# Troubleshooting: Network Error

## Error Message
"Network error. Please check if the server is running."

This error occurs when the frontend cannot connect to the backend API server.

## Quick Fixes

### 1. Check if Server is Running

**Open a new terminal and run:**
```bash
cd server
npm start
```

You should see:
```
🚀 Server running on http://localhost:3000
📊 Environment: development
💾 Database: Connected
```

### 2. Verify Server is Accessible

**Test the health endpoint:**
- Open browser: http://localhost:3000/health
- Or use curl: `curl http://localhost:3000/health`

You should see: `{"status":"ok","timestamp":"..."}`

### 3. Check Frontend API URL

**Create/Update `.env` file in the root directory:**
```env
VITE_API_URL=http://localhost:3000
```

**Important:** After creating/updating `.env`, restart the frontend dev server!

### 4. Restart Both Servers

**Terminal 1 - Backend:**
```bash
cd server
npm run dev
```

**Terminal 2 - Frontend:**
```bash
npm run dev
```

### 5. Check Port Conflicts

**If port 3000 is already in use:**

**Windows:**
```bash
netstat -ano | findstr :3000
```

**Kill the process:**
```bash
taskkill /PID <PID_NUMBER> /F
```

**Or change server port in `server/index.js`:**
```javascript
const PORT = process.env.PORT || 3001; // Change to 3001
```

**And update `.env`:**
```env
VITE_API_URL=http://localhost:3001
```

### 6. Check CORS Configuration

If you're accessing from a different origin, ensure CORS is configured in `server/index.js`.

### 7. Check Browser Console

Open browser DevTools (F12) → Console tab to see detailed error messages.

### 8. Verify Database

**Check if database file exists:**
```bash
cd server
dir hotel.db
```

If missing, the server will create it automatically on first run.

## Common Issues

### Issue: Server starts but immediately crashes
**Solution:** Check if SQLite is installed and database permissions are correct.

### Issue: "Cannot GET /api/rooms"
**Solution:** Make sure you're accessing the correct endpoint. The API base is `/api/rooms`, not `/rooms`.

### Issue: CORS errors in browser
**Solution:** The server CORS is configured to allow `localhost:8080`. If using a different port, update `server/index.js`.

### Issue: Environment variable not working
**Solution:** 
- Make sure `.env` is in the root directory (not in `src/`)
- Restart the Vite dev server after creating `.env`
- Vite only reads variables prefixed with `VITE_`

## Step-by-Step Debugging

1. **Start Backend:**
   ```bash
   cd server
   npm start
   ```
   ✅ Should see: "Server running on http://localhost:3000"

2. **Test Backend:**
   - Open: http://localhost:3000/health
   - Should return: `{"status":"ok",...}`

3. **Check Frontend Config:**
   - Verify `.env` exists with `VITE_API_URL=http://localhost:3000`
   - Restart frontend if `.env` was just created

4. **Start Frontend:**
   ```bash
   npm run dev
   ```
   ✅ Should see: "Local: http://localhost:8080"

5. **Check Browser:**
   - Open: http://localhost:8080
   - Open DevTools (F12) → Network tab
   - Look for failed requests to `localhost:3000`

## Still Not Working?

1. **Check firewall** - Windows Firewall might be blocking Node.js
2. **Check antivirus** - Some antivirus software blocks local servers
3. **Try different browser** - Clear cache and cookies
4. **Check Node.js version** - Should be Node.js 18+

## Quick Test Script

Run this to test the connection:

```bash
# Test backend
curl http://localhost:3000/health

# Test API endpoint
curl http://localhost:3000/api/rooms
```

If these work, the backend is fine. The issue is with the frontend connection.


