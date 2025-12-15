# Quick Fix: Network Error

## The Problem
"Network error. Please check if the server is running."

This means your **backend server is not running** or the frontend can't connect to it.

## ✅ Solution (3 Steps)

### Step 1: Start the Backend Server

**Open a NEW terminal window and run:**
```bash
cd server
npm start
```

**You should see:**
```
🚀 Server running on http://localhost:3000
📊 Environment: development
💾 Database: Connected
```

**Keep this terminal open!** The server must stay running.

### Step 2: Create .env File (If Missing)

**In the root directory (not in server/), create `.env` file:**
```env
VITE_API_URL=http://localhost:3000
```

### Step 3: Start the Frontend

**Open ANOTHER terminal window and run:**
```bash
npm run dev
```

**You should see:**
```
  ➜  Local:   http://localhost:8080/
```

## 🎯 Quick Test

1. **Test Backend:** Open http://localhost:3000/health in browser
   - Should show: `{"status":"ok","timestamp":"..."}`

2. **Test Frontend:** Open http://localhost:8080 in browser
   - Should load the hotel management app

## ⚠️ Common Mistakes

1. **Only running frontend** - You MUST run both servers!
2. **Wrong directory** - Make sure you're in the right folder
3. **Port already in use** - Close other applications using port 3000
4. **Forgot to restart** - After creating `.env`, restart the frontend

## 🔧 If Still Not Working

**Run the diagnostic script:**
```bash
check-server.bat
```

**Or manually check:**
```bash
# Check if server is running
curl http://localhost:3000/health

# Check port usage
netstat -ano | findstr :3000
```

## 📝 Summary

**You need TWO terminals running:**

**Terminal 1 (Backend):**
```bash
cd server
npm start
```

**Terminal 2 (Frontend):**
```bash
npm run dev
```

Both must be running simultaneously!


