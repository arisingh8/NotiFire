# backend/main.py

from fastapi import FastAPI, Depends, HTTPException, status
from supabase_client import supabase
from typing import List, Optional
from pydantic import BaseModel
from geopy.distance import geodesic
import pandas as pd
import os

from anthropic import Anthropic

anthropic_client = Anthropic(api_key=os.getenv("ANTHROPIC_API_KEY"))

# If using JWT auth:
from auth import create_jwt_token, decode_jwt_token, hash_password, verify_password


app = FastAPI()

# -------------------------------
# AUTH SCHEMAS (if custom)
# -------------------------------
class RegisterUser(BaseModel):
    email: str
    password: str

class LoginUser(BaseModel):
    email: str
    password: str

# Optional users table name
USERS_TABLE = "users"

# -------------------------------
# ROLE SCHEMAS
# -------------------------------
class AtRisk(BaseModel):
    user_id: str
    name: str
    email: Optional[str]
    phone: Optional[str]
    street: Optional[str]
    city: Optional[str]
    state: Optional[str]
    zip: Optional[str]
    lat: Optional[float]
    lng: Optional[float]
    disability: Optional[str]
    additional_info: Optional[str]

class Dispatcher(BaseModel):
    user_id: str
    name: str
    place_of_work: Optional[str]
    zip: Optional[str]
    auth_key: Optional[str]
    lat: Optional[float]
    lng: Optional[float]

class FirstResponder(BaseModel):
    user_id: str
    role: str
    unit_name: str
    street: Optional[str]
    city: Optional[str]
    state: Optional[str]
    zip: Optional[str]
    lat: Optional[float]
    lng: Optional[float]
    unit_size: Optional[int]

# -------------------------------
# OPTIONAL AUTH ENDPOINTS
# (SKIP if you have a simpler approach)
# -------------------------------
@app.post("/auth/register")
def register(user: RegisterUser):
    # Check if user already exists
    existing = supabase.table(USERS_TABLE).select("*").eq("email", user.email).execute()
    if existing.data:
        raise HTTPException(status_code=400, detail="Username already taken")

    hashed = hash_password(user.password)
    inserted = supabase.table(USERS_TABLE).insert({"email": user.email, "password": hashed}).execute()
    
    # Return success
    return {"message": "User registered successfully", "uuid": inserted.data[0]["id"]}

@app.post("/auth/login")
def login(user: LoginUser):
    existing = supabase.table(USERS_TABLE).select("*").eq("email", user.email).single().execute()
    if not existing.data:
        raise HTTPException(status_code=401, detail="User not found")

    row = existing.data
    if not verify_password(user.password, row["password"]):
        raise HTTPException(status_code=401, detail="Incorrect password")

    token = create_jwt_token(str(row["id"]))
    return {"access_token": token}

def get_current_user(token: str):
    if not token:
        raise HTTPException(status_code=401, detail="No token provided")
    decoded = decode_jwt_token(token)
    if not decoded:
        raise HTTPException(status_code=401, detail="Invalid or expired token")
    # decoded["user_id"] is the primary key from your users table
    return decoded["user_id"]

# -------------------------------
# AT-RISK, DISPATCHER, RESPONDER ENDPOINTS
# -------------------------------

@app.post("/onboard/at_risk")
def create_at_risk(at_risk: AtRisk):
    # Insert into 'at_risk' table
    result = supabase.table("at_risk").insert(at_risk.dict()).execute()
    if result.error:
        raise HTTPException(status_code=400, detail=result.error.message)
    return {"message": "At-risk profile created", "data": result.data}

@app.post("/onboard/dispatcher")
def create_dispatcher(dispatcher: Dispatcher):
    # Insert into 'dispatchers'
    result = supabase.table("dispatchers").insert(dispatcher.dict()).execute()
    if result.error:
        raise HTTPException(status_code=400, detail=result.error.message)
    return {"message": "Dispatcher profile created", "data": result.data}

@app.post("/onboard/responder")
def create_responder(responder: FirstResponder):
    # Insert into 'first_responders'
    result = supabase.table("first_responders").insert(responder.dict()).execute()
    if result.error:
        raise HTTPException(status_code=400, detail=result.error.message)
    return {"message": "Responder profile created", "data": result.data}

# -------------------------------
# NASA FIRMS / FIRES
# -------------------------------

@app.get("/fires")
def get_fires():
    """
    Retrieve stored fires from 'fires' table or fetch from NASA, up to you.
    For brevity, let's read from the DB. 
    """
    response = supabase.table("fires").select("*").execute()
    if response.error:
        raise HTTPException(status_code=400, detail=response.error.message)
    return response.data

@app.post("/fires/import")
def import_fires():
    """
    Example: call NASA FIRMS API, store new records in the 'fires' table.
    In production, you'd do something like below:
    """
    SOURCE = 'MODIS_NRT'
    AREA_COORDINATES = "world" # "-124.409591,32.534156,-114.131211,42.009518"
    DAY_RANGE = 5
    DATE = '2025-02-01'

    url = f"https://firms.modaps.eosdis.nasa.gov/api/area/csv/{os.getenv('MAP_KEY')}/{SOURCE}/{AREA_COORDINATES}/{DAY_RANGE}/{DATE}"
    fires = pd.read_csv(url)[["latitude", "longitude", "confidence", "acq_date"]].to_dict(orient="records")
    truncate_response = supabase.rpc("truncate_fires").execute()
    print("Truncate response:", truncate_response)
    # Insert into Supabase
    result = supabase.table("fires").insert(fires).execute()

    return {"message": "Fires imported", "inserted": len(result.data)}


# -------------------------------
# DISPATCH LOGIC
# -------------------------------

@app.get("/responders-within")
def responders_within(fire_id: str, radius_miles: float):
    """
    1) Get the fire's lat/lng
    2) Grab all first_responders
    3) Calculate distance, return those within the radius
    """
    fire_res = supabase.table("fires").select("*").eq("id", fire_id).single().execute()
    if fire_res.error or not fire_res.data:
        raise HTTPException(status_code=404, detail="Fire not found")
    fire_data = fire_res.data
    fire_lat, fire_lng = fire_data["latitude"], fire_data["longitude"]

    resp_res = supabase.table("first_responders").select("*").execute()
    if resp_res.error:
        raise HTTPException(status_code=400, detail=resp_res.error.message)

    within = []
    for r in resp_res.data:
        if r["lat"] is not None and r["lng"] is not None:
            dist_mi = geodesic((fire_lat, fire_lng), (r["lat"], r["lng"])).miles
            if dist_mi <= radius_miles:
                r["distance"] = round(dist_mi, 2)
                within.append(r)
    return within

@app.post("/dispatch")
def dispatch_responder(fire_id: str, responder_id: str):
    """
    Insert a record into 'dispatches'.
    """
    data = {"fire_id": fire_id, "responder_id": responder_id}
    res = supabase.table("dispatches").insert(data).execute()
    if res.error:
        raise HTTPException(status_code=400, detail=res.error.message)
    return {"message": "Dispatched successfully"}

# -------------------------------
# ALERTS & SUMMARIES
# -------------------------------

@app.get("/alerts")
def get_alerts(responder_id: str):
    """
    Return dispatches for a given responder
    """
    disp = supabase.table("dispatches").select("*").eq("responder_id", responder_id).execute()
    if disp.error:
        raise HTTPException(status_code=400, detail=disp.error.message)
    return disp.data

from anthropic import Anthropic
from fastapi import HTTPException
from geopy.distance import geodesic

@app.post("/generate-summary")
def generate_summary(fire_id: str):
    """
    Summarize at-risk individuals within 5 miles of the fire using Claude 3.5 Sonnet.
    Steps:
      1) Find the fire lat/lng
      2) Query 'at_risk' for those within 5 miles
      3) Summarize via Anthropic's Claude
    """
    fire_res = supabase.table("fires").select("*").eq("id", fire_id).single().execute()
    if fire_res.error or not fire_res.data:
        raise HTTPException(status_code=404, detail="Fire not found")
    fire_data = fire_res.data

    # 1) get lat/lng
    f_lat, f_lng = fire_data["latitude"], fire_data["longitude"]

    # 2) find at-risk
    at_risk_res = supabase.table("at_risk").select("*").execute()
    if at_risk_res.error:
        raise HTTPException(status_code=400, detail=at_risk_res.error.message)

    near_ones = []
    for person in at_risk_res.data:
        if person["lat"] and person["lng"]:
            dist_mi = geodesic((f_lat, f_lng), (person["lat"], person["lng"])).miles
            if dist_mi <= 5:
                person["distance"] = round(dist_mi, 2)
                near_ones.append(person)

    # 3) Summarize with Claude
    if not anthropic_client:
        return {"error": "Anthropic API key not configured"}

    # Build the message for Claude
    person_text = "\n".join([
        f"- {p['name']} at {p['street']}, {p['city']}, Dist: {p['distance']} miles. Disability: {p.get('disability','N/A')}, Info: {p.get('additional_info','')}"
        for p in sorted(near_ones, key=lambda x: x["distance"])
    ])
    
    system_prompt = """You are an emergency response assistant. Summarize the list of at-risk individuals near a fire. 
    Focus on key details that emergency responders need to know. Order by distance from fire."""
    
    user_message = f"""Summarize these at-risk individuals near the fire in a concise bullet list. Include their distance, mobility status, and any critical information:

{person_text}"""

    try:
        response = anthropic_client.messages.create(
            model="claude-3-5-sonnet-20241022",
            max_tokens=200,
            system=system_prompt,
            messages=[
                {"role": "user", "content": user_message}
            ]
        )
        summary = response.content[0].text
    except Exception as e:
        summary = f"Error calling Anthropic API: {str(e)}"

    return {"summary": summary}