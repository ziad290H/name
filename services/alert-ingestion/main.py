from fastapi import FastAPI
from datetime import datetime

app = FastAPI()

incidents = []

@app.get("/health")
def health():
    return {"status": "ok"}

@app.get("/api/v1/incidents")
def list_incidents():
    return incidents

@app.post("/api/v1/incidents")
def create_incident(data: dict):
    incident = {
        "id": len(incidents) + 1,
        "service": data.get("service"),
        "severity": data.get("severity"),
        "status": "open",
        "created_at": datetime.utcnow()
    }
    incidents.append(incident)
    return incident
