import requests

key_football_data = "865d878acde547cd815bf264898dbc0c"

print("Testing football-data.org endpoint...")
url = "http://api.football-data.org/v4/competitions"
headers = {
    "X-Auth-Token": key_football_data
}
try:
    res = requests.get(url, headers=headers)
    print(res.status_code)
    data = res.json()
    if 'competitions' in data:
        print(f"Success! Found {len(data['competitions'])} competitions.")
    else:
        print(data)
except Exception as e:
    print(e)
