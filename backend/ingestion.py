from fastapi import APIRouter, HTTPException
import requests
import os
from supabase import create_client, Client

router = APIRouter()

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")
OPENWEATHER_KEY = os.getenv("OPENWEATHER_KEY")
MAP_KEY = os.getenv("MAP_KEY")

supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

def fetch_weather(lat, lon):
    if not OPENWEATHER_KEY:
        return {}
    url = f"https://api.openweathermap.org/data/2.5/weather?lat={lat}&lon={lon}&appid={OPENWEATHER_KEY}&units=metric"
    r = requests.get(url)
    if r.status_code == 200:
        wdata = r.json()
        return {
            "temp": wdata["main"].get("temp"),
            "humidity": wdata["main"].get("humidity"),
            "wind_speed": wdata["wind"].get("speed")
        }
    return {}

@router.post("/ingest-fires")
def ingest_fires():
    """
    Fetch NASA FIRMS CSV, parse, store in fire_events table.
    Also optionally fetch weather for each coordinate.
    """
    url = " api call"
    resp = requests.get(url)
    if resp.status_code != 200:
        raise HTTPException(status_code=500, detail="Failed to fetch NASA FIRMS data.")
    
    lines = resp.text.splitlines()
    header = lines[0].split(",")
    lat_idx = header.index("latitude")
    lon_idx = header.index("longitude")
    conf_idx = header.index("confidence")
    date_idx = header.index("acq_date")
    time_idx = header.index("acq_time")

    records = []
    for row in lines[1:]:
        parts = row.split(",")
        if len(parts) < len(header):
            continue
        lat = float(parts[lat_idx])
        lon = float(parts[lon_idx])
        confidence = float(parts[conf_idx])
        acq_date = parts[date_idx]
        acq_time = parts[time_idx]

        weather_data = fetch_weather(lat, lon)

        record = {
            "latitude": lat,
            "longitude": lon,
            "confidence": confidence,
            "acq_date": acq_date,
            "acq_time": acq_time,
            "weather_info": weather_data
        }
        records.append(record)
    
    chunk_size = 500
    for i in range(0, len(records), chunk_size):
        batch = records[i:i+chunk_size]
        ins = supabase.table("fire_events").insert(batch).execute()
        if ins.status_code not in (200,201):
            raise HTTPException(status_code=500, detail="Error inserting fire events.")
    
    return {"message": f"Inserted {len(records)} records into fire_events."}

@router.get("/fire-events")
def get_fire_events():
    """
    Returns all fire events from Supabase
    """
    res = supabase.table("fire_events").select("*").execute()
    if res.status_code != 200:
        raise HTTPException(status_code=500, detail="Cannot fetch fire_events.")
    return {"fire_events": res.data}
