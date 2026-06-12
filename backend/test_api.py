import requests
import sys

key = "78babf7450msh32fc55e14a2c05bp1bf443jsnacfc4c5afda9"

print("Testing RapidAPI endpoint...")
url_rapidapi = "https://api-football-v1.p.rapidapi.com/v3/timezone"
headers_rapidapi = {
	"X-RapidAPI-Key": key,
	"X-RapidAPI-Host": "api-football-v1.p.rapidapi.com"
}
try:
    res = requests.get(url_rapidapi, headers=headers_rapidapi)
    print(res.status_code)
    print(res.json())
except Exception as e:
    print(e)

print("\nTesting Direct API-Sports endpoint...")
url_direct = "https://v3.football.api-sports.io/timezone"
headers_direct = {
    "x-apisports-key": key
}
try:
    res = requests.get(url_direct, headers=headers_direct)
    print(res.status_code)
    print(res.json())
except Exception as e:
    print(e)
