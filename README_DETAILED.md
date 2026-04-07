# FitVerse - AI-Powered Fitness Platform
## Comprehensive Technical Documentation

> ### 👉 **For Non-Coders:** If you're not a programmer, please read [README_SIMPLE.md](README_SIMPLE.md) instead - it's written for everyone!
> 
> **This document is for developers and technical people only.**

A full-stack AI-powered fitness application featuring real-time exercise detection, personalized meal planning, intelligent workout recommendations, and a 24/7 virtual fitness coach.

---

## 📊 Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                   FRONTEND (React + Vite)                   │
│  Dashboard | Exercise Detection | Workout | Diet | Coach    │
└──────────────────────┬──────────────────────────────────────┘
                       │
        ┌──────────────┼──────────────┐
        │              │              │
        ▼              ▼              ▼
   ┌─────────┐  ┌────────────┐  ┌──────────┐
   │ Backend │  │  AI Engine │  │ Database │
   │(Express)│  │  (FastAPI) │  │  (Mongo) │
   └─────────┘  └────────────┘  └──────────┘
```

---

## 🛠️ TECH STACK - Detailed Breakdown

### ⚛️ FRONTEND (React + TypeScript + CSS Modules)

#### Core Libraries
| Library | Version | Purpose | Function |
|---------|---------|---------|----------|
| **React** | 18.3.1 | UI Framework | Renders components, manages state with hooks (useState, useEffect, useRef, useContext) |
| **Vite** | 5.4.1 | Build Tool | Fast development server, optimized production builds, HMR (Hot Module Replacement) |
| **React Router DOM** | 6.22.3 | Routing | Client-side navigation - `<Route>`, `<Navigate>`, `useNavigate()` |
| **React Icons** | 5.0.1 | Icons | 7000+ SVG icons from various icon sets (Io, Md, Fa, etc.) |
| **MediaPipe Pose** | Latest (CDN) | Pose Detection | Real-time body pose estimation using ML models |
| **CSS Modules** | Native | Styling | Scoped CSS prevents global conflicts, maintains clean component styling |

#### Key Frontend Functions & Components

**Components (`src/components/`)**
- `Input.jsx` - Reusable text input with label and validation
- `Button.jsx` - Styled button component with variants (primary, outline)
- `Card.jsx` - Container component with consistent padding and shadow
- `Header.jsx` - Top navigation bar with branding
- `Sidebar.jsx` - Navigation menu with theme switching

**Utility Functions (`src/utils/`)**
```javascript
// bmiCalculator.js
calculateBMI(weight, height)           // Formula: weight / (height²)
getBMICategory(bmi)                    // Returns: Underweight/Normal/Overweight/Obese
getBMIColor(bmi)                       // Returns: Color code for BMI category
getRecommendations(bmi, fitnessGoal)   // Returns: Personalized diet/workout suggestions
```

**Screen Components (`src/screens/`)**
- `LoginScreen.jsx` - User authentication with form validation
- `RegisterScreen.jsx` - Account creation with email/password
- `DashboardScreen.jsx` - Main hub with statistics and quick actions
- `ProfileScreen.jsx` - User profile: height, weight, age, fitness goals
- `ExerciseDetectionScreen.jsx` - Real-time pose detection with rep counting
- `WorkoutPlannerScreen.jsx` - Weekly workout scheduling
- `DietPlannerScreen.jsx` - Personalized 7-day meal plans
- `AICoachScreen.jsx` - Chat interface with fitness AI
- `ContactScreen.jsx` - Contact form with email submission

**Key Hooks Used**
```javascript
useState(initialValue)           // Manage component state
useEffect(() => {}, [deps])      // Side effects (API calls, subscriptions)
useRef(element)                  // Direct DOM access (video, canvas)
useNavigate()                    // Programmatic routing
useContext(Context)              // Access theme/user context
```

---

### 🖥️ BACKEND (Node.js + Express + MongoDB)

#### Core Packages
| Package | Version | Purpose | Function |
|---------|---------|---------|----------|
| **Express** | 5.2.1 | Web Framework | Route handling, middleware, HTTP server |
| **Mongoose** | 9.4.1 | ODM | MongoDB schema validation, model definitions |
| **bcryptjs** | 3.0.3 | Password Security | Hash passwords with salt: `bcryptjs.hash(password, 10)` |
| **jsonwebtoken** | 9.0.3 | Authentication | Generate/verify JWT tokens for session management |
| **CORS** | 2.8.6 | Security | Allow cross-origin requests from frontend |
| **dotenv** | 17.4.1 | Config | Load environment variables from `.env` file |
| **MongoDB Memory Server** | 11.0.1 | Test DB | In-memory MongoDB for development/testing |

#### Database Models (`backend/models/`)

**User Model**
```javascript
{
  _id: ObjectId,
  name: String,
  email: String (unique),
  password: String (bcrypt hashed),
  createdAt: Date,
  updatedAt: Date
}
```

#### API Routes (`backend/routes/`)

**Auth Routes** (`auth.js`)
```
POST /api/auth/register
  - Input: { name, email, password }
  - Process: Hash password, create user
  - Output: { token, user }
  - Uses: bcryptjs.hash(), jwt.sign()

POST /api/auth/login
  - Input: { email, password }
  - Process: Find user, compare password, generate token
  - Output: { token, user }
  - Uses: bcryptjs.compare(), jwt.sign()
```

**Middleware** (`middleware/auth.js`)
```javascript
verifyToken(req, res, next)
  - Extracts JWT from headers
  - Validates token signature
  - Attaches user info to request
  - Returns 401 if invalid
```

#### Key Backend Functions
```javascript
// User Registration
hashPassword(password)                 // bcryptjs.hash(password, 10)
generateToken(userId, email)           // jwt.sign({ id, email }, secret)

// Authentication
verifyPassword(inputPassword, hash)     // bcryptjs.compare()
verifyJWT(token)                        // jwt.verify()
```

---

### 🐍 AI ENGINE (FastAPI + Python + NumPy/Pandas)

#### Core Python Packages
| Package | Purpose | Function |
|---------|---------|----------|
| **FastAPI** | Web Framework | High-performance async HTTP server |
| **Uvicorn** | ASGI Server | Production-ready server for FastAPI |
| **NumPy** | Numerical Computing | Array operations, angle calculations |
| **Pandas** | Data Analysis | CSV parsing, filtering, data manipulation |
| **scikit-learn** | ML Tools | TF-IDF vectorization, cosine similarity |
| **Pydantic** | Validation | Request/response data validation |

#### Exercise Detection Engine (`ai-engine/main.py`)

**Core Algorithm: Pose-Based Rep Counting**
```python
def calculate_angle(a, b, c):
    """
    Calculate angle between 3 joints using atan2
    Formula: angle = arctan2((c.y - b.y), (c.x - b.x)) - arctan2((a.y - b.y), (a.x - b.x))
    Returns: Angle in degrees (0-360)
    """

# Exercise Detection Logic
Squat:
  - Tracks: Hip (23) → Knee (25) → Ankle (27)
  - Down: Angle < 100° (deep squat)
  - Up: Angle > 160° (standing)
  - Rep Count: Each up→down→up cycle

Push-Up:
  - Tracks: Shoulder (11) → Elbow (13) → Wrist (15)
  - Down: Angle < 90° (elbow bent)
  - Up: Angle > 160° (arm extended)
  - Rep Count: Each down→up cycle

Plank:
  - Tracks: Shoulder (11) → Hip (23) → Ankle (27)
  - Good Form: Alignment angle 170-180°
  - Feedback: "Perfect Plank!" or "Hips Sagging!"

Lunge:
  - Tracks: Hip → Knee → Ankle (front leg)
  - Similar to squat but single leg

Mountain Climber:
  - Tracks: Plank position + hip height changes
  - Rep: Each knee contraction

Burpee:
  - Multi-stage: Standing → Plank → Jump → Standing

Jumping Jacks:
  - Tracks: Vertical arm position change
```

#### Diet Recommender (`ai-engine/diet_recommender.py`)

**Functions**
```python
class DietRecommender:
    recommend(gender, goal):
        """
        Process:
        1. Load final dataset.csv
        2. Filter by goal (Weight Loss, Weight Gain)
        3. Filter by gender (Male, Female)
        4. Select 7 random rows
        5. Extract meal suggestions for 7 days
        6. Return: {Mon: {meals: [...], daily_targets: {...}}, ...}
        """
```

**Dataset Structure**
```csv
Gender, Activity Level, Dietary Preference, Breakfast, Lunch, Dinner, Snack
Male, Moderately Active, Omnivore, "Vegetable oats...", "Grilled chicken...", ...
```

#### AI Coach Engine (`ai-engine/coach_engine.py`)

**Natural Language Processing (NLP)**
```python
class CoachEngine:
    # Knowledge Base: 10+ fitness topic-response pairs
    
    get_response(user_input):
        1. Tokenize user input
        2. Convert to TF-IDF vector
        3. Calculate cosine_similarity with knowledge base
        4. Find best matching topic
        5. Return response with 15% confidence threshold
```

**Topics Covered**
- Weight loss, muscle building
- Nutrition, hydration, sleep
- Form correction (squat, pushup)
- Motivation, workout planning
- General fitness Q&A

#### WebSocket Endpoint
```python
@app.websocket("/ws/pose")
    Connected client sends: { landmarks: [...], exercise: "squat" }
    Server returns: { rep_count: 5, status: "active", message: "..." }
    Real-time update frequency: ~30fps
```

---

## 📱 USER FLOWS

### 1. Authentication Flow
```
User → Register/Login
  ↓
Validate credentials (Email/Password)
  ↓
Hash password (bcryptjs)
  ↓
Generate JWT token
  ↓
Store token in localStorage
  ↓
Redirect to Dashboard
```

### 2. Exercise Detection Flow
```
User → Select Exercise
  ↓
Start Camera (MediaPipe loads)
  ↓
Live video stream to canvas
  ↓
Extract pose landmarks (33 keypoints)
  ↓
Send to WebSocket: /ws/pose
  ↓
Backend calculates angles
  ↓
Determine rep stage (up/down)
  ↓
Count rep + Send feedback
  ↓
Display real-time rep count
```

### 3. Personalization Flow
```
User Creates Profile (Height, Weight, Age, Goal)
  ↓
Calculate BMI: weight / (height_in_meters²)
  ↓
Determine BMI Category (Underweight/Normal/Overweight/Obese)
  ↓
Generate Recommendations (Diet goal, Workout intensity)
  ↓
Auto-select exercises based on difficulty
  ↓
Pre-fill diet/workout plans with recommendations
```

### 4. Diet Recommendation Flow
```
User Selects Goal (Fat Loss / Muscle Gain)
  ↓
Request to API: POST /api/diet/recommend
  ↓
Backend filters dataset by goal + gender
  ↓
Select 7 random matching rows
  ↓
Extract meals for 7 days
  ↓
Return macro targets (calories, protein, carbs, fat)
  ↓
Display in UI with daily breakdowns
```

---

## 🔐 SECURITY FEATURES

| Feature | Implementation | Purpose |
|---------|---|---------|
| **Password Hashing** | bcryptjs with salt factor 10 | Never store plain passwords |
| **JWT Authentication** | Token-based session | Stateless, scalable auth |
| **CORS** | Restrict origins to frontend domain | Prevent unauthorized requests |
| **Environment Variables** | `.env` file for secrets | Don't expose API keys in code |
| **HTTPOnly Cookies** | Store tokens securely | Protect against XSS attacks |

---

## 📊 STATE MANAGEMENT

### Frontend State
```javascript
// Component State (useState)
const [profile, setProfile] = useState(null)
const [goal, setGoal] = useState('fat-loss')
const [repCount, setRepCount] = useState(0)

// LocalStorage Persistence
localStorage.setItem('fitverse_user', JSON.stringify(user))
localStorage.setItem('fitverse_token', token)
localStorage.setItem('fitverse_profile', JSON.stringify(profile))
localStorage.setItem('fitverse_theme', 'dark')
```

### Backend State
```javascript
// In-Memory (Development)
let users = []  // Stored in memory, cleared on server restart

// Production (MongoDB)
db.users.find({ email: "user@example.com" })
```

---

## 🚀 PERFORMANCE OPTIMIZATIONS

| Optimization | Where | Impact |
|---|---|---|
| **Code Splitting** | Vite bundler | Lazy load routes, smaller initial bundle |
| **Image Lazy Loading** | HTML img tags | Defer loading off-screen images |
| **CSS Modules** | Component styling | Only load relevant CSS per component |
| **Async/Await** | Backend routes | Non-blocking I/O operations |
| **WebSocket** | Exercise detection | Real-time low-latency communication |
| **FastAPI Async** | Python routes | Handle multiple concurrent requests |

---

## 📡 DATA FLOW EXAMPLE: Rep Counting

```
1. Frontend (ExerciseDetectionScreen.jsx)
   - VideoElement captures frame
   - Pose.onResults() extracts 33 landmarks
   - Sends to WebSocket: { landmarks: [...], exercise: "squat" }

2. Backend (ai-engine/main.py)
   @app.websocket("/ws/pose")
   - Receives landmarks
   - calculate_angle(hip, knee, ankle) = 85°
   - stage = "down"
   - Sends: { rep_count: 5, message: "Good Depth! Push UP!" }

3. Frontend
   - Receives message via WebSocket.onmessage()
   - Updates setRepCount(5)
   - Renders: <span>5 reps</span>
```

---

## 🔄 API COMMUNICATION

### REST Endpoints
```javascript
// Frontend makes fetch requests

const response = await fetch(`${VITE_BACKEND_URL}/api/diet/recommend`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ goal: 'fat-loss', gender: 'Male' })
});

const data = await response.json();
```

### WebSocket Communication
```javascript
// Real-time bidirectional connection

const ws = new WebSocket(`${VITE_AI_ENGINE_URL.replace('http', 'ws')}/ws/pose`);

ws.onopen = () => console.log('Connected');
ws.send(JSON.stringify({ landmarks: [...], exercise: 'squat' }));
ws.onmessage = (event) => {
  const data = JSON.parse(event.data);
  console.log(data.rep_count);
};
```

---

## 📂 PROJECT STRUCTURE

```
Fitverse/
├── src/                          # Frontend source
│   ├── components/               # Reusable UI components
│   │   ├── Button.jsx
│   │   ├── Input.jsx
│   │   ├── Card.jsx
│   │   ├── Sidebar.jsx
│   │   └── Header.jsx
│   ├── screens/                  # Page components
│   │   ├── LoginScreen.jsx
│   │   ├── DashboardScreen.jsx
│   │   ├── ExerciseDetectionScreen.jsx
│   │   ├── DietPlannerScreen.jsx
│   │   ├── WorkoutPlannerScreen.jsx
│   │   ├── AICoachScreen.jsx
│   │   ├── ProfileScreen.jsx
│   │   └── ContactScreen.jsx
│   ├── layout/                   # Layout components
│   │   └── MainLayout.jsx
│   ├── utils/                    # Utility functions
│   │   └── bmiCalculator.js
│   ├── App.jsx                   # Main app component
│   ├── main.jsx                  # React entry point
│   └── index.css                 # Global styles
│
├── backend/                      # Node.js backend
│   ├── server.js                 # Express server entry
│   ├── models/
│   │   └── User.js              # MongoDB user schema
│   ├── routes/
│   │   └── auth.js              # Authentication endpoints
│   └── middleware/
│       └── auth.js              # JWT verification
│
├── ai-engine/                    # Python AI/FastAPI
│   ├── main.py                   # FastAPI server + WebSocket
│   ├── diet_recommender.py       # Diet recommendation logic
│   ├── coach_engine.py           # NLP chatbot
│   └── requirements.txt          # Python dependencies
│
├── final dataset.csv             # Meal planning dataset
├── package.json                  # Frontend dependencies
├── vite.config.js                # Vite configuration
└── README.md                     # Documentation
```

---

## 🚀 HOW TO RUN LOCALLY

### 1. Install Dependencies
```bash
npm install
cd backend && npm install
cd ../ai-engine && pip install -r requirements.txt
```

### 2. Set Environment Variables
Create `.env.local` in root:
```
VITE_BACKEND_URL=http://localhost:3001
VITE_AI_ENGINE_URL=http://localhost:8000
```

### 3. Start All Services
```bash
# Terminal 1 - Frontend
npm run dev          # http://localhost:5174

# Terminal 2 - Backend
node backend/server.js  # http://localhost:3001

# Terminal 3 - AI Engine
python -m uvicorn ai-engine/main:app --host 0.0.0.0 --port 8000
```

---

## 🎯 KEY ALGORITHMS

### BMI Calculation
```
BMI = Weight (kg) / Height (m)²
Example: 70kg / (1.7m)² = 24.22
Categories: <18.5 (Underweight), 18.5-25 (Normal), 25-30 (Overweight), >30 (Obese)
```

### Rep Counting Algorithm
```
1. Get 3D coordinates of 2 joints + 1 pivot point
2. Calculate angle using atan2 (arctangent of y/x)
3. Compare current angle with threshold
4. Transition between "up" and "down" states
5. Increment rep count on full cycle
```

### TF-IDF Text Similarity (NLP)
```
1. Tokenize user input
2. Convert to term frequency-inverse document frequency vector
3. Calculate cosine similarity with knowledge base topics
4. Return response with highest similarity score
```

---

## 📊 SCALABILITY

### Current Setup (Development)
- In-memory MongoDB
- Single server instance
- Local storage

### Production Setup (Recommended)
- **Database**: MongoDB Atlas (cloud)
- **Backend**: Heroku/Railway/AWS (auto-scaling)
- **AI Engine**: Cloud Run/Railway (serverless)
- **Frontend**: Netlify/Vercel (CDN)
- **Storage**: AWS S3 (user data)
- **Cache**: Redis (session management)

---

## 🤝 TECHNOLOGY INTERACTIONS

```
User Action → React Component → State Update
         ↓
     API Call (REST/WebSocket)
         ↓
Backend/AI Processing
         ↓
Database Query (if needed)
         ↓
Response Return
         ↓
Frontend Render Update
         ↓
User Sees Result
```

---

## 📚 DEPENDENCIES SUMMARY

**Total Packages:**
- Frontend: ~20 packages
- Backend: ~15 packages
- AI Engine: ~10 packages

**Total Bundle Size:** ~15MB (with MediaPipe models)

---

## ✅ TESTING & QUALITY

- **ESLint**: Code quality enforcement
- **Console Errors**: Caught in DevTools
- **Form Validation**: Client-side + Server-side
- **Error Handling**: Try-catch blocks throughout

---

**Version:** 1.0.0  
**Last Updated:** April 7, 2026  
**Team:** FitVerse Development
