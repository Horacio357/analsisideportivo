from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
from sqlalchemy.orm import Session
from database import get_db, engine, Base
import models
import uvicorn
import os
import mercadopago
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(title="Football Betting AI API")

# Mercado Pago SDK (use your real TEST token in .env)
MP_TOKEN = os.getenv("MP_ACCESS_TOKEN", "TEST-0000000000000000-000000-00000000000000000000000000000000-000000000")
try:
    sdk = mercadopago.SDK(MP_TOKEN)
except Exception as e:
    print(f"[WARNING] Mercado Pago SDK init warning: {e}")
    sdk = None

# Configure CORS - allow all origins for local development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

class PredictionResponse(BaseModel):
    match_id: int
    home_win_prob: float
    draw_prob: float
    away_win_prob: float
    prediction: str
    analysis: str

@app.get("/")
async def root():
    return {"message": "Football Betting AI API is running"}

def generate_betting_details(m):
    hp, dp, ap = m.home_prob, m.draw_prob, m.away_prob
    
    # Check if custom fields are seeded in database
    if m.confidence is not None:
        return {
            "group_name": m.group_name or "",
            "confidence": m.confidence,
            "seguro_dnb_team": m.seguro_dnb_team or "",
            "seguro_dnb_odds": m.seguro_dnb_odds or "1.00",
            "seguro_handicap_market": m.seguro_handicap_market or "",
            "seguro_handicap_odds": m.seguro_handicap_odds or "1.00",
            "valor_1x2_team": m.valor_1x2_team or "",
            "valor_1x2_odds": m.valor_1x2_odds or "1.00",
            "valor_overunder_market": m.valor_overunder_market or "",
            "valor_overunder_odds": m.valor_overunder_odds or "1.00",
            "arriesgado_1x2pt_market": m.arriesgado_1x2pt_market or "",
            "arriesgado_1x2pt_odds": m.arriesgado_1x2pt_odds or "1.00",
            "arriesgado_btts_market": m.arriesgado_btts_market or "",
            "arriesgado_btts_odds": m.arriesgado_btts_odds or "1.00",
            "when_to_bet": m.when_to_bet or "Pre-partido (24-48h antes)",
            "pending_adjustments": m.pending_adjustments or "Sin lesionados reportados; alineación confirmada.",
            "metric_form_xg": m.metric_form_xg or 60,
            "metric_squad": m.metric_squad or 25,
            "metric_context": m.metric_context or 10,
            "metric_h2h": m.metric_h2h or 5
        }

    # Otherwise, dynamic generation based on math Heuristics
    fav_team = m.home_team.name if hp >= ap else m.away_team.name
    underdog_team = m.away_team.name if hp >= ap else m.home_team.name
    fav_prob = max(hp, ap)
    underdog_prob = min(hp, ap)
    
    # Confidence Level
    if abs(hp - ap) >= 30:
        confidence = "ALTA"
    elif abs(hp - ap) >= 15:
        confidence = "MEDIA"
    else:
        confidence = "VALUE BET"
        
    # Odds calculations (house margin applied)
    margin = 0.92
    home_odds = round(max(1.02, 100.0 / max(1, hp) * margin), 2)
    draw_odds = round(max(1.02, 100.0 / max(1, dp) * margin), 2)
    away_odds = round(max(1.02, 100.0 / max(1, ap) * margin), 2)
    
    fav_odds = home_odds if hp >= ap else away_odds
    
    # 1. SEGURO
    # Sin Empate (DNB)
    dnb_prob = fav_prob / (fav_prob + underdog_prob) if (fav_prob + underdog_prob) > 0 else 0.5
    dnb_odds = round(max(1.02, 1.0 / max(0.01, dnb_prob) * margin), 2)
    seguro_dnb_team = fav_team
    seguro_dnb_odds = f"{dnb_odds:.2f}"
    
    # Handicap
    if confidence == "ALTA":
        seguro_handicap_market = f"Hándicap Asiático -1.5 ({fav_team})"
        seguro_handicap_odds = f"{round(fav_odds + 0.40, 2):.2f}"
    else:
        seguro_handicap_market = f"Hándicap Asiático -0.5 ({fav_team})"
        seguro_handicap_odds = f"{fav_odds:.2f}"
        
    # 2. VALOR
    # 1X2 Gana (Ensure never using victoria favorito, strictly 1X2 — [nombre equipo] gana)
    valor_1x2_team = f"1X2 — {fav_team} gana"
    valor_1x2_odds = f"{fav_odds:.2f}"
    
    # Over/Under 2.5
    if (hp + ap) > 65:
        valor_overunder_market = "Over/Under: Más de 2.5 goles"
        valor_overunder_odds = f"{round(1.75 + (dp / 100.0), 2):.2f}"
    else:
        valor_overunder_market = "Over/Under: Menos de 2.5 goles"
        valor_overunder_odds = f"{round(1.65 + (fav_prob / 200.0), 2):.2f}"
        
    # 3. ARRIESGADO
    # 1X2 Primer Tiempo
    if confidence == "ALTA":
        arriesgado_1x2pt_market = f"1X2 Primer Tiempo ({fav_team} gana)"
        arriesgado_1x2pt_odds = f"{round(fav_odds + 0.50, 2):.2f}"
    else:
        arriesgado_1x2pt_market = "1X2 Primer Tiempo (Empate)"
        arriesgado_1x2pt_odds = f"{round(draw_odds - 0.30, 2):.2f}"
        
    # BTTS
    if confidence == "ALTA":
        arriesgado_btts_market = "BTTS (Ambos Anotan): No"
        arriesgado_btts_odds = f"{round(1.60 + (dp / 100.0), 2):.2f}"
    else:
        arriesgado_btts_market = "BTTS (Ambos Anotan): Sí"
        arriesgado_btts_odds = f"{round(1.80 + (fav_prob / 200.0), 2):.2f}"
        
    # When to bet
    when_to_bet = "Pre-partido (24-48h antes)" if confidence == "ALTA" else "En Vivo (In-Play)"
    pending_adjustments = "Confirmar alineaciones iniciales y estados físicos de último minuto."
    
    # Methodology Metrics (60/25/10/5)
    metric_form_xg = int(max(40, min(95, 60 + (hp - ap) * 0.4)))
    metric_squad = int(max(45, min(95, 75 + (hp - ap) * 0.3)))
    metric_context = int(max(50, min(95, 70 + (hp - ap) * 0.2)))
    metric_h2h = int(max(50, min(95, 65 + (hp - ap) * 0.1)))

    return {
        "group_name": "Fase de Grupos" if m.league_id == "WC" else "Liga Regular",
        "confidence": confidence,
        "seguro_dnb_team": seguro_dnb_team,
        "seguro_dnb_odds": seguro_dnb_odds,
        "seguro_handicap_market": seguro_handicap_market,
        "seguro_handicap_odds": seguro_handicap_odds,
        "valor_1x2_team": valor_1x2_team,
        "valor_1x2_odds": valor_1x2_odds,
        "valor_overunder_market": valor_overunder_market,
        "valor_overunder_odds": valor_overunder_odds,
        "arriesgado_1x2pt_market": arriesgado_1x2pt_market,
        "arriesgado_1x2pt_odds": arriesgado_1x2pt_odds,
        "arriesgado_btts_market": arriesgado_btts_market,
        "arriesgado_btts_odds": arriesgado_btts_odds,
        "when_to_bet": when_to_bet,
        "pending_adjustments": pending_adjustments,
        "metric_form_xg": metric_form_xg,
        "metric_squad": metric_squad,
        "metric_context": metric_context,
        "metric_h2h": metric_h2h
    }

@app.get("/matches")
async def get_matches(league_id: str, db: Session = Depends(get_db)):
    matches = db.query(models.Match).filter(models.Match.league_id == league_id).all()
    result = []
    for m in matches:
        bet_data = generate_betting_details(m)
        result.append({
            "id": m.id,
            "home": m.home_team.name,
            "homeLogo": m.home_team.logo,
            "away": m.away_team.name,
            "awayLogo": m.away_team.logo,
            "homeProb": m.home_prob,
            "drawProb": m.draw_prob,
            "awayProb": m.away_prob,
            "prediction": m.prediction,
            **bet_data
        })
    return {"status": "success", "league": league_id, "matches": result}

@app.get("/team/{league_id}")
async def get_team(league_id: str, db: Session = Depends(get_db)):
    team = db.query(models.Team).filter(models.Team.league_id == league_id).first()
    if not team:
        raise HTTPException(status_code=404, detail="Team not found")
    
    stats_list = [int(x) for x in team.stats.split(',')] if team.stats else [50, 50, 50, 50, 50, 50]
    
    return {
        "name": team.name,
        "logo": team.logo,
        "stats": stats_list,
        "color": team.color,
        "form": team.form,
        "goals": team.goals,
        "conceded": team.conceded,
        "possession": team.possession,
        "wins": team.wins
    }

@app.get("/players/{player_id}")
async def get_player_stats(player_id: int):
    # Stats for Spider Chart
    stats = {
        0: [88, 75, 72, 80, 45, 76], # Cavani
        1: [90, 68, 70, 85, 30, 74], # Borja
        2: [82, 92, 88, 65, 35, 70]  # Juanfer
    }
    return {"stats": stats.get(player_id, [50, 50, 50, 50, 50, 50])}

@app.post("/create_preference")
async def create_preference(item: dict):
    if sdk is None:
        raise HTTPException(
            status_code=503,
            detail="Mercado Pago SDK not initialized. Please set MP_ACCESS_TOKEN in your .env file."
        )

    # Ensure HTTPS for back_urls to avoid MP 400 error
    frontend_url = os.getenv('FRONTEND_URL', 'https://localhost:5173')
    if frontend_url.startswith('http://localhost'):
        frontend_url = frontend_url.replace('http://', 'https://')

    preference_data = {
        "items": [
            {
                "title": item.get("title", "BET AI VIP Subscription"),
                "quantity": item.get("quantity", 1),
                "unit_price": float(item.get("unit_price", 9.99)),
                "currency_id": "ARS",
            }
        ],
        "payer": {
            "email": item.get("payer_email", "")
        },
        "back_urls": {
            "success": f"{frontend_url}/?status=success",
            "failure": f"{frontend_url}/?status=failure",
            "pending": f"{frontend_url}/?status=pending"
        },
        "auto_return": "approved",
        "statement_descriptor": "BET AI VIP",
    }

    try:
        preference_response = sdk.preference().create(preference_data)
        preference = preference_response.get("response", {})
        print("MP Response:", preference_response)

        if "init_point" not in preference:
            raise HTTPException(status_code=400, detail=f"MP Error: {preference}")

        return {"init_point": preference["init_point"]}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error creating preference: {str(e)}")

@app.post("/send_welcome_email")
async def send_welcome_email(item: dict):
    email = item.get("email")
    plan_id = item.get("plan_id", "mensual")
    
    if not email:
        raise HTTPException(status_code=400, detail="Email is required")
        
    print(f"\n{'='*40}")
    print(f"📧 ENVIANDO EMAIL DE BIENVENIDA")
    print(f"Para: {email}")
    print(f"Plan adquirido: VIP {plan_id.upper()}")
    print(f"Beneficios: Predicciones VIP, Top 3 MVP, Estadísticas Radar y más.")
    print(f"¡Gracias por unirte a la élite de BET AI!")
    print(f"{'='*40}\n")
    
    # Aquí iría el código real de smtplib o SendGrid cuando el usuario agregue credenciales
    
    return {"status": "success", "message": "Welcome email sent (simulated)"}

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
