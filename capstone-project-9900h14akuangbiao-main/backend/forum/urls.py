from django.urls import path
from .views import (ForumPostListCreateAPIView, ForumPostRetrieveUpdateDestroyAPIView,
                    ForumCommentListCreateAPIView, ForumCommentRetrieveUpdateDestroyAPIView)
from rest_framework import permissions
from drf_yasg2.views import get_schema_view
from drf_yasg2 import openapi

schema_view = get_schema_view(
    openapi.Info(
        title="Forum API",
        default_version="v1",
        description="A simple forum API",
    ),
    public=True,
    permission_classes=(permissions.AllowAny,),
)
urlpatterns = [
    path('posts/', ForumPostListCreateAPIView.as_view(), name='forum_post_list_create'),
    path('posts/<int:pk>/', ForumPostRetrieveUpdateDestroyAPIView.as_view(), name='forum_post_detail'),
    path('posts/<int:post_pk>/comments/', ForumCommentListCreateAPIView.as_view(), name='forum_comment_list_create'),
    path('comments/<int:pk>/', ForumCommentRetrieveUpdateDestroyAPIView.as_view(), name='forum_comment_detail'),
]
