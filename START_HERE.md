# 🚀 START HERE - Get SolarScope Running in 5 Minutes!

**Quick setup guide to get you started immediately**

---

## 📍 You Are Here

```
/Users/jayvora/Desktop/SolarScope/
```

All the code is ready! You just need to add **1 API key** and run it.

---

## ✅ Step 1: Get Your FREE Gemini API Key (2 minutes)

### Visit This Link:
```
https://ai.google.dev
```

### What to Do:
1. Click **"Get API Key"** or **"Get started"**
2. Sign in with **any Google account** (Gmail)
3. Click **"Create API key"**
4. **Copy the key** (starts with `AIza...`)

**Screenshot of what you'll see:**
```
┌─────────────────────────────────────────┐
│  Google AI Studio                       │
├─────────────────────────────────────────┤
│                                         │
│  Your API Keys                          │
│                                         │
│  [+ Create API key]                     │
│                                         │
│  Key: AIzaSyDXXXXXXXXXXXXXXX  [Copy]   │
│       Created: Nov 26, 2025             │
│                                         │
└─────────────────────────────────────────┘
```

**Copy that key!** You'll need it in the next step.

---

## ✅ Step 2: Add Your API Key to SolarScope (1 minute)

### Open This File:
```
/Users/jayvora/Desktop/SolarScope/backend/.env
```

### How to Open:
**Option A - Using TextEdit:**
```bash
open -e /Users/jayvora/Desktop/SolarScope/backend/.env
```

**Option B - Using Terminal:**
```bash
nano /Users/jayvora/Desktop/SolarScope/backend/.env
```

**Option C - Using VS Code/Any Editor:**
Just open the file: `backend/.env`

### What You'll See:
```bash
GEMINI_API_KEY=your_gemini_key_here
GEE_SERVICE_ACCOUNT=solarscope-gee@project-id.iam.gserviceaccount.com
GEE_PRIVATE_KEY_PATH=./gee-key.json
FLASK_ENV=development
PORT=5000
```

### What to Change:
Replace `your_gemini_key_here` with your actual key:

**BEFORE:**
```bash
GEMINI_API_KEY=your_gemini_key_here
```

**AFTER:**
```bash
GEMINI_API_KEY=AIzaSyDXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
```
↑ Use YOUR actual key from Step 1

### Save the File!
- TextEdit: Cmd+S
- Nano: Ctrl+O, Enter, Ctrl+X
- Other editors: Just save normally

---

## ✅ Step 3: Install Dependencies (2 minutes)

### Backend Dependencies:

```bash
cd /Users/jayvora/Desktop/SolarScope/backend

# Create virtual environment (if not done)
python3 -m venv venv

# Activate it
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt
```

You should see packages installing... ✅

### Frontend Dependencies:

Already done! (We ran `npm install` during setup)

---

## ✅ Step 4: Start SolarScope! (30 seconds)

### Easy Way - Use the Script:

```bash
cd /Users/jayvora/Desktop/SolarScope
./start.sh
```

This starts everything automatically!

### Manual Way - Two Terminals:

**Terminal 1 - Backend:**
```bash
cd /Users/jayvora/Desktop/SolarScope/backend
source venv/bin/activate
python app.py
```

You should see:
```
╔═══════════════════════════════════════╗
║      SolarScope Backend API           ║
║  AI-Powered Site Discovery Platform   ║
╚═══════════════════════════════════════╝

🚀 Server starting on http://localhost:5000
📊 Ready to analyze renewable energy sites!
```

**Terminal 2 - Frontend:**
```bash
cd /Users/jayvora/Desktop/SolarScope/frontend
npm run dev
```

You should see:
```
  VITE v5.x.x  ready in xxx ms

  ➜  Local:   http://localhost:3000/
```

---

## ✅ Step 5: Open in Browser!

### Go to:
```
http://localhost:3000
```

### You Should See:
- Beautiful landing page with solar theme 🌅
- "SolarScope" logo
- "Find optimal renewable energy sites in minutes, not months"
- **"Start Searching"** button

### Try It:
1. Click **"Start Searching"**
2. Click on example: **"50-acre solar site in Arizona, flat terrain"**
3. Click **"Find Optimal Sites"**
4. Watch the magic! ✨

---

## 🎉 Success Checklist

You'll know it's working when you see:

- ✅ Agent status updating (4 steps)
- ✅ Map populates with numbered markers
- ✅ Results panel shows 10 sites
- ✅ Click marker #1 to see detailed analysis
- ✅ AI explanation reads naturally

---

## 🐛 Troubleshooting

### Problem: "GEMINI_API_KEY not found"

**Solution:**
```bash
# Make sure you saved the .env file!
cat /Users/jayvora/Desktop/SolarScope/backend/.env

# You should see your actual API key, not "your_gemini_key_here"
```

### Problem: Backend won't start

**Solution:**
```bash
# Make sure virtual environment is activated
cd /Users/jayvora/Desktop/SolarScope/backend
source venv/bin/activate

# Reinstall dependencies
pip install -r requirements.txt

# Try again
python app.py
```

### Problem: Frontend shows blank page

**Solution:**
```bash
# Make sure backend is running first!
# Check: http://localhost:5000/api/health

# Should return JSON with "status": "healthy"
```

### Problem: "Port 5000 already in use"

**Solution:**
```bash
# Kill whatever's on port 5000
lsof -ti:5000 | xargs kill -9

# Or change port in backend/.env:
PORT=5001
```

### Problem: API key not working

**Solution:**
1. Make sure you copied the ENTIRE key (starts with `AIza`)
2. No spaces before/after the key in .env
3. Try creating a NEW key at https://ai.google.dev
4. Check you're not over the free tier limit (60 requests/min)

---

## 📁 File Locations Quick Reference

```
SolarScope/
│
├── backend/
│   ├── .env              ← ADD YOUR API KEY HERE! ⭐
│   ├── app.py            ← Main backend (run this)
│   └── requirements.txt  ← Python dependencies
│
├── frontend/
│   ├── src/              ← React components
│   └── package.json      ← Node dependencies
│
└── Documentation:
    ├── START_HERE.md         ← You are here!
    ├── API_KEYS_GUIDE.md     ← Detailed API key guide
    ├── SETUP_GUIDE.md        ← Detailed setup
    └── README.md             ← Full documentation
```

---

## 🎯 What You Need (Absolute Minimum)

### Required:
1. ✅ Gemini API key from https://ai.google.dev
2. ✅ Add to `backend/.env`
3. ✅ Python 3.10+
4. ✅ Node.js 18+

### Optional (for real satellite data):
- Google Earth Engine account (not needed for MVP!)

---

## 🚀 Quick Commands Cheat Sheet

```bash
# Start everything (easiest!)
cd /Users/jayvora/Desktop/SolarScope
./start.sh

# Start backend only
cd backend && source venv/bin/activate && python app.py

# Start frontend only
cd frontend && npm run dev

# Test if backend is working
curl http://localhost:5000/api/health

# Stop everything
./stop.sh
```

---

## ✅ You're Ready When:

1. ✅ You can open http://localhost:3000
2. ✅ You see the beautiful SolarScope landing page
3. ✅ Clicking "Start Searching" works
4. ✅ Submitting a query returns 10 sites on a map
5. ✅ Clicking a marker shows AI-generated explanation

**If all of the above work, YOU'RE READY TO DEMO! 🎉**

---

## 📞 Need More Help?

### Check these files:
- **Detailed API setup:** [API_KEYS_GUIDE.md](API_KEYS_GUIDE.md)
- **Full setup guide:** [SETUP_GUIDE.md](SETUP_GUIDE.md)
- **API documentation:** [docs/API.md](docs/API.md)
- **Testing guide:** [TESTING.md](TESTING.md)

### Watch the terminal logs:
Both backend and frontend print helpful error messages!

---

## 🎬 Ready to Demo?

Once everything works:

1. **Practice the flow** 3-5 times
2. **Try different queries** (examples in [DEMO_SCRIPT.md](DEMO_SCRIPT.md))
3. **Record your video** (4-minute script provided)
4. **Deploy to production** (configs included!)
5. **Submit to hackathon!** 🏆

---

**You've got this! Get that Gemini API key and you'll be running in 5 minutes!** ☀️🚀

**Next Step:** Get your API key → https://ai.google.dev
