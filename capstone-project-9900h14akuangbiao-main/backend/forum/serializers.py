from rest_framework import serializers
from .models import ForumPost, ForumComment
from userprofile.serializers import UserProfileSerializer

class ForumCommentSerializer(serializers.ModelSerializer):
    author = UserProfileSerializer(read_only=True)

    class Meta:
        model = ForumComment
        fields = ['id', 'author', 'author_name', 'content', 'created_at', 'updated_at']

class ForumPostSerializer(serializers.ModelSerializer):
    author = UserProfileSerializer(read_only=True)
    comments = ForumCommentSerializer(many=True, read_only=True)

    class Meta:
        model = ForumPost
        fields = ['id', 'author', 'author_name', 'title', 'content', 'created_at', 'updated_at', 'comments']
