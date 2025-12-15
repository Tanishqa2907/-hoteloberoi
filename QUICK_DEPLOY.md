# Quick Deployment Guide: Netlify Frontend + Backend

## 🎯 The Problem

You deployed the **frontend to Netlify**, but the **backend is still trying to connect to `localhost:3000`**, which doesn't exist in production!

## ✅ Solution: Deploy Backend + Update Frontend

### Step 1: Deploy Backend (Choose One)

#### 🚂 Option A: Railway (Easiest - Recommended)

1. Go to **railway.app** → Sign up/Login
2. Click **"New Project"** → **"Deploy from GitHub repo"**
3. Select your repository
4. In project settings:
   - **Root Directory**: `server`
   - **Start Command**: `npm start`
5. Add **Environment Variables**:
   - `NODE_ENV` = `production`
   - `FRONTEND_URL` = `https://your-netlify-site.netlify.app` (your actual Netlify URL)
6. **Deploy** → Railway gives you a URL like: `https://your-app.railway.app`
7. **Copy this URL** - you'll need it for Step 2!

#### 🎨 Option B: Render

1. Go to **render.com** → Sign up/Login
2. Click **"New"** → **"Web Service"**
3. Connect your GitHub repo
4. Configure:
   - **Name**: `hotel-backend`
   - **Root Directory**: `server`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
5. Add **Environment Variables**:
   - `NODE_ENV` = `production`
   - `FRONTEND_URL` = `https://your-netlify-site.netlify.app`
6. **Deploy** → Render gives you a URL like: `https://your-app.onrender.com`

### Step 2: Update Netlify Environment Variables

1. Go to your **Netlify Dashboard**
2. Select your site → **Site settings**
3. Go to **Environment variables** (under Build & deploy)
4. Click **Add variable**
5. Add:
   - **Key**: `VITE_API_URL`
   - **Value**: `https://your-backend-url.railway.app` (use your actual backend URL from Step 1)
6. Click **Save**

### Step 3: Rebuild Netlify Site

1. Go to **Deploys** tab in Netlify
2. Click **"Trigger deploy"** → **"Clear cache and deploy site"**
3. Wait for deployment to complete

### Step 4: Test

1. Visit your Netlify site
2. Open browser DevTools (F12) → Console
3. Check for errors
4. The app should now connect to your backend!

## 🔍 Quick Check

**Test Backend:**
- Visit: `https://your-backend-url/health`
- Should show: `{"status":"ok","timestamp":"..."}`

**Test Frontend:**
- Visit your Netlify site
- Should load without "Network error" messages

## ⚠️ Important Notes

1. **Backend URL**: Make sure it starts with `https://` (not `http://`)
2. **CORS**: Backend is already configured to allow your Netlify domain
3. **Environment Variables**: Must be set in BOTH:
   - Netlify (for frontend): `VITE_API_URL`
   - Backend service (Railway/Render): `FRONTEND_URL`

## 🐛 Troubleshooting

### Still Getting Network Errors?

1. **Check backend is running:**
   - Visit: `https://your-backend-url/health`
   - If it doesn't load, backend isn't deployed correctly

2. **Check Netlify environment variable:**
   - Go to Netlify → Site settings → Environment variables
   - Verify `VITE_API_URL` is set correctly
   - **Redeploy** after adding/changing variables

3. **Check CORS:**
   - Make sure `FRONTEND_URL` in backend matches your Netlify URL exactly
   - Include `https://` and full domain

4. **Clear cache:**
   - Netlify → Deploys → Clear cache and deploy

## 📝 Summary

**You need:**
1. ✅ Frontend on Netlify (already done)
2. ✅ Backend on Railway/Render (do this now)
3. ✅ Set `VITE_API_URL` in Netlify (your backend URL)
4. ✅ Set `FRONTEND_URL` in backend (your Netlify URL)
5. ✅ Rebuild Netlify site

That's it! Your full-stack app will be live! 🚀


