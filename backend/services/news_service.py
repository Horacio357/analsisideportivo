import requests
import datetime

import os

NEWS_API_KEY = os.getenv("NEWS_API_KEY", "2afdb251676a4314b12d7c4b8dd02972")
BASE_URL = "https://newsapi.org/v2/everything"
NEWSDATA_API_KEY = os.getenv("NEWSDATA_API_KEY", "pub_f1e62282e11a4b4ebfc2515ca24fa2b7")
NEWSDATA_URL = "https://newsdata.io/api/1/latest"

def get_recent_news(query: str, max_results: int = 3, news_api_key: str = None, newsdata_api_key: str = None):
    current_year = "2026"
    active_news_key = news_api_key or NEWS_API_KEY
    
    params = {
        "q": f"({query}) AND {current_year}",
        "language": "es",
        "sortBy": "publishedAt",
        "apiKey": active_news_key,
        "pageSize": max_results
    }
    
    try:
        response = requests.get(BASE_URL, params=params)
        if response.status_code == 200:
            data = response.json()
            articles = data.get("articles", [])
            
            results = []
            for i, item in enumerate(articles):
                # Formatear la fecha para que sea más legible (YYYY-MM-DD)
                raw_time = item.get("publishedAt", "")
                formatted_time = raw_time[:10] if raw_time else "Hoy"
                
                results.append({
                    "id": i + 1,
                    "source": item.get("source", {}).get("name", "Deportes"),
                    "title": item.get("title", ""),
                    "url": item.get("url", ""),
                    "time": formatted_time
                })
            
            if not results:
                return get_newsdata_fallback(query, max_results, newsdata_api_key)
                
            return results
        else:
            print(f"Error fetching news: {response.status_code} - {response.text}")
            return get_newsdata_fallback(query, max_results, newsdata_api_key)
    except Exception as e:
        print(f"Request failed: {e}")
        return get_newsdata_fallback(query, max_results, newsdata_api_key)

def get_newsdata_fallback(query: str, max_results: int = 3, newsdata_api_key: str = None):
    current_year = "2026"
    active_newsdata_key = newsdata_api_key or NEWSDATA_API_KEY
    
    # NewsData usa 'q' pero puede ser menos flexible con operadores booleanos complejos en el free tier.
    # Eliminamos las comillas extrañas si las hay y buscamos de forma simple
    clean_query = query.replace('"', '').replace(' OR ', ' ')
    
    params = {
        "apikey": active_newsdata_key,
        "q": f"{clean_query} {current_year}",
        "language": "es"
    }
    
    try:
        response = requests.get(NEWSDATA_URL, params=params)
        if response.status_code == 200:
            data = response.json()
            articles = data.get("results", [])
            
            results = []
            for i, item in enumerate(articles[:max_results]):
                raw_time = item.get("pubDate", "")
                formatted_time = raw_time[:10] if raw_time else "Hoy"
                
                results.append({
                    "id": i + 1,
                    "source": item.get("source_id", "Noticias Deportivas"),
                    "title": item.get("title", ""),
                    "url": item.get("link", ""),
                    "time": formatted_time
                })
            
            if not results:
                return get_mock_news(query)
                
            return results
        else:
            print(f"NewsData Fallback Error: {response.status_code} - {response.text}")
            return get_mock_news(query)
    except Exception as e:
        print(f"NewsData Request failed: {e}")
        return get_mock_news(query)

def get_mock_news(query: str):
    return [
        {"id": 1, "source": "Diario Olé", "title": f"Última hora sobre {query} de cara al próximo partido del Mundial 2026.", "time": "Hace 2 horas"},
        {"id": 2, "source": "ESPN", "title": f"El técnico ultima detalles tácticos para asegurar la victoria en 2026.", "time": "Hace 5 horas"},
        {"id": 3, "source": "TyC Sports", "title": "Análisis estadístico: ¿Cómo llega el equipo a esta instancia?", "time": "Ayer"}
    ]
