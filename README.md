
# 🧠 Analyzer — Fullstack App (FastAPI + React)

This is a full-featured web application for media file analysis, built with:
- **Backend**: FastAPI (Python)
- **Frontend**: React + Vite (JavaScript)

## 📁 Project Structure

Analyzer/
├── backend/         # Backend service (FastAPI)
├── frontend/        # Frontend app (React)
└── README.md        # Setup instructions

## 🔧 Backend (FastAPI)

### Steps to run:

## 🧩 System Requirements

This project requires [FFmpeg](https://ffmpeg.org/) to extract audio from video files.

### Install FFmpeg:

- **WINDOWS:**
 
  Download from https://ffmpeg.org

  Add the bin/ folder to your system PATH


1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies (make sure your virtual environment is activated):
   ```bash
   pip install -r requirements.txt
   ```

3. Create a `.env` file with api connection settings. Example for OPENAI_API:
   ```
   OPENAI_API_KEY=sk-proj
   ```

4. Create the required folders before starting:
   ```bash
   mkdir -p uploads documents temp
   ```

5. Initialize the database (run once):
   ```bash
   python init_db.py
   ```

6. Start the FastAPI server:
   ```bash
   uvicorn main:app --reload --port 8000
   ```

The backend will be available at: `http://localhost:8000`

## 🌐 Frontend (React + Vite)

### Steps to run:

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

The frontend will be available at: `http://localhost:5173`

---

## ✅ Notes

- Ensure Python 3.9+ and Node.js 16+ are installed.
- Avoid committing `node_modules/`, `__pycache__/`, `uploads/`, `documents/`, and `.env` files.
- See `.gitignore` for ignored files.
