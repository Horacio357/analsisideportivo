from database import SessionLocal, engine, Base
from models import League, Team, Match

def seed_db():
    print("Dropping existing tables...")
    Base.metadata.drop_all(bind=engine)
    print("Creating tables...")
    Base.metadata.create_all(bind=engine)

    db = SessionLocal()

    leagues_data = [
        {"id": "AR", "name": "Liga Argentina Profesional"},
        {"id": "BR", "name": "Brasileirao Serie A"},
        {"id": "EU", "name": "UEFA Champions League"},
        {"id": "ES", "name": "La Liga"},
        {"id": "EN", "name": "Premier League"},
        {"id": "DE", "name": "Bundesliga"},
        {"id": "IT", "name": "Serie A"},
        {"id": "FR", "name": "Ligue 1"},
        {"id": "PT", "name": "Primeira Liga"},
        {"id": "US", "name": "MLS"},
        {"id": "MX", "name": "Liga MX"},
        {"id": "WC", "name": "Copa del Mundo 2026"},
    ]

    for ld in leagues_data:
        db.add(League(id=ld["id"], name=ld["name"]))
    
    db.commit()

    teams_data = [
        {"league_id": "AR", "name": 'Boca Juniors', "logo": '/escudos/AR/boca.png', "stats": [85, 78, 92, 80, 75, 88], "color": '#ffd700', "form": 'VVEVP', "goals": 28, "conceded": 12, "possession": '58%', "wins": 14},
        {"league_id": "AR", "name": 'River Plate', "logo": '/escudos/AR/river.png', "stats": [88, 80, 90, 82, 70, 85], "color": '#ff0000', "form": 'VVVVV', "goals": 30, "conceded": 10, "possession": '60%', "wins": 15},
        {"league_id": "AR", "name": 'Racing Club', "logo": '/escudos/AR/racing.png', "stats": [80, 75, 88, 85, 72, 80], "color": '#00bfff', "form": 'VVEVE', "goals": 25, "conceded": 15, "possession": '55%', "wins": 12},
        {"league_id": "AR", "name": 'Independiente', "logo": '/escudos/AR/independiente.png', "stats": [78, 72, 85, 80, 70, 75], "color": '#ff0000', "form": 'VEVEV', "goals": 20, "conceded": 18, "possession": '52%', "wins": 10},
        {"league_id": "AR", "name": 'San Lorenzo', "logo": '/escudos/AR/sanlorenzo.png', "stats": [75, 80, 82, 78, 85, 70], "color": '#00008b', "form": 'EEVEV', "goals": 18, "conceded": 15, "possession": '48%', "wins": 9},
        {"league_id": "AR", "name": 'Huracán', "logo": '/escudos/AR/huracan.png', "stats": [72, 75, 80, 75, 70, 68], "color": '#ff4500', "form": 'VEEEV', "goals": 15, "conceded": 20, "possession": '45%', "wins": 8},
        
        {"league_id": "BR", "name": 'Flamengo', "logo": '/escudos/BR/flamengo.png', "stats": [88, 82, 80, 85, 78, 90], "color": '#ff4444', "form": 'VVVEP', "goals": 34, "conceded": 15, "possession": '61%', "wins": 16},
        {"league_id": "BR", "name": 'Palmeiras', "logo": '/escudos/BR/palmeiras.png', "stats": [85, 85, 82, 88, 80, 85], "color": '#006400', "form": 'VVEVV', "goals": 30, "conceded": 12, "possession": '58%', "wins": 15},
        {"league_id": "BR", "name": 'Corinthians', "logo": '/escudos/BR/corinthians.png', "stats": [80, 78, 75, 82, 70, 78], "color": '#ffffff', "form": 'EEVEV', "goals": 25, "conceded": 20, "possession": '52%', "wins": 12},
        {"league_id": "BR", "name": 'São Paulo', "logo": '/escudos/BR/saopaulo.png', "stats": [82, 80, 78, 85, 75, 80], "color": '#ff0000', "form": 'VEEVV', "goals": 28, "conceded": 18, "possession": '55%', "wins": 14},
        {"league_id": "BR", "name": 'Atletico MG', "logo": '/escudos/BR/atlmineiro.png', "stats": [85, 82, 80, 88, 78, 85], "color": '#000000', "form": 'VVVEV', "goals": 32, "conceded": 15, "possession": '60%', "wins": 16},
        {"league_id": "BR", "name": 'Botafogo', "logo": '/escudos/BR/botafogo.png', "stats": [80, 75, 72, 80, 70, 75], "color": '#000000', "form": 'EEVEV', "goals": 22, "conceded": 25, "possession": '48%', "wins": 10},

        {"league_id": "EU", "name": 'Real Madrid (EU)', "logo": '/escudos/ES/realmadrid.png', "stats": [95, 90, 85, 92, 98, 95], "color": '#ffd700', "form": 'VVVVV', "goals": 52, "conceded": 18, "possession": '63%', "wins": 22},
        {"league_id": "EU", "name": 'Man City (EU)', "logo": '/escudos/EN/manchestercity.png', "stats": [92, 86, 90, 88, 94, 80], "color": '#6ec6ff', "form": 'VEVVV', "goals": 45, "conceded": 19, "possession": '65%', "wins": 19},
        {"league_id": "EU", "name": 'Bayern (EU)', "logo": '/escudos/DE/bayernmunchen.png', "stats": [96, 84, 88, 90, 92, 82], "color": '#ff4444', "form": 'VVVPV', "goals": 58, "conceded": 22, "possession": '64%', "wins": 21},
        {"league_id": "EU", "name": 'Arsenal (EU)', "logo": '/escudos/EN/arsenal.png', "stats": [88, 85, 82, 86, 80, 85], "color": '#ff0000', "form": 'VVEVV', "goals": 40, "conceded": 20, "possession": '60%', "wins": 18},
        {"league_id": "EU", "name": 'PSG (EU)', "logo": '/escudos/FR/psg.png', "stats": [90, 82, 85, 88, 92, 85], "color": '#004170', "form": 'VVVEV', "goals": 42, "conceded": 18, "possession": '64%', "wins": 17},
        {"league_id": "EU", "name": 'Barcelona (EU)', "logo": '/escudos/ES/barcelona.png', "stats": [88, 90, 85, 82, 88, 80], "color": '#0000ff', "form": 'VVEEV', "goals": 40, "conceded": 25, "possession": '65%', "wins": 16},

        {"league_id": "ES", "name": 'Real Madrid', "logo": '/escudos/ES/realmadrid.png', "stats": [94, 88, 87, 91, 96, 93], "color": '#ffd700', "form": 'VVEVV', "goals": 48, "conceded": 20, "possession": '62%', "wins": 20},
        {"league_id": "ES", "name": 'Barcelona', "logo": '/escudos/ES/barcelona.png', "stats": [88, 90, 85, 82, 88, 80], "color": '#0000ff', "form": 'VVEEV', "goals": 40, "conceded": 25, "possession": '65%', "wins": 16},
        {"league_id": "ES", "name": 'Atlético Madrid', "logo": '/escudos/ES/atlmadrid.png', "stats": [85, 92, 80, 88, 85, 75], "color": '#ff0000', "form": 'VVEVE', "goals": 35, "conceded": 15, "possession": '48%', "wins": 18},
        {"league_id": "ES", "name": 'Sevilla', "logo": '/escudos/ES/sevilla.png', "stats": [80, 82, 78, 85, 75, 80], "color": '#ffffff', "form": 'EEVEV', "goals": 25, "conceded": 20, "possession": '52%', "wins": 12},
        {"league_id": "ES", "name": 'Athletic Club', "logo": '/escudos/ES/athletic.png', "stats": [82, 85, 80, 88, 82, 78], "color": '#ff0000', "form": 'VVEEV', "goals": 30, "conceded": 18, "possession": '50%', "wins": 14},
        {"league_id": "ES", "name": 'Real Sociedad', "logo": '/escudos/ES/realsociedad.png', "stats": [80, 82, 85, 80, 85, 75], "color": '#0000ff', "form": 'VEEVV', "goals": 28, "conceded": 22, "possession": '55%', "wins": 13},

        {"league_id": "EN", "name": 'Man City', "logo": '/escudos/EN/manchestercity.png', "stats": [92, 86, 90, 88, 94, 80], "color": '#6ec6ff', "form": 'VEVVV', "goals": 45, "conceded": 19, "possession": '65%', "wins": 19},
        {"league_id": "EN", "name": 'Arsenal', "logo": '/escudos/EN/arsenal.png', "stats": [88, 85, 82, 86, 80, 85], "color": '#ff0000', "form": 'VVEVV', "goals": 40, "conceded": 20, "possession": '60%', "wins": 18},
        {"league_id": "EN", "name": 'Liverpool', "logo": '/escudos/EN/liverpool.png', "stats": [90, 82, 88, 85, 80, 88], "color": '#ff0000', "form": 'VVVEV', "goals": 42, "conceded": 22, "possession": '62%', "wins": 17},
        {"league_id": "EN", "name": 'Chelsea', "logo": '/escudos/EN/chelsea.png', "stats": [85, 80, 82, 88, 85, 80], "color": '#0000ff', "form": 'EEVVV', "goals": 35, "conceded": 25, "possession": '58%', "wins": 15},
        {"league_id": "EN", "name": 'Aston Villa', "logo": '/escudos/EN/astonvilla.png', "stats": [82, 85, 80, 82, 78, 85], "color": '#800000', "form": 'VVEEV', "goals": 32, "conceded": 28, "possession": '50%', "wins": 14},
        {"league_id": "EN", "name": 'Tottenham', "logo": '/escudos/EN/tottenham.png', "stats": [88, 80, 85, 80, 82, 88], "color": '#ffffff', "form": 'VVEVE', "goals": 38, "conceded": 30, "possession": '55%', "wins": 13},

        {"league_id": "DE", "name": 'Bayern Munich', "logo": '/escudos/DE/bayernmunchen.png', "stats": [96, 84, 88, 90, 92, 82], "color": '#ff4444', "form": 'VVVPV', "goals": 58, "conceded": 22, "possession": '64%', "wins": 21},
        {"league_id": "DE", "name": 'Borussia Dortmund', "logo": '/escudos/DE/borussiadortmund.png', "stats": [88, 80, 85, 82, 80, 88], "color": '#ffd700', "form": 'VVEVV', "goals": 40, "conceded": 25, "possession": '55%', "wins": 18},
        {"league_id": "DE", "name": 'Bayer Leverkusen', "logo": '/escudos/DE/bayerleverkusen.png', "stats": [90, 85, 88, 85, 88, 85], "color": '#ff0000', "form": 'VVVVV', "goals": 45, "conceded": 15, "possession": '60%', "wins": 20},
        {"league_id": "DE", "name": 'RB Leipzig', "logo": '/escudos/DE/rbleipzig.png', "stats": [85, 82, 80, 88, 85, 88], "color": '#ffffff', "form": 'VVEEV', "goals": 38, "conceded": 20, "possession": '58%', "wins": 16},

        {"league_id": "IT", "name": 'Inter Milan', "logo": '/escudos/IT/inter.png', "stats": [88, 90, 80, 86, 88, 75], "color": '#6ec6ff', "form": 'VVEVV', "goals": 40, "conceded": 16, "possession": '57%', "wins": 18},
        {"league_id": "IT", "name": 'AC Milan', "logo": '/escudos/IT/milan.png', "stats": [85, 85, 82, 88, 80, 85], "color": '#ff0000', "form": 'VVEEV', "goals": 35, "conceded": 20, "possession": '55%', "wins": 16},
        {"league_id": "IT", "name": 'Juventus', "logo": '/escudos/IT/juventus.png', "stats": [82, 92, 80, 85, 88, 75], "color": '#ffffff', "form": 'EEVEV', "goals": 30, "conceded": 15, "possession": '50%', "wins": 15},
        {"league_id": "IT", "name": 'Napoli', "logo": '/escudos/IT/napoli.png', "stats": [88, 80, 85, 82, 80, 88], "color": '#6ec6ff', "form": 'VVEVE', "goals": 38, "conceded": 25, "possession": '58%', "wins": 14},

        {"league_id": "FR", "name": 'PSG', "logo": '/escudos/FR/psg.png', "stats": [90, 82, 85, 88, 92, 85], "color": '#004170', "form": 'VVVEV', "goals": 42, "conceded": 18, "possession": '64%', "wins": 17},
        {"league_id": "FR", "name": 'Olympique Lyon', "logo": '/escudos/FR/olympiquelyon.png', "stats": [82, 80, 78, 85, 75, 80], "color": '#ffffff', "form": 'EEVEV', "goals": 28, "conceded": 25, "possession": '52%', "wins": 12},
        {"league_id": "FR", "name": 'Monaco', "logo": '/escudos/FR/monaco.png', "stats": [85, 80, 82, 88, 80, 85], "color": '#ff0000', "form": 'VVEVV', "goals": 35, "conceded": 20, "possession": '55%', "wins": 15},
        {"league_id": "FR", "name": 'Olimpique Marsella', "logo": '/escudos/FR/olimpiquemarsella.png', "stats": [80, 82, 85, 80, 85, 78], "color": '#6ec6ff', "form": 'VVEEV', "goals": 32, "conceded": 22, "possession": '58%', "wins": 14},

        {"league_id": "PT", "name": 'Benfica', "logo": '/escudos/PT/benfica.png', "stats": [86, 80, 82, 84, 88, 80], "color": '#ff0000', "form": 'VVEVV', "goals": 38, "conceded": 14, "possession": '58%', "wins": 15},
        {"league_id": "PT", "name": 'Porto', "logo": '/escudos/PT/porto.png', "stats": [85, 82, 80, 88, 85, 82], "color": '#0000ff', "form": 'VVVEV', "goals": 35, "conceded": 15, "possession": '55%', "wins": 16},
        {"league_id": "PT", "name": 'Sporting', "logo": '/escudos/PT/sporting.png', "stats": [88, 85, 82, 86, 80, 85], "color": '#006400', "form": 'VVVVV', "goals": 40, "conceded": 12, "possession": '60%', "wins": 18},
        {"league_id": "PT", "name": 'Braga', "logo": '/escudos/PT/braga.png', "stats": [80, 78, 85, 82, 75, 80], "color": '#ff0000', "form": 'VEEVV', "goals": 28, "conceded": 20, "possession": '52%', "wins": 12},

        {"league_id": "US", "name": 'Inter Miami', "logo": '/escudos/US/intermiami.png', "stats": [92, 65, 88, 70, 72, 60], "color": '#ff69b4', "form": 'VVVEV', "goals": 36, "conceded": 24, "possession": '55%', "wins": 15},
        {"league_id": "US", "name": 'LA Galaxy', "logo": '/escudos/US/losangelesgalaxy.png', "stats": [80, 75, 82, 85, 70, 78], "color": '#ffffff', "form": 'EEVEV', "goals": 28, "conceded": 30, "possession": '52%', "wins": 12},
        {"league_id": "US", "name": 'NY Red Bulls', "logo": '/escudos/US/newyork.png', "stats": [78, 80, 75, 82, 78, 80], "color": '#ff0000', "form": 'VVEVE', "goals": 25, "conceded": 22, "possession": '48%', "wins": 11},
        {"league_id": "US", "name": 'Orlando City', "logo": '/escudos/US/orlandocity.png', "stats": [75, 78, 80, 75, 82, 75], "color": '#800080', "form": 'EEVVV', "goals": 22, "conceded": 20, "possession": '50%', "wins": 10},

        {"league_id": "MX", "name": 'Club América', "logo": '/escudos/MX/america.png', "stats": [85, 80, 78, 82, 80, 72], "color": '#ffd700', "form": 'VPVVV', "goals": 32, "conceded": 18, "possession": '56%', "wins": 14},
        {"league_id": "MX", "name": 'Chivas', "logo": '/escudos/MX/guadalajara.png', "stats": [80, 78, 82, 80, 75, 78], "color": '#ff0000', "form": 'EEVEV', "goals": 25, "conceded": 20, "possession": '52%', "wins": 12},
        {"league_id": "MX", "name": 'Cruz Azul', "logo": '/escudos/MX/cruzazul.png', "stats": [82, 85, 80, 78, 82, 80], "color": '#0000ff', "form": 'VVEVV', "goals": 28, "conceded": 15, "possession": '55%', "wins": 13},
        {"league_id": "MX", "name": 'Pumas UNAM', "logo": '/escudos/MX/pumas.png', "stats": [78, 80, 75, 85, 70, 82], "color": '#ffd700', "form": 'VEVEV', "goals": 22, "conceded": 25, "possession": '48%', "wins": 10},
        
        # Copa del Mundo 2026 teams
        {"league_id": "WC", "name": 'Argentina', "logo": '/escudos/WC/argentina.png', "stats": [92, 88, 90, 85, 90, 88], "color": '#75aadb', "form": 'VVVVV', "goals": 24, "conceded": 4, "possession": '64%', "wins": 7},
        {"league_id": "WC", "name": 'Jordania', "logo": '/escudos/WC/arabiasaudita.png', "stats": [65, 62, 60, 68, 65, 58], "color": '#ff0000', "form": 'DVEVD', "goals": 10, "conceded": 15, "possession": '42%', "wins": 3},
        {"league_id": "WC", "name": 'España', "logo": '/escudos/WC/espana.png', "stats": [94, 86, 92, 80, 92, 90], "color": '#c60b1e', "form": 'VVVEV', "goals": 26, "conceded": 6, "possession": '68%', "wins": 6},
        {"league_id": "WC", "name": 'Nueva Zelanda', "logo": '/escudos/WC/nuevazelanda.png', "stats": [62, 65, 58, 72, 60, 55], "color": '#ffffff', "form": 'EDVDE', "goals": 8, "conceded": 12, "possession": '38%', "wins": 2},
        {"league_id": "WC", "name": 'Francia', "logo": '/escudos/WC/francia.png', "stats": [95, 88, 86, 90, 88, 92], "color": '#002395', "form": 'VVVEV', "goals": 22, "conceded": 5, "possession": '60%', "wins": 6},
        {"league_id": "WC", "name": 'Uganda', "logo": '/escudos/WC/senegal.png', "stats": [60, 62, 58, 70, 62, 50], "color": '#fcdc04', "form": 'VEEVD', "goals": 7, "conceded": 11, "possession": '40%', "wins": 2},
        {"league_id": "WC", "name": 'México', "logo": '/escudos/WC/mexico.png', "stats": [82, 80, 78, 82, 80, 75], "color": '#006847', "form": 'VEVVE', "goals": 14, "conceded": 10, "possession": '53%', "wins": 4},
        {"league_id": "WC", "name": 'Suecia', "logo": '/escudos/WC/suecia.png', "stats": [80, 82, 76, 85, 78, 78], "color": '#006aa7', "form": 'EVEVD', "goals": 12, "conceded": 11, "possession": '50%', "wins": 3},
        {"league_id": "WC", "name": 'Inglaterra', "logo": '/escudos/WC/inglaterra.png', "stats": [92, 85, 84, 88, 86, 88], "color": '#ffffff', "form": 'VVEEV', "goals": 18, "conceded": 8, "possession": '58%', "wins": 5},
        {"league_id": "WC", "name": 'Ecuador', "logo": '/escudos/WC/ecuador.png', "stats": [80, 84, 75, 88, 80, 76], "color": '#ffdd00', "form": 'VEVVE', "goals": 11, "conceded": 9, "possession": '48%', "wins": 3},
        {"league_id": "WC", "name": 'Brasil', "logo": '/escudos/WC/brasil.png', "stats": [90, 82, 85, 84, 88, 92], "color": '#fedf00', "form": 'VVVEV', "goals": 20, "conceded": 9, "possession": '60%', "wins": 5},
        {"league_id": "WC", "name": 'Uruguay', "logo": '/escudos/WC/uruguay.png', "stats": [85, 88, 80, 90, 85, 82], "color": '#00a6da', "form": 'VVEVV', "goals": 16, "conceded": 8, "possession": '52%', "wins": 5},
        {"league_id": "WC", "name": 'Países Bajos', "logo": '/escudos/WC/paisesbajos.png', "stats": [88, 86, 84, 82, 86, 84], "color": '#ff9b00', "form": 'VVEVV', "goals": 15, "conceded": 10, "possession": '56%', "wins": 4},
        {"league_id": "WC", "name": 'Colombia', "logo": '/escudos/WC/colombia.png', "stats": [86, 82, 85, 86, 82, 85], "color": '#fcd116', "form": 'VVVVV', "goals": 19, "conceded": 7, "possession": '55%', "wins": 6},
        {"league_id": "WC", "name": 'Portugal', "logo": '/escudos/WC/portugal.png', "stats": [90, 84, 86, 82, 88, 86], "color": '#ff0000', "form": 'VVEVE', "goals": 18, "conceded": 9, "possession": '58%', "wins": 4},
        {"league_id": "WC", "name": 'Croacia', "logo": '/escudos/WC/croacia.png', "stats": [84, 88, 90, 80, 85, 80], "color": '#ffffff', "form": 'EEVEV', "goals": 12, "conceded": 10, "possession": '54%', "wins": 3},
        {"league_id": "WC", "name": 'EE.UU.', "logo": '/escudos/WC/usa.png', "stats": [82, 80, 82, 85, 78, 80], "color": '#002868', "form": 'EVEVV', "goals": 13, "conceded": 11, "possession": '52%', "wins": 3},
        {"league_id": "WC", "name": 'Marruecos', "logo": '/escudos/WC/marruecos.png', "stats": [85, 86, 84, 88, 82, 85], "color": '#c1272d', "form": 'VVVEV', "goals": 16, "conceded": 8, "possession": '54%', "wins": 5},
    ]

    for td in teams_data:
        db.add(Team(
            league_id=td["league_id"],
            name=td["name"],
            logo=td["logo"],
            stats=",".join(map(str, td["stats"])),
            color=td["color"],
            form=td["form"],
            goals=td["goals"],
            conceded=td["conceded"],
            possession=td["possession"],
            wins=td["wins"]
        ))
    
    db.commit()

    # We need to map team names to IDs to create matches
    teams = db.query(Team).all()
    team_map = {f"{t.league_id}-{t.name}": t.id for t in teams}

    matches_data = [
        # AR
        {"league_id": "AR", "home": "Boca Juniors", "away": "River Plate", "homeProb": 45, "drawProb": 30, "awayProb": 25, "prediction": "Local"},
        {"league_id": "AR", "home": "Racing Club", "away": "Independiente", "homeProb": 50, "drawProb": 25, "awayProb": 25, "prediction": "Local"},
        {"league_id": "AR", "home": "San Lorenzo", "away": "Huracán", "homeProb": 38, "drawProb": 32, "awayProb": 30, "prediction": "Empate"},
        # BR
        {"league_id": "BR", "home": "Flamengo", "away": "Palmeiras", "homeProb": 45, "drawProb": 25, "awayProb": 30, "prediction": "Local"},
        {"league_id": "BR", "home": "Corinthians", "away": "São Paulo", "homeProb": 35, "drawProb": 35, "awayProb": 30, "prediction": "Empate"},
        {"league_id": "BR", "home": "Atletico MG", "away": "Botafogo", "homeProb": 52, "drawProb": 22, "awayProb": 26, "prediction": "Local"},
        # EU
        {"league_id": "EU", "home": "Real Madrid (EU)", "away": "Man City (EU)", "homeProb": 38, "drawProb": 24, "awayProb": 38, "prediction": "Local"},
        {"league_id": "EU", "home": "Bayern (EU)", "away": "Arsenal (EU)", "homeProb": 42, "drawProb": 28, "awayProb": 30, "prediction": "Local"},
        {"league_id": "EU", "home": "PSG (EU)", "away": "Barcelona (EU)", "homeProb": 36, "drawProb": 27, "awayProb": 37, "prediction": "Empate"},
        # ES
        {"league_id": "ES", "home": "Real Madrid", "away": "Barcelona", "homeProb": 44, "drawProb": 24, "awayProb": 32, "prediction": "Local"},
        {"league_id": "ES", "home": "Atlético Madrid", "away": "Sevilla", "homeProb": 50, "drawProb": 25, "awayProb": 25, "prediction": "Local"},
        {"league_id": "ES", "home": "Athletic Club", "away": "Real Sociedad", "homeProb": 40, "drawProb": 30, "awayProb": 30, "prediction": "Empate"},
        # EN
        {"league_id": "EN", "home": "Man City", "away": "Arsenal", "homeProb": 48, "drawProb": 22, "awayProb": 30, "prediction": "Local"},
        {"league_id": "EN", "home": "Liverpool", "away": "Chelsea", "homeProb": 45, "drawProb": 25, "awayProb": 30, "prediction": "Local"},
        {"league_id": "EN", "home": "Aston Villa", "away": "Tottenham", "homeProb": 38, "drawProb": 28, "awayProb": 34, "prediction": "Empate"},
        # DE
        {"league_id": "DE", "home": "Bayern Munich", "away": "Borussia Dortmund", "homeProb": 55, "drawProb": 20, "awayProb": 25, "prediction": "Local"},
        {"league_id": "DE", "home": "Bayer Leverkusen", "away": "RB Leipzig", "homeProb": 45, "drawProb": 28, "awayProb": 27, "prediction": "Local"},
        # IT
        {"league_id": "IT", "home": "Inter Milan", "away": "AC Milan", "homeProb": 46, "drawProb": 26, "awayProb": 28, "prediction": "Local"},
        {"league_id": "IT", "home": "Juventus", "away": "Napoli", "homeProb": 38, "drawProb": 30, "awayProb": 32, "prediction": "Empate"},
        # FR
        {"league_id": "FR", "home": "PSG", "away": "Olympique Lyon", "homeProb": 55, "drawProb": 25, "awayProb": 20, "prediction": "Local"},
        {"league_id": "FR", "home": "Monaco", "away": "Olimpique Marsella", "homeProb": 40, "drawProb": 30, "awayProb": 30, "prediction": "Empate"},
        # PT
        {"league_id": "PT", "home": "Benfica", "away": "Porto", "homeProb": 45, "drawProb": 30, "awayProb": 25, "prediction": "Local"},
        {"league_id": "PT", "home": "Sporting", "away": "Braga", "homeProb": 50, "drawProb": 25, "awayProb": 25, "prediction": "Local"},
        # US
        {"league_id": "US", "home": "Inter Miami", "away": "LA Galaxy", "homeProb": 60, "drawProb": 20, "awayProb": 20, "prediction": "Local"},
        {"league_id": "US", "home": "NY Red Bulls", "away": "Orlando City", "homeProb": 40, "drawProb": 30, "awayProb": 30, "prediction": "Empate"},
        # MX
        {"league_id": "MX", "home": "Club América", "away": "Chivas", "homeProb": 48, "drawProb": 26, "awayProb": 26, "prediction": "Local"},
        {"league_id": "MX", "home": "Cruz Azul", "away": "Pumas UNAM", "homeProb": 42, "drawProb": 28, "awayProb": 30, "prediction": "Local"},
        
        # Copa del Mundo 2026 matches (curados v2)
        # Confianza Alta
        {
            "league_id": "WC", "home": "Argentina", "away": "Jordania", "homeProb": 88, "drawProb": 9, "awayProb": 3, "prediction": "Local",
            "group_name": "Grupo A", "confidence": "ALTA",
            "seguro_dnb_team": "Argentina", "seguro_dnb_odds": "1.05",
            "seguro_handicap_market": "Hándicap Asiático -1.5 (Argentina)", "seguro_handicap_odds": "1.40",
            "valor_1x2_team": "Argentina gana", "valor_1x2_odds": "1.15",
            "valor_overunder_market": "Over/Under: Más de 2.5 goles", "valor_overunder_odds": "1.50",
            "arriesgado_1x2pt_market": "1X2 Primer Tiempo (Argentina gana)", "arriesgado_1x2pt_odds": "1.55",
            "arriesgado_btts_market": "BTTS (Ambos Anotan): No", "arriesgado_btts_odds": "1.65",
            "when_to_bet": "Pre-partido (24-48h antes)",
            "pending_adjustments": "Convocatoria final de delanteros a confirmar; se evalúa descanso de titulares en el segundo tiempo.",
            "metric_form_xg": 92, "metric_squad": 95, "metric_context": 85, "metric_h2h": 50
        },
        {
            "league_id": "WC", "home": "España", "away": "Nueva Zelanda", "homeProb": 90, "drawProb": 8, "awayProb": 2, "prediction": "Local",
            "group_name": "Grupo B", "confidence": "ALTA",
            "seguro_dnb_team": "España", "seguro_dnb_odds": "1.04",
            "seguro_handicap_market": "Hándicap Asiático -2.0 (España)", "seguro_handicap_odds": "1.60",
            "valor_1x2_team": "España gana", "valor_1x2_odds": "1.12",
            "valor_overunder_market": "Over/Under: Más de 2.5 goles", "valor_overunder_odds": "1.45",
            "arriesgado_1x2pt_market": "1X2 Primer Tiempo (España gana)", "arriesgado_1x2pt_odds": "1.48",
            "arriesgado_btts_market": "BTTS (Ambos Anotan): No", "arriesgado_btts_odds": "1.55",
            "when_to_bet": "Pre-partido (24-48h antes)",
            "pending_adjustments": "Molestias físicas del extremo titular; se espera rotación en el mediocampo.",
            "metric_form_xg": 90, "metric_squad": 94, "metric_context": 88, "metric_h2h": 50
        },
        {
            "league_id": "WC", "home": "Francia", "away": "Uganda", "homeProb": 85, "drawProb": 12, "awayProb": 3, "prediction": "Local",
            "group_name": "Grupo C", "confidence": "ALTA",
            "seguro_dnb_team": "Francia", "seguro_dnb_odds": "1.06",
            "seguro_handicap_market": "Hándicap Asiático -1.5 (Francia)", "seguro_handicap_odds": "1.38",
            "valor_1x2_team": "Francia gana", "valor_1x2_odds": "1.18",
            "valor_overunder_market": "Over/Under: Más de 2.5 goles", "valor_overunder_odds": "1.52",
            "arriesgado_1x2pt_market": "1X2 Primer Tiempo (Francia gana)", "arriesgado_1x2pt_odds": "1.60",
            "arriesgado_btts_market": "BTTS (Ambos Anotan): No", "arriesgado_btts_odds": "1.70",
            "when_to_bet": "Pre-partido (24-48h antes)",
            "pending_adjustments": "Confirmar estado físico del lateral izquierdo tras la última jornada de liga.",
            "metric_form_xg": 88, "metric_squad": 95, "metric_context": 80, "metric_h2h": 50
        },
        # Confianza Media
        {
            "league_id": "WC", "home": "México", "away": "Suecia", "homeProb": 48, "drawProb": 30, "awayProb": 22, "prediction": "Local",
            "group_name": "Grupo D", "confidence": "MEDIA",
            "seguro_dnb_team": "México", "seguro_dnb_odds": "1.65",
            "seguro_handicap_market": "Hándicap Asiático -0.5 (México)", "seguro_handicap_odds": "1.85",
            "valor_1x2_team": "México gana", "valor_1x2_odds": "2.10",
            "valor_overunder_market": "Over/Under: Menos de 2.5 goles", "valor_overunder_odds": "1.75",
            "arriesgado_1x2pt_market": "1X2 Primer Tiempo (Empate)", "arriesgado_1x2pt_odds": "2.05",
            "arriesgado_btts_market": "BTTS (Ambos Anotan): Sí", "arriesgado_btts_odds": "1.95",
            "when_to_bet": "En Vivo (In-Play)",
            "pending_adjustments": "Suspensión por tarjetas amarillas del mediocentro defensivo; regreso del central titular.",
            "metric_form_xg": 72, "metric_squad": 78, "metric_context": 85, "metric_h2h": 60
        },
        {
            "league_id": "WC", "home": "Inglaterra", "away": "Ecuador", "homeProb": 58, "drawProb": 26, "awayProb": 16, "prediction": "Local",
            "group_name": "Grupo E", "confidence": "MEDIA",
            "seguro_dnb_team": "Inglaterra", "seguro_dnb_odds": "1.35",
            "seguro_handicap_market": "Hándicap Asiático -0.5 (Inglaterra)", "seguro_handicap_odds": "1.55",
            "valor_1x2_team": "Inglaterra gana", "valor_1x2_odds": "1.72",
            "valor_overunder_market": "Over/Under: Más de 1.5 goles", "valor_overunder_odds": "1.30",
            "arriesgado_1x2pt_market": "1X2 Primer Tiempo (Inglaterra gana)", "arriesgado_1x2pt_odds": "2.30",
            "arriesgado_btts_market": "BTTS (Ambos Anotan): Sí", "arriesgado_btts_odds": "2.10",
            "when_to_bet": "Pre-partido (24-48h antes)",
            "pending_adjustments": "Lesión del portero titular en el entrenamiento; debut del portero suplente en partido oficial.",
            "metric_form_xg": 78, "metric_squad": 85, "metric_context": 75, "metric_h2h": 65
        },
        {
            "league_id": "WC", "home": "Brasil", "away": "Uruguay", "homeProb": 50, "drawProb": 30, "awayProb": 20, "prediction": "Local",
            "group_name": "Grupo F", "confidence": "MEDIA",
            "seguro_dnb_team": "Brasil", "seguro_dnb_odds": "1.45",
            "seguro_handicap_market": "Hándicap Asiático -0.5 (Brasil)", "seguro_handicap_odds": "1.75",
            "valor_1x2_team": "Brasil gana", "valor_1x2_odds": "2.00",
            "valor_overunder_market": "Over/Under: Más de 2.5 goles", "valor_overunder_odds": "1.90",
            "arriesgado_1x2pt_market": "1X2 Primer Tiempo (Empate)", "arriesgado_1x2pt_odds": "2.10",
            "arriesgado_btts_market": "BTTS (Ambos Anotan): Sí", "arriesgado_btts_odds": "1.80",
            "when_to_bet": "En Vivo (In-Play)",
            "pending_adjustments": "Convocatoria final de Uruguay presenta dudas en la zaga defensiva.",
            "metric_form_xg": 75, "metric_squad": 88, "metric_context": 70, "metric_h2h": 80
        },
        # Value Bet
        {
            "league_id": "WC", "home": "Países Bajos", "away": "Colombia", "homeProb": 35, "drawProb": 30, "awayProb": 35, "prediction": "Empate",
            "group_name": "Grupo G", "confidence": "VALUE BET",
            "seguro_dnb_team": "Colombia", "seguro_dnb_odds": "2.10",
            "seguro_handicap_market": "Hándicap Asiático +0.5 (Colombia)", "seguro_handicap_odds": "1.80",
            "valor_1x2_team": "Colombia gana", "valor_1x2_odds": "3.10",
            "valor_overunder_market": "Over/Under: Más de 2.5 goles", "valor_overunder_odds": "2.15",
            "arriesgado_1x2pt_market": "1X2 Primer Tiempo (Colombia gana)", "arriesgado_1x2pt_odds": "3.75",
            "arriesgado_btts_market": "BTTS (Ambos Anotan): Sí", "arriesgado_btts_odds": "1.90",
            "when_to_bet": "Pre-partido (24-48h antes)",
            "pending_adjustments": "Regreso del extremo estrella tras lesión muscular; confirmación de la alineación táctica de Países Bajos.",
            "metric_form_xg": 85, "metric_squad": 82, "metric_context": 75, "metric_h2h": 70
        },
        {
            "league_id": "WC", "home": "Portugal", "away": "Croacia", "homeProb": 40, "drawProb": 32, "awayProb": 28, "prediction": "Local",
            "group_name": "Grupo H", "confidence": "VALUE BET",
            "seguro_dnb_team": "Croacia", "seguro_dnb_odds": "2.30",
            "seguro_handicap_market": "Hándicap Asiático +0.5 (Croacia)", "seguro_handicap_odds": "1.95",
            "valor_1x2_team": "Croacia gana", "valor_1x2_odds": "3.40",
            "valor_overunder_market": "Over/Under: Menos de 2.5 goles", "valor_overunder_odds": "1.85",
            "arriesgado_1x2pt_market": "1X2 Primer Tiempo (Empate)", "arriesgado_1x2pt_odds": "2.15",
            "arriesgado_btts_market": "BTTS (Ambos Anotan): No", "arriesgado_btts_odds": "2.00",
            "when_to_bet": "Pre-partido (24-48h antes)",
            "pending_adjustments": "Recuperación de la fatiga del mediocampo veterano de Croacia; cambios en el lateral izquierdo de Portugal.",
            "metric_form_xg": 80, "metric_squad": 84, "metric_context": 80, "metric_h2h": 75
        },
        {
            "league_id": "WC", "home": "EE.UU.", "away": "Marruecos", "homeProb": 36, "drawProb": 32, "awayProb": 32, "prediction": "Local",
            "group_name": "Grupo I", "confidence": "VALUE BET",
            "seguro_dnb_team": "Marruecos", "seguro_dnb_odds": "2.05",
            "seguro_handicap_market": "Hándicap Asiático +0.5 (Marruecos)", "seguro_handicap_odds": "1.75",
            "valor_1x2_team": "Marruecos gana", "valor_1x2_odds": "2.90",
            "valor_overunder_market": "Over/Under: Más de 2.5 goles", "valor_overunder_odds": "2.20",
            "arriesgado_1x2pt_market": "1X2 Primer Tiempo (Marruecos gana)", "arriesgado_1x2pt_odds": "3.50",
            "arriesgado_btts_market": "BTTS (Ambos Anotan): Sí", "arriesgado_btts_odds": "1.95",
            "when_to_bet": "En Vivo (In-Play)",
            "pending_adjustments": "Convocatoria a confirmar del delantero centro titular de Marruecos por molestias musculares.",
            "metric_form_xg": 78, "metric_squad": 82, "metric_context": 80, "metric_h2h": 70
        },
    ]

    for md in matches_data:
        home_id = team_map.get(f"{md['league_id']}-{md['home']}")
        away_id = team_map.get(f"{md['league_id']}-{md['away']}")

        if home_id and away_id:
            db.add(Match(
                league_id=md["league_id"],
                home_team_id=home_id,
                away_team_id=away_id,
                home_prob=md["homeProb"],
                draw_prob=md["drawProb"],
                away_prob=md["awayProb"],
                prediction=md["prediction"],
                
                # New detailed fields (v2)
                group_name=md.get("group_name"),
                confidence=md.get("confidence"),
                seguro_dnb_team=md.get("seguro_dnb_team"),
                seguro_dnb_odds=md.get("seguro_dnb_odds"),
                seguro_handicap_market=md.get("seguro_handicap_market"),
                seguro_handicap_odds=md.get("seguro_handicap_odds"),
                valor_1x2_team=md.get("valor_1x2_team"),
                valor_1x2_odds=md.get("valor_1x2_odds"),
                valor_overunder_market=md.get("valor_overunder_market"),
                valor_overunder_odds=md.get("valor_overunder_odds"),
                arriesgado_1x2pt_market=md.get("arriesgado_1x2pt_market"),
                arriesgado_1x2pt_odds=md.get("arriesgado_1x2pt_odds"),
                arriesgado_btts_market=md.get("arriesgado_btts_market"),
                arriesgado_btts_odds=md.get("arriesgado_btts_odds"),
                when_to_bet=md.get("when_to_bet"),
                pending_adjustments=md.get("pending_adjustments"),
                metric_form_xg=md.get("metric_form_xg"),
                metric_squad=md.get("metric_squad"),
                metric_context=md.get("metric_context"),
                metric_h2h=md.get("metric_h2h")
            ))
        else:
            print(f"Warning: Team not found for match {md['home']} vs {md['away']}")

    db.commit()
    print("Database seeded successfully!")

if __name__ == "__main__":
    seed_db()
