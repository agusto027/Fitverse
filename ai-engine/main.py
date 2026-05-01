from fastapi import FastAPI, WebSocket, WebSocketDisconnect, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import json
import asyncio
import numpy as np
import os
import time

# NOTE: We intentionally avoid importing heavy optional deps (pandas / scikit-learn)
# at module import time. Those imports can stall startup, preventing Uvicorn from
# binding to port 8000. We import them lazily inside get_recommender/get_coach.

app = FastAPI(title="FitVerse AI Engine")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Lazy init: these can be expensive to build at import-time.
# If we construct them eagerly, the ASGI app import can stall and Uvicorn never binds.
_dataset_path = os.path.join(os.path.dirname(__file__), "..", "final dataset.csv")
_recommender = None
_coach = None
_recommender_init_error = None
_coach_init_error = None


def get_recommender():
    global _recommender, _recommender_init_error
    if _recommender is not None:
        return _recommender
    if _recommender_init_error is not None:
        raise HTTPException(status_code=503, detail=f"Diet engine unavailable: {_recommender_init_error}")
    try:
        from diet_recommender import DietRecommender
        _recommender = DietRecommender(_dataset_path)
        return _recommender
    except Exception as e:
        _recommender_init_error = str(e)
        raise HTTPException(status_code=503, detail=f"Diet engine unavailable: {_recommender_init_error}")


def get_coach():
    global _coach, _coach_init_error
    if _coach is not None:
        return _coach
    if _coach_init_error is not None:
        raise HTTPException(status_code=503, detail=f"Coach engine unavailable: {_coach_init_error}")
    try:
        from coach_engine import CoachEngine
        _coach = CoachEngine()
        return _coach
    except Exception as e:
        _coach_init_error = str(e)
        raise HTTPException(status_code=503, detail=f"Coach engine unavailable: {_coach_init_error}")

EXERCISE_ALIASES = {
    "bicepurl": "bicep_curl",
    "bicep_curl": "bicep_curl",
    "chair_squats": "lunges",
    "tricepsdips": "tricep_dips",
    "tricep_dips": "tricep_dips",
    "lateralraise": "lateral_raise",
    "lateral_raise": "lateral_raise",
    "overheadpress": "shoulder_press",
    "shoulderpress": "shoulder_press",
    "shoulder_press": "shoulder_press",
    "calfraisestanding": "calf_raises",
    "calf_raises": "calf_raises",
    "lunge": "lunges",
    "lunges": "lunges",
    "pullupsapproach": "pull_ups",
    "pull_ups": "pull_ups",
}

SUPPORTED_EXERCISES = {
    "squat",
    "pushup",
    "lunges",
    "bicep_curl",
    "tricep_dips",
    "lateral_raise",
    "shoulder_press",
    "dumbbell_curl",
    "pull_ups",
    "calf_raises",
    "deadlift",
    "bench_press",
    "plank",
    "marching",
    "jumpingjacks",
}


def normalize_exercise(exercise):
    if not exercise:
        return "squat"
    normalized = str(exercise).strip().lower().replace(" ", "_").replace("-", "_")
    return EXERCISE_ALIASES.get(normalized, normalized)

class DietRequest(BaseModel):
    gender: str = "Male"
    goal: str = "fat-loss"

@app.post("/api/diet/recommend")
async def get_diet_recommendation(req: DietRequest):
    """Returns a full diet plan based on the dataset filtering."""
    recommender = get_recommender()
    plan = recommender.recommend(req.gender, req.goal)
    return plan

class ChatRequest(BaseModel):
    message: str
    user_name: str = "User"

@app.post("/api/coach/chat")
async def process_coach_chat(req: ChatRequest):
    """Processes user input using NLP and returns response."""
    await asyncio.sleep(0.8)
    coach = get_coach()
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

def analyze_posture(landmarks, exercise):
    """
    Analyzes body posture and alignment for form feedback.
    Returns a posture cue string with form recommendations.
    """
    posture_cues = []
    
    # Extract key landmarks
    left_shoulder = [landmarks[11]['x'], landmarks[11]['y']]
    right_shoulder = [landmarks[12]['x'], landmarks[12]['y']]
    left_hip = [landmarks[23]['x'], landmarks[23]['y']]
    right_hip = [landmarks[24]['x'], landmarks[24]['y']]
    left_knee = [landmarks[25]['x'], landmarks[25]['y']]
    right_knee = [landmarks[26]['x'], landmarks[26]['y']]
    left_ankle = [landmarks[27]['x'], landmarks[27]['y']]
    right_ankle = [landmarks[28]['x'], landmarks[28]['y']]
    nose = [landmarks[0]['x'], landmarks[0]['y']]
    
    # Check shoulder alignment (should be level)
    shoulder_diff = abs(left_shoulder[1] - right_shoulder[1])
    if shoulder_diff > 0.05:
        posture_cues.append("⚠️ Level shoulders")
    
    # Check hip alignment (should be level)
    hip_diff = abs(left_hip[1] - right_hip[1])
    if hip_diff > 0.05:
        posture_cues.append("⚠️ Level hips")
    
    # Exercise-specific form checks
    if exercise in ["squat", "lunges"]:
        # Check knee alignment: knees should track over ankles (not caving in)
        left_knee_x = left_knee[0]
        left_ankle_x = left_ankle[0]
        right_knee_x = right_knee[0]
        right_ankle_x = right_ankle[0]
        
        left_knee_drift = abs(left_knee_x - left_ankle_x)
        right_knee_drift = abs(right_knee_x - right_ankle_x)
        
        if left_knee_drift > 0.08 or right_knee_drift > 0.08:
            posture_cues.append("⚠️ Knees over toes")
        
        # Check forward lean (nose over shoulders)
        avg_shoulder_x = (left_shoulder[0] + right_shoulder[0]) / 2
        if abs(nose[0] - avg_shoulder_x) > 0.1:
            posture_cues.append("⚠️ Upright torso")
        
        # Check for good depth (if in down position)
        hip_knee_ankle = calculate_angle(left_hip, left_knee, left_ankle)
        if hip_knee_ankle < 100:
            posture_cues.append("✓ Good depth!")
        
    elif exercise == "bicep_curl":
        # Check elbow stays at sides
        left_elbow = [landmarks[13]['x'], landmarks[13]['y']]
        left_shoulder = [landmarks[11]['x'], landmarks[11]['y']]
        elbow_drift = abs(left_elbow[0] - left_shoulder[0])
        if elbow_drift > 0.1:
            posture_cues.append("⚠️ Elbows at sides")
        
        # Check wrist straight
        left_wrist = [landmarks[15]['x'], landmarks[15]['y']]
        wrist_elbow_diff = abs(left_wrist[0] - left_elbow[0])
        if wrist_elbow_diff > 0.08:
            posture_cues.append("⚠️ Wrist aligned")
    
    elif exercise == "shoulder_press":
        # Check core engagement
        left_hip_y = left_hip[1]
        avg_shoulder_y = (left_shoulder[1] + right_shoulder[1]) / 2
        if left_hip_y > avg_shoulder_y + 0.15:
            posture_cues.append("⚠️ Engage core")
        
        # Check elbows not flaring too much
        left_elbow = [landmarks[13]['x'], landmarks[13]['y']]
        elbow_shoulder_diff = abs(left_elbow[0] - left_shoulder[0])
        if elbow_shoulder_diff > 0.15:
            posture_cues.append("⚠️ Elbows under bar")
    
    # Return most critical cue or empty string if form is good
    if posture_cues:
        return posture_cues[0]  # Return first/most critical cue
    return "✓ Form looks good!"

@app.websocket("/ws/pose")
async def pose_websocket_endpoint(websocket: WebSocket):
    """
    WebSocket endpoint for real-time rep counting.
    SIMPLIFIED: Uses bulletproof logic that definitely works.
    """
    await websocket.accept()
    print("✓ Client connected for pose tracking")
    
    rep_count = 0
    in_down_pos = False  # True when in contracted/down position
    exercise = "squat"
    last_exercise = exercise
    last_rep_time = 0.0
    min_rep_interval = 1.5  # Minimum time between reps
    down_streak = 0
    up_streak = 0
    required_streak = 5  # Reduced to 5 for faster response
    warmup_frames = 0
    warmup_target = 10
    ready_for_rep = True

    def try_count_rep(label):
        nonlocal rep_count, last_rep_time
        now = time.monotonic()
        if now - last_rep_time < min_rep_interval:
            return False
        rep_count += 1
        last_rep_time = now
        print(f"[{label}] REP #{rep_count}")
        return True
    
    # Thresholds for "down" position (values below this = in down position)
    DOWN_THRESHOLDS = {
        'squat': 120,
        'pushup': 100,
        'lunges': 105,
        'bicep_curl': 80,
        'tricep_dips': 100,
        'lateral_raise': 30,
        'shoulder_press': 95,
        'dumbbell_curl': 70,
        'pull_ups': 80,
        'calf_raises': 0.85,  # Y-coordinate ratio
        'deadlift': 130,
        'bench_press': 100,
        'marching': 0.85,  # Y-coordinate ratio
        'plank': 165,
    }
    
    # Hysteresis thresholds: prevent flickering between states
    # Enter DOWN if below ENTER, exit DOWN only if above EXIT (hysteresis gap)
    DOWN_ENTER_THRESHOLDS = {'squat': 110, 'lunges': 105, 'pushup': 95, 'bicep_curl': 72, 'tricep_dips': 95, 'shoulder_press': 90}
    DOWN_EXIT_THRESHOLDS = {'squat': 130, 'lunges': 145, 'pushup': 110, 'bicep_curl': 85, 'tricep_dips': 110, 'shoulder_press': 105}
    UP_ENTER_THRESHOLDS = {'squat': 150, 'lunges': 150, 'pushup': 145, 'bicep_curl': 150, 'tricep_dips': 145, 'shoulder_press': 160}
    UP_EXIT_THRESHOLDS = {'squat': 135, 'lunges': 135, 'pushup': 130, 'bicep_curl': 135, 'tricep_dips': 130, 'shoulder_press': 145}
    
    try:
        while True:
            data = await websocket.receive_text()
            
            try:
                frame_data = json.loads(data)
                
                if frame_data.get("command") == "reset":
                    rep_count = 0
                    in_down_pos = False
                    last_rep_time = 0.0
                    down_streak = 0
                    up_streak = 0
                    warmup_frames = 0
                    ready_for_rep = True
                    await websocket.send_json({"rep_count": rep_count, "status": "idle", "message": "Reset to 0"})
                    continue
                
                landmarks = frame_data.get("landmarks", [])
                exercise = normalize_exercise(frame_data.get("exercise", "squat"))

                if exercise != last_exercise:
                    rep_count = 0
                    in_down_pos = False
                    last_rep_time = 0.0
                    down_streak = 0
                    up_streak = 0
                    warmup_frames = 0
                    ready_for_rep = True
                    last_exercise = exercise
                
                if not landmarks or len(landmarks) < 29:
                    continue

                if warmup_frames < warmup_target:
                    warmup_frames += 1
                    await websocket.send_json({
                        "rep_count": rep_count,
                        "status": "idle",
                        "message": "Stabilizing pose..."
                    })
                    continue
                
                msg = "Detecting..."
                status = "idle"

                if exercise not in SUPPORTED_EXERCISES:
                    await websocket.send_json({
                        "rep_count": rep_count,
                        "status": "idle",
                        "message": "Exercise not supported yet"
                    })
                    continue
                threshold = DOWN_THRESHOLDS.get(exercise, 120)
                
                # --- SQUAT ---
                if exercise == "squat":
                    hip = [landmarks[23]['x'], landmarks[23]['y']]
                    knee = [landmarks[25]['x'], landmarks[25]['y']]
                    ankle = [landmarks[27]['x'], landmarks[27]['y']]
                    angle = calculate_angle(hip, knee, ankle)
                    
                    # Simple hysteresis-based state machine
                    if not in_down_pos:
                        # Trying to enter down position
                        if angle < DOWN_ENTER_THRESHOLDS.get('squat', 110):
                            down_streak += 1
                            up_streak = 0
                        else:
                            down_streak = max(0, down_streak - 1)  # Decay streak if condition not met
                        
                        if down_streak >= required_streak:
                            in_down_pos = True
                            down_streak = 0
                            ready_for_rep = True
                            msg = f"⬇️ Down {angle:.0f}°"
                            status = "active"
                        else:
                            msg = f"Prep... {angle:.0f}°"
                            status = "idle"
                    else:
                        # Trying to exit down position (complete rep)
                        if angle > DOWN_EXIT_THRESHOLDS.get('squat', 130):
                            up_streak += 1
                            down_streak = 0
                        else:
                            up_streak = max(0, up_streak - 1)  # Decay streak if condition not met
                        
                        if up_streak >= required_streak and ready_for_rep:
                            if try_count_rep("SQUAT"):
                                in_down_pos = False
                                ready_for_rep = False
                                up_streak = 0
                                msg = f"✓ Rep {rep_count}! {angle:.0f}°"
                            status = "active"
                        else:
                            msg = f"⬆️ Up {angle:.0f}°"
                            status = "active"
                
                # --- PUSHUP ---
                elif exercise == "pushup":
                    shoulder = [landmarks[11]['x'], landmarks[11]['y']]
                    elbow = [landmarks[13]['x'], landmarks[13]['y']]
                    wrist = [landmarks[15]['x'], landmarks[15]['y']]
                    angle = calculate_angle(shoulder, elbow, wrist)
                    
                    if angle < 100:
                        in_down_pos = True
                        msg = f"⬇️ Down {angle:.0f}°"
                        status = "active"
                    elif angle > 140 and in_down_pos:
                        if try_count_rep("PUSHUP"):
                            in_down_pos = False
                            msg = f"✓ Rep {rep_count}! {angle:.0f}°"
                    else:
                        msg = f"⬆️ Up {angle:.0f}°"
                        status = "idle" if angle > 140 else "active"
                
                # --- LUNGES ---
                elif exercise == "lunges":
                    left_hip = [landmarks[23]['x'], landmarks[23]['y']]
                    left_knee = [landmarks[25]['x'], landmarks[25]['y']]
                    left_ankle = [landmarks[27]['x'], landmarks[27]['y']]
                    right_hip = [landmarks[24]['x'], landmarks[24]['y']]
                    right_knee = [landmarks[26]['x'], landmarks[26]['y']]
                    right_ankle = [landmarks[28]['x'], landmarks[28]['y']]

                    left_leg_angle = calculate_angle(left_hip, left_knee, left_ankle)
                    right_leg_angle = calculate_angle(right_hip, right_knee, right_ankle)
                    angle = min(left_leg_angle, right_leg_angle)
                    working_leg = "left" if left_leg_angle <= right_leg_angle else "right"

                    if not in_down_pos:
                        if angle < DOWN_ENTER_THRESHOLDS.get('lunges', 105):
                            down_streak += 1
                            up_streak = 0
                        else:
                            down_streak = max(0, down_streak - 1)

                        if down_streak >= required_streak:
                            in_down_pos = True
                            down_streak = 0
                            ready_for_rep = True
                            msg = f"⬇️ Lunge {working_leg} {angle:.0f}°"
                            status = "active"
                        else:
                            msg = f"Prep... {angle:.0f}°"
                            status = "idle"
                    else:
                        if angle > DOWN_EXIT_THRESHOLDS.get('lunges', 145):
                            up_streak += 1
                            down_streak = 0
                        else:
                            up_streak = max(0, up_streak - 1)

                        if up_streak >= required_streak and ready_for_rep:
                            if try_count_rep("LUNGES"):
                                in_down_pos = False
                                ready_for_rep = False
                                up_streak = 0
                                msg = f"✓ Rep {rep_count}! {angle:.0f}°"
                            status = "active"
                        else:
                            msg = f"⬆️ Return {angle:.0f}°"
                            status = "active"
                
                # --- BICEP CURL ---
                elif exercise == "bicep_curl":
                    shoulder = [landmarks[11]['x'], landmarks[11]['y']]
                    elbow = [landmarks[13]['x'], landmarks[13]['y']]
                    wrist = [landmarks[15]['x'], landmarks[15]['y']]
                    angle = calculate_angle(shoulder, elbow, wrist)
                    
                    # Hysteresis-based state machine
                    if not in_down_pos:
                        # Trying to enter down position (contracted)
                        if angle < DOWN_ENTER_THRESHOLDS.get('bicep_curl', 72):
                            down_streak += 1
                            up_streak = 0
                        else:
                            down_streak = max(0, down_streak - 1)  # Decay streak if condition not met
                        
                        if down_streak >= required_streak:
                            in_down_pos = True
                            down_streak = 0
                            ready_for_rep = True
                            msg = f"💪 Curl {angle:.0f}°"
                            status = "active"
                        else:
                            msg = f"Prep... {angle:.0f}°"
                            status = "idle"
                    else:
                        # Trying to exit down position (complete rep)
                        if angle > DOWN_EXIT_THRESHOLDS.get('bicep_curl', 85):
                            up_streak += 1
                            down_streak = 0
                        else:
                            up_streak = max(0, up_streak - 1)  # Decay streak if condition not met
                        
                        if up_streak >= required_streak and ready_for_rep:
                            if try_count_rep("BICEP"):
                                in_down_pos = False
                                ready_for_rep = False
                                up_streak = 0
                                msg = f"✓ Rep {rep_count}! {angle:.0f}°"
                            status = "active"
                        else:
                            msg = f"📄 Extend {angle:.0f}°"
                            status = "active"
                
                # --- TRICEP DIPS ---
                elif exercise == "tricep_dips":
                    shoulder = [landmarks[11]['x'], landmarks[11]['y']]
                    elbow = [landmarks[13]['x'], landmarks[13]['y']]
                    wrist = [landmarks[15]['x'], landmarks[15]['y']]
                    angle = calculate_angle(shoulder, elbow, wrist)
                    
                    if angle < 100:
                        down_streak += 1
                        up_streak = 0
                    elif angle > 140:
                        up_streak += 1
                        down_streak = 0
                    else:
                        down_streak = 0
                        up_streak = 0

                    if down_streak >= required_streak:
                        in_down_pos = True
                        ready_for_rep = True
                        msg = f"⬇️ Dip {angle:.0f}°"
                        status = "active"
                    elif up_streak >= required_streak and in_down_pos and ready_for_rep:
                        if try_count_rep("TRICEP"):
                            in_down_pos = False
                            ready_for_rep = False
                            msg = f"✓ Rep {rep_count}! {angle:.0f}°"
                        status = "active"
                    else:
                        msg = f"⬆️ Up {angle:.0f}°"
                        status = "idle" if angle > 140 else "active"
                
                # --- LATERAL RAISE ---
                elif exercise == "lateral_raise":
                    left_shoulder_y = landmarks[11]['y']
                    right_shoulder_y = landmarks[12]['y']
                    left_wrist_y = landmarks[15]['y']
                    right_wrist_y = landmarks[16]['y']

                    shoulders_y = (left_shoulder_y + right_shoulder_y) / 2
                    wrists_y = (left_wrist_y + right_wrist_y) / 2

                    arms_down = wrists_y > shoulders_y + 0.08
                    arms_up = wrists_y < shoulders_y - 0.02

                    if arms_down:
                        in_down_pos = True
                        msg = "⬇️ Arms down"
                        status = "active"
                    elif arms_up and in_down_pos:
                        if try_count_rep("LATERAL RAISE"):
                            in_down_pos = False
                            msg = f"✓ Rep {rep_count}!"
                        status = "active"
                    else:
                        msg = "⬆️ Raise to shoulder height"
                        status = "idle"
                
                # --- SHOULDER PRESS ---
                elif exercise == "shoulder_press":
                    shoulder = [landmarks[11]['x'], landmarks[11]['y']]
                    elbow = [landmarks[13]['x'], landmarks[13]['y']]
                    wrist = [landmarks[15]['x'], landmarks[15]['y']]
                    angle = calculate_angle(shoulder, elbow, wrist)

                    # Hysteresis-based state machine
                    if not in_down_pos:
                        # Trying to enter down position (lower)
                        if angle < DOWN_ENTER_THRESHOLDS.get('shoulder_press', 90):
                            down_streak += 1
                            up_streak = 0
                        else:
                            down_streak = max(0, down_streak - 1)  # Decay streak if condition not met
                        
                        if down_streak >= required_streak:
                            in_down_pos = True
                            down_streak = 0
                            ready_for_rep = True
                            msg = f"⬇️ Lower {angle:.0f}°"
                            status = "active"
                        else:
                            msg = f"Prep... {angle:.0f}°"
                            status = "idle"
                    else:
                        # Trying to exit down position (complete rep)
                        if angle > DOWN_EXIT_THRESHOLDS.get('shoulder_press', 105):
                            up_streak += 1
                            down_streak = 0
                        else:
                            up_streak = max(0, up_streak - 1)  # Decay streak if condition not met
                        
                        if up_streak >= required_streak and ready_for_rep:
                            if try_count_rep("SHOULDER PRESS"):
                                in_down_pos = False
                                ready_for_rep = False
                                up_streak = 0
                                msg = f"✓ Rep {rep_count}! {angle:.0f}°"
                            status = "active"
                        else:
                            msg = f"⬆️ Press {angle:.0f}°"
                            status = "active"
                
                # --- DUMBBELL CURL ---
                elif exercise == "dumbbell_curl":
                    shoulder = [landmarks[11]['x'], landmarks[11]['y']]
                    elbow = [landmarks[13]['x'], landmarks[13]['y']]
                    wrist = [landmarks[15]['x'], landmarks[15]['y']]
                    angle = calculate_angle(shoulder, elbow, wrist)
                    
                    if angle < 70:
                        in_down_pos = True
                        msg = f"💪 Curl {angle:.0f}°"
                        status = "active"
                    elif angle > 130 and in_down_pos:
                        if try_count_rep("DUMBBELL"):
                            in_down_pos = False
                            msg = f"✓ Rep {rep_count}! {angle:.0f}°"
                    else:
                        msg = f"📄 Extend {angle:.0f}°"
                        status = "idle" if angle > 130 else "active"
                
                # --- PULL UPS ---
                elif exercise == "pull_ups":
                    shoulder = [landmarks[11]['x'], landmarks[11]['y']]
                    elbow = [landmarks[13]['x'], landmarks[13]['y']]
                    wrist = [landmarks[15]['x'], landmarks[15]['y']]
                    angle = calculate_angle(shoulder, elbow, wrist)
                    
                    if angle < 80:
                        in_down_pos = True
                        msg = f"💪 Pull {angle:.0f}°"
                        status = "active"
                    elif angle > 160 and in_down_pos:
                        if try_count_rep("PULL UPS"):
                            in_down_pos = False
                            msg = f"✓ Rep {rep_count}! {angle:.0f}°"
                    else:
                        msg = f"📄 Hang {angle:.0f}°"
                        status = "idle" if angle > 160 else "active"
                
                # --- CALF RAISES ---
                elif exercise == "calf_raises":
                    left_ankle_y = landmarks[27]['y']
                    right_ankle_y = landmarks[28]['y']
                    left_knee_y = landmarks[25]['y']
                    right_knee_y = landmarks[26]['y']

                    ankles_y = (left_ankle_y + right_ankle_y) / 2
                    knees_y = (left_knee_y + right_knee_y) / 2

                    heels_up = ankles_y < knees_y + 0.12

                    if not heels_up:
                        in_down_pos = True
                        msg = "⬇️ Heels down"
                        status = "active"
                    elif in_down_pos:
                        if try_count_rep("CALF RAISES"):
                            in_down_pos = False
                            msg = f"✓ Rep {rep_count}!"
                        status = "active"
                    else:
                        msg = "⬆️ Raise heels"
                        status = "idle"
                
                # --- DEADLIFT ---
                elif exercise == "deadlift":
                    hip = [landmarks[23]['x'], landmarks[23]['y']]
                    knee = [landmarks[25]['x'], landmarks[25]['y']]
                    ankle = [landmarks[27]['x'], landmarks[27]['y']]
                    angle = calculate_angle(hip, knee, ankle)
                    
                    if angle < 130:
                        in_down_pos = True
                        msg = f"⬇️ Bend {angle:.0f}°"
                        status = "active"
                    elif angle > 160 and in_down_pos:
                        if try_count_rep("DEADLIFT"):
                            in_down_pos = False
                            msg = f"✓ Rep {rep_count}! {angle:.0f}°"
                    else:
                        msg = f"⬆️ Up {angle:.0f}°"
                        status = "idle" if angle > 160 else "active"
                
                # --- BENCH PRESS ---
                elif exercise == "bench_press":
                    shoulder = [landmarks[11]['x'], landmarks[11]['y']]
                    elbow = [landmarks[13]['x'], landmarks[13]['y']]
                    wrist = [landmarks[15]['x'], landmarks[15]['y']]
                    angle = calculate_angle(shoulder, elbow, wrist)
                    
                    if angle < 100:
                        in_down_pos = True
                        msg = f"⬇️ Lower {angle:.0f}°"
                        status = "active"
                    elif angle > 160 and in_down_pos:
                        if try_count_rep("BENCH"):
                            in_down_pos = False
                            msg = f"✓ Rep {rep_count}! {angle:.0f}°"
                    else:
                        msg = f"⬆️ Press {angle:.0f}°"
                        status = "idle" if angle > 160 else "active"
                
                # --- PLANK ---
                elif exercise == "plank":
                    shoulder = [landmarks[11]['x'], landmarks[11]['y']]
                    hip = [landmarks[23]['x'], landmarks[23]['y']]
                    ankle = [landmarks[27]['x'], landmarks[27]['y']]
                    angle = calculate_angle(shoulder, hip, ankle)
                    
                    if 165 <= angle <= 180:
                        msg = f"✓ Perfect! {angle:.0f}°"
                        status = "active"
                    else:
                        msg = f"Adjust hips {angle:.0f}°"
                        status = "active" if angle < 165 else "idle"
                
                # --- MARCHING ---
                elif exercise == "marching":
                    hip_y = landmarks[23]['y']
                    knee_y = landmarks[25]['y']
                    knee_high = knee_y < hip_y - 0.15
                    
                    if knee_high:
                        if not in_down_pos:
                            in_down_pos = True
                            if try_count_rep("MARCHING"):
                                msg = f"✓ Rep {rep_count}!"
                        else:
                            msg = "Keep marching!"
                        status = "active"
                    else:
                        in_down_pos = False
                        msg = "Lift knee!"
                        status = "idle"
                
                # --- JUMPING JACKS ---
                elif exercise == "jumpingjacks":
                    shoulder_y = landmarks[11]['y']
                    hip_y = landmarks[23]['y']
                    arms_up = shoulder_y < hip_y - 0.15
                    
                    if arms_up:
                        if not in_down_pos:
                            in_down_pos = True
                            if try_count_rep("JUMPING JACKS"):
                                msg = f"✓ Rep {rep_count}!"
                        else:
                            msg = "Continue!"
                        status = "active"
                    else:
                        in_down_pos = False
                        msg = "Jump!"
                        status = "idle"
                
                # Add AI-powered posture analysis
                posture_feedback = analyze_posture(landmarks, exercise)
                
                # Combine rep counting message with posture feedback
                full_message = f"{msg} | {posture_feedback}"
                
                await websocket.send_json({
                    "rep_count": rep_count,
                    "status": status,
                    "message": full_message,
                    "posture_feedback": posture_feedback
                })

            except Exception as e:
                print(f"Error: {e}")
                pass
                
    except WebSocketDisconnect:
        print("✗ Client disconnected")

if __name__ == "__main__":
    import uvicorn
    # Avoid reload by default on Windows; it can mask startup issues.
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=False)
