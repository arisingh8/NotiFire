# backend/auth.py
import os
import jwt
import bcrypt
from fastapi import HTTPException, status
from datetime import datetime, timedelta

JWT_SECRET = os.getenv("JWT_SECRET_KEY", "supersecret")

def create_jwt_token(user_id: str):
    payload = {
        "user_id": user_id,
        "exp": datetime.utcnow() + timedelta(days=1),  # token expires in 1 day
        "iat": datetime.utcnow()
    }
    token = jwt.encode(payload, JWT_SECRET, algorithm="HS256")
    return token

def decode_jwt_token(token: str):
    try:
        decoded = jwt.decode(token, JWT_SECRET, algorithms=["HS256"])
        return decoded if decoded["exp"] >= datetime.utcnow().timestamp() else None
    except:
        return None

def hash_password(password: str):
    return bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

<<<<<<< Updated upstream
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

=======
def verify_password(password: str, hashed: str):
    return bcrypt.checkpw(password.encode('utf-8'), hashed.encode('utf-8'))
>>>>>>> Stashed changes
