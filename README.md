# 📚 StudyFlow — Smarter Study, Less Stress

Tired of cramming and forgetting everything the next day?
**StudyFlow** is your intelligent study companion, built for students and lifelong learners who want to remember more — and stress less.

**Latest Updates:**
- **Modern, student-friendly UI** with a clean dashboard and no more empty space.
- **Always shows helpful mock data** if setup is incomplete, so you never see a blank screen.
- **Reset button** lets you restart your study setup at any time.
- **All code cleaned up:** No more warnings or errors in the dashboard.

Powered by spaced repetition, progress tracking, and (coming soon) AI-driven reviews, StudyFlow goes way beyond flashcards. It's a full learning workflow — from notes to quizzes to visual analytics — all in one place.

---

## ✨ Core Features

### 🧠 Smart Spaced Repetition
Never forget what you learned. StudyFlow schedules reviews right before you're about to forget — for maximum retention.

### 📝 Notes That Drive Learning
Create, organize, and link your notes directly to flashcards, quizzes, and more. Learning starts from your own content.

### 📊 Visual Progress & Mastery Tracking
Heatmaps, trends, and personalized stats that help you see your progress and study smarter.

### ⏱️ Schedule + Focus Tools
Built-in planner, Pomodoro timer, and smart reminders to keep you on track without burnout.

### 🤝 Collaborative Study Sessions
Share notes, co-create flashcards, and host group reviews. Perfect for study groups and class projects.

### 🔍 AI Assist (Coming Soon)
Auto-generate quiz questions, simplify complex notes, and get personalized prompts based on what you need most.

### 🧩 Gamification Layer (Optional)
Earn streaks, track milestones, and stay motivated with achievement badges.

---

## 🚀 Tech Stack
- **Frontend:** React + TypeScript + Vite
- **Backend:** Node.js + Express
- **Database:** PostgreSQL (pg library)
- **Styling:** Custom CSS with themes

---

## ⚙️ Setup Guide

### Prerequisites
- Node.js (v18+)
- npm
- PostgreSQL (running locally or remotely)

### .env Configuration
```
DB_USER=your_pg_user
DB_HOST=localhost
DB_NAME=your_database_name
DB_PASSWORD=your_pg_password
DB_PORT=5433
PORT=3000
FRONTEND_URL=http://localhost:5173
```

### Installation
```bash
git clone https://github.com/yourusername/studyflow.git
cd studyflow
npm install
cd backend && npm install
```

### Run Locally
```bash
# Start backend
cd backend
npm start

# In another terminal
cd ..
npm run dev
```

---

## 🛠 Auto-Migration Info
⚠️ The backend has migrated from MongoDB to PostgreSQL.
On startup, it will auto-create essential tables: users, notes, study_materials, and more.

---

## 🗂 Project Structure
```
studyflow/
├── backend/         # Node/Express API
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   └── ...
├── src/             # React frontend
│   ├── components/
│   ├── pages/
│   └── ...
├── public/
└── .env.example
```

---

## ❓ Troubleshooting
- **Port conflicts?** Change in `.env`.
- **Database errors?** Double-check credentials & DB status.
- **No table?** The backend will auto-create them at startup.

---

## 🧠 Built for Learners
StudyFlow isn't just a tool — it's your personal academic command center. Whether you're prepping for finals, organizing your semester, or just trying to finally remember what you study, we've got your back.
