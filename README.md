# LeetCode AI Mentor 🧠

A full-stack MERN application where developers submit coding problems + solutions and receive instant AI-powered analysis: time complexity detection, algorithm pattern recognition, improvement suggestions, and learning progress tracking.

---

## Tech Stack

| Layer     | Technology                          |
|-----------|-------------------------------------|
| Frontend  | React 18, React Router v6, TailwindCSS |
| Backend   | Node.js, Express 4                  |
| Database  | MongoDB + Mongoose                  |
| Auth      | JWT (jsonwebtoken) + bcryptjs        |

---

## Project Structure

```
leetcode-ai-mentor/
├── backend/
│   ├── controllers/
│   │   ├── authController.js      # signup, login, getMe
│   │   └── attemptsController.js  # submit, list, get, dashboard
│   ├── middleware/
│   │   └── auth.js                # JWT protect middleware
│   ├── models/
│   │   ├── User.js                # User schema (name, email, password)
│   │   └── ProblemAttempt.js      # Attempt schema with analysis results
│   ├── routes/
│   │   ├── auth.js                # /api/auth/*
│   │   └── attempts.js            # /api/attempts/*
│   ├── services/
│   │   └── codeAnalyzer.js        # Heuristic code analysis engine
│   ├── .env.example
│   ├── package.json
│   └── server.js
│
└── frontend/
    ├── public/
    │   └── index.html
    ├── src/
    │   ├── components/
    │   │   ├── AttemptCard.js
    │   │   ├── ComplexityBadge.js
    │   │   ├── LoadingSpinner.js
    │   │   ├── Navbar.js
    │   │   ├── ScoreBadge.js
    │   │   └── SubmitForm.js
    │   ├── context/
    │   │   └── AuthContext.js     # Global auth state
    │   ├── pages/
    │   │   ├── AttemptDetailPage.js
    │   │   ├── DashboardPage.js
    │   │   ├── HomePage.js
    │   │   ├── LoginPage.js
    │   │   └── SignupPage.js
    │   ├── services/
    │   │   └── api.js             # Axios instance + API calls
    │   ├── App.js
    │   ├── index.css
    │   └── index.js
    ├── .env.example
    ├── package.json
    ├── postcss.config.js
    └── tailwind.config.js
```

---

## Quick Start

### Prerequisites
- Node.js >= 16
- MongoDB (local or Atlas URI)

### 1. Clone & Install

```bash
# Backend dependencies
cd backend
npm install

# Frontend dependencies
cd ../frontend
npm install
```

### 2. Environment Variables

```bash
# backend/.env
cp backend/.env.example backend/.env
```

Edit `backend/.env`:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/leetcode-ai-mentor
JWT_SECRET=your_super_secret_key_here
JWT_EXPIRES_IN=7d
NODE_ENV=development
```

```bash
# frontend/.env
cp frontend/.env.example frontend/.env
```

Edit `frontend/.env`:
```
REACT_APP_API_URL=http://localhost:5000/api
```

### 3. Run the App

**Terminal 1 — Backend:**
```bash
cd backend
npm run dev
# Server on http://localhost:5000
```

**Terminal 2 — Frontend:**
```bash
cd frontend
npm start
# App on http://localhost:3000
```

---

## API Reference

### Auth

#### POST /api/auth/signup
```json
{
  "name": "Alex Chen",
  "email": "alex@example.com",
  "password": "secret123"
}
```
Response:
```json
{
  "message": "Account created successfully.",
  "token": "eyJ...",
  "user": { "id": "...", "name": "Alex Chen", "email": "alex@example.com" }
}
```

#### POST /api/auth/login
```json
{
  "email": "alex@example.com",
  "password": "secret123"
}
```

#### GET /api/auth/me
Headers: `Authorization: Bearer <token>`

---

### Attempts (all require `Authorization: Bearer <token>`)

#### POST /api/attempts/submit
```json
{
  "problemTitle": "Two Sum",
  "problemDescription": "Given an array nums and integer target, return indices of two numbers that add to target.",
  "code": "function twoSum(nums, target) {\n  for (let i = 0; i < nums.length; i++) {\n    for (let j = i + 1; j < nums.length; j++) {\n      if (nums[i] + nums[j] === target) return [i, j];\n    }\n  }\n}",
  "language": "javascript"
}
```
Response:
```json
{
  "message": "Solution submitted and analyzed successfully.",
  "attempt": {
    "_id": "...",
    "problemTitle": "Two Sum",
    "timeComplexity": "O(n²)",
    "spaceComplexity": "O(1)",
    "solutionType": "brute-force",
    "algorithmPattern": "Brute Force / Iteration",
    "score": 55,
    "feedback": "Your solution is functionally correct but uses a brute-force approach...",
    "suggestions": ["Consider using a Hash Map to reduce time complexity from O(n²) to O(n)."],
    "edgeCases": ["Empty array input []", "Negative numbers"],
    "topics": ["Arrays", "Hash Tables"]
  }
}
```

#### GET /api/attempts/user/:userId?page=1&limit=10
Returns paginated attempt list for a user.

#### GET /api/attempts/dashboard/:userId
Returns aggregated stats: totalAttempts, avgScore, topicStats, strongTopics, weakTopics, solutionTypeBreakdown.

#### GET /api/attempts/:id
Returns a single attempt by ID.

---

## Code Analyzer Engine

The `services/codeAnalyzer.js` uses heuristic pattern matching — no external AI API required:

| Feature | How it works |
|---------|-------------|
| **Time Complexity** | Counts nested loops, detects sorting calls, binary search patterns, recursion |
| **Space Complexity** | Detects use of Maps, Sets, arrays; identifies recursive call stacks |
| **Algorithm Pattern** | Regex matching for Two Pointers, Sliding Window, DP, BFS, DFS, Binary Search, etc. |
| **Solution Type** | Classifies as `optimal`, `optimized`, `brute-force` based on complexity + patterns |
| **Score** | 0–100 based on complexity, solution type, code length |
| **Suggestions** | Context-aware hints: Hash Map recommendations, loop optimization, language idioms |
| **Edge Cases** | Infers likely edge cases from data structures used in code |

---

## UI Pages

| Route | Page | Description |
|-------|------|-------------|
| `/` | Home | Hero + problem submit form (authenticated) |
| `/signup` | Sign Up | Registration form |
| `/login` | Login | Authentication form |
| `/dashboard` | Dashboard | Stats, topic breakdown, attempt history |
| `/attempts/:id` | Attempt Detail | Full analysis view for a submission |

---

## MongoDB Schemas

### User
```
name: String (required)
email: String (unique, required)
password: String (hashed, required)
createdAt: Date
```

### ProblemAttempt
```
userId: ObjectId → User
problemTitle: String
problemDescription: String
code: String
language: Enum[javascript, python, java, cpp, c, go, rust, typescript]
timeComplexity: String
spaceComplexity: String
solutionType: Enum[brute-force, optimized, optimal, unknown]
algorithmPattern: String
feedback: String
suggestions: [String]
edgeCases: [String]
score: Number (0-100)
topics: [String]
createdAt: Date
```

---

## Sample cURL Requests

```bash
# Signup
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"name":"Alex","email":"alex@test.com","password":"test123"}'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"alex@test.com","password":"test123"}'

# Submit a problem (replace TOKEN and USER_ID)
curl -X POST http://localhost:5000/api/attempts/submit \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TOKEN" \
  -d '{
    "problemTitle": "Two Sum",
    "problemDescription": "Find two numbers that add to target",
    "code": "function twoSum(nums, target) { const map = {}; for (let i = 0; i < nums.length; i++) { const comp = target - nums[i]; if (map[comp] !== undefined) return [map[comp], i]; map[nums[i]] = i; } }",
    "language": "javascript"
  }'

# Get dashboard
curl http://localhost:5000/api/attempts/dashboard/USER_ID \
  -H "Authorization: Bearer TOKEN"
```

---

## Design System

The UI uses a **terminal/hacker aesthetic** with:
- **Font**: JetBrains Mono (code) + Syne (display)
- **Colors**: `#0a0a0f` void black, `#00ff88` acid green, `#7c3aed` plasma purple
- **Style**: Dark panels, green glows, monospace UI text, CRT scanline overlay
