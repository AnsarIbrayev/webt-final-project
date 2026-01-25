# Ibrayev Ansar
# SE-2424
# WebT Assignment 3 Part 1

## Project Description
This project is a backend API using Node.js, Express, and MongoDB.
It implements full CRUD operations for tasks and serves HTML pages.

## Installation

1. Make sure Node.js and MongoDB are installed.
2. Start MongoDB:
   ```bash
   mongod
Open terminal in project folder and install dependencies:

npm install
Start the server:

node app.js
Usage
Open browser and go to:

http://localhost:3000/ — Home page

http://localhost:3000/about — About page

http://localhost:3000/contact — Contact page

For API testing, use:

Base URL: http://localhost:3000/api/tasks

API Endpoints
GET /api/tasks — Get all tasks (supports filtering and sorting)

GET /api/tasks/:id — Get a task by ID

POST /api/tasks — Create a task

PUT /api/tasks/:id — Update a task

DELETE /api/tasks/:id — Delete a task

Filtering and Sorting Example
GET /api/tasks?title=test&sortBy=title:asc
Notes
Any other page → 404 Not Found

Make sure MongoDB server is running before starting the Node.js server