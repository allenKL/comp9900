# -*- encoding: utf-8 -*-
'''
@File    :   rottentomatoes_dataSpyder.py
@Time    :   2023/02/22 14:39:10
@Author  :   Shaoming.Li 
@Version :   1.0
'''

from pyquery import PyQuery as pq
from bs4 import BeautifulSoup
from bs4.element import Tag
import pandas as pd
import os
import requests
import re
import time
import json
import pandas as pd

headers = {

    'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3904.97 Safari/537.36',
    'Referer': 'https://www.rottentomatoes.com'
}

data_file_path = './movie data/'
image_file_path = data_file_path + 'image/'
base_url = 'https://www.rottentomatoes.com'

def get_movie_info(movie_data, movie_soup):
    
    movie_info_list = movie_soup.find_all(attrs={'data-qa':'movie-info-item'})
    for movie_info in movie_info_list:
        data = movie_info.get_text().strip().split('\n')
        # print(data)
        
        movie_info = [x.strip() for x in data if x.strip() != '']
        # print(movie_info)
        movie_data[movie_info[0].split(':')[0]] = ''.join(movie_info[1:])
    
    movie_information = movie_soup.find_all(attrs={'data-qa':'movie-info-synopsis'})[0].get_text().strip()
    # print(movie_information)
    movie_data['information'] = movie_information
    return movie_data

def get_movie_poster(movie_data, movie_soup):
    for script in movie_soup.find_all(type='application/ld+json'):
        data_json = json.loads(script.string)
    # r = requests.get(url=data_json['image'], stream=True)   
    # img_name = re.sub(r'[^\w\d]', '_', data_json['name'].lower().strip())+'.jpg'
    # movie_data['image_path'] = image_file_path+img_name
    # with open(image_file_path+img_name, 'wb') as f:
    #     f.write(r.content)        
    movie_data['image_path'] = data_json['image']
    return movie_data

def get_movie_cast(movie_data, movie_soup):
    for script in movie_soup.find_all(type='application/ld+json'):
        data_json = json.loads(script.string)
    actors = []
    for actor in data_json['actors']:
        name = actor['sameAs'].split('/')[-1]
        name = re.sub(r'[\d]*-', '', name)
        name = re.sub(r'[^\w]', '_', name)
        actors.append(name)
    movie_data['Casts'] = actors
    return movie_data

def get_movie_reviews(movie_data, num_reviews):
    reviews_url = movie_data['url'] + '/reviews'
    response = requests.get(reviews_url)
    soup = BeautifulSoup(response.text, 'html.parser')

    reviews = soup.find_all('div', class_='review-row')
    # print('Get reviews', reviews)
    comments = {}
    for i, review in enumerate(reviews[:num_reviews]):
        if review.find('p', class_='original-score-and-url').text.find('Original Score') != -1:
            comment = {}
            author = review.find('a', class_='display-name').text.strip()
            comment['review'] = review.find('p', class_='review-text').text.strip()
            comment['score'] = review.find('p', class_='original-score-and-url').text.split('|')[1].split(':')[1].strip()
            comments[author] = comment
            # print(f"comment {i + 1} - Author: {author}")
            # print(f"comment detail : {review_content}")
            # print(f'comment score : {score}')
            # print('-' * 80)
    movie_data['comments'] = comments
    return movie_data

def get_movie_data(movie_url):
    movie_html = requests.get(url=base_url+movie_url, headers=headers)
    movie_soup = BeautifulSoup(movie_html.content, 'lxml')
    
    movie_data = {}
    movie_data['url'] = base_url+movie_url
    movie_data = get_movie_info(movie_data, movie_soup)
    movie_data = get_movie_cast(movie_data, movie_soup)
    movie_data = get_movie_poster(movie_data, movie_soup)
    movie_data = get_movie_reviews(movie_data, 10)
    
    # for i in movie_data:
    #     print(i, ' : ', movie_data[i])
        
    return movie_data

if __name__ == '__main__':
    
    data = {}
    # Check if the folder exists
    if not os.path.exists(image_file_path):
        os.makedirs(name=image_file_path)
    for count in range(1, 3):
        page_num = 5
        search_url = base_url+'/browse/movies_at_home/sort:popular?page='+str(page_num*count)
        print(search_url)
        website_html = requests.get(url=search_url, headers=headers)
        website_soup = BeautifulSoup(website_html.content, 'lxml')
        
        movie_list = website_soup.find_all(attrs = {"data-qa" : 'discovery-media-list-item'})
        count = 0
        print('Total movies:', len(movie_list))
        for movie in movie_list:
            movie_name = movie.find('span', attrs = {"data-qa" : 'discovery-media-list-item-title'}).get_text().strip()
            movie_url = movie.get('href')
            if movie_url is None:
                movie_url = movie.find('a', attrs = {"data-qa" : 'discovery-media-list-item-caption'}).get('href')

            if movie_url is not None:
                print(movie_name, "\t", movie_url, 'is getting data...')             
                data[movie_name] = get_movie_data(movie_url)
            # print(data[movie_name])
            count += 1
            if count == 10:
                with open('backend/movie.json', 'w') as f:
                    json.dump(data, f)
                count = 0
                print(f"Have saved 10 movies data, total:{len(data)}")
            # time.sleep(1)
        
        with open('backend/movie.json', 'w') as f:
            json.dump(data, f)
        print(data.keys())