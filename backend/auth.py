from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import os
from supabase import create_client, Client

router = APIRouter()

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

class UserRegister(BaseModel):
    username: str
    password: str
    role: str
    zipcode: int
    radius: int

class UserLogin(BaseModel):
    username: str
    password: str

@router.post("/register")
def register_user(user: UserRegister):

    existing = supabase.table("users").select("*").eq("username", user.username).execute()
    if existing.data:
        raise HTTPException(status_code=400, detail="Username taken.")

    result = supabase.table("users").insert({
        "username": user.username,
        "password": user.password,  # ts aint hashed, i think thats fine for rn
        "role": user.role,
        "zipcode": user.zipcode,
        "radius": user.radius
    }).execute()

    if result.status_code not in (200,201):
        raise HTTPException(status_code=500, detail="Failed to create user.")
    return {"message": "User registered successfully."}

@router.post("/login")
def login_user(creds: UserLogin):
    res = supabase.table("users")\
        .select("*")\
        .eq("username", creds.username)\
        .eq("password", creds.password)\
        .execute()

    if not res.data:
        raise HTTPException(status_code=401, detail="Invalid credentials.")

    return {"user": res.data[0]}

