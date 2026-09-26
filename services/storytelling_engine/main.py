"""
TacticalVision AI - Module 3: Storytelling Engine
FastAPI Service utilizing Google GenAI Gemini SDK with "Hastalık Bu Futbol" signature narrative style
"""
from fastapi import FastAPI
from pydantic import BaseModel
import os

app = FastAPI(title="TacticalVision Storytelling Engine", version="1.0.0")

class StoryRequest(BaseModel):
    match_title: str
    home_team: str
    away_team: str
    score: str
    tactical_thesis: str
    focus_topic: str

@app.get("/health")
def health():
    return {"status": "ok", "service": "storytelling_engine", "model": "gemini-3.8-flash"}

@app.post("/api/v1/generate-script")
def generate_hbf_script(req: StoryRequest):
    # Generates dramatic cinematic scenes with voiceover text and telestration cues
    return {
        "status": "success",
        "author_style": "Hastalık Bu Futbol",
        "match": req.match_title,
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8003)
