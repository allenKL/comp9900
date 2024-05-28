from django.db import models
from django.contrib.auth.models import User


class UserProfile(models.Model):
    """
    A model representing a user's profile
    """

    user = models.OneToOneField(User, on_delete=models.CASCADE, related_query_name='userprofile')
    # Basic user information fields
    email = models.EmailField(unique=True, max_length=255)
    username = models.CharField(max_length=30, unique=False)
    # password = models.CharField(max_length=128)

    # User information fields
    nickname = models.CharField(blank=True, max_length=30)

    # Additional user information fields
    profile_pic = models.TextField(blank=True, null=True)

    # User blacklist
    banlist = models.ManyToManyField('userprofile.UserProfile', related_name='ban_user', blank=True)

    # User waitlist for movies
    waitlist = models.ManyToManyField('movie.MoviePost', related_name='waitlisted_users', through='Waitlist', through_fields=('username', 'movie'))

    def __str__(self):
        """Return the username of the user"""
        return self.username
    
    def save(self, *args, **kwargs):
        # Print user and username during save for debug purposes
        # print(f'Username: {self.username}')
        # print(f'User: {self.user}')
        super().save(*args, **kwargs)


class Waitlist(models.Model):
    """
    A model representing a user's waitlist for movies
    """

    username = models.ForeignKey(UserProfile, on_delete=models.CASCADE, related_name='waitlist_items')
    movie = models.ForeignKey('movie.MoviePost', on_delete=models.CASCADE)
    added_time = models.DateTimeField(auto_now_add=True)

    class Meta:
        # Ensure each user has a unique waitlist for a specific movie
        unique_together = (('username', 'movie'),)
