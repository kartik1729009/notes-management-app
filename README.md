📘 PCM Notes Management App with Authentication

A full-stack application built for managing subject-wise notes (Physics, Chemistry, Math) with deeply nested data structures. Users can sign up, log in, and securely perform CRUD operations on their chapters, subjects, and notes.

🔐 Auth via JWT stored in secure HTTP-only cookies
📚 Notes managed using deep nesting (Chapter → Subject → Notes) in MongoDB
🚀 Fully modular, well-structured codebase with both frontend and backend
🧱 Tech Stack
Frontend	       Backend        	   Database	             Auth & Security
React (Vite)	Node.js + Express	  MongoDB + Mongoose	  JWT + bcrypt + cookie-parser


✨ Features

✅ Authentication
User Registration with hashed passwords (bcrypt)
Login using JWT tokens sent via secure, HTTP-only cookies
Logout route that clears token cookie
Protected routes using middleware
📝 Notes Management (Protected CRUD)
Chapters: Create, Read, Update, Delete chapters
Subjects: Nested inside chapters
Notes: Nested inside subjects
Full support for:
Adding subjects to a chapter
Adding notes to a subject
Updating or deleting any nested entity
All operations require a valid logged-in session
🧪 Tested with Postman
Fully tested API collection (available below)
Sample request/response data
Easily importable environment


For both the folders

# Backend
cd server
npm run dev

# Frontend
cd ../client
npm run dev
