# Web Technologies – Assignment 4  
# Ibrayev Ansar  
# SE-2424

---

## 1. Project Overview

This project is a **full-stack Task Manager web application** developed for **Assignment 4**.

The application allows users to manage tasks through a modern web interface with:
- authentication,
- session-based authorization,
- advanced task attributes,
- filtering and sorting.

The project demonstrates practical usage of backend, frontend, and database integration.

---

## 2. Features

### Core functionality
- User authentication (login/logout)
- Session-based authorization
- Create, read, update, delete tasks (CRUD)
- Tasks stored in MongoDB
- Protected routes for editing and deleting tasks

### Task attributes
- Title
- Description
- Status (Pending / In Progress / Done)
- Priority (Low / Medium / High)
- Due date
- Category
- Tags

### UI & UX
- Modern responsive dark-themed interface
- Filters by status, priority, category, tags
- Sorting (newest first)
- Edit tasks directly from the list
- Modal login window

---

## 3. Technologies Used

### Backend
- Node.js
- Express.js
- Express-session
- MongoDB
- Mongoose

### Frontend
- HTML5
- CSS3
- JavaScript (Fetch API)
- Bootstrap (UI components)

### Other
- dotenv
- Nodemon
- Git & GitHub

---

## 4. Project Structure

WebT Ass4/
│── app.js
│── package.json
│── .env.example
│
├── database/
│ └── mongo.js
│
├── models/
│ └── User.js
│
├── middleware/
│ └── requireAuth.js
│
├── routes/
│ ├── auth.js
│ └── tasks.js
│
├── public/
│ ├── styles.css
│ ├── theme.css
│ ├── script.js
│ └── i18n.js
│
└── views/
├── home.html
├── about.html
├── contact.html
└── 404.html


---

## 5. Environment Setup

1. Install dependencies:
```bash
npm install
Create .env file based on .env.example

Start the application:

npm run dev
Open in browser:

http://localhost:3000
6. Authentication
Default admin account (created via seed script):

Email: admin@example.com
Password: admin123
Only authenticated users can:

edit tasks

delete tasks

7. API Endpoints
Authentication
POST /login

POST /logout

Tasks
GET /api/tasks

GET /api/tasks/:id

POST /api/tasks

PUT /api/tasks/:id (protected)

DELETE /api/tasks/:id (protected)

8. Assignment Requirements Coverage
✔ Full-stack application
✔ Web UI CRUD
✔ MongoDB database
✔ Environment variables
✔ Authentication & authorization
✔ GitHub repository with README

9. Conclusion
This project fulfills all Assignment 4 requirements and demonstrates:

backend logic,

frontend interaction,

database integration,

and user authentication in a real-world web application.