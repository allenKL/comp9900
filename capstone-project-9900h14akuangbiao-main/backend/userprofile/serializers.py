from rest_framework import serializers
from rest_framework.exceptions import ValidationError
from rest_framework.validators import UniqueValidator
from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from django.contrib.auth.hashers import make_password
from .models import UserProfile
from movie.models import MoviePost, MovieComment
from movie.serializers import MoviePostSerializer, MovieCommentSerializer, MovieListSerializer


class UserSignupSerializer(serializers.ModelSerializer):
    confirm_password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'password', 'confirm_password')
        extra_kwargs = {
            'email': {'required': True},
            'username': {'validators': [UniqueValidator(queryset=User.objects.all())]},
            'password': {'write_only': True},
            'confirm_password': {'write_only': True},
        }

    def validate(self, attrs):
        if attrs.get('password') != attrs.get('confirm_password'):
            raise ValidationError({'password': 'Passwords do not match'})
        return attrs

    def create(self, validated_data):
        
        validated_data.pop('confirm_password')
        try:
            user = User.objects.create_user(
                validated_data['username'],
                validated_data['email'],
                validated_data['password'],
            )
        except Exception as e:
            raise serializers.ValidationError({'detail': 'Error creating user.'})
        try:
            user_profile, created = UserProfile.objects.get_or_create(
                user=user,
                defaults={
                    'username': validated_data['username'],
                    'email': validated_data['email'],
                }
            )
        except Exception as e:
            raise serializers.ValidationError({'detail': 'Error creating user profile.'})
        except Exception as e:
            raise serializers.ValidationError({'detail': 'Error creating user and user profile.'})
        return user

class UserSigninSerializer(serializers.Serializer):
    username = serializers.CharField(required=True)
    password = serializers.CharField(required=True)

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.user = None

    def validate(self, attrs):
        self.user = authenticate(username=attrs['username'], password=attrs['password'])
        try:
            user = User.objects.get(username=attrs['username'])
        except User.DoesNotExist:
            pass
        if not self.user:
            raise serializers.ValidationError('Account does not exist or is inactive.')
        if not self.user.is_active:
            raise serializers.ValidationError('Account is inactive.')
        return attrs


    def to_representation(self, instance):
        data = super().to_representation(instance)
        data['username'] = self.user.username
        return data

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['first_name', 'last_name', 'email']

class MovieIdField(serializers.RelatedField):
    def to_representation(self, value):
        return {'id':value.id, 'name':value.name}

class UserProfileSerializer(serializers.ModelSerializer):
    waitlist = MovieIdField(many=True, read_only=True)
    comments = MovieCommentSerializer(many=True, read_only=True)
    
    class Meta:
        model = UserProfile
        fields = ['id', 'email', 'username', 'nickname', 'profile_pic', 'comments', 'banlist', 'waitlist']
        extra_kwargs = {
            'email': {'required': False},
            'username': {'required': False},
            'waitlist': {'required': False},
        }
        
    def __init__(self, *args, **kwargs):
        super(UserProfileSerializer, self).__init__(*args, **kwargs)
        context = kwargs.get("context")  
        self.fields.pop("banlist") 
        if context:
            request = context.get("request")
            if request and request.user.is_authenticated:
                if request.user.username != self.instance.username:
                    self.fields.pop("email")
                    self.fields.pop("nickname")
    
    def create(self, validated_data):
        password = validated_data.pop('password')
        user = User(**validated_data)
        user.set_password(password)
        user.save()
        profile = UserProfile.objects.create(user=user)
        return profile

class PublicUserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserProfile
        fields = ['username', 'profile_pic', 'banlist', 'waitlist']

class WaitlistSerializer(serializers.ModelSerializer):
    class Meta:
        model = MoviePost
        fields = ['id', 'name', 'genres', 'theater_date', 'streaming_date']
        
class BanlistSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserProfile
        fields = ['id', 'username']
        
