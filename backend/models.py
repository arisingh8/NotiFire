# backend/models.py
from pydantic import BaseModel
from typing import Optional, List

class AtRisk(BaseModel):
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
    name: str
    place_of_work: Optional[str]
    zip: Optional[str]
    auth_key: Optional[str]
    lat: Optional[float]
    lng: Optional[float]

class FirstResponder(BaseModel):
    role: str
    unit_name: str
    street: Optional[str]
    city: Optional[str]
    state: Optional[str]
    zip: Optional[str]
    lat: Optional[float]
    lng: Optional[float]
    unit_size: Optional[int]

class Fire(BaseModel):
    id: Optional[str]
    latitude: float
    longitude: float
    confidence: Optional[float]
    date_detected: Optional[str]
    additional_fields: Optional[dict]

class Dispatch(BaseModel):
    fire_id: str
    responder_id: str
    status: Optional[str]
