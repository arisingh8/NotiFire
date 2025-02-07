from fastapi import FastAPI
from fastapi import Body, HTTPException
import supabase
from auth import router as auth_router
from ingestion import router as ingest_router
from openai import OpenAI

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

app = FastAPI(title="FireGuard AI")


app.include_router(auth_router, prefix="/auth")
app.include_router(ingest_router, prefix="/data")

@app.get("/")
def root():
    return {"message": "FireGuard AI API up and running!"}


@app.post("/generate_summary")
def generate_summary(user_id: str = Body(...)):
    # 1) fetch user from supabase
    user = supabase.table("users").select("*").eq("id", user_id).execute()
    if not user.data:
        raise HTTPException(status_code=404, detail="User not found")

    user_record = user.data[0]
    role = user_record["role"]

    # 2) fetch relevant fire events
    # (Optional) filter by user zipcode or location if you'd like
    fires_data = supabase.table("fire_events").select("*").execute()
    if fires_data.status_code != 200:
        raise HTTPException(status_code=500, detail="Cannot fetch fire events")

    # 3) Build prompt
    fire_list = fires_data.data
    prompt = f"""
    You are an assistant summarizing wildfire data for a {role}.
    The user is in ZIP {user_record['zipcode']}.

    Fire data:
    {fire_list}

    Provide a concise summary focusing on what's relevant to a {role}:
    - Firefighter: resources, containment
    - Police: evacuations, traffic
    - Ambulance: medical readiness, potential casualties
    """
    # 4) openai call
    response = client.completions.create(engine="text-davinci-003",
    prompt=prompt,
    max_tokens=200,
    temperature=0.7)
    summary_text = response.choices[0].text.strip()

    return {"summary": summary_text}
