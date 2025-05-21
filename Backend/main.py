from fastapi import FastAPI, Depends
from fastapi.security import OAuth2PasswordBearer
from routes.audio import router as audio_router
from routes.users import router as user_router
from database import engine
from models import Base
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import os

load_dotenv()

app = FastAPI(title="Media Analysis API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

Base.metadata.create_all(bind=engine)

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/user/login")

app.include_router(user_router, prefix="/user", tags=["Users"])
app.include_router(audio_router, prefix="/audio", tags=["Audio/Video Analysis"])

@app.get("/")
async def root():
    return {"message": "Media Analysis API"}