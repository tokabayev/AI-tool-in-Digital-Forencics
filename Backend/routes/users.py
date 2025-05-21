from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import List
from database import get_db
from models import User, UserFile, AnalysisRequest
from auth import create_access_token, get_current_user
from passlib.context import CryptContext
from datetime import datetime
import os

router = APIRouter()

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

class UserCreate(BaseModel):
    username: str
    password: str
    email: str

class UserFileResponse(BaseModel):
    id: int
    file_path: str
    file_type: str
    upload_date: datetime

class AnalysisRequestResponse(BaseModel):
    id: int
    file_id: int
    report_path: str
    request_date: datetime

@router.post("/register")
async def register(user: UserCreate, db: Session = Depends(get_db)):
    db_user = db.query(User).filter(User.username == user.username).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Username already registered")
    db_email = db.query(User).filter(User.email == user.email).first()
    if db_email:
        raise HTTPException(status_code=400, detail="Email already registered")
    hashed_password = pwd_context.hash(user.password)
    db_user = User(username=user.username, hashed_password=hashed_password, email=user.email)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return {"message": "User registered successfully"}

@router.post("/login")
async def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = db.query(User).filter(User.username == form_data.username).first()
    if not user or not pwd_context.verify(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token = create_access_token(data={"sub": user.username})
    return {"access_token": access_token, "token_type": "bearer"}

@router.get("/files", response_model=List[UserFileResponse])
async def get_user_files(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    return db.query(UserFile).filter(UserFile.user_id == current_user.id).all()

@router.get("/history", response_model=List[AnalysisRequestResponse])
async def get_user_history(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    return db.query(AnalysisRequest).filter(AnalysisRequest.user_id == current_user.id).all()

@router.get("/files/download/{file_id}")
async def download_file(file_id: int, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    user_file = db.query(UserFile).filter(UserFile.id == file_id, UserFile.user_id == current_user.id).first()
    if not user_file:
        raise HTTPException(status_code=404, detail="File not found")
    file_path = user_file.file_path
    if not os.path.exists(file_path):
        raise HTTPException(status_code=404, detail="File not found on server")
    return FileResponse(path=file_path, filename=os.path.basename(file_path), media_type="application/octet-stream")

@router.get("/history/report/{request_id}")
async def download_report(request_id: int, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    analysis_request = db.query(AnalysisRequest).filter(AnalysisRequest.id == request_id, AnalysisRequest.user_id == current_user.id).first()
    if not analysis_request:
        raise HTTPException(status_code=404, detail="Report not found")
    report_path = analysis_request.report_path
    if not os.path.exists(report_path):
        raise HTTPException(status_code=404, detail="Report not found on server")
    return FileResponse(path=report_path, filename=os.path.basename(report_path), media_type="application/pdf")


@router.get("/history/json/{request_id}")
async def download_json_report(
        request_id: int,
        current_user: User = Depends(get_current_user),
        db: Session = Depends(get_db)
):

    request = db.query(AnalysisRequest).filter(
        AnalysisRequest.id == request_id,
        AnalysisRequest.user_id == current_user.id
    ).first()

    if not request:
        raise HTTPException(status_code=404, detail="Запрос анализа не найден")


    if not request.json_path:
        raise HTTPException(status_code=404, detail="JSON отчёт недоступен для этого запроса")


    if not os.path.exists(request.json_path):
        raise HTTPException(status_code=404, detail="JSON файл не найден на сервере")

   
    return FileResponse(
        request.json_path,
        media_type='application/json',
        filename=f"report_{request_id}.json"
    )