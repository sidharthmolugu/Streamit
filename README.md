Pulse Assignment

A full-stack web application built with:

React (Vite) frontend
Node.js + Express backend
Socket.IO for real-time communication
MongoDB Atlas database

This project implements user authentication, video uploads, and real-time events.

Live Website:
https://pulse-assignment-livid.vercel.app/

Features:
User registration and login with JWT
Video upload and listing
Real-time communication using Socket.IO
React frontend with Axios for API requests
Node/Express backend with REST APIs
MongoDB Atlas for persistent storage

Project Structure
backend/
• index.js — server entrypoint
• routes/auth.js — authentication routes
• routes/videos.js — video handling
• models/User.js — user schema
• uploads/ — uploaded video files

frontend/
• src/components — UI components
• src/pages — pages
• src/utils — helper functions
• vite.config.js

Backend Setup

Navigate to backend:
cd backend
npm install

Create .env using .env.example:

MONGO_URI=<your MongoDB URI>
JWT_SECRET=<your secret>
PORT=4000

Start backend:
npm start

Frontend Setup

Navigate to frontend:
cd frontend
npm install

Create .env:
VITE_API_URL=http://localhost:4000

Run frontend:
npm run dev

Notes:
The Render backend uses temporary storage for uploaded files. If the server restarts, uploaded videos may disappear. Re-upload the video to view it again.
The backend requires MongoDB Atlas with IP Access set to 0.0.0.0/0.
The folder backend/uploads must exist.
CORS must allow both localhost and the deployed frontend domain.
Environment variables should not be committed; instead use .env.example.

Deployment:
Frontend deployed on Vercel
Backend deployed on Render
Both connected using environment variables
