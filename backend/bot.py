import os
import telebot
from dotenv import load_dotenv
from database import SessionLocal
import models

# Intenta importar la función de la web (dependiendo de cómo esté estructurado main.py)
try:
    from main import generate_betting_details
except ImportError:
    # Si falla por dependencias de FastAPI que no queremos cargar, la duplicamos o la extraemos
    print("Advertencia: No se pudo importar de main.py, asegúrate de tener las dependencias.")

load_dotenv()

TOKEN = os.getenv("TELEGRAM_BOT_TOKEN")
if not TOKEN:
    print("ERROR: Falta el TELEGRAM_BOT_TOKEN en el archivo .env")
    exit(1)

bot = telebot.TeleBot(TOKEN)

@bot.message_handler(commands=['start', 'ayuda'])
def send_welcome(message):
    welcome_text = (
        "🤖 *¡Hola! Soy XGuru Bot*\n\n"
        "Estoy conectado en tiempo real a la base de datos de XGuru AI.\n\n"
        "💡 *Comandos disponibles:*\n"
        "📅 /partidos - Lista los partidos cargados en sistema\n"
        "🔍 *Escribe el nombre de un equipo* (ej. `Boca`) para generar su análisis Pro instantáneo."
    )
    bot.reply_to(message, welcome_text, parse_mode='Markdown')

@bot.message_handler(commands=['partidos'])
def list_matches(message):
    db = SessionLocal()
    try:
        matches = db.query(models.Match).all()
        if not matches:
            bot.reply_to(message, "❌ No hay partidos registrados en la base de datos.")
            return
            
        text = "📅 *PRÓXIMOS PARTIDOS*\n\n"
        for m in matches:
            text += f"⚽ {m.home_team.name} vs {m.away_team.name} (Liga: {m.league_id})\n"
            
        bot.reply_to(message, text, parse_mode='Markdown')
    except Exception as e:
        bot.reply_to(message, "Ocurrió un error al leer la base de datos.")
        print(e)
    finally:
        db.close()

@bot.message_handler(func=lambda message: True)
def search_team(message):
    query = message.text.lower()
    
    if len(query) < 3:
        bot.reply_to(message, "Por favor, escribe al menos 3 letras del equipo.")
        return
        
    db = SessionLocal()
    try:
        matches = db.query(models.Match).all()
        found_matches = []
        for m in matches:
            if query in m.home_team.name.lower() or query in m.away_team.name.lower():
                found_matches.append(m)
                
        if not found_matches:
            bot.reply_to(message, f"❌ No encontré ningún partido analizado para '{message.text}'.")
            return
            
        for m in found_matches:
            try:
                # Generamos las probabilidades tal cual lo hace la web
                bet_data = generate_betting_details(m)
                
                reply = f"🔥 *FICHA DE APUESTAS PRO*\n"
                reply += f"🏟️ *{m.home_team.name} vs {m.away_team.name}*\n"
                reply += f"🏆 Confianza del Modelo: *{bet_data['confidence']}*\n\n"
                
                reply += f"🟢 *SEGURO (Bajo Riesgo)*\n"
                reply += f"▪️ Mercado: {bet_data['seguro_handicap_market']}\n"
                reply += f"▪️ Cuota Min: {bet_data['seguro_handicap_odds']}\n\n"
                
                reply += f"🔵 *VALOR (Alta Probabilidad)*\n"
                reply += f"▪️ Mercado: {bet_data['valor_1x2_team']}\n"
                reply += f"▪️ Cuota Min: {bet_data['valor_1x2_odds']}\n\n"
                
                reply += f"🟡 *ARRIESGADO (Especulativo)*\n"
                reply += f"▪️ Mercado: {bet_data['arriesgado_1x2pt_market']}\n"
                reply += f"▪️ Cuota Min: {bet_data['arriesgado_1x2pt_odds']}\n\n"
                
                reply += f"📌 *Cuándo Apostar:* {bet_data['when_to_bet']}\n"
                
                bot.reply_to(message, reply, parse_mode='Markdown')
            except Exception as e:
                bot.reply_to(message, f"Error al generar ficha para {m.home_team.name}. Falta data.")
                print(f"Error generando ficha: {e}")
                
    except Exception as e:
        bot.reply_to(message, f"Hubo un error buscando en la base de datos.")
        print(f"Error general: {e}")
    finally:
        db.close()

if __name__ == '__main__':
    print("=================================")
    print("Iniciando XGuru Bot de Telegram...")
    print("Conectado a bet_ai.db")
    print("=================================")
    bot.infinity_polling()
