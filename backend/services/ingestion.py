import requests
import pandas as pd
import os
from dotenv import load_dotenv

load_dotenv()

API_KEY = os.getenv("API_FOOTBALL_KEY")
BASE_URL = "https://v3.football.api-sports.io"

headers = {
    'x-rapidapi-host': "v3.football.api-sports.io",
    'x-rapidapi-key': API_KEY
}

def fetch_fixtures(league_id, season):
    """Fetch fixtures for a specific league and season."""
    url = f"{BASE_URL}/fixtures"
    params = {"league": league_id, "season": season}
    try:
        response = requests.get(url, headers=headers, params=params)
        if response.status_code == 200:
            return response.json()['response']
        else:
            print(f"Error fetching fixtures: {response.status_code}")
            return []
    except Exception as e:
        print(f"Request failed: {e}")
        return []

def get_team_streak(team_id, league_id, last_n=5):
    """Get the last N match results for a team."""
    # Placeholder for actual API call or DB query
    # In a real app, we'd fetch fixtures and filter by team_id
    return ["W", "W", "D", "W", "L"]

def get_player_stats(player_id, season=2024):
    """Fetch player statistics for the radar chart."""
    # Placeholder for actual API call
    return {
        "shooting": 85,
        "passing": 72,
        "dribbling": 68,
        "physical": 75,
        "defense": 45,
        "speed": 78
    }
