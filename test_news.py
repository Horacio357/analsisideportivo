import sys
sys.path.append('backend')
from services.news_service import get_recent_news
print("Result:")
print(get_recent_news('River Plate'))
