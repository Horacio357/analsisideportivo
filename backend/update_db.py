import os
import random
import sys
from database import SessionLocal, engine, Base
from models import League, Team, Match
from services.ingestion_fd import fetch_upcoming_matches, COMPETITION_MAP

def generate_heuristic_stats():
    """Generates random but realistic player/team stats for the radar chart."""
    return [
        random.randint(70, 95), # Tiro
        random.randint(65, 90), # Pase
        random.randint(60, 90), # Regate
        random.randint(65, 95), # Físico
        random.randint(60, 90), # Defensa
        random.randint(70, 95)  # Velocidad
    ]

def generate_probabilities():
    """Generates random match probabilities that sum up to ~100%."""
    home = random.randint(35, 60)
    draw = random.randint(20, 30)
    away = 100 - home - draw
    prediction = "Local" if home > away else "Visita" if away > home else "Empate"
    
    confidence_levels = ["ALTA", "MEDIA", "VALUE BET"]
    confidence = random.choice(confidence_levels)
    
    return home, draw, away, prediction, confidence

def update_database():
    db = SessionLocal()
    
    print("Limpiando partidos antiguos...")
    db.query(Match).delete()
    db.commit()
    
    matches = fetch_upcoming_matches(days=10)
    print(f"Total matches fetched from API: {len(matches)}")
    
    added_teams = 0
    added_matches = 0
    
    for m in matches:
        comp_id = m.get('competition', {}).get('id')
        
        # Only process leagues we care about
        if comp_id not in COMPETITION_MAP:
            continue
            
        league_id = COMPETITION_MAP[comp_id]
        
        home_team_data = m.get('homeTeam', {})
        away_team_data = m.get('awayTeam', {})
        
        if not home_team_data or not away_team_data:
            continue
            
        home_name = home_team_data.get('shortName') or home_team_data.get('name')
        home_logo = home_team_data.get('crest', '')
        
        away_name = away_team_data.get('shortName') or away_team_data.get('name')
        away_logo = away_team_data.get('crest', '')
        
        # Check and add home team
        home_team = db.query(Team).filter(Team.name == home_name).first()
        if not home_team:
            home_team = Team(
                league_id=league_id,
                name=home_name,
                logo=home_logo,
                stats=",".join(map(str, generate_heuristic_stats())),
                color='#1e293b', # Default dark
                form='V E D V E',
                goals=random.randint(10, 40),
                conceded=random.randint(10, 30),
                possession=f"{random.randint(45, 65)}%",
                wins=random.randint(5, 20)
            )
            db.add(home_team)
            db.flush() 
            added_teams += 1
            
        # Check and add away team
        away_team = db.query(Team).filter(Team.name == away_name).first()
        if not away_team:
            away_team = Team(
                league_id=league_id,
                name=away_name,
                logo=away_logo,
                stats=",".join(map(str, generate_heuristic_stats())),
                color='#334155',
                form='D V V E D',
                goals=random.randint(10, 40),
                conceded=random.randint(10, 30),
                possession=f"{random.randint(45, 65)}%",
                wins=random.randint(5, 20)
            )
            db.add(away_team)
            db.flush()
            added_teams += 1
            
        # Check if match already exists
        existing_match = db.query(Match).filter(
            Match.home_team_id == home_team.id,
            Match.away_team_id == away_team.id
        ).first()
        
        if not existing_match:
            hp, dp, ap, pred, conf = generate_probabilities()
            
            new_match = Match(
                league_id=league_id,
                home_team_id=home_team.id,
                away_team_id=away_team.id,
                home_prob=hp,
                draw_prob=dp,
                away_prob=ap,
                prediction=pred,
                confidence=conf,
                metric_form_xg=random.randint(60, 95),
                metric_squad=random.randint(60, 95),
                metric_context=random.randint(60, 95),
                metric_h2h=random.randint(60, 95)
            )
            db.add(new_match)
            added_matches += 1
            
    db.commit()
    print(f"Successfully added {added_teams} new teams and {added_matches} upcoming matches.")

if __name__ == "__main__":
    update_database()
