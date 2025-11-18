# Login/Signup App

Full-stack authentication app with Prisma ORM, Neon database, Express backend, and React frontend with Tailwind CSS.

## Setup

### Backend

1. Navigate to backend folder:
```bash
cd backend
npm install
```

2. Create `.env` file from `.env.example`:
```bash
cp .env.example .env
```

3. Update `.env` with your Neon database URL:
   - Go to [Neon Console](https://console.neon.tech/)
   - Create a new project or use existing one
   - Copy the connection string
   - Paste it in `.env` as `DATABASE_URL`

4. Run Prisma migrations:
```bash
npx prisma migrate dev --name init
npx prisma generate
```

5. Start backend server:
```bash
npm run dev
```

### Frontend

1. Navigate to frontend folder:
```bash
cd frontend
npm install
```

2. Start development server:
```bash
npm run dev
```

3. Open browser at `http://localhost:3000`

## Features

- User signup with email, password, and name
- User login with JWT authentication
- Protected dashboard route
- Tailwind CSS styling
- Prisma ORM with Neon PostgreSQL database

## Deployment

### Backend on Render

1. Go to [Render Dashboard](https://dashboard.render.com/)
2. Click "New +" → "Web Service"
3. Connect your GitHub repository: `https://github.com/princesingh2024/Capstone_Sem3`
4. Configure the service:
   - **Name**: `capstone-backend` (or any name)
   - **Root Directory**: `backend`
   - **Environment**: `Node`
   - **Build Command**: `npm install && npx prisma generate && npx prisma migrate deploy`
   - **Start Command**: `node server.js`
5. Add Environment Variables (click "Advanced" → "Add Environment Variable"):
   - `DATABASE_URL`: `postgresql://neondb_owner:npg_Mc1YZV6miOXA@ep-summer-sun-ah3z1axb-pooler.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require`
   - `JWT_SECRET`: `your-secret-key-change-this-to-something-random`
   - `NODE_ENV`: `production`
6. Click "Create Web Service"
7. Wait for deployment (takes 2-3 minutes)
8. Copy your backend URL (e.g., `https://capstone-backend.onrender.com`)

### Frontend on Vercel

1. Update the API URLs in your frontend code to use your Render backend URL
2. In `frontend/src/pages/Login.jsx` and `frontend/src/pages/Signup.jsx`, replace:
   - `http://localhost:5001` → `https://your-backend-url.onrender.com`
3. Push changes to GitHub
4. Vercel will auto-deploy
