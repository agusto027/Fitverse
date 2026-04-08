# Exercise Detection System - Technical Explanation

## 🎯 Overview

The Exercise Detection feature uses **real-time pose estimation** powered by AI to track your body movements, count repetitions, and provide real-time form feedback. It's a **full-stack system** combining frontend (React) and backend (FastAPI) technologies.

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────┐
│         React Frontend (Browser)                     │
│  - Captures video from user's camera                 │
│  - Draws skeleton visualization                      │
│  - Sends pose landmarks to backend via WebSocket     │
└────────────────┬────────────────────────────────────┘
                  │ WebSocket Connection
                  │ (Real-time bidirectional)
                  ↓
┌─────────────────────────────────────────────────────┐
│    FastAPI Backend (Python AI Engine)                │
│  - Receives pose landmarks from client               │
│  - Calculates joint angles (hip, knee, elbow, etc.)  │
│  - Tracks exercise stages (up/down)                  │
│  - Counts reps based on form patterns                │
│  - Sends feedback & rep count back to client         │
└─────────────────────────────────────────────────────┘
```

---

## 📚 Frontend Libraries

### **1. MediaPipe (Browser Version)**
- **Purpose**: Pose detection from video frames
- **Loaded via CDN**: `https://cdn.jsdelivr.net/npm/@mediapipe/pose/`
- **How it works**:
  - Detects 33 body landmarks (joints) from video
  - Provides x, y, z coordinates + confidence for each landmark
  - Runs inference directly in browser (WebGL acceleration)

**Key Components**:
```javascript
- Pose object: Performs the actual pose detection
- Camera object: Manages webcam feed input
- drawConnectors(): Draws skeleton lines between joints
- drawLandmarks(): Draws circles at joint positions
```

### **2. React & React Icons**
- **React**: UI framework for building the interface
- **React Icons**: Camera icons (`IoCamera`, `IoCameraOutline`)

### **3. React Refs**
- `videoRef`: Direct access to raw video stream
- `canvasRef`: Drawing canvas for skeleton visualization
- `wsRef`: WebSocket connection reference
- `cameraRef`: MediaPipe Camera instance
- `poseRef`: MediaPipe Pose instance

---

## 🧠 Backend Libraries (Python)

### **1. FastAPI**
- **Purpose**: Web framework for handling HTTP & WebSocket connections
- **Features Used**:
  - WebSocket endpoint (`/ws/pose`) for real-time communication
  - CORS middleware for cross-origin requests
  - Async/await for handling multiple client connections

### **2. NumPy**
- **Purpose**: Numerical calculations
- **Used for**: Angle calculations between body joints
```python
def calculate_angle(a, b, c):
    # Converts 3 joint positions into radians, then degrees
    # Used to measure joint angles (knee angle, elbow angle, etc.)
```

### **3. Uvicorn**
- **Purpose**: ASGI server that runs the FastAPI application
- **Port**: 8000

### **4. Pydantic**
- **Purpose**: Data validation for request/response models
```python
class DietRequest(BaseModel):
    gender: str
    goal: str
```

### **5. Additional Libraries**
- **Scikit-learn**: Used in Coach Engine for NLP similarity matching
- **python-multipart**: Handles file uploads
- **websockets**: WebSocket protocol support

---

## 🔄 Data Flow - Step by Step

### **1️⃣ Frontend: Video Capture**
```javascript
// User clicks "Start Camera"
const camera = new window.Camera(videoElement, {
  onFrame: async () => {
    await pose.send({image: videoElement})
  }
})
```

### **2️⃣ Frontend: Pose Detection**
```javascript
pose.onResults((results) => {
  // results.poseLandmarks contains 33 body points with x,y coordinates
  // Example: results.poseLandmarks[23] = left hip
  
  // Draw skeleton on canvas
  window.drawConnectors(canvasCtx, results.poseLandmarks, ...)
  window.drawLandmarks(canvasCtx, results.poseLandmarks, ...)
})
```

### **3️⃣ Frontend: Send to Backend**
```javascript
const payload = {
  landmarks: results.poseLandmarks,  // Array of 33 landmarks
  exercise: activeExercise            // "squat", "pushup", etc.
}
wsRef.current.send(JSON.stringify(payload))
```

### **4️⃣ Backend: Receive & Process**
```python
@app.websocket("/ws/pose")
async def pose_websocket_endpoint(websocket: WebSocket):
    while True:
        data = await websocket.receive_text()
        frame_data = json.loads(data)
        landmarks = frame_data.get("landmarks", [])
        exercise = frame_data.get("exercise")
```

### **5️⃣ Backend: Calculate Angles**
```python
# For Squat: Extract knee angle
hip = [landmarks[23]['x'], landmarks[23]['y']]    # Left hip
knee = [landmarks[25]['x'], landmarks[25]['y']]   # Left knee
ankle = [landmarks[27]['x'], landmarks[27]['y']]  # Left ankle

angle = calculate_angle(hip, knee, ankle)  # Returns angle in degrees
```

### **6️⃣ Backend: Track Exercise Stage**
```python
if exercise == "squat":
    if angle < 100:           # Knee bent deeply
        stage = "down"
        msg = "Good Depth! Push UP!"
    if angle > 160 and stage == "down":  # Knee extended, was in "down"
        stage = "up"
        rep_count += 1        # ✅ REP COUNTED!
        msg = "Rep completed!"
```

### **7️⃣ Backend: Send Response**
```python
await websocket.send_json({
    "rep_count": rep_count,
    "status": "active",
    "message": "Rep completed! Excellent."
})
```

### **8️⃣ Frontend: Update UI**
```javascript
ws.onmessage = (event) => {
  const data = JSON.parse(event.data)
  setRepCount(data.rep_count)        // Update rep counter
  setFeedbackMsg(data.message)       // Update feedback text
}
```

---

## 🦵 MediaPipe Pose Landmarks (Body Joints)

The system tracks **33 body landmarks**:

```
Index | Landmark          | Used For
------|-------------------|------------------
0     | Nose              | Head tracking
11    | Left Shoulder     | Arm/shoulder exercises
13    | Left Elbow        | Push-ups, arm angles
15    | Left Wrist        | Hand position
23    | Left Hip          | Leg exercises, burpees
25    | Left Knee         | Squats, lunges, leg tracking
27    | Left Ankle        | Lower body form
(+ right side counterparts: 12, 14, 16, 24, 26, 28)
```

Each landmark has: `{x: 0-1, y: 0-1, z: depth, visibility: confidence}`

---

## 📊 Exercise Detection Logic Examples

### **🏋️ Squat Detection**
```
Tracks: Left knee angle (hip → knee → ankle)

Down Phase:
  - Angle < 100° = Deep squat = "down"
  - Feedback: "Good Depth! Push UP!"

Up Phase:
  - Angle > 160° AND was in "down" = Rep counted ✅
  - Feedback: "Rep completed! Excellent."
```

### **💪 Push-Up Detection**
```
Tracks: Left elbow angle (shoulder → elbow → wrist)

Down Phase:
  - Angle < 90° = Arms bent deeply = "down"
  - Feedback: "Good Depth! Push UP!"

Up Phase:
  - Angle > 160° AND was in "down" = Rep counted ✅
  - Feedback: "Rep completed!"
```

### **🪨 Plank Detection**
```
Tracks: Body alignment (shoulder → hip → ankle)

Perfect Form:
  - Angle: 170° - 180° (straight line)
  - Feedback: "Perfect Plank Alignment!"

Bad Form:
  - Angle < 170° (hips sagging)
  - Feedback: "Hips are sagging! Raise them."
```

### **⏃ Jumping Jacks Detection**
```
Tracks: Arm position relative to hip

Arms Up:
  - Shoulder Y < Hip Y - 0.15 = "up" phase
  - Rep counted when: stage changed from "down" to "up"

Arms Down:
  - Shoulder Y >= Hip Y - 0.15 = "down" phase
```

---

## ⚙️ Key Technical Features

### **1. Real-Time Performance**
- Frontend processes video at ~30 FPS
- WebSocket communication: Low latency (~50-100ms)
- Total pipeline: <200ms per frame

### **2. State Machine Pattern**
- Each exercise tracks a "stage" variable
- Prevents rep double-counting by ensuring stage change
- Example: Squat rep only counts when transitioning from "down" to "up"

### **3. Personalization**
- User profile from localStorage
- Difficulty level calculated from BMI & age
- Recommended exercises based on fitness level

### **4. Confidence Thresholds**
```javascript
minDetectionConfidence: 0.5  // Minimum confidence to detect pose
minTrackingConfidence: 0.5   // Minimum confidence to track
```

### **5. Multi-Client Support**
- FastAPI handles multiple concurrent WebSocket connections
- Each client has independent rep_count & stage tracking

---

## 📦 Requirements.txt

```
fastapi >= 0.104.0         # Web framework
uvicorn >= 0.24.0          # ASGI server
websockets >= 12.0         # WebSocket protocol
mediapipe >= 0.10.30       # Pose detection (used in diet/coach)
numpy >= 1.24.3            # Numerical computing
scikit-learn >= 1.3.2      # ML for coach NLP
python-multipart >= 0.0.6  # File handling
pydantic >= 2.5.0          # Data validation
```

---

## 🔌 Environment Variables

```env
VITE_AI_ENGINE_URL=http://localhost:8000
VITE_BACKEND_URL=http://localhost:3001
```

---

## 🎬 Supported Exercises

| Exercise | Tracked Angles | Difficulty |
|----------|----------------|-----------|
| Squat | Knee angle | Beginner ✓ |
| Push-Up | Elbow angle | Intermediate |
| Plank | Body alignment | Beginner ✓ |
| Lunge | Knee angle | Intermediate |
| Jumping Jacks | Arm position | Intermediate |
| Burpee | Multi-stage tracking | Advanced |
| Mountain Climber | Body alignment + hip movement | Advanced |
| Marching in Place | Knee height | Beginner ✓ |

---

## 🚀 Performance Optimizations

1. **Smooth Landmarks**: MediaPipe applies temporal smoothing
2. **Canvas Rendering**: Only redraws on pose updates
3. **Model Complexity**: Set to 1 (faster, lighter model)
4. **Confidence Thresholding**: Ignores low-confidence detections
5. **WebSocket Optimization**: Only sends when landmarks available

---

## 🐛 Troubleshooting

| Issue | Cause | Solution |
|-------|-------|----------|
| No pose detected | Poor lighting | Improve lighting conditions |
| Wrong body in frame | Multiple people | Ensure single person in frame |
| Inaccurate reps | Poor posture form | Stay close to camera (1-2m) |
| WebSocket disconnects | Backend crash | Restart AI Engine |
| Low FPS | Old device | Reduce model complexity |

---

## 📝 Example: Custom Exercise Addition

To add a new exercise (e.g., lateral raises):

1. **Frontend**: Add to `allExercises` object
2. **Backend**: Add new elif block in pose_websocket_endpoint
3. **Logic**: Define landmarks to track and stage transitions
4. **Testing**: Enable logging and monitor angle values

```python
elif exercise == "lateralraise":
    shoulder = [landmarks[11]['x'], landmarks[11]['y']]
    wrist = [landmarks[15]['x'], landmarks[15]['y']]
    
    # Track arm height relative to shoulder
    arm_raised = wrist['y'] < shoulder['y'] - 0.2
    
    if arm_raised and stage == "down":
        stage = "up"
        rep_count += 1
```

---

## 🎓 Summary

**Exercise Detection = Pose Estimation + Angle Geometry + State Machine**

- **Pose Estimation**: MediaPipe detects body joints from video
- **Angle Geometry**: NumPy calculates angles between joints
- **State Machine**: Tracks exercise stages to count reps accurately
- **Real-time Communication**: WebSocket enables instant feedback loop

This creates an intelligent personal trainer that watches your form and counts your reps in real-time! 🎉
