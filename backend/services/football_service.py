import os
import requests
from datetime import datetime, timedelta
from sqlalchemy.orm import Session
import database
import models
import random

FOOTBALL_DATA_KEY = os.getenv("FOOTBALL_DATA_KEY", "865d878acde547cd815bf264898dbc0c")
BASE_URL = "https://api.football-data.org/v4"

# Mapping frontend league codes to football-data.org competition codes
LEAGUE_MAPPING = {
    "EU": "CL",   # Champions League
    "EN": "PL",   # Premier League
    "ES": "PD",   # Primera Division
    "IT": "SA",   # Serie A
    "DE": "BL1",  # Bundesliga
    "BR": "BSA",  # Campeonato Brasileiro
    "WC": "WC"    # World Cup
}

def fetch_and_update_matches():
    db = database.SessionLocal()
    headers = {"X-Auth-Token": FOOTBALL_DATA_KEY}
    
    # Get upcoming matches for the next 7 days
    date_from = datetime.utcnow().strftime("%Y-%m-%d")
    date_to = (datetime.utcnow() + timedelta(days=7)).strftime("%Y-%m-%d")

    for frontend_code, api_code in LEAGUE_MAPPING.items():
        try:
            print(f"Fetching matches for {frontend_code} (API: {api_code})...")
            url = f"{BASE_URL}/competitions/{api_code}/matches?dateFrom={date_from}&dateTo={date_to}"
            response = requests.get(url, headers=headers, timeout=10)
            
            if response.status_code == 200:
                data = response.json()
                matches = data.get("matches", [])
                
                # Ensure the league exists
                league = db.query(models.League).filter(models.League.id == frontend_code).first()
                if not league:
                    league = models.League(id=frontend_code, name=api_code)
                    db.add(league)
                    db.commit()

                for m in matches:
                    if m["status"] not in ["TIMED", "SCHEDULED", "IN_PLAY", "PAUSED"]:
                        continue # Skip finished matches
                        
                    home_name = m["homeTeam"]["shortName"] or m["homeTeam"]["name"]
                    away_name = m["awayTeam"]["shortName"] or m["awayTeam"]["name"]
                    home_logo = m["homeTeam"]["crest"]
                    away_logo = m["awayTeam"]["crest"]

                    # Check or create Home Team
                    home_team = db.query(models.Team).filter(models.Team.name == home_name, models.Team.league_id == frontend_code).first()
                    if not home_team:
                        home_team = models.Team(
                            league_id=frontend_code,
                            name=home_name,
                            logo=home_logo,
                            color="#ffffff", # Default color
                            form="E" * 5,
                            goals=random.randint(10, 40),
                            conceded=random.randint(10, 40),
                            possession=f"{random.randint(40, 60)}%",
                            wins=random.randint(5, 15),
                            stats=",".join([str(random.randint(60, 95)) for _ in range(6)])
                        )
                        db.add(home_team)
                        db.commit()
                        db.refresh(home_team)
                    elif home_logo and not home_team.logo:
                        home_team.logo = home_logo
                        db.commit()

                    # Check or create Away Team
                    away_team = db.query(models.Team).filter(models.Team.name == away_name, models.Team.league_id == frontend_code).first()
                    if not away_team:
                        away_team = models.Team(
                            league_id=frontend_code,
                            name=away_name,
                            logo=away_logo,
                            color="#ffffff",
                            form="E" * 5,
                            goals=random.randint(10, 40),
                            conceded=random.randint(10, 40),
                            possession=f"{random.randint(40, 60)}%",
                            wins=random.randint(5, 15),
                            stats=",".join([str(random.randint(60, 95)) for _ in range(6)])
                        )
                        db.add(away_team)
                        db.commit()
                        db.refresh(away_team)

                    # Create or update Match
                    match_record = db.query(models.Match).filter(
                        models.Match.home_team_id == home_team.id,
                        models.Match.away_team_id == away_team.id
                    ).first()
                    
                    if not match_record:
                        # Simulate AI Probabilities based on team 'wins' or random
                        base_home = 40 + (home_team.wins - away_team.wins) * 2
                        home_prob = max(10, min(80, base_home))
                        draw_prob = max(10, min(30, 30 - abs(home_team.wins - away_team.wins)))
                        away_prob = 100 - home_prob - draw_prob
                        
                        prediction = "Gana Local" if home_prob > away_prob else "Gana Visitante"
                        if draw_prob > home_prob and draw_prob > away_prob:
                            prediction = "Empate"

                        match_record = models.Match(
                            league_id=frontend_code,
                            home_team_id=home_team.id,
                            away_team_id=away_team.id,
                            home_prob=home_prob,
                            draw_prob=draw_prob,
                            away_prob=away_prob,
                            prediction=prediction
                        )
                        db.add(match_record)
                        db.commit()
            else:
                print(f"Error fetching {frontend_code}: {response.status_code}")
                
        except Exception as e:
            print(f"Exception for {frontend_code}: {str(e)}")

    db.close()
    print("Match update finished.")
