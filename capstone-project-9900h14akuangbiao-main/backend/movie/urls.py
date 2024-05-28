from django.contrib import admin
from django.urls import path, re_path,include
from rest_framework import permissions
from drf_yasg2.views import get_schema_view
from drf_yasg2 import openapi
from django.contrib.auth.models import User
from rest_framework import routers, serializers, viewsets
from rest_framework.authtoken.views import obtain_auth_token
from rest_framework_swagger.views import get_swagger_view
from drf_yasg2.views import get_schema_view
from drf_yasg2 import openapi
from drf_yasg2.generators import OpenAPISchemaGenerator
from .views import MovieListAPIView, MovieCommentCreateAPIView, MovieCommentListAPIView, MovieDetailAPIView, \
    NewsDetailAPIView, NewsListAPIView, RecommendAPIView, MovieCommentUpdateAPIView, MoviePostDirectorSearchAPIView, MoviePostGenresSearchAPIView

schema_view = get_schema_view(
    openapi.Info(
        title="Snippets API",
        default_version='v1',
        description="Welcome to the world of Tweet",
    ),
    public=True,
    urlconf="movie.urls",
    permission_classes=(permissions.AllowAny,),
)

router = routers.DefaultRouter()
urlpatterns = [
    re_path(r'^(?P<pk>\d+)/$', MovieDetailAPIView.as_view(), name='movie_detail_api'),
    re_path(r'^$', MovieListAPIView.as_view(), name='movie_list_api'),
    re_path(r'^doc(?P<login>\.json|\.yaml)$',schema_view.without_ui(cache_timeout=0), name='schema-json'), 
    path('doc/', schema_view.with_ui('swagger', cache_timeout=0), name='schema-swagger-ui'), 
    path('redoc/', schema_view.with_ui('redoc', cache_timeout=0), name='schema-redoc'),
    path('<int:pk>/', MovieDetailAPIView.as_view(), name='movie_detail_api'),
    path('<int:movie_id>/comments/', MovieCommentListAPIView.as_view(), name='movie_comment_list_api'),
    path('<int:movie_id>/comments/create/', MovieCommentCreateAPIView.as_view(), name='movie_comment_create_api'),
    path('<int:movie_id>/comments/update/', MovieCommentUpdateAPIView.as_view(), name='movie_comment_update'),
    path('news/<int:pk>/', NewsDetailAPIView.as_view(), name='news_detail_api'),
    path('news/', NewsListAPIView.as_view(), name='news_list_api'),
    path("reco_movie/", RecommendAPIView.as_view(), name="reco_movie"),
    path("director_search/", MoviePostDirectorSearchAPIView.as_view(), name="director_search"),
    path("genres_search/", MoviePostGenresSearchAPIView.as_view(), name="genres_search"),
]