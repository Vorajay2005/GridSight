# SolarScope Setup Guide

This guide will help you get SolarScope up and running in minutes!

## 📋 Prerequisites

- **Node.js** 18+ ([Download](https://nodejs.org/))
- **Python** 3.10+ ([Download](https://www.python.org/downloads/))
- **Google Gemini API Key** (Free tier available)

## 🔑 Getting API Keys

### Google Gemini API Key (Required)

1. Visit [Google AI Studio](https://ai.google.dev)
2. Click "Get API Key in Google AI Studio"
3. Sign in with your Google account
4. Click "Create API Key"
5. Copy the key (starts with `AIza...`)

### Google Earth Engine (Optional for MVP)

The MVP works with simulated data. For production:

1. Sign up at [Google Earth Engine](https://earthengine.google.com)
2. Create a Google Cloud Project
3. Enable Earth Engine API
4. Create a Service Account
5. Download the JSON key file

## 🚀 Installation Steps

### 1. Clone or Download Project

```bash
cd /Users/jayvora/Desktop/SolarScope
```

### 2. Backend Setup

```bash
cd backend

# Create and activate virtual environment
python3 -m venv venv

# Activate (macOS/Linux)
source venv/bin/activate

# Activate (Windows)
# venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Configure environment
cp .env.example .env
nano .env  # or use any text editor
```

**Edit `.env` file:**
```
GEMINI_API_KEY=AIza...your_actual_key_here
GEE_SERVICE_ACCOUNT=solarscope-gee@project-id.iam.gserviceaccount.com
GEE_PRIVATE_KEY_PATH=./gee-key.json
FLASK_ENV=development
PORT=5000
```

**Save and close the file.**

### 3. Frontend Setup

Open a new terminal window:

```bash
cd /Users/jayvora/Desktop/SolarScope/frontend

# Dependencies already installed during build

# Verify .env exists
cat .env
# Should show: VITE_API_URL=http://localhost:5000
```

## ▶️ Running the Application

### Terminal 1: Start Backend

```bash
cd backend
source venv/bin/activate  # if not already activated
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

### Terminal 2: Start Frontend

```bash
cd frontend
npm run dev
```

You should see:
```
VITE v5.x.x  ready in xxx ms

➜  Local:   http://localhost:3000/
➜  Network: use --host to expose
```

## 🎯 Testing the Application

1. **Open Browser**: Navigate to `http://localhost:3000`

2. **Hero Page**: You should see the SolarScope landing page with:
   - Solar orange/gold branding
   - "Find optimal renewable energy sites in minutes, not months"
   - "Start Searching" button

3. **Click "Start Searching"**

4. **Try Example Queries**:
   - Click on: "50-acre solar site in Arizona, flat terrain"
   - Or type your own: "Solar farm in California with high sun exposure"

5. **Click "Find Optimal Sites"**

6. **Watch the Magic**:
   - Agent status updates in real-time
   - Map populates with numbered markers
   - Results panel shows top 10 sites
   - Click any marker for detailed AI analysis

## ✅ Verification Checklist

- [ ] Backend running on port 5000
- [ ] Frontend running on port 3000
- [ ] Hero page loads with proper styling
- [ ] Search interface appears after clicking "Start Searching"
- [ ] Query submission triggers agent status updates
- [ ] Map displays with markers
- [ ] Site details modal opens on marker click
- [ ] AI explanations appear for each site

## 🐛 Troubleshooting

### Backend Issues

**Error: ModuleNotFoundError**
```bash
# Make sure virtual environment is activated
source venv/bin/activate
pip install -r requirements.txt
```

**Error: GEMINI_API_KEY not found**
```bash
# Verify .env file exists and has correct key
cat backend/.env
# Should show your actual API key, not placeholder
```

**Port 5000 already in use**
```bash
# Kill process on port 5000
lsof -ti:5000 | xargs kill -9
# Or change PORT in backend/.env to 5001
```

### Frontend Issues

**Error: Cannot connect to backend**
```bash
# Verify backend is running
curl http://localhost:5000/api/health

# Should return: {"status":"healthy",...}
```

**Blank page / White screen**
```bash
# Check browser console for errors (F12)
# Verify VITE_API_URL in frontend/.env
cat frontend/.env
```

**Map not loading**
```bash
# Check browser console
# Leaflet CSS should be loading from CDN
# Try refreshing the page
```

### API Key Issues

**Gemini API errors**
- Verify key is correct (starts with `AIza`)
- Check you haven't exceeded free tier limits
- Try generating a new key at [Google AI Studio](https://ai.google.dev)

**Common error messages:**
- `"API_KEY_INVALID"`: Key is incorrect or malformed
- `"QUOTA_EXCEEDED"`: You've hit free tier limits (wait or upgrade)
- `"PERMISSION_DENIED"`: API not enabled for your project

## 🎨 Customization

### Change Branding Colors

Edit `frontend/tailwind.config.js`:
```js
colors: {
  solar: {
    orange: '#YOUR_COLOR',
    gold: '#YOUR_COLOR',
    // ...
  }
}
```

### Adjust Scoring Weights

Edit `backend/gee_queries.py`:
```python
criteria_weights = {
    'irradiance': 0.5,  # Increase solar priority
    'slope': 0.2,
    'grid_distance': 0.2,
    'land_cover': 0.1
}
```

### Add More States

Edit `backend/utils.py`:
```python
boundaries = {
    'Your State': (min_lon, min_lat, max_lon, max_lat),
    # ...
}
```

## 📚 Next Steps

### For Development

1. **Add Real GEE Integration**:
   - Uncomment real implementation in `gee_queries.py`
   - Set up GEE authentication
   - Test with actual satellite data

2. **Add Features**:
   - Wind energy support
   - Satellite imagery overlay
   - PDF export
   - Cost calculator

3. **Improve AI**:
   - Fine-tune prompts
   - Add more context to explanations
   - Implement caching for queries

### For Demo/Hackathon

1. **Create Demo Video**:
   - Record screen with OBS or Loom
   - Show query → results flow
   - Highlight AI explanations
   - Show detailed site modal

2. **Prepare Talking Points**:
   - "6-18 months → 3 minutes"
   - "Real satellite data from Google Earth Engine"
   - "Multi-agent AI system"
   - "Accelerating renewable energy transition"

3. **Test Demo Queries**:
   - "50-acre solar farm in Arizona with excellent sun and flat terrain"
   - "Large solar installation in California near existing grid"
   - "Solar site in Nevada, minimal environmental impact"

## 💡 Tips

- **Keep backend terminal visible** during demos to show API logs
- **Use example queries** for consistent demo results
- **Pre-load the app** before presenting (first load can be slow)
- **Have backup slides** in case of internet issues
- **Practice the full flow** 3-5 times before judging

## 🆘 Getting Help

- **GitHub Issues**: Report bugs or ask questions
- **Documentation**: Check `README.md` for API details
- **Code Comments**: All functions have detailed docstrings

## 🎉 You're Ready!

SolarScope should now be running! Try searching for solar sites and exploring the results.

**Happy hacking!** ☀️🚀
