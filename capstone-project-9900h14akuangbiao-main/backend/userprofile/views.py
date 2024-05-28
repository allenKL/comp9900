from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import User
from django.utils.decorators import method_decorator
from drf_yasg import openapi
from drf_yasg.utils import swagger_auto_schema
from rest_framework import status, generics
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.decorators import api_view
from rest_framework.authtoken.models import Token
from .serializers import UserSignupSerializer, UserSigninSerializer, UserSerializer, UserProfileSerializer, WaitlistSerializer, BanlistSerializer, PublicUserProfileSerializer
from django.core.exceptions import ObjectDoesNotExist
import logging
from movie.models import MoviePost
from .models import UserProfile, Waitlist
from django.shortcuts import get_object_or_404

@swagger_auto_schema(
    request_body=UserSignupSerializer,
    operation_description="Register a new user",
    operation_summary="Register user API",
    responses={
        201: openapi.Response(
            description="User created successfully.",
            examples={
                "application/json": {"code": 200, "msg": "Success"},
            },
        ),
        400: openapi.Response(
            description="Invalid input",
            examples={
                "application/json": {
                    "code": 400,
                    "msg": "Information Error",
                    "errors": {
                        "username": ["Username already exists."],
                        "password": ["The confirm password is not correct."],
                    },
                }
            },
        ),
    },
)
class RegisterAPIView(APIView):
    """
    API endpoint to register a new user
    """

    permission_classes = [AllowAny]

    
    def post(self, request):
        serializer = UserSignupSerializer(data=request.data)
        if serializer.is_valid(raise_exception=True):
            user = serializer.save()
            Token.objects.get_or_create(user=user)
            data = {"code": 200, "msg": "Success"}
            return Response(data, status=status.HTTP_201_CREATED)
        else:
            logger = logging.getLogger(__name__)
            logger.error(f'Error creating user: {serializer.errors}')
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@swagger_auto_schema(
    request_body=UserSigninSerializer,
    operation_description="Authenticate and login a user.",
    operation_summary="Login user API",
    responses={
        200: openapi.Response(
            description="Login success",
            examples={
                "application/json": {
                    "code": 200,
                    "msg": "Success",
                    "data": {"username": "test", "token": "abc123"},
                },
            },
        ),
        401: openapi.Response(description="Username or password is incorrect"),
    },
)
class LoginAPIView(APIView):
    """
    API endpoint to authenticate and login a user
    """

    permission_classes = [AllowAny]


    def post(self, request):
        serializer = UserSigninSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.user
            login(request, user)
            token, created = Token.objects.get_or_create(user=user)
            data = {
                "user_id": user.id,
                "username": user.username,
                "token": token.key,
            }
            return Response({"code": 200, "msg": "Success", "data": data}, status=status.HTTP_200_OK)
        else:
            return Response(serializer.errors, status=status.HTTP_401_UNAUTHORIZED)

@swagger_auto_schema(
    operation_description="Logout a user.",
    operation_summary="Logout user API",
    responses={
        200: openapi.Response(
            description="Logout success",
            examples={
                "application/json": {
                    "code": 200,
                    "msg": "Logout successful.",
                },
            },
        ),
        401: openapi.Response(description="User not authenticated"),
    },
)
class LogoutAPIView(APIView):
    """
    API endpoint to logout a user
    """

    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            request.user.auth_token.delete()
        except (AttributeError, ObjectDoesNotExist):
            pass

        logout(request)

        return Response(
            {"code": 200, "msg": "Logout successful."},
            status=status.HTTP_200_OK,
        )

@swagger_auto_schema(
    request_body=openapi.Schema(
        type=openapi.TYPE_OBJECT,
        properties={
            'movie_id': openapi.Schema(type=openapi.TYPE_INTEGER, description='ID of the movie to be added/removed from the waitlist'),
            'add_to_waitlist': openapi.Schema(type=openapi.TYPE_BOOLEAN, description='Whether to add or remove the movie from the waitlist'),
        },
        required=['movie_id', 'add_to_waitlist']
    ),
    operation_description='Add or remove a movie from the user\'s waitlist',
    responses={
        200: 'Success',
        400: 'Bad request',
        401: 'Authentication failed',
        404: 'Movie not found'
    }
)    
class WaitlistAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, **kwargs):
        """
        Return user's waitlist.
        """
        user_profile = request.user.userprofile
        if len(kwargs) != 0:
            movie_id = kwargs['movie_id']
            try:
                movie = MoviePost.objects.get(pk=movie_id)
            except MoviePost.DoesNotExist:
                return Response({'detail': f'Movie with ID {movie_id} does not exist.'}, status=status.HTTP_404_NOT_FOUND)
            
            if movie in user_profile.waitlist.all():
                return Response({'detail': f'Movie {movie.name} is in your waitlist.'}, status=status.HTTP_200_OK)
            else:
                return Response({'detail': f'Movie {movie.name} is not in your waitlist.'}, status=status.HTTP_201_CREATED)
        
        else:
            waitlist = user_profile.waitlist.all()
            serializer = WaitlistSerializer(waitlist, many=True)
            return Response(serializer.data)

    def post(self, request, **kwargs):
        """
        Add or remove movie from user's waitlist.
        """
        movie_id = kwargs['movie_id']
        user_profile = request.user.userprofile

        if not movie_id:
            return Response({'detail': 'Movie ID is required.'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            movie = MoviePost.objects.get(pk=movie_id)
        except MoviePost.DoesNotExist:
            return Response({'detail': f'Movie with ID {movie_id} does not exist.'}, status=status.HTTP_404_NOT_FOUND)

        if movie in user_profile.waitlist.all():
            user_profile.waitlist.remove(movie)
            return Response({'detail': f'Movie {movie.name} has been removed from your waitlist.'}, status=status.HTTP_200_OK)
        else:
            user_profile.waitlist.add(movie)
            return Response({'detail': f'Movie {movie.name} has been added to your waitlist.'}, status=status.HTTP_201_CREATED)
    
    
# class UserProfileAPIView(generics.  ):
#     permission_classes = [IsAuthenticated]
#     serializer_class = UserProfileSerializer

#     def get_object(self):
#         return get_object_or_404(UserProfile, user=self.request.user)


@swagger_auto_schema(
    request_body=openapi.Schema(
        type=openapi.TYPE_OBJECT,
        properties={
            'email': openapi.Schema(type=openapi.TYPE_STRING, description='The user\'s email address'),
            'username': openapi.Schema(type=openapi.TYPE_STRING, description='The user\'s username'),
            'nickname': openapi.Schema(type=openapi.TYPE_STRING, description='The user\'s nickname'),
            'profile_pic': openapi.Schema(type=openapi.TYPE_FILE, description='The user\'s profile picture')
        },
        required=['email', 'username']
    ),
    operation_description='Update the user\'s profile information',
    responses={
        200: 'Success',
        400: 'Bad request',
        401: 'Authentication failed'
    }
)
class UserProfileAPIView(generics.RetrieveUpdateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = UserProfileSerializer
    lookup_field = 'username'

    def get_queryset(self):
        queryset = UserProfile.objects.all()
        return queryset

    def get_object(self):
        queryset = self.get_queryset()
        username = self.kwargs.get('username')
        if username is not None:
            return get_object_or_404(queryset, user__username=username)
        elif self.request.user.is_authenticated:
            return get_object_or_404(queryset, user=self.request.user)
        else:
            raise Http404("User not found")


    def put(self, request, *args, **kwargs):
        # Update the user's username and email first
        user = request.user
        user.username = request.data.get('username', user.username)
        user.email = request.data.get('email', user.email)
        user.save()
        # Update the user profile
        response = super().put(request, *args, **kwargs)
        base64_image_data = request.data.get('profile_pic')
        if base64_image_data:
            # Update the user profile with the Base64 image data
            profile = self.get_object()
            profile.profile_pic = base64_image_data
            profile.save()
        if response.status_code == 200:
            # Manually retrieve the updated user profile using the new username
            queryset = self.get_queryset()
            updated_username = request.data.get('username', None)
            if updated_username:
                user_profile = get_object_or_404(queryset, user__username=updated_username)
                return Response(self.get_serializer(instance=user_profile).data)
            else:
                return Response(self.get_serializer(instance=self.get_object()).data)

        return response

    
@swagger_auto_schema(
    request_body=openapi.Schema(
        type=openapi.TYPE_OBJECT,
        properties={
            'user_id': openapi.Schema(type=openapi.TYPE_INTEGER, description='ID of the user to be added/removed from the banlist'),
            'add_to_banlist': openapi.Schema(type=openapi.TYPE_BOOLEAN, description='Whether to add or remove the user from the banlist'),
        },
        required=['movie_id', 'add_to_banlist']
    ),
    operation_description='Add or remove a user from the user\'s banlist',
    responses={
        200: 'Success',
        400: 'Bad request',
        401: 'Authentication failed',
        404: 'Movie not found'
    }
)    
class BanlistAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, **kwargs):
        """
        Return user's banlist.
        """
        user_profile = request.user.userprofile
        if len(kwargs) != 0:
            user_id = kwargs['user_id']
            try:
                user = UserProfile.objects.get(pk=user_id)
            except UserProfile.DoesNotExist:
                return Response({'detail': f'User with ID {user_id} does not exist.'}, status=status.HTTP_404_NOT_FOUND)
            
            if user in user_profile.banlist.all():
                return Response({'detail': f'User {user.username} is in your banlist.'}, status=status.HTTP_200_OK)
            else:
                return Response({'detail': f'User {user.username} is not in your banlist.'}, status=status.HTTP_201_CREATED)
        
        else:
            banlist = user_profile.banlist.all()
            serializer = BanlistSerializer(banlist, many=True)
            return Response(serializer.data)

    def post(self, request, **kwargs):
        """
        Add or remove user from user's banlist.
        """
        user_id = kwargs['user_id']
        user_profile = request.user.userprofile

        if not user_id:
            return Response({'detail': 'User ID is required.'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            user = UserProfile.objects.get(pk=user_id)
        except UserProfile.DoesNotExist:
            return Response({'detail': f'User with ID {user_id} does not exist.'}, status=status.HTTP_404_NOT_FOUND)

        if user in user_profile.banlist.all():
            user_profile.banlist.remove(user)
            return Response({'detail': f'User {user.username} has been removed from your banlist.'}, status=status.HTTP_200_OK)
        else:
            user_profile.banlist.add(user)
            return Response({'detail': f'User {user.username} has been added to your banlist.'}, status=status.HTTP_201_CREATED)