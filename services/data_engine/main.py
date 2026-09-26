"""
TacticalVision AI - Module 1: Data Engine
FastAPI Service for StatsBomb/Opta match events ingestion & tactical KPI calculation
"""
from fastapi import FastAPI, UploadFile, File
import pandas as pd
import json

app = FastAPI(title="TacticalVision Data Engine", version="1.0.0")

@app.get("/health")
def health():
    return {"status": "ok", "service": "data_engine"}

@app.post("/api/v1/parse-match")
async def parse_match_data(file: UploadFile = File(...)):
    contents = await file.read()
    data = json.loads(contents)
    # Parse events, compute xG, pass matrix, and PPDA
    return {
        "status": "success",
        "match_id": data.get("id", "custom-match"),
        "total_events": len(data.get("events", [])),
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)
