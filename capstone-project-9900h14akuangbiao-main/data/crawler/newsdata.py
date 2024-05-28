import requests
from bs4 import BeautifulSoup
import json


def fetch_rottentomatoes_news(pages=1):
    for page in range(1, pages + 1):
        url = "https://editorial.rottentomatoes.com/news/?wpv_view_count=9675&wpv_paged=" + str(page)
        response = requests.get(url)
        soup = BeautifulSoup(response.text, "html.parser")

        news_data = []
        news_items = soup.find_all("div", class_="newsItem")
        # print(news_items)
        links = []
        print(f'news_items: {len(news_items)}')
        for i, news_item in enumerate(news_items):
            # print(news_item)
            link = news_item.find("a", class_='unstyled articleLink')["href"]
            print(f'link: {link}')

            link_res = requests.get(link)
            link_soup = BeautifulSoup(link_res.text, "html.parser")
            # print(link_soup.find('a', class_="author url fn"))
            if link_soup.find('a', class_="author url fn") != None:
                author = link_soup.find('a', class_="author url fn").text
                date = link_soup.find_all('a', class_="author url fn")[-1].next_sibling.split('|')[1].strip()
                img = news_item.find('img')['src']
                title = news_item.find('p', class_="noSpacing title").text
                details = link_soup.find('div', class_="articleContentBody").text
                print([title, author, img, details, date])
                news_data.append({
                    "newsId": i + 1,
                    "title": title,
                    "author": author,
                    "date": date,
                    "img": img,
                    "details": details
                })
            if i % 10 == 0:
                with open('backend/news.json', 'w') as f:
                    json.dump(news_data, f)
                print(f"Have saved 10 news data, total:{len(news_data)}")
            # time.sleep(1)

        with open('backend/news.json', 'w') as f:
            json.dump(news_data, f)
        # print(data)
        return news_data


if __name__ == "__main__":
    news_data = fetch_rottentomatoes_news(pages=5)
