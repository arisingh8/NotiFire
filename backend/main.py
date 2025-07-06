# backend/main.py

from fastapi import FastAPI, Depends, HTTPException, responses, status, Request
from fastapi.middleware.cors import CORSMiddleware
from supabase_client import supabase
from typing import List, Optional
from pydantic import BaseModel
from geopy import distance
import pandas as pd
import numpy as np
import os
import logging
from starlette.concurrency import iterate_in_threadpool

from anthropic import Anthropic

anthropic_client = Anthropic(api_key=os.getenv("ANTHROPIC_API_KEY"))

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

class Dispatch(BaseModel):
    fire_id: str
    responder_id: str

# Configure logging
logging.basicConfig(
    level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s"
)
logger = logging.getLogger(__name__)


"""
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

    latitude, longitude = get_lat_lng_full(at_risk.street, at_risk.city, at_risk.state, at_risk.zipcode)

    logger.info(at_risk.model_dump_json())
    # Insert into 'at_risk' table
    result = (
        supabase.table("at_risk")
        .insert({**at_risk.model_dump(), "user_id": data.user.id, "lat": latitude, "lng": longitude})
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
    
    latitude, longitude = get_lat_lng_zipc(dispatcher.state, dispatcher.zipcode)

    # Insert into 'at_risk' table
    result = (
        supabase.table("dispatchers")
        .insert({**dispatcher.model_dump(), "user_id": data.user.id, "lat": latitude, "lng": longitude})
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

    latitude, longitude = get_lat_lng_full(responder.street, responder.city, responder.state, responder.zipcode)

    # Insert into 'at_risk' table
    result = (
        supabase.table("first_responders")
        .insert({**responder.model_dump(), "user_id": data.user.id, "lat": latitude, "lng": longitude})
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
@app.get("/responders_within")
def responders_within(fire_id: str, radius_miles: float = 50.0):
    """
    Get all first responders within the given radius (default 10 miles) of the fire.
    """

    # Retrieve fire location
    fire_res = supabase.table("fires").select("*").eq("id", fire_id).single().execute()

    fire_data = fire_res.data
    fire_lat, fire_lng = fire_data["latitude"], fire_data["longitude"]

    # Retrieve first responders
    resp_res = supabase.table("first_responders").select("user_id, unit_name, role, lat, lng").execute()

    responders = resp_res.data
    within = []

    for responder in responders:
        if responder["lat"] is not None and responder["lng"] is not None:
            distance_miles = distance.distance((fire_lat, fire_lng), (responder["lat"], responder["lng"])).miles
            logger.info(f"{responder} {distance_miles}")
            if distance_miles <= radius_miles:
                responder["distance"] = round(distance_miles, 2)
                within.append(responder)

    return within




@app.post("/dispatch")
def dispatch_responder(dispatch: Dispatch):
    """
    Insert a record into 'dispatches'.
    """
    data = {"fire_id": dispatch.fire_id, "responder_id": dispatch.responder_id}
    res = supabase.table("dispatches").insert(data).execute()
    return {"message": "Dispatched successfully"}


@app.get("/responder/dispatches")
def get_dispatches(responder_id: str = None):
    if not responder_id:
        data = supabase.auth.get_user()
        result = supabase.table("dispatches").select("*").eq("responder_id", data.user.id).execute()
    else:
        result = supabase.table("dispatches").select("*").eq("responder_id", responder_id).execute()
    return {"data": result.data}

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
from geopy import distance

from typing import Optional
from fastapi import Query
from geopy.geocoders import Nominatim
import json
import time

# Initialize Geocoder
geolocator = Nominatim(user_agent="fire_safety_app")


def get_lat_lng_full(street: str, city: str, state: str, zip_code: str):
    """
    Converts an address to latitude and longitude using Nominatim Geocoder.
    """
    address = f"{street}, {city}, {state} {zip_code}"

    try:
        location = geolocator.geocode(address, timeout=10)
        if location:
            return location.latitude, location.longitude
    except Exception as e:
        logger.info(f"Geocoding failed for {address}: {e}")

    return None, None  # If geolocation fails

def get_lat_lng_zipc(state: str, zip_code: str):
    """
    Converts an address to latitude and longitude using Nominatim Geocoder.
    """
    address = f"{state} {zip_code}"

    try:
        location = geolocator.geocode(address, timeout=10)
        if location:
            return location.latitude, location.longitude
    except Exception as e:
        print(f"Geocoding failed for {address}: {e}")

    return None, None  # If geolocation fails


from fastapi import BackgroundTasks

@app.get("/generate-summary")
def generate_summary(fire_id: str = Query(...)):
    """
    Generate structured AI-generated summaries for Firefighters, EMTs, and Police
    based on at-risk individuals near the fire location.
    """
    # 1) Retrieve Fire Location
    fire_res = supabase.table("fires").select("*").eq("id", fire_id).single().execute()
    if not fire_res.data:
        raise HTTPException(status_code=404, detail="Fire not found")
    fire_data = fire_res.data
    fire_lat, fire_lng = fire_data["latitude"], fire_data["longitude"]

    # 2) Retrieve At-Risk Residents
    at_risk_res = supabase.table("at_risk").select("*").execute()
    if not at_risk_res.data:
        raise HTTPException(status_code=400, detail="Error fetching at-risk residents.")

    nearby_individuals = []
    for person in at_risk_res.data:
        # If lat/lng is missing, use get_lat_lng_zipc (which only uses state and zipcode)
        if person.get("lat") is None or person.get("lng") is None:
            lat, lng = get_lat_lng_zipc(person["state"], person["zipcode"])
            if lat is None or lng is None:
                continue  # Skip if geocoding fails
            person["lat"], person["lng"] = lat, lng

        # Calculate distance from fire
        person_coords = (person["lat"], person["lng"])
        fire_coords = (fire_lat, fire_lng)
        distance_miles = distance.distance(person_coords, fire_coords).miles

        # Include only if within 5 miles
        if distance_miles <= 20:
            logger.info(distance_miles)
            person["distance_miles"] = round(distance_miles, 2)
            nearby_individuals.append(person)

    logger.info(nearby_individuals)
    # If no one is nearby, return default summaries
    if not nearby_individuals:
        return {
            "firefighter": "No immediate firefighter concerns.",
            "emt": "No EMT assistance required.",
            "police": "No law enforcement action needed."
        }

    # 3) Structure Data for AI prompt
    resident_text = "\n".join([
        f"- {p['name']} ({p['street']}, {p['city']}, {p['state']}) - "
        f"Disability: {p.get('disability', 'None')}, Info: {p.get('additional_info', 'N/A')}"
        for p in sorted(nearby_individuals, key=lambda x: x["distance_miles"])
    ])

    system_prompt = (
        "You are an emergency response assistant. Generate separate response summaries for Firefighters, EMTs, and Police "
        "based on the at-risk residents in the fire-affected area. Each summary should be concise and relevant to their role. "
        "Return ONLY a valid JSON object with:\n"
        "- firefighter (string)\n"
        "- emt (string)\n"
        "- police (string)"
    )

    user_message = (
        "Generate emergency response summaries for first responders. The following at-risk residents are near the fire:\n\n"
        + resident_text
    )

    try:
        logger.info(os.getenv("ANTHROPIC_API_KEY"))
        response = anthropic_client.messages.create(
            model="claude-3-5-sonnet-20241022",
            max_tokens=500,
            system=system_prompt,
            messages=[{"role": "user", "content": user_message}],
        )
        # Parse Claude's response into JSON
        structured_summary = json.loads(response.content[0].text)
    except Exception as e:
        return {"error": f"Error calling Claude API: {str(e)}"}

    return structured_summary


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
        distance_miles = distance.distance(person_coords, fire_coords).miles

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
