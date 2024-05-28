import json
import sqlite3
from collections import defaultdict
import re
from datetime import datetime

conn = sqlite3.connect('./backend/db.sqlite3')
cursor = conn.cursor()

# cursor.execute('SELECT * FROM data[name]_data[name]post')
# rows = cursor.fetchall()
cursor.execute('SELECT name FROM movie_moviepost')
existing_names = [row[0] for row in cursor.fetchall()]
cursor.close()

with open('./backend/movie.json') as f:
    data = json.load(f)

# count = 0
# for i in data:
#     if count == 2:
#         for key in data[i].keys():
#             print(key)
#         break
#     count += 1
pattern = r'[a-zA-Z]+(?=\s*\Z)'
cursor = conn.cursor()
for name in data:
    if name in existing_names:
        continue
    
    genre = ', '.join((data[name].get('Genre', [])).split(',')) if data[name].get('Genre') is not None else None
    information = data[name].get('information', None)
    # poster = data[name].get('image_path', None)
    director = data[name].get('Director', None)
    producer = data[name].get('Producer', None)
    casts = ', '.join(data[name].get('Casts', [])) if data[name].get('Casts') is not None else None
    writer = data[name].get('Writer', 'None')
    original_language = data[name].get('Original Language', None)
    theater_date = data[name].get('Release Date (Theaters)', None)
    if theater_date is not None:
        theater_date = re.sub(pattern, '', theater_date)
        theater_date = datetime.strptime(theater_date, '%b %d, %Y').date()
    streaming_date = data[name].get('Release Date (Streaming)', None)
    if streaming_date is not None:
        streaming_date = re.sub(pattern, '', streaming_date)
        streaming_date = datetime.strptime(streaming_date, '%b %d, %Y').date()
    money = data[name].get('Money', None)
    run_time = data[name].get('Runtime', None)
    distributor = data[name].get('Distributor', None)
    sound = data[name].get('Sound', None)
    
    cursor.execute('''
        INSERT INTO movie_moviepost (name, poster, genres, info, director, producer, cast, writer, original_language, theater_date, streaming_date, money, run_time, distributor, sound)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ''', (
        name,
        data[name].get('image_path', None),
        genre,
        information,
        director,
        producer,
        casts,
        writer,
        original_language,
        theater_date,
        streaming_date,
        money,
        run_time,
        distributor,
        sound

    ))
    
conn.commit()

cursor = conn.cursor()
movie_id = {}
cursor.execute('SELECT name, id FROM movie_moviepost')
movie_data =  [[row[0], row[1]] for row in cursor.fetchall()]
results = cursor.execute('SELECT movie_id, author_name FROM movie_moviecomment')
movie_authors = defaultdict(list)
for i, author_name in results:
    movie_authors[i].append(author_name)
    
print(movie_authors)
for i in movie_data:
    movie_id[i[0]] = i[1]

print(movie_id)

for movie in data:
    # for comment in data[movie][comments]:
    #     print(comment)
    comments = data[movie].get('comments', None)
    for author in comments:
        print(comments[author])
        if movie in movie_authors and author in movie_authors[movie]:
            continue
        results = cursor.fetchall()

        if results:
            # result is not null
            pass
        else:
            if comments[author].get('score').find('/') != -1:
                if str.isdigit(comments[author].get('score').split('/')[0]):
                    score = round(float(comments[author].get('score').split('/')[0]) / float(comments[author].get('score').split('/')[1]) * 10, 2)
                    # result is null
                    cursor.execute("""
                    INSERT INTO movie_moviecomment(user_id, movie_id, author_name, score, content, in_blacklist)
                    VALUES (?, ?, ?, ?, ?, ?)
                    """ ,(None, movie_id[movie], author, score, comments[author].get('review'), False))
                
conn.commit()
# cursor.execute(sql)
cursor.close()

conn.close()