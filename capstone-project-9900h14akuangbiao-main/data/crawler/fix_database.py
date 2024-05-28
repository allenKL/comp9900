import json
import sqlite3
from collections import defaultdict

conn = sqlite3.connect('./backend/db.sqlite3')
cursor = conn.cursor()

cursor.execute('DELETE FROM auth_user;')
conn.commit()
cursor.execute('DROP TABLE userprofile_userprofile;')
conn.commit()
cursor.close()

conn.close()