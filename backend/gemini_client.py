import os
import base64
from google import genai
from google.genai import types
from dotenv import load_dotenv

load_dotenv()

_api_key = os.getenv("GEMINI_API_KEY")
if not _api_key:
    raise EnvironmentError(
        "GEMINI_API_KEY is not set. Add it to backend/.env before starting the server."
    )

client = genai.Client(api_key=_api_key)

MODEL = "gemini-3.6-flash"


def call_gemini(prompt: str) -> str:
    """Send a text prompt to Gemini and return the response text."""
    response = client.models.generate_content(
        model=MODEL,
        contents=prompt,
    )
    return response.text


def call_gemini_vision(prompt: str, image_data: bytes, mime_type: str) -> str:
    """Send a prompt + inline image to Gemini and return the response text."""
    image_part = types.Part.from_bytes(data=image_data, mime_type=mime_type)
    response = client.models.generate_content(
        model=MODEL,
        contents=[prompt, image_part],
    )
    return response.text
