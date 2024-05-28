from rest_framework import generics
from django.shortcuts import get_object_or_404
from .models import ForumPost, ForumComment
from .serializers import ForumPostSerializer, ForumCommentSerializer
from rest_framework.permissions import IsAuthenticated, AllowAny
from drf_yasg2.utils import swagger_auto_schema

class ForumPostListCreateAPIView(generics.ListCreateAPIView):
    """
    get:
    List all forum posts.

    post:
    Create a new forum post.
    """
    queryset = ForumPost.objects.all()
    serializer_class = ForumPostSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(author=self.request.user.userprofile, author_name=self.request.user.userprofile.username)

class ForumPostRetrieveUpdateDestroyAPIView(generics.RetrieveUpdateDestroyAPIView):
    """
    get:
    Retrieve a forum post by ID.

    put:
    Update a forum post by ID.

    patch:
    Partially update a forum post by ID.

    delete:
    Delete a forum post by ID.
    """
    queryset = ForumPost.objects.all()
    serializer_class = ForumPostSerializer
    permission_classes = [IsAuthenticated]

class ForumCommentListCreateAPIView(generics.ListCreateAPIView):
    """
    get:
    List all comments for a specific forum post.

    post:
    Create a new comment for a specific forum post.
    """
    serializer_class = ForumCommentSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        if getattr(self, 'swagger_fake_view', False):
            return ForumComment.objects.none()
        
        post_pk = self.kwargs['post_pk']
        return ForumComment.objects.filter(post_id=post_pk)

    def perform_create(self, serializer):
        post = get_object_or_404(ForumPost, pk=self.kwargs['post_pk'])
        serializer.save(author=self.request.user.userprofile, author_name=self.request.user.userprofile.username, post=post)

class ForumCommentRetrieveUpdateDestroyAPIView(generics.RetrieveUpdateDestroyAPIView):
    """
    get:
    Retrieve a comment by ID.

    put:
    Update a comment by ID.

    patch:
    Partially update a comment by ID.

    delete:
    Delete a comment by ID.
    """
    serializer_class = ForumCommentSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        if getattr(self, 'swagger_fake_view', False):
            return ForumComment.objects.none()
        
        pk = self.kwargs['pk']
        return ForumComment.objects.filter(id=pk)
