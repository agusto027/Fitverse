# FitVerse - AI-Powered Fitness Platform

A comprehensive fitness application with AI-powered features for personalized workout tracking, exercise form detection, meal planning, and a 24/7 virtual fitness coach.

> **📖 For Detailed Technical Documentation:** See [README_DETAILED.md](README_DETAILED.md) for comprehensive tech stack, architecture, algorithms, and functions explanation.

---

## 🚀 Quick Start

### Getting Started

1. **Open the Website**
   - Navigate to `http://localhost:5179` in your web browser (or the displayed port)

2. **Create an Account or Sign In**
   - Click "Sign up" to create a new account with your name, email, and password
   - Or sign in with existing credentials
   - Minimum password length: 6 characters

3. **Complete Your Profile**
   - Go to "My Profile" in the sidebar
   - Enter your height (cm), weight (kg), and age
   - Select your fitness goal (Build Muscle, Lose Weight, or Maintain)
   - This personalizes all recommendations!

4. **Dashboard**
   - View your fitness statistics (workouts completed, last workout)
   - Access quick action cards to navigate to different features
   - Read daily fitness reminders and tips

### Features Overview

#### 📹 Exercise Detection
- Start your camera to enable AI-powered pose detection
- 7 exercises available (difficulty-based on your profile)
- Real-time feedback on form and technique
- Automatic rep counting using MediaPipe Pose landmarks
- **Advanced exercises**: Squat, Push-up, Lunge, Burpee, Mountain Climber
- **Beginner exercises**: Plank, Marching in Place, Jumping Jacks
- Supported browsers: Chrome, Firefox, Edge (with camera permissions)

#### 💪 Workout Planner
- Create and manage personalized workout routines
- **3 difficulty levels**: Beginner, Intermediate, Advanced (based on your BMI & age)
- **3 workout types**: Fat Loss (HIIT), Muscle Gain (Strength), Maintain (Balanced)
- Weekly workout scheduling with progress tracking
- Track completed workouts and view detailed exercise instructions

#### 🍽️ Diet Planner
- Get personalized meal plans based on your profile data (BMI, age, goals)
- **3 diet goals**: Fat Loss (deficit), Muscle Gain (surplus), Maintain (balanced)
- Daily meal breakdown: Breakfast, Lunch, Dinner, Snacks
- Macro tracking: Calories, Protein, Carbs, Fat, Sodium
- 7-day meal recommendations sourced from AI analysis

#### 🤖 AI Coach
- Chat with your personal fitness AI assistant (24/7 availability)
- Uses NLP (Natural Language Processing) to understand your questions
- Get answers to: nutrition, form, motivation, workout planning
- Powered by TF-IDF similarity matching with fitness knowledge base
- Available topics: weight loss, muscle building, sleep, motivation, form correction

#### 👤 My Profile
- Store and update your fitness profile
- Height, Weight, Age, and Fitness Goal
- Real-time BMI calculation with color-coded categories
- Personalizes all recommendations (Diet, Workout, Exercise Detection)

#### ⚙️ Settings
- **Theme Settings**: Toggle between Dark, Light, or System theme
- **Account Menu**: View profile and sign out
- **Contact Us**: Email for inquiries:
  - samrajnee05@gmail.com
  - sanjanav0610@gmail.com

### Navigation
- Use the sidebar to navigate between features
- Mobile users can toggle the menu with the hamburger icon
- Sidebar closes automatically after selecting a feature on mobile

---

## 🏗️ HOW IT WORKS - Technology Overview

### Frontend (React + Vite)
Renders interactive UI components with real-time state management
- **React Hooks**: useState (state), useEffect (side effects), useRef (DOM access)
- **Routing**: React Router for navigation between screens
- **Styling**: CSS Modules for scoped, component-specific styles
- **Icons**: React Icons library for consistent UI elements
- **Storage**: localStorage for user session persistence

### Backend (Node.js + Express)
HTTP server handling authentication and data management
- **Authentication**: JWT tokens + bcryptjs password hashing
- **API Routes**: /auth/register, /auth/login
- **Database**: MongoDB (in-memory for dev, Atlas for production)
- **Security**: CORS, environment variables, token verification

### AI Engine (FastAPI + Python)
Real-time AI processing for exercise detection and recommendations
- **Exercise Detection**: MediaPipe Pose + angle calculations for rep counting
  - Calculates angles between joints using trigonometry (atan2)
  - Tracks state transitions (up/down/active/idle)
  - Outputs: rep count, feedback message, form corrections
- **Diet Recommendation**: Pandas DataFrame filtering based on user profile
- **AI Coach**: scikit-learn TF-IDF vectorization + cosine similarity for NLP
- **WebSocket**: Real-time bidirectional communication for live exercise feedback

### Data Flow Example: Exercise Detection
```
User → Start Camera → MediaPipe extracts 33 body landmarks → Send to WebSocket
→ Backend calculates joint angles → Determines rep stage → Returns feedback
→ Frontend updates rep count display
```

---

## 🛠️ Tech Stack (Quick Overview)

### Frontend
- **React 18.3.1** - Component-based UI with hooks
- **Vite 5.4.1** - Lightning-fast dev server & build tool
- **React Router 6.22.3** - Client-side navigation & routing
- **React Icons 5.0.1** - 7000+ SVG icons
- **CSS Modules** - Scoped component styling
- **MediaPipe Pose (CDN)** - Real-time pose detection ML model

### Backend
- **Node.js** - JavaScript runtime
- **Express 5.2.1** - Web server framework
- **Mongoose 9.4.1** - MongoDB object mapper with validation
- **bcryptjs 3.0.3** - Secure password hashing
- **JWT 9.0.3** - Token-based authentication
- **CORS** - Cross-origin request handling

### AI Engine
- **FastAPI 0.135.2** - High-performance Python web framework
- **Uvicorn** - ASGI server for async processing
- **NumPy** - Mathematical calculations (angle math, trigonometry)
- **Pandas 2.x** - CSV parsing & data filtering
- **scikit-learn** - TF-IDF vectorization for NLP

### Database
- **MongoDB Memory Server** (dev) - In-memory testing
- **MongoDB Atlas** (production) - Cloud database

### Key Algorithms Used
| Algorithm | Purpose | Where |
|-----------|---------|-------|
| **BMI Calculation** | User fitness level assessment | Frontend (bmiCalculator.js) |
| **Pose Angle Calculation** | Rep counting & form detection | Backend (atan2 trigonometry) |
| **TF-IDF + Cosine Similarity** | AI coaching response matching | Backend (coach_engine.py) |
| **CSV DataFrame Filtering** | Diet recommendation | Backend (diet_recommender.py) |
| **Password Hashing (bcrypt)** | Secure authentication | Backend (bcryptjs) |

---

> **For deep-dive into functions, architecture, data flows, and algorithms → See [README_DETAILED.md](README_DETAILED.md)**

## 📋 System Requirements

### Frontend
- Modern web browser with JavaScript enabled
- Camera access for Exercise Detection feature
- Minimum 2GB RAM

### Backend
- Node.js 14+ installed
- npm or yarn package manager

### AI Engine
- Python 3.13+
- pip package manager
- 4GB RAM recommended

---

## 🎯 Key Components

### Authentication
- Secure login/registration with email and password
- JWT token-based session management
- Password hashing with bcryptjs

### Real-Time Features
- WebSocket connection for live exercise rep counting
- Real-time pose detection feedback
- Instant form correction messages

### Personalization
- User profile management
- Theme preference saving (Dark/Light/System)
- Personalized meal plans based on fitness goals

---

## 📌 Default Test Credentials

**Email:** test@example.com  
**Password:** password123

Or create your own account during registration.

---

## 🔗 API Endpoints

| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | `/api/auth/register` | User registration |
| POST | `/api/auth/login` | User login |
| GET | `/api/user/profile` | Get user profile |
| POST | `/api/diet/recommend` | Get diet recommendations |
| POST | `/api/coach/chat` | Chat with AI Coach |
| WS | `/ws/pose` | Real-time exercise detection |

---

## 💡 Tips for Best Results

### Exercise Detection
- Ensure good lighting in your room
- Wear fitted clothing for accurate body tracking
- Keep your full body visible in the camera frame
- Maintain 2-3 meters distance from camera for optimal detection

### Diet Planning
- Update your fitness goals for personalized recommendations
- Track daily macro intake for better results
- Adjust meal portions based on your preferences

### AI Coach
- Ask specific fitness questions for better responses
- Use the coach for form corrections and workout advice
- Request motivation and accountability support

---

## � Deployment on Netlify

### Environment Variables Required

The frontend needs these environment variables to connect to your backend and AI engine:

```
VITE_BACKEND_URL=https://your-backend-url.herokuapp.com
VITE_AI_ENGINE_URL=https://your-ai-engine-url.herokuapp.com
```

### Steps to Deploy on Netlify

1. **Push to GitHub** (already done ✓)
   - Repository: https://github.com/agusto027/Fitverse

2. **Set Up Netlify**
   - Go to https://app.netlify.com
   - Click "New site from Git"
   - Select GitHub and authorize
   - Choose the `Fitverse` repository

3. **Configure Build Settings**
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`

4. **Set Environment Variables in Netlify**
   - Go to Site settings → Build & deploy → Environment
   - Click "Edit variables"
   - Add the following:
     - Key: `VITE_BACKEND_URL` | Value: `https://your-backend-deployed-url`
     - Key: `VITE_AI_ENGINE_URL` | Value: `https://your-ai-engine-deployed-url`

5. **Deploy**
   - Netlify will automatically deploy when you push to GitHub
   - Or manually trigger deployment from Netlify dashboard

### Deploying Backend (Node.js)

Recommended platforms: Heroku, Railway, or AWS

**Environment variables needed:**
```
PORT=3001
MONGODB_URI=your-mongodb-connection-string
JWT_SECRET=your-secret-key
```

### Deploying AI Engine (Python/FastAPI)

Recommended platforms: Heroku, Railway, Google Cloud Run, or AWS

**Requirements:**
- Python 3.13+
- All packages from `requirements.txt`

---

## 📌 Local Development Setup

1. **Create `.env.local` file:**
   ```
   VITE_BACKEND_URL=http://localhost:3001
   VITE_AI_ENGINE_URL=http://localhost:8000
   ```

2. **Install dependencies:**
   ```
   npm install
   cd backend && npm install
   ```

3. **Run all services:**
   - Frontend: `npm run dev` (port 5174)
   - Backend: `node backend/server.js` (port 3001)
   - AI Engine: `python -m uvicorn ai-engine/main:app --host 0.0.0.0 --port 8000`

---

For issues or inquiries:
- Click "Contact Us" in the sidebar
- Email: samrajnee05@gmail.com
- Check the AI Coach for fitness-related questions

---

## 📄 License

This project is created for educational and fitness purposes.

---

**Last Updated:** April 2026  
**Version:** 1.0.0
