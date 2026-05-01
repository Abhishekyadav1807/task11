# Primetrade Backend Developer Internship Assignment (MERN)

This project implements a scalable REST API with authentication, role-based access, and task CRUD, plus a basic React frontend to test the APIs.

## Tech Stack
- Backend: Node.js, Express.js, MongoDB (Mongoose)
- Frontend: React (Vite)
- Auth: JWT + bcrypt password hashing
- API Docs: Swagger (`/api-docs`)

## Features Implemented
- User registration/login APIs with hashed passwords
- JWT-protected routes
- Role-based access (`user`, `admin`)
- Task CRUD APIs (secondary entity)
- API versioning via `/api/v1/...`
- Request validation + centralized error responses
- MongoDB schema models for users and tasks
- Basic React UI for register/login/dashboard/task actions

## Project Structure
- `backend/` - Express API
- `frontend/` - React app

## Backend Setup
1. Go to backend:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create env file:
   ```bash
   cp .env.example .env
   ```
4. Start backend:
   ```bash
   npm run dev
   ```

Backend runs on `http://localhost:5000`

## Frontend Setup
1. Open new terminal and go to frontend:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start frontend:
   ```bash
   npm run dev
   ```

Frontend runs on default Vite URL (`http://localhost:5173`).

Frontend env:
```bash
cp .env.example .env
```

## API Documentation
- Swagger UI: `http://localhost:5000/api-docs`

## Important API Endpoints
- `POST /api/v1/auth/register`
- `POST /api/v1/auth/login`
- `GET /api/v1/auth/me`
- `GET /api/v1/tasks`
- `POST /api/v1/tasks`
- `PUT /api/v1/tasks/:id`
- `DELETE /api/v1/tasks/:id`
- `GET /api/v1/admin/stats` (admin only)

## Role Rules
- Default registration role is `user`.
- To create admin from register API, pass:
  - `role: "admin"`
  - `adminCreationSecret` matching `ADMIN_CREATION_SECRET` in `.env`

## Security Practices Included
- Password hashing with bcrypt
- JWT token verification middleware
- Protected routes and RBAC checks
- Helmet security headers
- Mongo query sanitization (`express-mongo-sanitize`)
- Input validation (`express-validator`)

## Short Scalability Note
This architecture is modular and can scale by splitting services (`auth`, `tasks`) into microservices, adding Redis for caching frequent reads, introducing a message queue for async jobs, and placing instances behind a load balancer with stateless JWT-based auth.

## Hosting (Fastest)
### 1) MongoDB Atlas
- Create free cluster
- Create DB user + IP access (`0.0.0.0/0` for quick setup)
- Copy connection string and use it as `MONGO_URI` in backend hosting env

### 2) Backend on Render
- New `Web Service` from this GitHub repo
- Root Directory: `backend`
- Build Command: `npm install`
- Start Command: `npm start`
- Add env vars:
  - `PORT=5000`
  - `MONGO_URI=<atlas-uri>`
  - `JWT_SECRET=<strong-secret>`
  - `JWT_EXPIRES_IN=1d`
  - `ADMIN_CREATION_SECRET=<your-secret>`
  - `CORS_ORIGIN=<your-vercel-frontend-url>`

### 3) Frontend on Vercel
- New Project from same GitHub repo
- Root Directory: `frontend`
- Framework preset: `Vite`
- Env var:
  - `VITE_API_BASE_URL=<your-render-backend-url>/api/v1`

After deploy, open frontend URL and test register/login/task CRUD.
