from fastapi import FastAPI
from fastapi import Body, HTTPException
import supabase
from auth import router as auth_router
from ingestion import router as ingest_router
import os
import openai

app = FastAPI(title="FireGuard AI")


app.include_router(auth_router, prefix="/auth")
app.include_router(ingest_router, prefix="/data")

@app.get("/")
def root():
    return {"message": "FireGuard AI API up and running!"}
