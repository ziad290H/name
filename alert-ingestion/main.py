from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from datetime import datetime

app = FastAPI()

# ✅ CORS FIX
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # OK for dev/project
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

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
        "created_at": datetime.utcnow().isoformat(),
        "acknowledged_at": None,
        "resolved_at": None,
        "mtta": None,
        "mttr": None
    }
    incidents.append(incident)
    return incident

@app.patch("/api/v1/incidents/{incident_id}")
def update_incident_status(incident_id: int, data: dict):
    for incident in incidents:
        if incident["id"] == incident_id:
            new_status = data.get("status")

            if new_status not in ["acknowledged", "resolved"]:
                raise HTTPException(status_code=400, detail="Invalid status")

            now = datetime.utcnow()

            if new_status == "acknowledged" and incident["acknowledged_at"] is None:
                incident["acknowledged_at"] = now.isoformat()
                incident["mtta"] = (
                    now - datetime.fromisoformat(incident["created_at"])
                ).total_seconds()

            if new_status == "resolved" and incident["resolved_at"] is None:
                incident["resolved_at"] = now.isoformat()
                incident["mttr"] = (
                    now - datetime.fromisoformat(incident["created_at"])
                ).total_seconds()

            incident["status"] = new_status
            return incident

    raise HTTPException(status_code=404, detail="Incident not found")
