# 🎓 EduTrack — Student Management System

A beginner-friendly full-stack web application to manage students using **HTML, CSS, Vanilla JavaScript, Node.js, Express.js, and Supabase**.

---

## 📁 Folder Structure

```
student-management-system/
├── public/                  ← Frontend files (served statically)
│   ├── index.html           ← Main HTML page
│   ├── style.css            ← All styles
│   └── app.js               ← All frontend JavaScript
│
├── server.js                ← Express server + REST API
├── package.json             ← Project dependencies
├── .env.example             ← Template for your environment variables
├── .env                     ← Your actual secrets (DO NOT commit this)
├── .gitignore               ← Ignores node_modules and .env
└── README.md                ← This file
```

---

## 🚀 Setup Instructions

### Step 1 — Create a Supabase Project

1. Go to [https://supabase.com](https://supabase.com) and sign up / log in.
2. Click **"New Project"** and fill in project details.
3. Wait for the project to be ready (~1 minute).

### Step 2 — Create the Students Table

1. In your Supabase dashboard, go to **SQL Editor** (left sidebar).
2. Paste and run this SQL:

```sql
CREATE TABLE students (
  id         UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name       TEXT        NOT NULL,
  email      TEXT        NOT NULL UNIQUE,
  course     TEXT        NOT NULL,
  phone      TEXT        NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);
```

> ✅ This creates a `students` table with auto-generated IDs and timestamps.

### Step 3 — Get Your Supabase API Keys

1. In your Supabase project, go to **Settings → API** (left sidebar).
2. Copy:
   - **Project URL** → looks like `https://xyz.supabase.co`
   - **anon / public** key → a long JWT string

### Step 4 — Configure Environment Variables

1. In the project folder, copy the example env file:
   ```bash
   cp .env.example .env
   ```

2. Open `.env` and fill in your Supabase credentials:
   ```
   SUPABASE_URL=https://your-project-id.supabase.co
   SUPABASE_ANON_KEY=your-anon-key-here
   PORT=3000
   ```

### Step 5 — Install Dependencies

```bash
npm install
```

### Step 6 — Start the Server

```bash
# Production
npm start

# Development (auto-restarts on file changes)
npm run dev
```

### Step 7 — Open in Browser

Visit: [http://localhost:3000](http://localhost:3000)

---

## ✨ Features

| Feature         | Description                                      |
|-----------------|--------------------------------------------------|
| ➕ Add Student  | Form with validation to add new students         |
| 👀 View Students | Responsive table showing all students            |
| ✏️ Edit Student | Pre-filled form to update student details        |
| 🗑️ Delete Student | Confirmation dialog before deleting              |
| 🔍 Search       | Live search across name, email, course, phone    |

---

## 🔌 REST API Endpoints

| Method | Endpoint              | Description              |
|--------|-----------------------|--------------------------|
| GET    | `/api/students`       | Get all students         |
| GET    | `/api/students?search=john` | Search students   |
| GET    | `/api/students/:id`   | Get one student by ID    |
| POST   | `/api/students`       | Create a new student     |
| PUT    | `/api/students/:id`   | Update a student         |
| DELETE | `/api/students/:id`   | Delete a student         |

### Example API Request (POST)

```json
POST /api/students
Content-Type: application/json

{
  "name": "Priya Sharma",
  "email": "priya@example.com",
  "course": "Computer Science",
  "phone": "9876543210"
}
```

---

## 🛠️ Tech Stack

- **Frontend**: HTML5, CSS3, Vanilla JavaScript (Fetch API)
- **Backend**: Node.js, Express.js
- **Database**: Supabase (PostgreSQL)
- **Auth/Config**: dotenv

---

## 🧯 Troubleshooting

| Problem | Solution |
|--------|----------|
| `Cannot GET /` | Make sure server is running: `npm start` |
| `Error connecting to Supabase` | Check your `.env` values are correct |
| Students not loading | Open browser console (F12) for error details |
| Email duplicate error | Supabase enforces unique emails per the table schema |
