import os
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from supabase import create_client, Client
from anthropic import Anthropic

router = APIRouter()

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")
ANTHROPIC_API_KEY = os.getenv("ANTHROPIC_API_KEY")

supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

class SummaryRequest(BaseModel):
    user_id: str

@router.post("/generate_summary_claude")
async def generate_summary_claude(req: SummaryRequest):
    
    user_data = supabase.table("users").select("*").eq("id", req.user_id).execute()
    if not user_data.data:
        raise HTTPException(status_code=404, detail="User not found")
    
    user = user_data.data[0]
    role = user["role"]
    zipcode = user["zipcode"]

    events_resp = supabase.table("fire_events").select("*").execute()
    if events_resp.status_code != 200:
        raise HTTPException(status_code=500, detail="Unable to fetch fire events")
    
    fire_events = events_resp.data

    system_message = """You are an AI assistant specializing in summarizing wildfire data. 
    Provide concise, role-specific summaries that are actionable and relevant."""

    user_message = f"""Given the user's role as {role} in ZIP code {zipcode}, 
    here are the current fire events to summarize:
    {fire_events}

    Please provide a focused summary based on the role:
    - Firefighter: Emphasize resources and containment status
    - Police: Focus on evacuation needs and traffic management
    - Ambulance: Highlight medical readiness and potential casualties

    Keep the summary brief and actionable."""

    client = Anthropic(api_key=ANTHROPIC_API_KEY)
    
    try:
        response = await client.messages.create(
            model="claude-3-5-sonnet-20241022",
            max_tokens=300,
            temperature=0.7,
            system=system_message,
            messages=[
                {
                    "role": "user",
                    "content": user_message
                }
            ]
        )
        summary_text = response.content[0].text
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Anthropic API error: {e}")

    return {"summary": summary_text}