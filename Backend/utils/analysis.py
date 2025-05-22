from utils.whisper_utils import transcribe_audio
import os
import subprocess
import uuid
import re
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


def extract_audio_from_video(video_path: str, output_dir: str = "temp") -> str:
    os.makedirs(output_dir, exist_ok=True)
    audio_path = os.path.join(output_dir, f"{uuid.uuid4().hex}.wav")

    command = [
        "ffmpeg",
        "-i", video_path,
        "-vn",
        "-acodec", "pcm_s16le",
        "-ar", "16000",
        "-ac", "1",
        audio_path
    ]

    try:
        subprocess.run(command, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL, check=True)
        return audio_path
    except subprocess.CalledProcessError:
        logger.error(f"Ошибка извлечения аудио из {video_path}")
        return None


def load_keywords_from_file(filepath: str = os.path.join(os.path.dirname(__file__), "keywords.txt")) -> list[str]:
    logger.info(f"Попытка загрузки ключевых слов из: {filepath}")
    if not os.path.exists(filepath):
        logger.error(f"Файл ключевых слов не найден: {filepath}")
        return []
    with open(filepath, "r", encoding="utf-8") as f:
        return [line.strip().lower() for line in f if line.strip()]


def clean_text(text: str) -> str:
    text = re.sub(r"['’]s\b", "", text, flags=re.IGNORECASE)
    text = re.sub(r"[^\w\s]", " ", text)
    return text.lower()


def analyze_media(file_path: str):
    file_ext = os.path.splitext(file_path)[1].lower()

    if file_ext in ['.mp4', '.avi', '.mov', '.mkv']:
        audio_path = extract_audio_from_video(file_path)
        if not audio_path or not os.path.exists(audio_path):
            return {"error": "Failed to extract audio from video"}
        file_path = audio_path

    if file_ext in ['.mp3', '.wav'] or file_path.endswith(".wav"):
        transcription = transcribe_audio(file_path)
        logger.info(f"Результат транскрипции: {transcription}")
        if "error" in transcription:
            return {"error": transcription["error"]}

        keywords = load_keywords_from_file()
        timestamps = []
        for segment in transcription.get("segments", []):
            text = segment.text if segment.text else ""
            cleaned_text = clean_text(text)
            matches = [keyword for keyword in keywords if keyword in cleaned_text]
            if matches:
                timestamps.append({
                    "timestamp": segment.start,
                    "text": text,
                    "keywords": matches
                })

        return {
            "transcription": transcription.get("text"),
            "drug_timestamps": timestamps
        }

    return {"error": "Unsupported file format"}