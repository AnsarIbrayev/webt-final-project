# Task Manager Web Application

# Ansar Ibrayev
# SE-2424  

## Project Description
This is a full-stack Task Manager web application built using Node.js, Express, and MongoDB.  
The system allows users to create, update, delete, and manage tasks with secure authentication and role-based access control.

## Features
- User Registration and Login (Session-based authentication)
- Role-based access control (User / Admin)
- Password hashing with bcrypt
- Protected REST API endpoints
- Owner-based data access (users cannot see others’ tasks)
- Admin can view and manage all tasks
- Pagination support (`/api/tasks?page=1&limit=5`)
- Environment variables for security (no hardcoded secrets)

## Technologies
- Node.js
- Express.js
- MongoDB Atlas
- Mongoose
- bcrypt
- express-session
- Bootstrap (frontend)

## How to Run Locally

1. Clone the repository
git clone https://github.com/AnsarIbrayev/webt-final-project.git


2. Install dependencies
npm install


3. Create `.env` file
PORT=3000
MONGO_URI=your_mongodb_connection_string
SESSION_SECRET=your_secret_key
NODE_ENV=development


4. Run the project
npm run dev


Open:
http://localhost:3000


## Deployment
Live URL:
https://webt-final-project.onrender.com

## Demo Credentials
Admin:
admin@example.com
admin123


## Security
- Passwords stored using bcrypt hash
- Sessions protected with secret key
- API endpoints protected (401/403)
- Environment variables used for secrets