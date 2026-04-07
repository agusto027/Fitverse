# FitVerse - Simple Explanation for Everyone 🏋️

## What is FitVerse?

Think of FitVerse like having a **personal fitness trainer, nutritionist, and coach all in one app** on your phone!

### The 3 Main Parts:

1. **Your Computer (Frontend)** 💻
   - This is the app you see on your screen
   - Shows buttons, images, meal plans, workouts
   - Built with React (a tool for making interactive websites)

2. **Your Server (Backend)** 🖥️
   - This is like a filing cabinet that stores all your data
   - Keeps track of: your login info, fitness goals, progress
   - Built with Node.js (a tool for managing server data)

3. **The AI Brain (Python Engine)** 🧠
   - This is the smart part that counts your exercise reps
   - Gives you personalized meal recommendations
   - Answers your fitness questions like a coach
   - Built with Python and FastAPI

---

## How Does FitVerse Work? (Simple Step-by-Step)

### Step 1: You Sign Up
```
You enter: Name, Email, Password
   ↓
App encrypts your password (scrambles it so thieves can't read it)
   ↓
Your info is saved in the database (filing cabinet)
   ↓
You get a special "token" (like a concert ticket) that proves you're logged in
```

### Step 2: You Set Your Profile
```
You enter: Height, Weight, Age, Goal (Build Muscle/Lose Weight/Stay Healthy)
   ↓
App calculates your BMI (Body Mass Index - how heavy you are for your height)
   ↓
App remembers these for EVERYTHING ELSE
```

### Step 3: You Use Exercise Detection
```
You turn on your camera
   ↓
The app uses "MediaPipe" - a smart camera system that can "see" your body
   ↓
It tracks 33 points on your body (shoulders, elbows, knees, etc.)
   ↓
The app measures angles between these points
   ↓
When you complete a full squat: ANGLE CHANGES → App counts "1 rep!"
   ↓
You see real-time feedback: "Good form! Keep going!"
```

### Step 4: You Get Custom Diet Plans
```
You click "Diet Planner"
   ↓
App asks: "What's your goal?" (Fat Loss / Muscle Gain / Maintain)
   ↓
App searches through a giant meal database
   ↓
Finds meals that match YOUR goal + age + weight
   ↓
Shows you 7 days of meals with calories and nutrition
```

### Step 5: You Get Custom Workouts
```
App looks at your BMI and age
   ↓
If you're beginner: shows easier exercises (squats, plank, marching)
   ↓
If you're advanced: shows harder exercises (burpees, mountain climbers)
   ↓
You pick which workouts and track your progress
```

### Step 6: You Chat with AI Coach
```
You ask: "How do I do a proper push-up?"
   ↓
App reads your question and looks in its "knowledge base" (like Google)
   ↓
Uses math to find the closest matching question it knows
   ↓
Returns the best answer
```

---

## The Tools That Power FitVerse

### Frontend Tools (What You See) 👀
| Tool | What It Does | Real-World Example |
|------|-------------|-------------------|
| **React** | Makes interactive buttons, screens, forms | Like building blocks for a website |
| **Vite** | Makes the app fast | Like a sports car vs a regular car |
| **React Router** | Lets you jump between screens | Like the Menu in a restaurant app |
| **CSS Modules** | Makes things look pretty | Like paint and decorations |
| **MediaPipe** | Sees your body through camera | Like having a smart security camera |

### Backend Tools (The Filing Cabinet) 🗄️
| Tool | What It Does | Real-World Example |
|------|-------------|-------------------|
| **Express** | Organizes requests from the app | Like a post office sorting mail |
| **MongoDB** | Stores all your data | Like a digital filing cabinet |
| **bcryptjs** | Scrambles passwords | Like a secret code |
| **JWT Tokens** | Proves you're logged in | Like showing your ID card |

### AI Brain Tools (The Smart Part) 🧠
| Tool | What It Does | Real-World Example |
|------|-------------|-------------------|
| **FastAPI** | Fast server for AI tasks | Like an express lane |
| **Python** | Language for AI/math | Like using a calculator |
| **NumPy** | Does math with angles | Like a scientific calculator |
| **Pandas** | Works with meal data | Like Excel spreadsheet |
| **scikit-learn** | Helps AI understand questions | Like a dictionary for the AI |

---

## How the App Knows What to Recommend

### 1. BMI Calculation (How Fit Are You?)
```
Simple Math:
   Your Weight (kg) ÷ (Your Height in meters × Your Height in meters)
   
Example: 
   70 kg ÷ (1.7 × 1.7) = 24.2
   
What this means:
   Less than 18.5 = Underweight (need to eat more)
   18.5 to 25 = Perfect weight ✓
   25 to 30 = Overweight (need more cardio)
   More than 30 = Obese (need professional help)
```

### 2. Exercise Recommendation (Which Exercises Should I Do?)
```
App Thinks:
   IF Age < 40 AND BMI < 25
      → You're advanced → Show burpees, mountain climbers
   
   ELSE IF Age < 50 AND BMI < 30
      → You're intermediate → Show push-ups, lunges
   
   ELSE
      → You're beginner → Show squats, plank, marching
```

### 3. Meal Recommendation (What Should I Eat?)
```
App searches the meal database:
   Filter by: Your Goal (Muscle Gain = eat more, Fat Loss = eat less)
   Filter by: Your Gender
   Filter by: Your Activity Level
   
   Then picks 7 random meals that match
   
   Shows you: Breakfast/Lunch/Dinner/Snacks + Calories
```

### 4. AI Coach Response (What's Your Question?)
```
You ask: "How do I build muscle?"

App does:
   Converts your words to a number (math magic)
   Searches knowledge base (database of fitness tips)
   Finds the closest matching question
   Returns the best answer
   
Like: Searching Google but smarter!
```

---

## How Exercise Rep Counting Works ⚙️

### The Magic Behind Exercise Detection:

**What is MediaPipe?**
- It's a super smart camera system that can "see" 33 different body points
- Points tracked: Head, Shoulders, Elbows, Wrists, Hips, Knees, Ankles, etc.
- Works in real-time (like 30 pictures per second)

**How Does It Count Reps?**

**For a Squat:**
```
App measures the angle of your knee

Standing up:    Knee angle = 170° (almost straight)
   ↓
Squatting down: Knee angle = 80° (very bent)
   ↓
Standing up:    Knee angle = 170° (straight again)
   ↓
App counts: "That's 1 rep!" ✓
```

**For a Push-up:**
```
App measures your elbow

Arms stretched: Elbow angle = 160°
   ↓
Chest down:     Elbow angle = 90°
   ↓
Arms stretched: Elbow angle = 160°
   ↓
App counts: "That's 1 rep!" ✓
```

**For a Plank:**
```
App checks if your body is straight

Good form (straight):    Keeps saying "Perfect Plank!"
Bad form (hips down):    Says "Hips are sagging - raise them!"
```

---

## What Happens With Your Data? 🔐

### Where Is Your Data Stored?

1. **When You Login**
   - Your email and password are encrypted (scrambled)
   - Stored in database (not in plain text)
   - You get a secret "token" that acts like your ID

2. **Your Profile**
   - Height, weight, age → Saved in database
   - Profile picture → Would be saved
   - Fitness goals → Saved for recommendations

3. **Your Progress**
   - Workouts completed → Could be saved
   - Meals logged → Could be saved
   - Exercises done → Could be saved

### Is My Data Safe?
✅ **Yes, because:**
- Passwords are encrypted (scrambled)
- Your token proves you logged in (changes daily)
- Only you can access your data (server checks your token)

---

## The 7 Exercises Explained 💪

### Beginner (Easier)
1. **Squat** - Bend knees, go down, come back up
   - What it works: Legs and core
   - Rep counted: When you go down and come back up = 1 rep

2. **Plank** - Hold a straight push-up position
   - What it works: Core (stomach)
   - Rep counted: Time held (not traditional reps)

3. **Marching** - Lift knees while standing in place
   - What it works: Cardio, legs
   - Rep counted: Each knee lift = 1 rep

### Intermediate (Medium)
4. **Push-up** - Hands down, lower body, push back up
   - What it works: Chest, arms, core
   - Rep counted: Each down-up = 1 rep

5. **Lunge** - Step forward, bend knees, step back
   - What it works: Legs, balance
   - Rep counted: Each leg = 1 rep

6. **Jumping Jacks** - Jump with arms and legs moving
   - What it works: Full body cardio
   - Rep counted: Each complete movement = 1 rep

### Advanced (Harder)
7. **Burpee** - Squat + push-up + jump
   - What it works: Everything!
   - Rep counted: Complete squat-to-jump = 1 rep

8. **Mountain Climber** - Plank position + knees up
   - What it works: Core and cardio
   - Rep counted: Each knee move = 1 rep

---

## Technology Made Simple 🎓

### What Does Each Technology Do?

**React** = The Website Maker
- Makes the buttons, screens, and forms you click on
- Like HTML (text documents) but interactive
- Updates instantly when you click something

**Node.js** = The Task Runner
- Runs JavaScript on a server (not just in browser)
- Manages your login, saves your data
- Like a waiter taking your order and giving it to the kitchen

**Python** = The Math Expert
- Calculates exercise angles
- Finds meal recommendations
- Powers the AI coach that answers questions
- Especially good at math and AI

**MongoDB** = The Digital Filing Cabinet
- Stores all your data
- Different from Excel (more flexible)
- Like a smart filing system

**JWT Token** = Your Digital ID Card
- Proves you're logged in without a password every time
- Like a concert wristband - shows you paid
- Expires after some time (for security)

**bcryptjs** = The Password Scrambler
- Makes your password unreadable
- Even if someone steals the database, they can't read your password
- Like writing in code

---

## Simple Data Flow Examples

### Example 1: Counting Your Squats
```
1. You: Turn on camera and select "Squat"
2. Camera: Records your body movements
3. App: "I see you squatting"
4. Math: Measures your knee angle → 170° → 80° → 170°
5. App: Says "That's 1 rep! Great form!"
6. You: See "+1 rep" on screen
```

### Example 2: Getting a Meal Plan
```
1. You: Click "Diet Planner"
2. You: Choose "Fat Loss"
3. App: Searches database for meals marked "Fat Loss"
4. App: Picks 7 meals for the week
5. App: Shows meals + calories + nutrition
6. You: See your custom meal plan
```

### Example 3: Asking the AI Coach
```
1. You: Type "How do I lose weight fast?"
2. App: Reads your question
3. App: Compares to knowledge base
4. App: Finds best matching answer
5. App: Responds: "Create a calorie deficit with cardio..."
6. You: Read the helpful answer
```

---

## Simple Setup Guide 🚀

### What You Need to Download
1. **Node.js** - For the server
2. **Python 3.13** - For the AI
3. **Visual Studio Code** - For editing code (optional)

### Three Things to Start
```
1. Frontend (The App You See)
   npm run dev
   Opens at: http://localhost:5179

2. Backend (The Server)
   node backend/server.js
   Runs at: http://localhost:3001

3. AI Brain (The Smart Part)
   python -m uvicorn ai-engine/main:app --port 8000
   Runs at: http://localhost:8000
```

### What Each One Does
| Part | Does What | Like What? |
|------|-----------|-----------|
| Frontend | Shows screens and buttons | Restaurant menu |
| Backend | Stores data and manages logins | Restaurant kitchen |
| AI Brain | Counts reps and answers questions | Restaurant chef |

---

## How to Use FitVerse 📱

### Step 1: Create Account
- Enter name, email, password
- Password gets encrypted (secured)
- You're logged in!

### Step 2: Fill Your Profile
- Height, Weight, Age
- Fitness goal (Build/Lose/Maintain)
- App uses this for ALL recommendations

### Step 3: Pick an Exercise
- App suggests based on your fitness level
- Turn on camera
- Do exercise while watching feedback
- App counts reps automatically

### Step 4: Get Meal Plan
- Choose your goal
- Get 7 days of meals
- See calories and nutrition
- Different meals based on your profile

### Step 5: Chat with Coach
- Ask any fitness question
- Coach gives personalized answer
- Available 24/7!

---

## Troubleshooting 🔧

**"Exercise isn't counting reps"**
- Make sure lighting is good
- Stand further from camera (2-3 meters)
- Wear fitted clothing so camera can see your body

**"Meal plan doesn't match my goal"**
- Check your profile - update if wrong
- Regenerate the plan (it picks random meals)
- Try again and you'll get different options

**"AI Coach isn't understanding me"**
- Ask more specific fitness questions
- Use simpler words
- Ask about: workouts, diet, form, motivation

**"App is slow"**
- Refresh the page
- Close other apps
- Make sure all 3 servers are running

---

## What's the Database? (The Filing Cabinet) 🗄️

The database stores information like:

```
User Data:
├── Name: John Doe
├── Email: john@example.com
├── Password: (encrypted - looks like: $2b$10$aBc123...)
├── Created: April 7, 2026
└── Last Login: Today

Profile Data:
├── Height: 180 cm
├── Weight: 75 kg
├── Age: 28
└── Goal: Build Muscle

Workout History:
├── Workout 1: Squats (10 reps)
├── Workout 2: Push-ups (15 reps)
└── Workout 3: Planks (45 seconds)
```

---

## Important Concepts Explained 💡

### What is a JWT Token?
Think of it like a concert wristband:
- You show ID at entry, get wristband
- Wristband proves you paid (without showing ID every time)
- One per person, one per visit
- After concert: wristband expires

### What is Encryption?
Think of it like a secret code:
- Original: `password123`
- Encrypted: `$2b$10$aBcDeFgHiJkLmNoPqRsTuVwXyZ`
- Only the app knows the code
- Even database admin can't read it

### What is MD5 Hash?
Think of it like a fingerprint:
- Different input = different output
- Same input = same output (always)
- One-way (can't reverse it)
- Used to verify passwords

### What is API?
Think of it like a menu at a restaurant:
- You order (make a request)
- Kitchen processes (server works)
- Food comes out (you get response)
- API = the ordering system

### What is WebSocket?
Think of it like a phone call:
- Regular API = Email (one-way, takes time)
- WebSocket = Phone call (real-time, both ways)
- Used for exercise reps (needs instant updates)

---

## The Bottom Line 🎯

**FitVerse = Three Things Working Together**

1. **Frontend** shows you the app
2. **Backend** remembers your data
3. **AI Brain** counts reps and gives advice

All three talk to each other to give you:
- ✅ Custom workouts based on YOUR fitness level
- ✅ Custom meals based on YOUR goals
- ✅ Real-time exercise coaching
- ✅ 24/7 AI fitness assistant

---

## Questions? 🤔

The AI Coach in the app can answer most fitness questions!
Or contact: sanjanav0610@gmail.com or samrajnee05@gmail.com

---

**Created: April 2026**
**For: Everyone (No coding knowledge needed!)**
