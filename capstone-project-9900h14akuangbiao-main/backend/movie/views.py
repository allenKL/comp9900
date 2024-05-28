from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import generics, status
from drf_yasg import openapi
from drf_yasg.utils import swagger_auto_schema
from userprofile.models import UserProfile
from .models import MoviePost
from rest_framework.permissions import AllowAny, IsAuthenticated, IsAuthenticatedOrReadOnly
from .models import MovieComment, News
from .serializers import MovieCommentSerializer, MovieListSerializer, MoviePostSerializer, NewsSerializer
from recommend_movies import recommend_movies
from rest_framework.views import APIView
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from rest_framework import status
from itertools import chain
from rest_framework.exceptions import PermissionDenied, NotFound
from rest_framework.filters import SearchFilter, OrderingFilter
from django.contrib.auth.models import User
from django.db.models import Q

class MovieListAPIView(generics.ListAPIView):
    """
    API view to list all movies or filter by specific fields.
    """
    # Permissions for the API view
    permission_classes = [AllowAny]
    
    # Queryset to retrieve the movies
    queryset = MoviePost.objects.all()
    
    # Serializer class to use
    serializer_class = MoviePostSerializer
    
    # Filter backends to use
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    
    # Filter fields for the queryset
    filterset_fields = {
        'name': ['exact'],
        'genres': ['icontains'],
        'director': ['icontains'],
        'original_language': ['exact']
    }
    
    # Search fields for the queryset
    search_fields = ['name', 'info','poster','genres','director','producer','cast','writer','original_language','distributor','sound']
    
    # Ordering fields for the queryset
    ordering_fields = ['streaming_date', 'theater_date']
    
    # Default ordering for the queryset
    ordering = ['-streaming_date']

    def get_serializer_class(self):
        """
        Return the serializer class to use based on the presence of a primary key in the URL.
        """
        if 'pk' in self.kwargs:
            return MoviePostSerializer
        return MovieListSerializer

    def get_serializer_context(self):
        """
        Return the context for the serializer.
        """
        context = super().get_serializer_context()
        if self.request.user.is_authenticated:
            # Get the list of users in the user's banlist
            banlist_users = self.request.user.profile.banlist.all()
            context['request'] = self.request
            context['banlist_users'] = banlist_users
            context['in_waitlist'] = self.request.user.profile.waitlist.filter(pk=self.kwargs['pk']).exists()
        return context

class MovieDetailAPIView(generics.RetrieveUpdateAPIView):
    """
    API view to retrieve, update or delete a movie instance.
    """
    permission_classes = [IsAuthenticatedOrReadOnly]
    
    # Queryset to retrieve the movie
    queryset = MoviePost.objects.all()
    
    # Serializer class to use
    serializer_class = MoviePostSerializer
    
    # Lookup field to use
    lookup_field = 'pk'


class MovieCommentListAPIView(generics.ListCreateAPIView):
    """
    API view to retrieve and create comments for a movie instance.
    """
    permission_classes = [AllowAny]
    
    # Serializer class to use
    serializer_class = MovieCommentSerializer
    
    # Filter backends to use
    filter_backends = [DjangoFilterBackend]
    
    # Filter fields for the queryset
    filterset_fields = ['user', 'movie']
    
    # Search fields for the queryset
    search_fields = ['content']

    def get_queryset(self):
        """
        Return the queryset for the API view.
        """
        # Get all comments
        queryset = MovieComment.objects.all()
        
        # Get the movie id from the URL parameters
        movie_id = self.kwargs.get('movie_id')
        if movie_id is not None:
            queryset = queryset.filter(movie_id=movie_id)
        
        # Check if user is authenticated and if the user is in blacklist
        if self.request.user.is_authenticated:
            # Check if the request user is an instance of User model
            if isinstance(self.request.user, User):
                user_profile = UserProfile.objects.filter(user=self.request.user).first()
                if user_profile is not None:
                    # Get the list of users in the user's banlist
                    banlist_users = user_profile.banlist.values_list('id', flat=True)
                    
                    # Exclude comments from banned users and in blacklist
                    queryset = queryset.exclude(user__in=banlist_users, in_blacklist=True)
                    
                    # Include the user's own comment if it exists
                    user_comment = queryset.filter(user=user_profile).first()
                    if user_comment:
                        queryset = queryset.exclude(user=user_profile)
                        queryset = MovieComment.objects.filter(pk=user_comment.pk) | queryset
                
        return queryset

    def perform_create(self, serializer):
        """
        Save the user profile for the comment when it is created.
        """
        serializer.save(user=self.request.user.userprofile)


class MovieCommentUpdateAPIView(generics.UpdateAPIView):
    """
    API view to update a comment for a specific movie.
    """
    permission_classes = [IsAuthenticatedOrReadOnly]
    
    # Serializer class to use
    serializer_class = MovieCommentSerializer

    def get_queryset(self):
        """
        Return the queryset for the API view.
        """
        return MovieComment.objects.all()
    
    def put(self, request, *args, **kwargs):
        """
        Set the movie ID in the request data before updating the comment.
        """
        movie_id = self.kwargs.get('movie_id')
        request.data['movie'] = movie_id
        response = super().put(request, *args, **kwargs)
        return response

    def get_object(self):
        """
        Return the comment object to update.
        """
        queryset = self.get_queryset()
        movie_id = self.kwargs.get('movie_id')
        user = self.request.user.userprofile
        try:
            return queryset.get(movie_id=movie_id, user=user)
        except MovieComment.DoesNotExist:
            raise NotFound("Comment not found")

    def perform_update(self, serializer):
        """
        Save the updated comment object.
        """
        # Get the comment object
        comment = self.get_object()

        # Check if the current user is the comment's author
        if self.request.user.userprofile == comment.user:
            serializer.save()
        else:
            raise PermissionDenied("You can only edit your own comments.")


class MovieCommentCreateAPIView(generics.CreateAPIView):
    """
    API view to create a new comment for a specific movie.
    """
    permission_classes = [IsAuthenticatedOrReadOnly]
    
    # Serializer class to use
    serializer_class = MovieCommentSerializer
    
    # Queryset to use
    queryset = MovieComment.objects.all()

    def create(self, request, *args, **kwargs):
        """
        Create a new comment object for the movie.
        """
        movie_pk = self.kwargs.get('movie_id')
        movie = get_object_or_404(MoviePost, pk=movie_pk)
        user_already_commented = request.user.userprofile.comments.filter(movie=movie).exists()
        
        if user_already_commented:
            # User has already commented on this movie, return an error response
            return Response({"detail": "User has already commented on this movie"}, status=status.HTTP_400_BAD_REQUEST)

        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            author_name = request.user.userprofile.username
            serializer.save(user=request.user.userprofile, movie_id=movie_pk, author_name=author_name)
            headers = self.get_success_headers(serializer.data)
            return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class NewsDetailAPIView(APIView):
    """
    API view to retrieve a news instance.
    """
    permission_classes = [AllowAny]
    
    @swagger_auto_schema(
        operation_description="Retrieve a news instance",
        responses={200: NewsSerializer()},
    )
    def get(self, request, pk):
        """
        Retrieve a news instance by ID.
        """
        news = News.objects.get(news_id=pk)
        return Response(NewsSerializer(news).data)


class NewsListAPIView(APIView):
    """
    List all news.
    """
    permission_classes = [AllowAny]
    @swagger_auto_schema(
        operation_description="Retrieve a list of all news",
        responses={200: NewsSerializer(many=True)},
    )
    def get(self, request):
        news_list = News.objects.all()
        return Response(NewsSerializer(news_list, many=True).data)


class RecommendAPIView(APIView):
    """
    Get recommended movies for the current user.
    """
    permission_classes = [AllowAny]
    @swagger_auto_schema(
        operation_description="Get recommended movies for the current user",
        responses={200: MoviePostSerializer(many=True)},
    )
    def get(self, request):
        # print(request.user, 90909)
        user_id = self.request.user.pk
        return Response(MoviePostSerializer(recommend_movies(user_id), many=True).data)


class MoviePostDirectorSearchAPIView(APIView):
    permission_classes = [AllowAny]
    def get(self, request):
        key = self.request.query_params.get('key', '')
        list1 = MoviePost.objects.filter(Q(director__icontains=key)).values_list('director', flat=True)
        res = []
        for info in list1:
            res.extend(info.split(","))
        res = list(map(lambda x: x.strip() , list(set(res))))
        return Response(sorted(list(set(res))))


class MoviePostGenresSearchAPIView(APIView):
    permission_classes = [AllowAny]
    def get(self, request):
        key = self.request.query_params.get('key', '')
        list1 = MoviePost.objects.filter(Q(genres__icontains=key)).values_list('genres', flat=True)
        res = []
        for info in list1:
            res.extend(info.split(","))
        res = list(map(lambda x: x.strip() , list(set(res))))
        return Response(sorted(list(set(res))))
