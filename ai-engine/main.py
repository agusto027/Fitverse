from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import json
import asyncio
import numpy as np
import os

from diet_recommender import DietRecommender
from coach_engine import CoachEngine

app = FastAPI(title="FitVerse AI Engine")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize Recommender with proper path handling
dataset_path = os.path.join(os.path.dirname(__file__), '..', 'final dataset.csv')
recommender = DietRecommender(dataset_path)
coach = CoachEngine()

class DietRequest(BaseModel):
    gender: str = "Male"
    goal: str = "fat-loss"

@app.post("/api/diet/recommend")
async def get_diet_recommendation(req: DietRequest):
    """Returns a full diet plan based on the dataset filtering."""
    plan = recommender.recommend(req.gender, req.goal)
    return plan

class ChatRequest(BaseModel):
    message: str
    user_name: str = "User"

@app.post("/api/coach/chat")
async def process_coach_chat(req: ChatRequest):
    """Processes user input using NLP and returns response."""
    # Allow some sleep to mimic typing
    await asyncio.sleep(0.8)
    reply_text = coach.get_response(req.message)
    return {"reply": reply_text}

def calculate_angle(a, b, c):
    """
    Calculates the 2D angle between 3 points.
    a = First Joint
    b = Mid Joint (Vertex)
    c = End Joint
    """
    a = np.array(a)
    b = np.array(b)
    c = np.array(c)
    
    radians = np.arctan2(c[1]-b[1], c[0]-b[0]) - np.arctan2(a[1]-b[1], a[0]-b[0])
    angle = np.abs(radians*180.0/np.pi)
    
    if angle > 180.0:
        angle = 360 - angle
        
    return angle

@app.websocket("/ws/pose")
async def pose_websocket_endpoint(websocket: WebSocket):
    """
    WebSocket endpoint for real-time rep counting / form tracking.
    Expects keypoint JSON from client, returns rep status.
    """
    await websocket.accept()
    print("Client connected for pose tracking")
    
    rep_count: int = 0
    stage: str = "up"
    current_exercise: str = "squat"
    
    try:
        while True:
            data = await websocket.receive_text()
            
            try:
                frame_data = json.loads(data)
                
                # Manual override / Reset 
                if frame_data.get("command") == "reset":
                    rep_count = 0
                    stage = "up"
                    await websocket.send_json({"rep_count": rep_count, "status": "tracking", "message": "Exercise reset to 0"})
                    continue
                
                landmarks = frame_data.get("landmarks", [])
                exercise = frame_data.get("exercise", "squat")

                # Auto-reset if exercise changes unexpectedly from frontend
                if exercise != current_exercise:
                    current_exercise = exercise
                    rep_count = 0
                    stage = "up"

                if not landmarks or len(landmarks) < 29:
                    continue  # Ensure we have a valid body parsed
                
                msg = "Tracking..."
                
                # --- SQUAT LOGIC ---
                if exercise == "squat":
                    # Extract left leg coordinates: Hip (23), Knee (25), Ankle (27)
                    hip = [landmarks[23]['x'], landmarks[23]['y']]
                    knee = [landmarks[25]['x'], landmarks[25]['y']]
                    ankle = [landmarks[27]['x'], landmarks[27]['y']]
                    
                    angle = calculate_angle(hip, knee, ankle)
                    
                    if angle < 100:
                        stage = "down"
                        msg = "Good Depth! Push UP!"
                    if angle > 160 and stage == "down":
                        stage = "up"
                        rep_count += 1
                        msg = "Rep completed! Excellent."
                    elif angle > 160:
                        stage = "up"
                        msg = "Standing. Ready."

                # --- PUSHUP LOGIC ---
                elif exercise == "pushup":
                    # Extract left arm coordinates: Shoulder (11), Elbow (13), Wrist (15)
                    shoulder = [landmarks[11]['x'], landmarks[11]['y']]
                    elbow = [landmarks[13]['x'], landmarks[13]['y']]
                    wrist = [landmarks[15]['x'], landmarks[15]['y']]
                    
                    angle = calculate_angle(shoulder, elbow, wrist)
                    
                    # Pushup angles
                    if angle < 90:
                        stage = "down"
                        msg = "Good Depth! Push UP!"
                    if angle > 160 and stage == "down":
                        stage = "up"
                        rep_count += 1
                        msg = "Rep completed! Excellent."
                    elif angle > 160:
                        stage = "up"
                        msg = "Holding up. Ready."
                        
                # --- PLANK LOGIC ---
                elif exercise == "plank":
                    # For plank, we just track alignment. Hip (23), Shoulder (11), Ankle (27)
                    shoulder = [landmarks[11]['x'], landmarks[11]['y']]
                    hip = [landmarks[23]['x'], landmarks[23]['y']]
                    ankle = [landmarks[27]['x'], landmarks[27]['y']]
                    
                    alignment_angle = calculate_angle(shoulder, hip, ankle)
                    
                    if 170 <= alignment_angle <= 180:
                        msg = "Perfect Plank Alignment!"
                    elif alignment_angle < 170:
                        msg = "Hips are sagging! Raise them."
                    else:
                        msg = "Plank active."
                
                await websocket.send_json({
                    "rep_count": rep_count,
                    "status": "active" if stage == "down" else "idle",
                    "message": msg
                })

            except Exception as e:
                pass
                
    except WebSocketDisconnect:
        print("Client disconnected from pose tracking")

if __name__ == "__main__":
    import uvicorn
    # Make sure to run on 8000
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
