# SolarScope Testing Guide 🧪

This document provides comprehensive testing procedures for SolarScope.

---

## ✅ Pre-Demo Testing Checklist

Run through this checklist before any demo or presentation:

### Backend Tests

- [ ] Backend starts without errors (`python app.py`)
- [ ] Health check returns 200: `curl http://localhost:5000/api/health`
- [ ] Gemini API key is valid (check logs for API errors)
- [ ] All routes respond correctly

### Frontend Tests

- [ ] Frontend builds successfully (`npm run dev`)
- [ ] No console errors on page load (F12 → Console)
- [ ] Hero page displays with correct branding
- [ ] All images and icons load
- [ ] Responsive design works (test at 768px, 1024px, 1920px)

### Integration Tests

- [ ] Search triggers backend API call
- [ ] Agent status updates in real-time
- [ ] Map populates with markers
- [ ] Clicking marker opens site detail modal
- [ ] All 10 sites display correctly
- [ ] AI explanations are coherent and relevant

---

## 🎯 Test Scenarios

### Scenario 1: Basic Search (Happy Path)

**Steps:**
1. Open `http://localhost:3000`
2. Click "Start Searching"
3. Click on example query: "50-acre solar site in Arizona, flat terrain"
4. Click "Find Optimal Sites"

**Expected Results:**
- Agent status shows 4 steps completing
- Map displays 10 markers in Arizona
- Results panel shows top 10 sites
- Site #1 has score between 85-95
- Each site has valid coordinates
- All metrics are reasonable:
  - Solar irradiance: 4.5-7.5 kWh/m²/day
  - Slope: 0-10 degrees
  - Grid distance: 0.5-25 km
  - Land cover: barren/grassland/cropland

**Time to Complete:** <5 seconds

---

### Scenario 2: Custom Query

**Steps:**
1. Type: "Large solar installation in California with high sun exposure"
2. Expand "Advanced Filters"
3. Set acreage to 100
4. Adjust weights:
   - Solar Irradiance: 60%
   - Terrain Slope: 20%
   - Grid Distance: 10%
   - Land Cover: 10%
5. Click "Find Optimal Sites"

**Expected Results:**
- Sites appear in California (lat ~32-42°N, lon ~-114 to -124°W)
- Top sites have higher solar irradiance scores (80-95)
- Results reflect weight adjustments
- Query is parsed correctly by Gemini

---

### Scenario 3: Multiple States

**Test each state individually:**

```
Arizona:    "Solar farm in Arizona"
California: "Solar site in California"
Texas:      "Solar installation in Texas"
Nevada:     "Solar farm in Nevada"
New Mexico: "Solar site in New Mexico"
```

**Expected Results:**
- Coordinates match state boundaries
- Site characteristics vary by region:
  - Arizona: High irradiance (6-7.5 kWh/m²/day)
  - Texas: Moderate irradiance (5-6.5 kWh/m²/day)
  - California: Variable irradiance (5-7 kWh/m²/day)

---

### Scenario 4: Site Detail Modal

**Steps:**
1. Run any search
2. Click marker #1
3. Verify modal displays all sections

**Expected Results:**
- Modal opens smoothly
- Overall score matches marker
- 4 progress bars display correctly:
  - Colors: Green (90+), Yellow (75-89), Orange (60-74), Red (<60)
  - Widths match percentages
- AI explanation is 3-4 sentences
- No placeholder text or undefined values
- Action buttons are clickable (even if non-functional for MVP)

---

### Scenario 5: Edge Cases

#### Empty Query
**Steps:** Submit search with empty text field
**Expected:** Uses default query or shows validation error

#### Very Long Query
**Steps:** Paste 500+ character query
**Expected:** Truncates gracefully or processes normally

#### Invalid State
**Steps:** Manually change region to "Mars" via browser console
**Expected:** Defaults to Arizona or shows error

#### Network Timeout
**Steps:** Kill backend, submit query
**Expected:** Error state in agent status, user-friendly message

#### API Quota Exceeded
**Steps:** Make 100+ rapid queries
**Expected:** Graceful degradation or rate limit message

---

## 🔧 Unit Tests

### Backend Unit Tests

Create `backend/test_app.py`:

```python
import pytest
from app import app

@pytest.fixture
def client():
    app.config['TESTING'] = True
    with app.test_client() as client:
        yield client

def test_health_check(client):
    """Test health endpoint"""
    response = client.get('/api/health')
    assert response.status_code == 200
    data = response.get_json()
    assert data['status'] == 'healthy'

def test_analyze_endpoint(client):
    """Test analyze endpoint"""
    payload = {
        'query': 'solar farm in Arizona',
        'energy_type': 'solar',
        'filters': {
            'region': 'Arizona',
            'acreage': 50
        }
    }
    response = client.post('/api/analyze', json=payload)
    assert response.status_code == 200
    data = response.get_json()
    assert data['status'] == 'success'
    assert len(data['sites']) == 10
    assert data['sites'][0]['rank'] == 1

def test_datasets_endpoint(client):
    """Test datasets endpoint"""
    response = client.get('/api/datasets')
    assert response.status_code == 200
    data = response.get_json()
    assert 'solar' in data
    assert 'elevation' in data
```

**Run tests:**
```bash
cd backend
pytest test_app.py -v
```

---

### Frontend Unit Tests

Create `frontend/src/App.test.jsx`:

```jsx
import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import App from './App'

describe('App', () => {
  it('renders hero page initially', () => {
    render(<App />)
    expect(screen.getByText(/Find optimal renewable energy sites/i)).toBeInTheDocument()
  })

  it('shows start searching button', () => {
    render(<App />)
    const button = screen.getByText(/Start Searching/i)
    expect(button).toBeInTheDocument()
  })
})
```

**Run tests:**
```bash
cd frontend
npm test
```

---

## 🌐 API Testing

### Using cURL

**Health Check:**
```bash
curl http://localhost:5000/api/health
```

**Analyze Sites:**
```bash
curl -X POST http://localhost:5000/api/analyze \
  -H "Content-Type: application/json" \
  -d '{
    "query": "solar farm in Arizona",
    "energy_type": "solar",
    "filters": {
      "region": "Arizona",
      "acreage": 50,
      "criteria_weights": {
        "irradiance": 0.4,
        "slope": 0.3,
        "grid_distance": 0.2,
        "land_cover": 0.1
      }
    }
  }'
```

**Get Datasets:**
```bash
curl http://localhost:5000/api/datasets
```

### Using Postman

Import this collection:

```json
{
  "info": {
    "name": "SolarScope API",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "item": [
    {
      "name": "Health Check",
      "request": {
        "method": "GET",
        "url": "http://localhost:5000/api/health"
      }
    },
    {
      "name": "Analyze Sites",
      "request": {
        "method": "POST",
        "url": "http://localhost:5000/api/analyze",
        "header": [
          {
            "key": "Content-Type",
            "value": "application/json"
          }
        ],
        "body": {
          "mode": "raw",
          "raw": "{\n  \"query\": \"solar farm in Arizona\",\n  \"energy_type\": \"solar\",\n  \"filters\": {\n    \"region\": \"Arizona\",\n    \"acreage\": 50\n  }\n}"
        }
      }
    }
  ]
}
```

---

## 🎨 Visual Regression Testing

### Manual Visual Checks

**Hero Page:**
- [ ] Logo displays correctly
- [ ] Gradient background renders
- [ ] Stats are aligned
- [ ] Buttons have hover effects
- [ ] Text is readable on all backgrounds

**Search Interface:**
- [ ] Layout is responsive
- [ ] Sliders move smoothly
- [ ] Example chips are clickable
- [ ] Search button changes state
- [ ] Agent status icons animate

**Map View:**
- [ ] Map tiles load
- [ ] Markers are visible
- [ ] Hover tooltips work
- [ ] Zoom controls function
- [ ] Results panel doesn't overlap markers

**Site Modal:**
- [ ] Modal centers on screen
- [ ] Close button works
- [ ] Progress bars animate
- [ ] Text is formatted correctly
- [ ] Scrollable if content is long

---

## 📊 Performance Testing

### Load Time Targets

- Hero page: <1 second
- Search interface: <500ms
- API response: <3 seconds
- Map render: <2 seconds
- Modal open: <200ms

### Monitoring Performance

**Chrome DevTools:**
1. F12 → Performance tab
2. Click Record
3. Perform actions
4. Stop recording
5. Analyze:
   - Scripting should be <500ms
   - Rendering should be <300ms
   - Painting should be <100ms

**Lighthouse Audit:**
1. F12 → Lighthouse tab
2. Select "Performance" category
3. Click "Generate report"
4. Target scores:
   - Performance: 90+
   - Accessibility: 95+
   - Best Practices: 90+
   - SEO: 85+

---

## 🐛 Known Issues & Workarounds

### Issue: Map markers overlap
**Workaround:** Zoom in or use marker clustering

### Issue: Gemini API rate limits
**Workaround:** Add exponential backoff, use caching

### Issue: Long AI explanations
**Workaround:** Add character limit to prompt

### Issue: Mobile responsiveness
**Workaround:** Add media queries for <768px screens

---

## 🧪 Test Data

### Valid Test Queries

```
"50-acre solar farm in Arizona with excellent sun exposure"
"Large solar installation in California near existing grid infrastructure"
"Solar site in Nevada with flat terrain and minimal environmental impact"
"30-acre solar farm in Texas with high irradiance"
"Solar installation in New Mexico, gentle slopes preferred"
```

### Expected Score Ranges

- **Excellent sites** (90-100): High irradiance + flat + close to grid
- **Good sites** (75-89): 2-3 strong metrics
- **Fair sites** (60-74): 1-2 strong metrics
- **Poor sites** (<60): Multiple weak metrics

### Sample API Response

```json
{
  "status": "success",
  "sites": [
    {
      "rank": 1,
      "score": 92.5,
      "coordinates": {"lat": 33.4484, "lon": -112.0740},
      "metrics": {
        "solar_irradiance": 6.8,
        "solar_irradiance_score": 94,
        "slope": 1.2,
        "slope_score": 96,
        "grid_distance": 2.4,
        "grid_distance_score": 88,
        "land_cover": "barren",
        "land_cover_score": 85
      },
      "explanation": "This site ranks #1 because it receives exceptional solar irradiance..."
    }
  ]
}
```

---

## ✅ Final Pre-Submission Checklist

- [ ] All dependencies install cleanly
- [ ] README has accurate setup instructions
- [ ] .env.example has all required variables
- [ ] No hardcoded API keys in code
- [ ] All console.logs removed (or toggled by DEBUG flag)
- [ ] Error messages are user-friendly
- [ ] Code is commented
- [ ] Git history is clean
- [ ] Demo video is uploaded
- [ ] Screenshots are in docs/
- [ ] Devpost submission is complete

---

**Happy Testing! 🚀**
