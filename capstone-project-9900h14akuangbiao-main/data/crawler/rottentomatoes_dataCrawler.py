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
        movie_info = [x.strip() for x in data if x.strip() != '']
        movie_data[movie_info[0]] = ''.join(movie_info[1:])
    
    return movie_data

def get_movie_poster(movie_data, movie_soup):
    for script in movie_soup.find_all(type='application/ld+json'):
        data_json = json.loads(script.string)
    r = requests.get(url=data_json['image'], stream=True)   
    img_name = re.sub(r'[^\w\d]', '_', data_json['name'].lower().strip())+'.jpg'
    movie_data['image_path'] = image_file_path+img_name
    with open(image_file_path+img_name, 'wb') as f:
        f.write(r.content)        
        
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

def get_movie_data(movie_url):
    movie_html = requests.get(url=base_url+movie_url, headers=headers)
    movie_soup = BeautifulSoup(movie_html.content, 'lxml')
    
    movie_data = {}
    movie_data['url'] = base_url+movie_url
    movie_data = get_movie_info(movie_data, movie_soup)
    movie_data = get_movie_cast(movie_data, movie_soup)
    movie_data = get_movie_poster(movie_data, movie_soup)
    
    # for i in movie_data:
    #     print(i, ' : ', movie_data[i])
        
    return movie_data

if __name__ == '__main__':
    
    data = {}
    # Check if the folder exists
    if not os.path.exists(image_file_path):
        os.makedirs(name=image_file_path)
        
    search_url = base_url+'/browse/movies_at_home/sort:popular?page=200'
    print(search_url)
    website_html = requests.get(url=search_url, headers=headers)
    website_soup = BeautifulSoup(website_html.content, 'lxml')
    
    movie_list = website_soup.find_all('a', attrs = {"data-qa" : 'discovery-media-list-item'})
    for movie in movie_list:
        movie_name = movie.find('span', attrs = {"data-qa" : 'discovery-media-list-item-title'}).get_text().strip()
        movie_url = movie.get('href')
        print(movie_name)
        if movie_url is not None:
            data[movie_name] = get_movie_data(movie_url)

        time.sleep(3)
        
    print(data)