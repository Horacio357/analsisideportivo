from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
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

@app.get("/matches")
async def get_matches(league_id: int = 128, season: int = 2024):
    # This will be replaced by the ingestion service
    return {"status": "success", "league": league_id, "matches": []}

@app.get("/predict/{match_id}")
async def predict_match(match_id: int):
    # Placeholder for prediction logic
    return {
        "match_id": match_id,
        "home_win_prob": 0.45,
        "draw_prob": 0.30,
        "away_win_prob": 0.25,
        "prediction": "Home Win",
        "analysis": "Cavani has scored in 3 of the last 4 matches. Home team has a 70% win rate at home."
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

    preference_data = {
        "items": [
            {
                "title": item.get("title", "BET AI VIP Subscription"),
                "quantity": item.get("quantity", 1),
                "unit_price": float(item.get("unit_price", 9.99)),
                "currency_id": "ARS",
            }
        ],
        "back_urls": {
            "success": "http://localhost:5173/?status=success",
            "failure": "http://localhost:5173/?status=failure",
            "pending": "http://localhost:5173/?status=pending"
        },
        "auto_return": "approved",
        "statement_descriptor": "BET AI VIP",
    }

    try:
        preference_response = sdk.preference().create(preference_data)
        preference = preference_response["response"]

        if "init_point" not in preference:
            raise HTTPException(status_code=400, detail=f"MP Error: {preference}")

        return {"init_point": preference["init_point"]}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error creating preference: {str(e)}")

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
