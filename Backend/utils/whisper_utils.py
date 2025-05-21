import openai
import ffmpeg
import os


openai.api_key = os.getenv("OPENAI_API_KEY")

def transcribe_audio(file_path: str):
    try:
        if not os.path.exists(file_path):
            print(f"Error: File not found at {file_path}")
            return {"error": "File not found"}

        size = os.path.getsize(file_path)
        print(f"Transcribing file: {file_path} ({size} bytes)")

        client = openai.Client(api_key=openai.api_key)
        with open(file_path, "rb") as audio_file:
            response = client.audio.transcriptions.create(
                model="whisper-1",
                file=audio_file,
                response_format="verbose_json",
                timestamp_granularities=["segment"]
            )
        print("Whisper API response:", response)
        return {
            "text": response.text,
            "segments": response.segments
        }
    except Exception as e:
        print(f"Error in transcribe_audio: {str(e)}")
        return {"error": str(e)}