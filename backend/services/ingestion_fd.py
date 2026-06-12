import requests
import os
from dotenv import load_dotenv

load_dotenv()

API_KEY = os.getenv("FOOTBALL_DATA_KEY")
BASE_URL = "http://api.football-data.org/v4"

HEADERS = {
    "X-Auth-Token": API_KEY
}

# Map football-data competition IDs to our internal IDs
COMPETITION_MAP = {
    2021: 'EN', # Premier League
    2014: 'ES', # Primera Division
    2019: 'IT', # Serie A
    2002: 'DE', # Bundesliga
    2015: 'FR', # Ligue 1
    2013: 'BR', # Brasileirao
    2017: 'PT', # Primeira Liga
    2000: 'WC'  # World Cup
}

def fetch_upcoming_matches(days=10):
    """Fetches upcoming matches for mapped competitions."""
    import datetime
    
    date_from = datetime.datetime.now().strftime('%Y-%m-%d')
    date_to = (datetime.datetime.now() + datetime.timedelta(days=days)).strftime('%Y-%m-%d')
    
    url = f"{BASE_URL}/matches"
    params = {
        "dateFrom": date_from,
        "dateTo": date_to,
    }
    
    print(f"Fetching matches from {date_from} to {date_to}...")
    try:
        response = requests.get(url, headers=HEADERS, params=params)
        if response.status_code == 200:
            return response.json().get('matches', [])
        else:
            print(f"Error fetching matches: {response.status_code} - {response.text}")
            return []
    except Exception as e:
        print(f"Request failed: {e}")
        return []
