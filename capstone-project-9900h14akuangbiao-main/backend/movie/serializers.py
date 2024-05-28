from rest_framework import serializers
from userprofile.models import UserProfile
from .models import MoviePost, MovieComment, News
from django.db.models import Avg

# Serializer for the list of movies
class MovieListSerializer(serializers.ModelSerializer):
    class Meta:
        model = MoviePost
        fields = ['id', 'name', 'poster', 'genres', 'director', 'original_language', 'streaming_date', 'theater_date', 'info']

# Serializer for movie comments
class MovieCommentSerializer(serializers.ModelSerializer):
    # User who made the comment
    user = serializers.StringRelatedField(read_only=True)

    class Meta:
        model = MovieComment
        fields = ['id', 'user', 'movie', 'score', 'content', 'create_time', 'in_blacklist']

    def to_representation(self, instance):
        """
        Exclude the comment if the user is in the black list.
        """
        if self.context.get('request') and self.context.get('request').user.is_authenticated:
            # Get the user profile for the authenticated user
            user_profile = UserProfile.objects.filter(user=self.context['request'].user).first()
            if user_profile and instance.user in user_profile.banlist.all():
                return {}
        return super().to_representation(instance)

# Serializer for movie posts
class MoviePostSerializer(serializers.ModelSerializer):
    # List of comments for the movie
    comments = MovieCommentSerializer(many=True, read_only=True)

    # Method to get the genres of the movie as a list
    def get_genres_list(self, obj):
        return obj.genres.split(', ')

    # Genres of the movie
    genres = serializers.SerializerMethodField(method_name='get_genres_list')

    # Serializer method field for the average rating of the movie
    average_rating = serializers.SerializerMethodField()

    class Meta:
        model = MoviePost
        fields = ['id', 'name', 'poster', 'genres', 'info', 'director', 'producer', 'cast', 'writer',
                  'original_language', 'theater_date', 'streaming_date', 'money', 'run_time', 'distributor',
                  'sound', 'comments', 'average_rating']

    def get_average_rating(self, obj):
        # Get the request object
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            # Get the user profile for the authenticated user
            user_profile = request.user.userprofile
            # Get the list of users in the user's banlist
            banlist_users = user_profile.banlist.all().values_list('user', flat=True)
            # Calculate the average rating for the movie excluding the users in the banlist
            avg_rating = obj.comment.exclude(user__in=banlist_users).aggregate(average_rating=Avg('score'))
        else:
            # Calculate the average rating for the movie
            avg_rating = obj.comment.aggregate(average_rating=Avg('score'))
        
        return avg_rating['average_rating']

    def to_representation(self, instance):
        data = super().to_representation(instance)
        # Add the average rating to the representation
        data['average_rating'] = self.get_average_rating(instance)
        return data

    def get_in_waitlist(self, obj):
        user = self.context['request'].user
        if user.is_authenticated:
            return obj.waitlisted.filter(user=user).exists()
        return False

# Serializer for news
class NewsSerializer(serializers.ModelSerializer):
    class Meta:
        model = News
        fields = ['news_id', 'title', 'author', 'details', 'img', 'date']
