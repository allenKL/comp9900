from django.contrib import admin
from django.contrib.auth.models import Group, User
from .models import MoviePost, MovieComment, News
from userprofile.models import UserProfile, Waitlist
from forum.models import ForumPost, ForumComment

class CustomAdminSite(admin.AdminSite):
    site_header = "COMP9900"
    def get_app_list(self, request):
        app_list = super().get_app_list(request)
        app_list = [app for app in app_list if app['app_label'] != 'auth']
        return app_list

custom_site = CustomAdminSite(name='custom_admin')

custom_site.register(MoviePost)
custom_site.register(MovieComment)
custom_site.register(News)
custom_site.register(UserProfile)
custom_site.register(Waitlist)
custom_site.register(ForumPost)
custom_site.register(ForumComment)
