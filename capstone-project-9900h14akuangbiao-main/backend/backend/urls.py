from django.contrib import admin
from django.urls import path, re_path,include
from rest_framework import permissions
from django.contrib.auth.models import User
from rest_framework import routers, serializers, viewsets
from userprofile import views
from drf_yasg2.views import get_schema_view
from drf_yasg2 import openapi
from drf_yasg2.generators import OpenAPISchemaGenerator
from movie.admin import custom_site

schema_view = get_schema_view(
    openapi.Info(
        title="COMP9900 KuangBiao API",
        default_version='v1',
        description="Welcome to the Website of Kuangbiao",
        license=openapi.License(name="Awesome IP"),
    ),
    public=True,
    permission_classes=(permissions.AllowAny,),
)

router = routers.DefaultRouter()

urlpatterns = [
    path('', include(router.urls)),
    path('admin/', custom_site.urls),
    path('api-auth/', include('rest_framework.urls', namespace='rest_framework')),
    path('user/', include(('userprofile.urls', 'userprofile'), namespace='userprofile')),
    path('movie/', include(('movie.urls', 'movie'), namespace='movie')),
    path('forum/', include(('forum.urls', 'forum'), namespace='forum')),
    re_path(r'^doc(?P<format>\.json|\.yaml)$',schema_view.without_ui(cache_timeout=0), name='schema-json'), 
    path('doc/', schema_view.with_ui('swagger', cache_timeout=0), name='schema-swagger-ui'), 
    path('redoc/', schema_view.with_ui('redoc', cache_timeout=0), name='schema-redoc'),
]
