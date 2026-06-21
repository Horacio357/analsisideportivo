import requests
import datetime

NEWS_API_KEY = "2afdb251676a4314b12d7c4b8dd02972"
BASE_URL = "https://newsapi.org/v2/everything"

def get_recent_news(query: str, max_results: int = 3):
    current_year = "2026"
    
    params = {
        "q": f"({query}) AND {current_year}",
        "language": "es",
        "sortBy": "publishedAt",
        "apiKey": NEWS_API_KEY,
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
                return get_mock_news(query)
                
            return results
        else:
            print(f"Error fetching news: {response.status_code} - {response.text}")
            return get_mock_news(query)
    except Exception as e:
        print(f"Request failed: {e}")
        return get_mock_news(query)

def get_mock_news(query: str):
    return [
        {"id": 1, "source": "Diario Olé", "title": f"Última hora sobre {query} de cara al próximo partido del Mundial 2026.", "time": "Hace 2 horas"},
        {"id": 2, "source": "ESPN", "title": f"El técnico ultima detalles tácticos para asegurar la victoria en 2026.", "time": "Hace 5 horas"},
        {"id": 3, "source": "TyC Sports", "title": "Análisis estadístico: ¿Cómo llega el equipo a esta instancia?", "time": "Ayer"}
    ]
