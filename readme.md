# TaskFlow - Team Task Manager

A full-stack team task management application with role-based access for admins and members.

## What this codebase uses

### Frontend
- React (function components + hooks)
- React Router DOM (`BrowserRouter`, nested routes, protected routes)
- Axios (API client + interceptors for JWT auth/401 handling)
- Tailwind CSS (custom theme, utility classes, custom components)
- PostCSS + Autoprefixer
- Vite (dev server + production build)
- TypeScript tooling present (`tsconfig.json`, template TS files)
- React Hot Toast (notifications)
- React Icons (`heroicons` set)

### Backend
- Node.js + Express 5
- MongoDB + Mongoose (ODM)
- JWT authentication (`jsonwebtoken`)
- Password hashing (`bcryptjs`)
- Request validation (`express-validator`)
- CORS configuration (`cors`)
- HTTP logging (`morgan`)
- Environment config (`dotenv`)

### Database Models
- `User` (name, email, password, role)
- `Project` (name, description, admin, members)
- `Task` (title, description, status, priority, dueDate, assignedTo, project)
- `WorkLog` (project, user, description, date)

### Development / Tooling
- `nodemon` for backend hot reload
- Vercel SPA rewrite config (`frontend/vercel.json`)
- npm workspaces are not configured; frontend and backend are separate Node projects

## Core app behavior

- Role-based access: `admin` and `member`
- JWT auth flow: register, login, get current user
- Admins can create/update/delete projects and tasks
- Members can update task progress (with completion approval rule)
- Work log submission for project activity tracking
- Dashboard stats endpoints with role-aware responses

## Folder structure

```text
Assignment/
  backend/
    config/
    controllers/
    middleware/
    models/
    routes/
    validators/
    server.js
  frontend/
    public/
    src/
      api/
      components/
      context/
      pages/
    index.html
    tailwind.config.js
    postcss.config.js
    vercel.json
```

## Backend API summary

Base URL (local): `http://localhost:5000/api`

### Auth
- `POST /auth/register` - public
- `POST /auth/login` - public
- `GET /auth/me` - authenticated

### Projects
- `POST /projects` - admin only
- `GET /projects` - authenticated
- `GET /projects/:id` - authenticated project member/admin
- `PUT /projects/:id` - project admin only
- `DELETE /projects/:id` - project admin only
- `PUT /projects/:id/members` - project admin only

### Tasks
- `GET /tasks/stats/dashboard` - authenticated
- `GET /tasks/stats/team` - admin only
- `GET /tasks/single/:id` - authenticated
- `POST /tasks/:projectId` - project admin only
- `GET /tasks/:projectId` - authenticated project member/admin
- `PUT /tasks/:id` - project admin only
- `PATCH /tasks/:id/status` - authenticated project member/admin
- `DELETE /tasks/:id` - project admin only

### Work Logs
- `POST /worklogs/:projectId` - authenticated project member/admin
- `GET /worklogs/:projectId` - project admin only

## Environment variables

### Backend (`backend/.env`)

```env
PORT=5000
NODE_ENV=development
JWT_SECRET=your_jwt_secret
MONGO_URI=your_mongodb_connection_string
MONGO_DB_NAME=optional_database_name
FRONTEND_URL=http://localhost:5173
```

Notes:
- Database URI also supports `MONGODB_URI` or `MONGO_URL` fallback names.
- Database name also supports `MONGODB_DB` fallback name.
- In development, CORS allows `http://localhost:5173` by default.

### Frontend (`frontend/.env`)

```env
VITE_API_URL=http://localhost:5000/api
```

## Run locally

### 1. Start backend

```bash
cd backend
npm install
npm run dev
```

### 2. Start frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend local URL is usually `http://localhost:5173`.

## Build commands

### Backend
```bash
cd backend
npm start
```

### Frontend
```bash
cd frontend
npm run build
npm run preview
```

## Scripts in this repo

### Backend scripts
- `npm run dev` - run with nodemon
- `npm start` - run server with Node

### Frontend scripts
- `npm run dev` - Vite dev server
- `npm run build` - TypeScript check + Vite production build
- `npm run preview` - preview production build

## UI and architecture notes

- Auth state is managed via React Context + `useReducer`.
- JWT token/user are stored in `localStorage`.
- Axios request interceptor attaches `Authorization: Bearer <token>`.
- Axios response interceptor logs user out on `401` and redirects to `/login`.
- Tailwind theme extends custom `primary` and `surface` color palettes plus custom animations.

## Current state of codebase

- Production frontend artifacts exist in `frontend/dist/`.
- Legacy Vite TypeScript starter files still exist (`src/main.ts`, `src/style.css`, `src/counter.ts`) while the active app entry is `src/main.jsx`.
- No automated test setup is currently configured in package scripts.
