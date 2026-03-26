import os
from dotenv import load_dotenv

from fastapi import FastAPI, Depends, HTTPException
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse

from backend.database import supabase, get_profile, save_profile, get_next_swipe, record_swipe, get_matches, get_messages, save_message

load_dotenv()

app = FastAPI()
security = HTTPBearer()


async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    token = credentials.credentials
    try:
        user = supabase.auth.get_user(token)
        return user
    except:
        raise HTTPException(status_code=401, detail="Not authenticated")


@app.get("/config")
async def get_config():
    return {
        "supabase_url": os.getenv("SUPABASE_URL"),
        "supabase_key": os.getenv("SUPABASE_PUBLISHABLE_KEY")
    }


@app.get("/api/profile")
async def api_get_profile(user = Depends(get_current_user)):
    profile = get_profile(user.user.id)
    return { **profile, "email": user.user.email }


@app.post("/api/profile")
async def api_save_profile(data: dict, user = Depends(get_current_user)):
    save_profile(
        user_id=user.user.id,
        bio=data.get("bio", ""),
        teach_skills=data.get("teach_skills", []),
        learn_skills=data.get("learn_skills", [])
    )
    return { "success": True }


@app.get("/api/swipe")
async def api_get_next_swipe(user = Depends(get_current_user)):
    return get_next_swipe(user.user.id)


@app.post("/api/swipe")
async def api_record_swipe(data: dict, user = Depends(get_current_user)):
    record_swipe(
        swiper_id=user.user.id,
        swiped_id=data.get("swiped_id"),
        direction=data.get("direction"),
    )
    return { "success": True }


@app.get("/api/matches")
async def api_get_matches(user = Depends(get_current_user)):
    return get_matches(user.user.id)


@app.get("/api/chat")
async def api_get_messages(username: str, user = Depends(get_current_user)):
    return get_messages(user.user.id, username)

@app.post("/api/chat")
async def api_save_messages(data: dict, user = Depends(get_current_user)):
    save_message(
        sender_id=user.user.id,
        receiver_username=data.get("receiver_username", ""),
        content=data.get("content", "")
    )
    return { "success": True }


app.mount("/static", StaticFiles(directory="frontend/static"), name="static")


@app.get("/")
def index():
    return FileResponse("frontend/templates/index.html")

@app.get("/chat")
def chat():
    return FileResponse("frontend/templates/chat.html")

@app.get("/login")
def login():
    return FileResponse("frontend/templates/login.html")

@app.get("/matches")
def matches():
    return FileResponse("frontend/templates/matches.html")

@app.get("/profile-setup")
def profile_setup():
    return FileResponse("frontend/templates/profile-setup.html")

@app.get("/profile")
def profile():
    return FileResponse("frontend/templates/profile.html")

@app.get("/signup")
def signup():
    return FileResponse("frontend/templates/signup.html")

@app.get("/swipe")
def swipe():
    return FileResponse("frontend/templates/swipe.html")