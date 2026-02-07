# SolarScope Quick Reference 📋

One-page cheat sheet for developers.

---

## 🚀 Quick Start

```bash
# Clone and setup
cd SolarScope

# Backend
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
# Edit .env and add GEMINI_API_KEY
python app.py

# Frontend (new terminal)
cd frontend
npm install
npm run dev
```

**URLs:**
- Frontend: http://localhost:3000
- Backend: http://localhost:5000

---

## 📁 Project Structure

```
SolarScope/
├── frontend/           # React + Vite
│   ├── src/
│   │   ├── components/ # UI components
│   │   ├── App.jsx     # Main app
│   │   └── main.jsx    # Entry point
│   └── package.json
├── backend/            # Flask API
│   ├── app.py          # Main Flask app
│   ├── gemini_agents.py# AI agents
│   ├── gee_queries.py  # Satellite data
│   └── utils.py        # Helper functions
└── docs/               # Documentation
```

---

## 🔑 Environment Variables

**Backend (.env):**
```bash
GEMINI_API_KEY=AIza...        # Required
GEE_SERVICE_ACCOUNT=...       # Optional (MVP uses simulated data)
FLASK_ENV=development
PORT=5000
```

**Frontend (.env):**
```bash
VITE_API_URL=http://localhost:5000
```

---

## 🌐 API Endpoints

### POST /api/analyze
**Main analysis endpoint**

```bash
curl -X POST http://localhost:5000/api/analyze \
  -H "Content-Type: application/json" \
  -d '{
    "query": "solar farm in Arizona",
    "energy_type": "solar"
  }'
```

**Response:** Top 10 ranked sites with AI explanations

### GET /api/health
**Health check**
```bash
curl http://localhost:5000/api/health
```

### GET /api/datasets
**Available datasets**
```bash
curl http://localhost:5000/api/datasets
```

---

## 🎨 Key Components

### Frontend

| Component | Purpose |
|-----------|---------|
| `Hero.jsx` | Landing page |
| `SearchPanel.jsx` | Query input + filters |
| `MapView.jsx` | Leaflet map with markers |
| `ResultsPanel.jsx` | Top 10 sites list |
| `SiteDetailModal.jsx` | Detailed site info |
| `AgentStatus.jsx` | Real-time agent progress |
| `CriteriaSliders.jsx` | Weight adjustments |

### Backend

| File | Purpose |
|------|---------|
| `app.py` | Flask routes |
| `gemini_agents.py` | AI query parsing & explanations |
| `gee_queries.py` | Satellite data queries |
| `utils.py` | Scoring & boundaries |

---

## 🎯 Scoring Algorithm

**Formula:**
```
Final Score = (
  Irradiance Score × 0.4 +
  Slope Score × 0.3 +
  Grid Distance Score × 0.2 +
  Land Cover Score × 0.1
) × 100
```

**Normalization:**
- **Irradiance:** 3-7.5 kWh/m²/day → 0-100
- **Slope:** 0-15° → 100-0 (inverse)
- **Grid:** 0-50 km → 100-0 (inverse)
- **Land Cover:** Categorical (barren=95, water=0)

---

## 🧪 Testing

**Quick test:**
```bash
# Backend health
curl http://localhost:5000/api/health

# Frontend
# Open http://localhost:3000
# Click "Start Searching"
# Use example query
```

**Run unit tests:**
```bash
# Backend
cd backend
pytest

# Frontend
cd frontend
npm test
```

---

## 🐛 Common Issues

| Issue | Solution |
|-------|----------|
| Port 5000 in use | `lsof -ti:5000 \| xargs kill -9` |
| Module not found | `pip install -r requirements.txt` |
| Gemini API error | Check API key in .env |
| Map not loading | Verify Leaflet CSS in index.html |
| CORS error | Check Flask-CORS is installed |

---

## 📦 Dependencies

**Frontend:**
```json
react, react-dom, axios, leaflet, react-leaflet,
tailwindcss, lucide-react, vite
```

**Backend:**
```
flask, flask-cors, google-generativeai,
earthengine-api, python-dotenv, gunicorn
```

---

## 🎨 Brand Colors

```css
--solar-orange: #FF6B35
--solar-gold: #F7931E
--solar-green: #2D5016
--solar-green-deep: #0A4D3C
--solar-blue: #4A90E2
```

---

## 📊 Demo Queries

```
"50-acre solar farm in Arizona with excellent sun exposure"
"Large solar installation in California near grid"
"Solar site in Nevada, flat terrain"
"30-acre solar farm in Texas with high irradiance"
```

---

## 🚢 Deployment

**Frontend (Vercel):**
```bash
cd frontend
vercel deploy
```

**Backend (Render):**
```bash
# Push to GitHub
# Connect Render to repo
# Add environment variables
```

---

## 🔗 Quick Links

- **GitHub**: github.com/yourusername/solarscope
- **Gemini API**: ai.google.dev
- **Google Earth Engine**: earthengine.google.com
- **Docs**: README.md, SETUP_GUIDE.md

---

## 💡 Development Tips

1. **Keep backend logs visible** during dev
2. **Use React DevTools** for debugging
3. **Test on multiple browsers**
4. **Cache API responses** during dev
5. **Use example queries** for consistency

---

## 📞 Getting Help

- Check `SETUP_GUIDE.md` for detailed setup
- Check `TESTING.md` for test procedures
- Check `API.md` for endpoint details
- Open GitHub issue for bugs

---

**Happy coding! ☀️🚀**
