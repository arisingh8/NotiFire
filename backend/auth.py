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

def verify_password(password: str, hashed: str):
    return bcrypt.checkpw(password.encode('utf-8'), hashed.encode('utf-8'))
