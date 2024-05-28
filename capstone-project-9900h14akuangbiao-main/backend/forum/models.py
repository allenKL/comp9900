from django.db import models
from userprofile.models import UserProfile

class ForumPost(models.Model):
    author = models.ForeignKey(UserProfile, on_delete=models.CASCADE)
    author_name = models.CharField(max_length=255, default='Anonymous')
    title = models.CharField(max_length=255)
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.title

class ForumComment(models.Model):
    author = models.ForeignKey(UserProfile, on_delete=models.CASCADE)
    author_name = models.CharField(max_length=255, default='Anonymous')
    post = models.ForeignKey(ForumPost, on_delete=models.CASCADE, related_name='comments')
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.author.username}: {self.content[:50]}"
