
from functools import reduce
import random
import os
import django
os.environ["DJANGO_SETTINGS_MODULE"] = "backend.settings"
django.setup()
from django.contrib.auth.models import User
from userprofile.models import UserProfile, Waitlist
from movie.models import MoviePost, MovieComment
from django.db.models import Q


def recommend_movies(user_id): 
    # 1. Gets the user's UserProfile
    user_profile = UserProfile.objects.filter(user_id=user_id).first()
    if not user_profile:
        return MoviePost.objects.order_by("?")[:15]
    
    # 2.  Get the movie in the user's waitlist
    waitlisted_movies = user_profile.waitlist.all()
    if not waitlisted_movies:
        return MoviePost.objects.order_by("?")[:15]

    pks = []
    genres = []
    for movie in waitlisted_movies:
        pks.append(movie.pk)
        
        _genres = [i.strip() for i in movie.genres.split(",")]
        genres.extend(_genres)

    # 3. Get all movies of the same type as the movie in the waitlisted_movies
    q_list = [Q(genres__icontains=genre) for genre in genres]
    similar_movies = MoviePost.objects.filter(reduce(lambda x, y: x | y, q_list)).exclude(pk__in=pks).distinct()

    # 4. Calculate a rating for each movie
    movies_with_score = []
    movies_pks = []
    for movie in similar_movies:
        comments = MovieComment.objects.filter(movie=movie).all()
        if comments:
            # Calculate the average rating
            score = sum(comment.score for comment in comments)/len(comments)
            movies_with_score.append((movie, score))
            movies_pks.append(movie.pk)
    
    # 5. Sort by average rating from highest to lowest
    if movies_with_score:
        movies_with_score = sorted(movies_with_score, key=lambda x: x[1], reverse=True)
        _count = 15 - len(movies_with_score)
        # Not enough for 15 mandatory completions
        if _count > 0:
            movies_with_score.extend([(movie, 0) for movie in MoviePost.objects.exclude(pk__in=movies_pks).order_by("?")[:_count]])
    else:
        # If there are no movies, 15 movies are returned randomly
        movies_with_score = [(movie, 0) for movie in MoviePost.objects.all()]

    # 6. Returns the MoviePost object querysets
    return [movie[0] for movie in movies_with_score[:15]]

