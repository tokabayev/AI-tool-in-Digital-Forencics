from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session
from database import get_db
from models import User, UserFile, AnalysisRequest
from auth import get_current_user
from utils.analysis import analyze_media
from utils.pdf_generator import generate_pdf_report
import os
from datetime import datetime
import json

router = APIRouter()

UPLOAD_DIR = "uploads"
REPORT_DIR = "documents"
ALLOWED_EXTENSIONS = {'.mp3', '.wav', '.mp4', '.avi'}

os.makedirs(UPLOAD_DIR, exist_ok=True)
os.makedirs(REPORT_DIR, exist_ok=True)


@router.post("/upload")
async def upload_media(file: UploadFile = File(...), current_user: User = Depends(get_current_user),
                       db: Session = Depends(get_db)):
    file_ext = os.path.splitext(file.filename)[1].lower()
    if file_ext not in ALLOWED_EXTENSIONS:
        raise HTTPException(status_code=400, detail="Invalid file type")
    file_path = os.path.join(UPLOAD_DIR, f"{current_user.id}_{datetime.utcnow().timestamp()}{file_ext}")
    with open(file_path, "wb") as buffer:
        buffer.write(await file.read())
    user_file = UserFile(user_id=current_user.id, file_path=file_path, file_type=file_ext[1:].upper())
    db.add(user_file)
    db.commit()
    db.refresh(user_file)
    return {"file_id": user_file.id, "message": "File uploaded successfully"}


@router.post("/analyze/{file_id}")
async def analyze_file(file_id: int, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    user_file = db.query(UserFile).filter(UserFile.id == file_id, UserFile.user_id == current_user.id).first()
    if not user_file:
        raise HTTPException(status_code=404, detail="File not found")
    analysis_result = analyze_media(user_file.file_path)
    report_path = os.path.join(REPORT_DIR, f"report_{file_id}_{datetime.utcnow().timestamp()}.pdf")
    generate_pdf_report(analysis_result, report_path)

    json_response = {
        "analysis_result": analysis_result,
        "request_date": datetime.utcnow().isoformat(),
        "file_id": file_id,
        "user_id": current_user.id
    }
    json_path = os.path.join(REPORT_DIR, f"report_{file_id}_{datetime.utcnow().timestamp()}.json")
    with open(json_path, 'w', encoding='utf-8') as json_file:
        json.dump(json_response, json_file, ensure_ascii=False, indent=4)

    analysis_request = AnalysisRequest(user_id=current_user.id, file_id=user_file.id, report_path=report_path,
                                       json_path=json_path)
    db.add(analysis_request)
    db.commit()

    return JSONResponse(content=json_response)