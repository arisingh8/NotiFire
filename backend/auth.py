import os
import json
import bcrypt
from datetime import datetime, timedelta
from fastapi import HTTPException, status
from jwcrypto import jwk, jwt

# 1. Load RSA keys from environment variables
private_key_pem = os.getenv("PRIVATE_KEY")
public_key_pem = os.getenv("PUBLIC_KEY")

if not private_key_pem or not public_key_pem:
    raise RuntimeError("RSA keys not found in environment variables. Please set PRIVATE_KEY_PEM and PUBLIC_KEY_PEM.")

private_jwk = jwk.JWK.from_pem(private_key_pem.encode("utf-8"))
public_jwk = jwk.JWK.from_pem(public_key_pem.encode("utf-8"))

# 2. Token settings
ACCESS_TOKEN_EXPIRE_MINUTES = 60  # e.g. 1 hour

def create_jwt_token(user_id: str) -> str:
    """
    Create an RS256-signed JWT with 'user_id' and 1-hour expiration.
    """
    now = datetime.utcnow()
    exp = now + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)

    claims = {
        "user_id": user_id,
        "iat": int(now.timestamp()),
        "exp": int(exp.timestamp())
    }

    token = jwt.JWT(header={"alg": "RS256", "typ": "JWT"}, claims=claims)
    token.make_signed_token(private_jwk)
    return token.serialize()

def decode_jwt_token(token_str: str) -> dict:
    """
    Verify an RS256-signed JWT using the public key and return its claims.
    Raises HTTPException if invalid or expired.
    """
    try:
        token = jwt.JWT(jwt=token_str, key=public_jwk)
        claims = json.loads(token.claims)
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or malformed JWT token.",
            headers={"WWW-Authenticate": "Bearer"},
        )

    if datetime.utcnow().timestamp() > claims.get("exp", 0):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token has expired.",
            headers={"WWW-Authenticate": "Bearer"},
        )

    return claims

def hash_password(password: str) -> str:
    """
    Hash a plaintext password using bcrypt.
    """
    return bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")

def verify_password(password: str, hashed_password: str) -> bool:
    """
    Verify a plaintext password against a bcrypt-hashed password.
    """
    return bcrypt.checkpw(password.encode("utf-8"), hashed_password.encode("utf-8"))
