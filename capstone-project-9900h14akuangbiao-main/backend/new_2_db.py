import json
import os
import django


os.environ["DJANGO_SETTINGS_MODULE"] = "backend.settings"
django.setup()

from movie.models import News
from datetime import datetime

with open("news.json", "r") as f:
    datas = json.load(f)


for data in datas:
    print(data.pop("newsId", None), )

    News.objects.create(**data)