from django.db import models
from django.contrib.auth.models import User
from django.utils import timezone
from django.urls import reverse

from PIL import Image
from django.contrib.auth import get_user_model

# Importing the UserProfile model from the userprofile app.
from userprofile.models import UserProfile

# Getting the user model
User = get_user_model()

# Movie model
class MoviePost(models.Model):
    
    # Name of the movie
    name = models.CharField(max_length=100)
    
    # Movie poster (as a text field)
    poster = models.TextField(blank=True, null=True)
    
    # Genre of the movie (using Django-taggit module)
    genres = models.TextField(blank=True, null=True)
    
    # Info about the movie
    info = models.TextField(blank=True, null=True)
    
    # Director of the movie
    director = models.CharField(blank=True, max_length=100, null=True)
    
    # Producer of the movie
    producer = models.TextField(blank=True, null=True)
    
    # Cast of the movie
    cast = models.TextField(blank=True, null=True)
    
    # Writer of the movie
    writer = models.CharField(blank=True, max_length=100, null=True)
    
    # Original language of the movie
    original_language = models.CharField(max_length=100, null=True)
    
    # Release date (in theaters)
    theater_date = models.DateField(blank=True, null=True)
    
    # Release date (streaming)
    streaming_date = models.DateField(blank=True, null=True)
    
    # Box office (gross USA)
    money = models.CharField(blank=True, max_length=100, null=True)
    
    # Runtime of the movie
    run_time = models.CharField(blank=True, max_length=20, null=True)
    
    # Distributor of the movie
    distributor = models.CharField(blank=True, max_length=100, null=True)
    
    # Sound mix of the movie
    sound = models.CharField(blank=True, max_length=100, null=True)
    
    # Comments for the movie
    comments = models.ForeignKey('MovieComment', on_delete=models.CASCADE, related_name='movies', blank=True, null=True)
    
    # Waitlist for the movie
    # waitlisted_users = models.ManyToManyField('userprofile.UserProfile', related_name='waitlisted_movies', through='Waitlist')
    
    # Method to check if a user is in the waitlist for this movie
    def is_in_waitlist(self, user):
        return self.waitlisted_users.filter(userprofile__user=user).exists()
    
    class Meta:
        # Ordering of the movies
        # '-created' returns the data in reverse order
        ordering = ('-streaming_date',)

# Movie comments model
class MovieComment(models.Model):
    
    # User who made the comment (related to the UserProfile model)
    user = models.ForeignKey(UserProfile, on_delete=models.CASCADE, verbose_name="reviewer", related_name='comments', blank=True, null=True)
    
    # Movie which was commented on
    movie = models.ForeignKey(MoviePost, on_delete=models.CASCADE, verbose_name="movie", related_name='comment')
    
    # Author name of the comment
    author_name = models.CharField(blank=True, max_length=100, verbose_name="reviewer name")
    
    # Score given for the movie (as stars)
    score = models.FloatField(default=0, verbose_name="satisfaction", help_text="star")
    
    # Content of the comment
    content = models.TextField(verbose_name="comments")
    
    # Time when the comment was created
    create_time = models.DateTimeField(auto_now_add=True, blank=True, null=True,verbose_name="create time")

    # Flag to indicate whether the author of the comment is in the blacklist
    in_blacklist = models.BooleanField(default=False)

class Meta:
    # Verbose names for the model and its plural
    verbose_name = "movie_comment"
    verbose_name_plural = "movie_comments"

# News Models
class News(models.Model):
    # ID of the news
    news_id = models.IntegerField(primary_key=True, verbose_name="news_id")

    # Title of the news
    title = models.CharField(max_length=300, verbose_name="img")

    # Author of the news
    author = models.CharField(max_length=100, verbose_name="author")

    # Image of the news
    img = models.CharField(max_length=100, verbose_name="img")

    # Date when the news was created
    date = models.DateTimeField(auto_now_add=True, verbose_name="date")

    # Details of the news
    details = models.TextField(verbose_name="details")

    class Meta:
        # Verbose name for the model
        verbose_name = "news"
