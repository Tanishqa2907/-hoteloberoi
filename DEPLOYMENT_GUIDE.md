# Deployment Guide: Netlify + Backend

## Current Situation

✅ **Frontend**: Deployed on Netlify (static hosting)
❌ **Backend**: Needs separate deployment (Node.js server)

Netlify only hosts static files, so your Node.js backend must be deployed elsewhere.

## Solution: Deploy Backend Separately

### Option 1: Railway (Recommended - Easiest)

1. **Go to Railway.app** and sign up/login
2. **Create New Project** → "Deploy from GitHub repo"
3. **Select your repository**
4. **Configure:**
   - Root Directory: `server`
   - Start Command: `npm start`
   - Port: `3000`
5. **Add Environment Variables:**
   - `NODE_ENV=production`
   - `PORT=3000`
   - `FRONTEND_URL=https://your-netlify-site.netlify.app`
6. **Deploy** - Railway will give you a URL like: `https://your-app.railway.app`

### Option 2: Render

1. **Go to render.com** and sign up
2. **New** → "Web Service"
3. **Connect your GitHub repo**
4. **Configure:**
   - Name: `hotel-backend`
   - Environment: `Node`
   - Build Command: `cd server && npm install`
   - Start Command: `cd server && npm start`
   - Root Directory: `server`
5. **Add Environment Variables:**
   - `NODE_ENV=production`
   - `FRONTEND_URL=https://your-netlify-site.netlify.app`
6. **Deploy** - Render gives you a URL like: `https://your-app.onrender.com`

### Option 3: Fly.io

1. **Install Fly CLI**: `npm install -g @fly/cli`
2. **Login**: `fly auth login`
3. **Initialize**: `cd server && fly launch`
4. **Deploy**: `fly deploy`

## Update Frontend for Production

### Step 1: Update Netlify Environment Variables

1. Go to your Netlify dashboard
2. Site settings → **Environment variables**
3. Add:
   ```
   VITE_API_URL=https://your-backend-url.railway.app
   ```
   (Replace with your actual backend URL)

### Step 2: Rebuild on Netlify

1. Go to **Deploys** tab
2. Click **Trigger deploy** → **Clear cache and deploy site**

## Update Backend CORS

Make sure your backend allows your Netlify domain:

In `server/index.js`, the CORS is already configured, but verify:

```javascript
const corsOptions = {
  origin: NODE_ENV === 'production' 
    ? process.env.FRONTEND_URL || 'https://your-site.netlify.app'
    : '*',
  credentials: true,
};
```

Set `FRONTEND_URL` environment variable in your backend hosting service.

## Quick Setup Checklist

- [ ] Deploy backend to Railway/Render/Fly.io
- [ ] Get backend URL (e.g., `https://hotel-backend.railway.app`)
- [ ] Add `VITE_API_URL` to Netlify environment variables
- [ ] Add `FRONTEND_URL` to backend environment variables
- [ ] Rebuild Netlify site
- [ ] Test the deployed site

## Testing

1. **Test Backend**: Visit `https://your-backend-url/health`
   - Should return: `{"status":"ok",...}`

2. **Test Frontend**: Visit your Netlify site
   - Should load without network errors
   - Dashboard should show data

## Troubleshooting

### CORS Errors
- Make sure `FRONTEND_URL` in backend matches your Netlify URL exactly
- Include `https://` in the URL

### Network Errors
- Verify backend is running (check health endpoint)
- Check `VITE_API_URL` in Netlify environment variables
- Clear Netlify cache and redeploy

### Database Issues
- Railway/Render provide persistent storage
- For production, consider migrating to PostgreSQL (better than SQLite)

## Production Database (Optional but Recommended)

For production, consider using PostgreSQL instead of SQLite:

1. **Railway**: Automatically provides PostgreSQL
2. **Render**: Add PostgreSQL database service
3. Update `server/database.js` to use PostgreSQL


