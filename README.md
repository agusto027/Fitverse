# FitVerse - AI-Powered Fitness Platform

A comprehensive fitness application with AI-powered features for personalized workout tracking, exercise form detection, meal planning, and a 24/7 virtual fitness coach.

---

## 🚀 How to Use This Website

### Getting Started

1. **Open the Website**
   - Navigate to `http://localhost:5174` in your web browser

2. **Create an Account or Sign In**
   - Click "Sign up" to create a new account with your name, email, and password
   - Or sign in with existing credentials
   - Minimum password length: 6 characters

3. **Dashboard**
   - View your fitness statistics (workouts completed, last workout)
   - Access quick action cards to navigate to different features
   - Read daily fitness reminders and tips

### Features Overview

#### 📹 Exercise Detection
- Start your camera to enable AI-powered pose detection
- Select from exercises: Squat, Push-up, or Plank
- Real-time feedback on form and technique
- Automatic rep counting as you perform exercises
- Supported browsers: Chrome, Firefox, Edge (with camera permissions)

#### 💪 Workout Planner
- Create and manage personalized workout routines
- Weekly workout scheduling
- Track completed workouts
- View detailed exercise information and instructions

#### 🍽️ Diet Planner
- Get personalized meal plans based on your goals
- Choose between Fat Loss or Muscle Gain plans
- Daily meal breakdown: Breakfast, Lunch, Dinner, Snacks
- Macro tracking (Calories, Protein, Carbs, Fat)
- 7-day meal recommendations

#### 🤖 AI Coach
- Chat with your personal fitness AI assistant
- Get answers to fitness questions
- Form correction guidance
- Motivation and accountability support
- Available 24/7

#### ⚙️ Settings
- **Theme Settings**: Toggle between Dark, Light, or System theme
- **Account Menu**: View profile and sign out
- **Contact Us**: Email for inquiries :
- samrajnee05@gmail.com
- sanjanav0610@gmail.com

### Navigation
- Use the sidebar to navigate between features
- Mobile users can toggle the menu with the hamburger icon
- Sidebar closes automatically after selecting a feature on mobile

---

## 🛠️ Tech Stack

### Frontend
- **React** (18.3.1) - UI library for building interactive components
- **Vite** (5.4.1) - Fast build tool and development server
- **React Router DOM** (6.22.3) - Client-side routing and navigation
- **React Icons** (5.0.1) - Icon library for UI elements
- **CSS Modules** - Scoped styling for component isolation
- **MediaPipe Pose** (via CDN) - Real-time pose estimation for exercise detection

### Backend
- **Node.js** - JavaScript runtime environment
- **Express** (5.2.1) - Web server framework
- **MongoDB Memory Server** (11.0.1) - In-memory MongoDB for development
- **Mongoose** (9.4.1) - MongoDB object modeling
- **bcryptjs** (3.0.3) - Password hashing and security
- **JSON Web Tokens (JWT)** (9.0.3) - Authentication tokens
- **CORS** (2.8.6) - Cross-origin resource sharing
- **dotenv** (17.4.1) - Environment variable management

### AI Engine
- **FastAPI** (0.135.2) - High-performance Python web framework
- **Uvicorn** - ASGI server for FastAPI
- **NumPy** - Numerical computing
- **Pandas** (9.4.1) - Data manipulation and analysis
- **scikit-learn** - Machine learning utilities
- **Python 3.13** - Programming language

### Development Tools
- **ESLint** (9.9.0) - Code quality and linting
- **Vite React Plugin** (4.3.1) - React optimization for Vite
- **npm** - Package manager

---

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

## 📞 Support

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
