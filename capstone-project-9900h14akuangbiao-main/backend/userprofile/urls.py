from django.contrib import admin
from django.urls import path, re_path,include
from rest_framework import permissions
from drf_yasg2.views import get_schema_view
from drf_yasg2 import openapi
from django.contrib.auth.models import User
from rest_framework import routers, serializers, viewsets
from .views import RegisterAPIView, LoginAPIView, LogoutAPIView, WaitlistAPIView, UserProfileAPIView, BanlistAPIView
from rest_framework.authtoken.views import obtain_auth_token
from rest_framework_swagger.views import get_swagger_view
from drf_yasg2.views import get_schema_view
from drf_yasg2 import openapi
from drf_yasg2.generators import OpenAPISchemaGenerator

schema_view = get_schema_view(
    openapi.Info(
        title="Snippets API",
        default_version='v1',
        description="Welcome to the world of Tweet",
    ),
    public=True,
    urlconf="userprofile.urls",
    permission_classes=(permissions.AllowAny,),
)

router = routers.DefaultRouter()

urlpatterns = [
    path('register/', RegisterAPIView.as_view(), name='register_user'),
    path('login/', LoginAPIView.as_view(), name='login_user'),
    path('logout/', LogoutAPIView.as_view(), name='logout_user'),
    path('profile/', UserProfileAPIView.as_view()),
    path('profile/<str:username>/', UserProfileAPIView.as_view()),
    path('waitlist/', WaitlistAPIView.as_view()),
    path('waitlist/<int:movie_id>/', WaitlistAPIView.as_view()),
    path('ban/', BanlistAPIView.as_view()),
    path('ban/<int:user_id>/', BanlistAPIView.as_view()),
    re_path(r'^doc(?P<login>\.json|\.yaml)$',schema_view.without_ui(cache_timeout=0), name='schema-json'), 
    path('doc/', schema_view.with_ui('swagger', cache_timeout=0), name='schema-swagger-ui'), 
    path('redoc/', schema_view.with_ui('redoc', cache_timeout=0), name='schema-redoc'),

]