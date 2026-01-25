# WebT Assignment 3 – Part 2  
**Student:** Ibraev Ansar  
**Course:** Web Technologies  
**Project:** Task Manager (Full-Stack CRUD App)

## 1. Project Overview

This project is a simple Task Manager web application.  
It is the continuation of Assignment 3 – Part 1.

The goal of Part 2 is to:

- deploy the full-stack application to a production hosting platform;
- connect the frontend UI to the backend API;
- demonstrate full CRUD operations through a web interface;
- use environment variables for configuration.

The domain of the project is **task management**: the user can create, view, update, and delete tasks.

## 2. Technologies Used

- **Backend:** Node.js, Express.js
- **Database:** MongoDB Atlas (cloud)
- **ORM:** Mongoose
- **Frontend:** HTML, CSS, JavaScript (fetch API)
- **Hosting:** Render (Web Service)
- **Version Control:** Git, GitHub

## 3. Project Structure

Main folders and files:

- `app.js` – main Express server file (routes, middleware, server start)
- `database/mongo.js` – MongoDB connection using `MONGO_URI`
- `routes/tasks.js` – REST API routes for Task CRUD
- `views/home.html` – main UI (Task Manager)
- `views/about.html`, `views/contact.html`, `views/404.html` – additional pages
- `public/script.js` – frontend logic (fetch requests, DOM updates)
- `public/styles.css` – basic styles
- `.env` (local only, not in GitHub) – environment variables
- `package.json` – dependencies and npm scripts

## 4. Environment Variables

The application uses environment variables for configuration.

Required variables:

- `PORT` – server port (locally usually `3000`)
- `MONGO_URI` – MongoDB connection string (MongoDB Atlas)

### Local development

Create a `.env` file in the project root:

```env
PORT=3000
MONGO_URI=<your MongoDB Atlas connection string>
.env is ignored by Git with .gitignore.

Production (Render)
On Render, MONGO_URI is set in Environment Variables.
PORT is provided automatically by Render and read via process.env.PORT.

5. Running the Project Locally
Clone the repository:

git clone https://github.com/AnsarIbrayev/WebT-Ass3-Part2-Ibrayev-Ansar.git
cd WebT-Ass3-Part2-Ibrayev-Ansar/WebT\ Ass3\ Part2
Install dependencies:

npm install
Create .env with PORT and MONGO_URI.

Start the server:

npm start
Open the browser at:

http://localhost:3000
The Task Manager UI should be available at the root URL (/).

6. Deployed Application (Production)
The application is deployed on Render as a Web Service.

Public URL:
https://webt-ass3-part2-ibrayev-ansar.onrender.com

This URL is used during the defense to demonstrate the production version of the app.

7. CRUD Functionality via Web UI
All CRUD operations are available through the web interface:

Create:
Use the form “Create / Update Task” and press Save task.

Read:
All tasks are loaded from the backend (GET /api/tasks) and displayed in a table.

Update:
Click Edit next to a task. The form is filled with task data.
Change fields and press Save task to update (PUT /api/tasks/:id).

Delete:
Click Delete to remove a task (DELETE /api/tasks/:id).

No Postman is required during the defense. All operations are shown in the browser.

8. Difference Between Local and Production Environments
Local:

Runs on http://localhost:3000

Uses .env file for PORT and MONGO_URI

Useful for development and debugging

Production (Render):

Runs on a public URL

Uses Render environment variables for MONGO_URI

Uses process.env.PORT provided by Render

Connected to the same MongoDB Atlas cluster

9. How to Use This Project in Defense
During the defense, the student will:

Open the deployed URL in the browser.

Demonstrate all CRUD operations from the UI.

Explain the backend API endpoints and data flow.

Explain the MongoDB usage and environment variables.

Describe deployment steps to Render.

