# Task Manager App

A **full-stack web application** with authentication, a user dashboard, and CRUD operations on tasks.  
Built with **React (frontend)** + **Node.js/Express (backend)** + **MongoDB**.  

---

## Features
- Authentication
  - User registration & login
  - JWT-based auth with protected routes
  - Password hashing (bcrypt)
- Dashboard
  - Add, edit, delete, and list tasks
  - Responsive UI with modern styling
- Backend API
  - RESTful API with validation and error handling
  - Connected to MongoDB
- Postman Collection
  - Pre-configured API requests for easy testing


## Backend Setup
cd backend
npm install

Create a .env file in backend/:

PORT=5000
MONGODB_URI=mongodb://localhost:27017/taskmanager
JWT_SECRET=your_jwt_secret

Run the server:
npm run dev


##Frontend Setup
cd frontend
npm install
npm run dev


For production, I would deploy backend on a service like Render with MongoDB Atlas and serve frontend via Vercel, using environment variables for API base URL



## API Endpoints

Auth
- POST /api/auth/register → Register user
- POST /api/auth/login → Login user
- GET /api/users/me → Get current user profile (JWT required)

Tasks
- GET /api/tasks → List all tasks
- POST /api/tasks → Create a task
- PATCH /api/tasks/:id → Update a task
- DELETE /api/tasks/:id → Delete a task
