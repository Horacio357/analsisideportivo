from database import SessionLocal, engine, Base
from models import League, Team, Match

def insert_wc():
    db = SessionLocal()

    # Create League if not exists
    wc_league = db.query(League).filter(League.id == "WC").first()
    if not wc_league:
        db.add(League(id="WC", name="Copa del Mundo 2026"))
        db.commit()

    teams_data = [
        {"league_id": "WC", "name": 'Argentina', "logo": '/escudos/WC/argentina.png', "stats": [92, 88, 90, 85, 90, 88], "color": '#75aadb', "form": 'VVVVV', "goals": 24, "conceded": 4, "possession": '64%', "wins": 7},
        {"league_id": "WC", "name": 'Arabia Saudita', "logo": '/escudos/WC/arabiasaudita.png', "stats": [65, 62, 60, 68, 65, 58], "color": '#ff0000', "form": 'DVEVD', "goals": 10, "conceded": 15, "possession": '42%', "wins": 3},
        {"league_id": "WC", "name": 'España', "logo": '/escudos/WC/espana.png', "stats": [94, 86, 92, 80, 92, 90], "color": '#c60b1e', "form": 'VVVEV', "goals": 26, "conceded": 6, "possession": '68%', "wins": 6},
        {"league_id": "WC", "name": 'Nueva Zelanda', "logo": '/escudos/WC/nuevazelanda.png', "stats": [62, 65, 58, 72, 60, 55], "color": '#ffffff', "form": 'EDVDE', "goals": 8, "conceded": 12, "possession": '38%', "wins": 2},
        {"league_id": "WC", "name": 'Francia', "logo": '/escudos/WC/francia.png', "stats": [95, 88, 86, 90, 88, 92], "color": '#002395', "form": 'VVVEV', "goals": 22, "conceded": 5, "possession": '60%', "wins": 6},
        {"league_id": "WC", "name": 'Senegal', "logo": '/escudos/WC/senegal.png', "stats": [60, 62, 58, 70, 62, 50], "color": '#fcdc04', "form": 'VEEVD', "goals": 7, "conceded": 11, "possession": '40%', "wins": 2},
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
        existing = db.query(Team).filter(Team.name == td["name"]).first()
        if not existing:
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

    teams = db.query(Team).all()
    team_map = {f"{t.league_id}-{t.name}": t.id for t in teams}

    matches_data = [
        {
            "league_id": "WC", "home": "Argentina", "away": "Arabia Saudita", "homeProb": 88, "drawProb": 9, "awayProb": 3, "prediction": "Local",
            "group_name": "Grupo C", "confidence": "ALTA",
            "seguro_dnb_team": "Argentina", "seguro_dnb_odds": "1.05",
            "seguro_handicap_market": "Hándicap Asiático -1.5 (Argentina)", "seguro_handicap_odds": "1.40",
            "valor_1x2_team": "Argentina gana", "valor_1x2_odds": "1.15",
            "valor_overunder_market": "Más de 2.5 goles", "valor_overunder_odds": "1.55",
            "arriesgada_exact_score": "2-0", "arriesgada_exact_odds": "5.50",
            "arriesgada_combo": "Argentina gana en ambas mitades", "arriesgada_combo_odds": "2.20"
        },
        {
            "league_id": "WC", "home": "España", "away": "Nueva Zelanda", "homeProb": 90, "drawProb": 8, "awayProb": 2, "prediction": "Local",
            "group_name": "Grupo E", "confidence": "ALTA",
            "seguro_dnb_team": "España", "seguro_dnb_odds": "1.04",
            "seguro_handicap_market": "Hándicap Asiático -2.0 (España)", "seguro_handicap_odds": "1.60",
            "valor_1x2_team": "España gana", "valor_1x2_odds": "1.12",
            "league_id": "WC", "home": "Francia", "away": "Senegal", "homeProb": 85, "drawProb": 12, "awayProb": 3, "prediction": "Local",
            "group_name": "Grupo D", "confidence": "ALTA",
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
        {
            "league_id": "WC", "home": "México", "away": "Suecia", "homeProb": 48, "drawProb": 30, "awayProb": 22, "prediction": "Local",
            "group_name": "Grupo C", "confidence": "MEDIA",
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
            "group_name": "Grupo B", "confidence": "MEDIA",
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
            "group_name": "Grupo G", "confidence": "MEDIA",
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
        {
            "league_id": "WC", "home": "Países Bajos", "away": "Colombia", "homeProb": 35, "drawProb": 30, "awayProb": 35, "prediction": "Empate",
            "group_name": "Grupo A", "confidence": "VALUE BET",
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
            "group_name": "Grupo F", "confidence": "VALUE BET",
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
            existing = db.query(Match).filter(
                Match.league_id == md["league_id"],
                Match.home_team_id == home_id,
                Match.away_team_id == away_id
            ).first()
            if not existing:
                db.add(Match(
                    league_id=md["league_id"],
                    home_team_id=home_id,
                    away_team_id=away_id,
                    home_prob=md["homeProb"],
                    draw_prob=md["drawProb"],
                    away_prob=md["awayProb"],
                    prediction=md["prediction"],
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
                existing.group_name = md.get("group_name")

    db.commit()
    print("World Cup matches successfully inserted into DB!")

if __name__ == "__main__":
    insert_wc()
