# Deployment Guide

## Environment Variables Setup

### Backend (Render)
In your Render backend service dashboard, set these environment variables:

1. **DATABASE_URL**: Your Neon database connection string
   ```
   postgresql://username:password@your-neon-host.neon.tech/database?sslmode=require
   ```

2. **JWT_SECRET**: A secure random string (at least 32 characters)
   ```
   your-very-secure-random-jwt-secret-key-here-make-it-long-and-random
   ```

3. **NODE_ENV**: Set to `production`

4. **PORT**: Render will set this automatically to 10000

### Frontend (Render)
In your Render frontend service dashboard, set this environment variable:

1. **VITE_API_URL**: Your backend URL
   ```
   https://capstone-backend.onrender.com
   ```

## Deployment Steps

1. **Push your changes to GitHub**
   ```bash
   git add .
   git commit -m "Fix production environment configuration"
   git push origin main
   ```

2. **Redeploy both services on Render**
   - Go to your Render dashboard
   - Redeploy the backend service first
   - Then redeploy the frontend service

3. **Verify the deployment**
   - Check backend health: `https://capstone-backend.onrender.com/health`
   - Test frontend: `https://your-frontend.onrender.com`

## Troubleshooting

### "Invalid token" errors:
- Ensure JWT_SECRET is set in backend environment variables
- Make sure it's the same secret used when tokens were created
- Users may need to log out and log back in after deployment

### "Connection error" when adding books:
- Verify VITE_API_URL is set correctly in frontend
- Check that backend is running and accessible
- Ensure CORS is properly configured

### Database connection issues:
- Verify DATABASE_URL is correct
- Check Neon database is running and accessible
- Ensure SSL mode is set to 'require'