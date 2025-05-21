from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from database import Base
from datetime import datetime

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    email = Column(String, unique=True, index=True)
    files = relationship("UserFile", back_populates="user")
    requests = relationship("AnalysisRequest", back_populates="user")

class UserFile(Base):
    __tablename__ = "user_files"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    file_path = Column(String)
    file_type = Column(String)
    upload_date = Column(DateTime, default=datetime.utcnow)
    user = relationship("User", back_populates="files")

class AnalysisRequest(Base):
    __tablename__ = "analysis_requests"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    file_id = Column(Integer, ForeignKey("user_files.id"))
    report_path = Column(String)
    json_path = Column(String)
    request_date = Column(DateTime, default=datetime.utcnow)
    user = relationship("User", back_populates="requests")
    file = relationship("UserFile")