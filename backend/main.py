# backend/main.py

from fastapi import FastAPI, Depends, HTTPException, responses, status, Request
from fastapi.middleware.cors import CORSMiddleware
from supabase_client import supabase
from typing import List, Optional
from pydantic import BaseModel
from geopy.distance import geodesic
import pandas as pd
import numpy as np
import os
import logging
from starlette.concurrency import iterate_in_threadpool

from anthropic import Anthropic

anthropic_client = Anthropic(api_key=os.getenv("ANTHROPIC_API_KEY"))

# If using JWT auth:
from auth import create_jwt_token, decode_jwt_token, hash_password, verify_password

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Only allow frontend to access API
    allow_credentials=True,
    allow_methods=["*"],  # Allow all methods (GET, POST, etc.)
    allow_headers=["*"],  # Allow all headers
)


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
    name: str
    street: Optional[str]
    city: Optional[str]
    state: Optional[str]
    zipcode: Optional[str]
    phone: Optional[str]
    mobility_status: Optional[str]
    medical_needs: Optional[str]
    emergency_contact: Optional[str]
    emergency_phone: Optional[str]
    additional_info: Optional[str]


class Dispatcher(BaseModel):
    name: str
    state: Optional[str]
    zipcode: Optional[str]
    authkey: Optional[str]
    dispatch_center: Optional[str]
    dispatch_center_phone: Optional[str]


class FirstResponder(BaseModel):
    role: Optional[str]
    unit_name: str
    street: Optional[str]
    city: Optional[str]
    state: Optional[str]
    zipcode: Optional[str]
    unit_size: Optional[str]


"""
# Configure logging
logging.basicConfig(
    level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s"
)
logger = logging.getLogger(__name__)


# @app.middleware("http")
async def log_requests(request: Request, call_next):
    logger.info(f"Request: {request.method} {request.url}")
    response = await call_next(request)
    response_body = [chunk async for chunk in response.body_iterator]
    response.body_iterator = iterate_in_threadpool(iter(response_body))
    logging.info(f"response_body={response_body[0].decode()}")
    return response
"""

# -------------------------------
# OPTIONAL AUTH ENDPOINTS
# (SKIP if you have a simpler approach)
# -------------------------------


@app.post("/auth/register")
def register(user: RegisterUser):
    data = supabase.auth.sign_up(
        {
            "email": user.email,
            "password": user.password,
        }
    )

    # Return success
    return {"message": "User registered successfully", "uuid": data.user.id}


@app.post("/auth/login")
def login(user: LoginUser):
    data = supabase.auth.sign_in_with_password(
        {
            "email": user.email,
            "password": user.password,
        }
    )

    return {"message": "User logged in successfully", "uuid": data.user.id}


@app.post("/auth/logout")
def login():
    response = supabase.auth.sign_out()

    return {"message": "User logged out successfully"}


@app.get("/user/role")
def get_role():
    data = supabase.auth.get_user()
    if not data:
        return {"role": "NA"}

    if (
        supabase.table("at_risk")
        .select("*", count="exact")
        .eq("user_id", data.user.id)
        .execute()
        .count
        > 0
    ):
        return {"role": "resident"}
    elif (
        supabase.table("dispatchers")
        .select("*", count="exact")
        .eq("user_id", data.user.id)
        .execute()
        .count
        > 0
    ):
        return {"role": "dispatcher"}
    else:
        return {"role": "first_responder"}


# -------------------------------
# AT-RISK, DISPATCHER, RESPONDER ENDPOINTS
# -------------------------------


@app.post("/onboard/at_risk")
def create_at_risk(at_risk: AtRisk):
    # Get current user's id or force login
    data = supabase.auth.get_user()
    if not data:
        return responses.RedirectResponse(
            "/login", status_code=status.HTTP_303_SEE_OTHER
        )

    logging.info(at_risk.model_dump_json())
    # Insert into 'at_risk' table
    result = (
        supabase.table("at_risk")
        .insert({**at_risk.model_dump(), "user_id": data.user.id})
        .execute()
    )
    return {"message": "At-risk profile created", "data": result.data}


@app.post("/onboard/dispatcher")
def create_dispatcher(dispatcher: Dispatcher):
    # Get current user's id or force login
    data = supabase.auth.get_user()
    if not data:
        return responses.RedirectResponse(
            "/login", status_code=status.HTTP_303_SEE_OTHER
        )

    # Insert into 'at_risk' table
    result = (
        supabase.table("dispatchers")
        .insert({**dispatcher.model_dump(), "user_id": data.user.id})
        .execute()
    )
    return {"message": "Dispatcher profile created", "data": result.data}


@app.post("/onboard/responder")
def create_responder(responder: FirstResponder):
    # Get current user's id or force login
    data = supabase.auth.get_user()
    if not data:
        return responses.RedirectResponse(
            "/login", status_code=status.HTTP_303_SEE_OTHER
        )

    # Insert into 'at_risk' table
    result = (
        supabase.table("first_responders")
        .insert({**responder.model_dump(), "user_id": data.user.id})
        .execute()
    )
    return {"message": "First responder profile created", "data": result.data}


# -------------------------------
# NASA FIRMS / FIRES
# -------------------------------


@app.get("/fires")
def get_fires():
    """
    Retrieve stored fires from 'fires' table or fetch from NASA, up to you.
    For brevity, let's read from the DB.
    """
    response = supabase.table("fires").select("*").gt("confidence", 50).execute()
    return response.data


@app.post("/fires/import")
def import_fires():
    """
    Example: call NASA FIRMS API, store new records in the 'fires' table.
    In production, you'd do something like below:
    """
    SOURCE = "MODIS_NRT"
    AREA_COORDINATES = "-171.791110603,18.91619,-66.96466,71.3577635769"  # "-124.409591,32.534156,-114.131211,42.009518"
    DAY_RANGE = 5
    DATE = "2025-01-10"

    url = f"https://firms.modaps.eosdis.nasa.gov/api/area/csv/{os.getenv('MAP_KEY')}/{SOURCE}/{AREA_COORDINATES}/{DAY_RANGE}/{DATE}"
    fires = pd.read_csv(url)[
        ["latitude", "longitude", "confidence", "acq_date"]
    ].to_dict(orient="records")
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
    disp = (
        supabase.table("dispatches")
        .select("*")
        .eq("responder_id", responder_id)
        .execute()
    )
    if disp.error:
        raise HTTPException(status_code=400, detail=disp.error.message)
    return disp.data


from anthropic import Anthropic
from fastapi import HTTPException
from geopy.distance import geodesic

from typing import Optional
from fastapi import Query
from geopy.distance import geodesic
from geopy.geocoders import Nominatim
import json
import time

# Initialize Geocoder
geolocator = Nominatim(user_agent="fire_safety_app")


def get_lat_lng(street: str, city: str, state: str, zip_code: str):
    """
    Converts an address to latitude and longitude using Nominatim Geocoder.
    """
    address = f"{street}, {city}, {state} {zip_code}"

    try:
        location = geolocator.geocode(address, timeout=10)
        if location:
            return location.latitude, location.longitude
    except Exception as e:
        print(f"Geocoding failed for {address}: {e}")

    return None, None  # If geolocation fails


@app.post("/generate-summary")
def generate_summary(fire_id: str):
    """
    Generate a structured summary of at-risk individuals near a fire using Claude.
    Addresses are converted to lat/lng before distance calculation.
    """

    # 1) Retrieve Fire Location from Supabase
    fire_res = supabase.table("fires").select("*").eq("id", fire_id).single().execute()
    if fire_res.error or not fire_res.data:
        raise HTTPException(status_code=404, detail="Fire not found")

    fire_data = fire_res.data
    f_lat, f_lng = fire_data["latitude"], fire_data["longitude"]

    # 2) Retrieve At-Risk Individuals from Supabase
    at_risk_res = supabase.table("at_risk").select("*").execute()
    if at_risk_res.error:
        raise HTTPException(status_code=400, detail=at_risk_res.error.message)

    # 3) Geocode Missing Lat/Lng and Calculate Distance
    nearby_individuals = []

    for person in at_risk_res.data:
        # If lat/lng is missing, use geocoding
        if person.get("lat") is None or person.get("lng") is None:
            lat, lng = get_lat_lng(
                person["street"], person["city"], person["state"], person["zip"]
            )
            if lat is None or lng is None:
                continue  # Skip if geocoding fails
            person["lat"], person["lng"] = lat, lng

        # Calculate distance from fire
        person_coords = (person["lat"], person["lng"])
        fire_coords = (f_lat, f_lng)
        distance_miles = geodesic(person_coords, fire_coords).miles

        # Include only if within 5 miles
        if distance_miles <= 5:
            person["distance_miles"] = round(distance_miles, 2)
            nearby_individuals.append(person)

        # Respect API rate limits
        time.sleep(1)  # Avoid excessive geocoding requests

    # If no one is within 5 miles, return early
    if not nearby_individuals:
        return {"summary": "No at-risk individuals within a 5-mile radius."}

    # 4) Prepare Data for Claude
    person_text = "\n".join(
        [
            f"- {p['name']} at {p['street']}, {p['city']}, {p['state']} ({p['distance_miles']} miles away). "
            f"Disability: {p.get('disability', 'None')}. Info: {p.get('additional_info', 'N/A')}"
            for p in sorted(nearby_individuals, key=lambda x: x["distance_miles"])
        ]
    )

    system_prompt = """You are an emergency response assistant. You must return a structured JSON array of at-risk individuals sorted by distance from a fire.
    Each object in the JSON array must contain:
    - name (string)
    - address (string)
    - distance_miles (float)
    - disability (string)
    - critical_info (string)
    
    Return ONLY a valid JSON response and nothing else."""

    user_message = f"""Generate a JSON response summarizing at-risk individuals near the fire.

    {person_text}"""

    try:
        response = anthropic_client.messages.create(
            model="claude-3-5-sonnet-20241022",
            max_tokens=500,
            system=system_prompt,
            messages=[{"role": "user", "content": user_message}],
        )

        # Ensure response is formatted correctly
        if not response.content or not response.content[0].text.strip():
            return {"error": "Claude returned an empty response."}

        # Try parsing Claude's response into JSON
        try:
            structured_summary = json.loads(response.content[0].text)
        except json.JSONDecodeError:
            return {
                "error": "Claude's response was not valid JSON.",
                "raw_response": response.content[0].text,
            }

    except Exception as e:
        return {"error": f"Error calling Claude API: {str(e)}"}

    return {"summary": structured_summary}


'''
geolocator = Nominatim(user_agent="fire_safety_app")

def get_lat_lng(street: str, city: str, state: str, zip_code: str):
    """
    Converts an address to latitude and longitude using Nominatim Geocoder.
    """
    address = f"{street}, {city}, {state} {zip_code}"
    
    try:
        location = geolocator.geocode(address, timeout=10)
        if location:
            return location.latitude, location.longitude
    except Exception as e:
        print(f"Geocoding failed for {address}: {e}")
    
    return None, None  # If geolocation fails

@app.post("/generate-summary")
def generate_summary(fire_id: Optional[str] = Query(None)):
    """
    Generate a structured summary of at-risk individuals near a fire using Claude.
    Addresses are converted to lat/lng before distance calculation.
    """

    # Mock fire location (Replace with real NASA FIRMS data later)
    fire_location = {
        "latitude": 40.7128,   # Example: New York City
        "longitude": -74.0060
    }

    # Mock at-risk individuals (Replace with Supabase query in production)
    mock_at_risk_data = [
        {
            "name": "John Doe",
            "street": "20 Cooper Square",
            "city": "New York",
            "state": "NY",
            "zip": "10003",
            "disability": "Wheelchair user",
            "critical_info": "Requires assistance with evacuation."
        },
        {
            "name": "Jane Smith",
            "street": "5002 Mesa Verde Rd",
            "city": "Charlotte",
            "state": "NC",
            "zip": "28277",
            "disability": "Hearing impairment",
            "critical_info": "Has service dog."
        },
        {
            "name": "Mike Brown",
            "street": "47 W 13th St",
            "city": "New York",
            "state": "NY",
            "zip": "10011",
            "disability": "Blind",
            "critical_info": "Lives alone."
        }
    ]

    # Geocode each address and calculate distance
    nearby_individuals = []
    
    for person in mock_at_risk_data:
        lat, lng = get_lat_lng(person["street"], person["city"], person["state"], person["zip"])
        
        if lat is None or lng is None:
            continue  # Skip if geolocation fails
        
        # Calculate distance from fire
        person_coords = (lat, lng)
        fire_coords = (fire_location["latitude"], fire_location["longitude"])
        distance_miles = geodesic(person_coords, fire_coords).miles

        # Include only if within 5 miles
        if distance_miles <= 5:
            person["distance_miles"] = round(distance_miles, 2)
            nearby_individuals.append(person)

        # Respect API rate limits (if using external services)
        time.sleep(1)  # Avoid excessive geocoding requests

    # If no one is within 5 miles, return early
    if not nearby_individuals:
        return {"summary": "No at-risk individuals within a 5-mile radius."}

    # Create structured input for Claude
    person_text = "\n".join([
        f"- {p['name']} at {p['street']}, {p['city']}, {p['state']} ({p['distance_miles']} miles away). "
        f"Disability: {p.get('disability', 'None')}. Info: {p.get('critical_info', 'N/A')}"
        for p in sorted(nearby_individuals, key=lambda x: x["distance_miles"])
    ])

    system_prompt = """You are an emergency response assistant. You must return a structured JSON array of at-risk individuals sorted by distance from a fire.
    Each object in the JSON array must contain:
    - name (string)
    - address (string)
    - distance_miles (float)
    - disability (string)
    - critical_info (string)
    
    Return ONLY a valid JSON response and nothing else."""

    user_message = f"""Generate a JSON response summarizing at-risk individuals near the fire.

    {person_text}"""

    try:
        response = anthropic_client.messages.create(
            model="claude-3-5-sonnet-20241022",
            max_tokens=500,
            system=system_prompt,
            messages=[
                {"role": "user", "content": user_message}
            ]
        )

        # Ensure response is formatted correctly
        if not response.content or not response.content[0].text.strip():
            return {"error": "Claude returned an empty response."}

        # Try parsing Claude's response into JSON
        try:
            structured_summary = json.loads(response.content[0].text)
        except json.JSONDecodeError:
            return {"error": "Claude's response was not valid JSON.", "raw_response": response.content[0].text}

    except Exception as e:
        return {"error": f"Error calling Claude API: {str(e)}"}

    return {"summary": structured_summary}

    '''
