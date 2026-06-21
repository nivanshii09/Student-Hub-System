# 🎓 EduTrack — Student Management System

A beginner-friendly Student Management System developed as a full-stack web application. This project demonstrates frontend development, backend API creation, and database integration in a single repository.

## Task Completion

### Task 1: Frontend
- Responsive user interface
- Built using HTML, CSS, and JavaScript
- Mobile-friendly design
- User-friendly layout and navigation

### Task 2: Backend API
- Developed using Node.js and Express.js
- REST API implementation
- GET, POST, PUT, and DELETE endpoints
- Request validation and server-side logic

### Task 3: Database
- Supabase database integration
- Student data storage and retrieval
- CRUD operations
- Persistent data management

## Features

- Add Student
- View Students
- Edit Student Details
- Delete Student Records
- Search Students
- Responsive Design
- Form Validation
- Database Integration

## Technology Stack

### Frontend
- HTML5
- CSS3
- JavaScript

### Backend
- Node.js
- Express.js

### Database
- Supabase

## Student Information Fields

Each student record contains:

- Name
- Email
- Course
- Phone Number

## Project Structure

```text
Student-Hub-System/
│
├── public/
│   ├── index.html
│   ├── styles.css
│   └── app.js
│
├── server.js
├── package.json
├── package-lock.json
└── README.md
```

## Installation

### Clone Repository

```bash
git clone https://github.com/nivanshii09/Student-Hub-System.git
cd Student-Hub-System
```

### Install Dependencies

```bash
npm install
```

### Configure Environment Variables

Create a `.env` file and add:

```env
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_key
PORT=3000
```

### Start Application

```bash
npm start
```

or

```bash
node server.js
```

### Open in Browser

```text
http://localhost:3000
```

## API Endpoints

| Method | Endpoint | Description |
|----------|----------|----------|
| GET | /students | Get all students |
| GET | /students/:id | Get student by ID |
| POST | /students | Create new student |
| PUT | /students/:id | Update student |
| DELETE | /students/:id | Delete student |

## Learning Outcomes

Through this project, the following concepts were implemented:

- Responsive frontend development
- RESTful API development
- Database integration
- CRUD operations
- Client-server communication
- Form validation
- Full-stack application structure

## Future Improvements

- Authentication system
- Student profile pages
- Attendance management
- Advanced filtering and search
- Dashboard analytics

## Author

GitHub: :contentReference[oaicite:0]{index=0}

---

**Internship Project Submission**

This repository contains the implementation of all three required tasks:
- Frontend Development
- Backend API Development
- Database Integration

All requirements have been completed within a single full-stack project repository.
