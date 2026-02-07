# SolarScope API Documentation

**Version:** 1.0.0
**Base URL:** `http://localhost:5000` (development) | `https://api.solarscope.app` (production)

---

## 📋 Overview

The SolarScope API provides endpoints for analyzing renewable energy sites using AI and satellite data. All endpoints return JSON responses.

### Authentication

Currently, no authentication is required for the MVP. Production version will use API keys.

### Rate Limits

- Free tier: 10 requests/hour
- Pro tier: Unlimited (planned)

### Response Format

All successful responses follow this structure:

```json
{
  "status": "success",
  "data": { ... }
}
```

Error responses:

```json
{
  "status": "error",
  "message": "Error description"
}
```

---

## 🔌 Endpoints

### 1. Health Check

**GET** `/api/health`

Check if the API is running and services are connected.

**Request:**
```bash
curl http://localhost:5000/api/health
```

**Response:** `200 OK`
```json
{
  "status": "healthy",
  "gee_connected": true,
  "gemini_connected": true,
  "version": "1.0.0",
  "timestamp": "2025-11-26T10:30:00Z"
}
```

---

### 2. Analyze Sites

**POST** `/api/analyze`

Analyze potential renewable energy sites based on user query.

**Request Headers:**
```
Content-Type: application/json
```

**Request Body:**
```json
{
  "query": "50-acre solar farm in Arizona with high irradiance",
  "energy_type": "solar",
  "filters": {
    "acreage": 50,
    "region": "Arizona",
    "criteria_weights": {
      "irradiance": 0.4,
      "slope": 0.3,
      "grid_distance": 0.2,
      "land_cover": 0.1
    }
  }
}
```

**Parameters:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `query` | string | Yes | Natural language description of desired site |
| `energy_type` | string | No | Energy type: "solar", "wind", "hydro" (default: "solar") |
| `filters` | object | No | Advanced filtering options |
| `filters.acreage` | number | No | Desired site size in acres (default: 50) |
| `filters.region` | string | No | US state name (default: "Arizona") |
| `filters.criteria_weights` | object | No | Scoring criteria weights (must sum to 1.0) |

**Criteria Weights:**
- `irradiance`: Weight for solar irradiance (0-1)
- `slope`: Weight for terrain slope (0-1)
- `grid_distance`: Weight for grid proximity (0-1)
- `land_cover`: Weight for land suitability (0-1)

**Response:** `200 OK`
```json
{
  "status": "success",
  "query_parsed": {
    "energy_type": "solar",
    "region": "Arizona",
    "acreage": 50,
    "priorities": ["high irradiance"],
    "constraints": [],
    "confidence": 0.95
  },
  "sites": [
    {
      "rank": 1,
      "score": 92.5,
      "coordinates": {
        "lat": 33.4484,
        "lon": -112.0740
      },
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
      "explanation": "This site ranks #1 because it receives exceptional solar irradiance (6.8 kWh/m²/day, top 5% in Arizona) with nearly flat terrain perfect for panel installation. Located just 2.4km from an existing transmission line, reducing grid connection costs significantly. The barren land classification means minimal environmental concerns and faster permitting."
    }
    // ... 9 more sites
  ],
  "metadata": {
    "locations_analyzed": 100,
    "analysis_time_seconds": 2.8,
    "datasets_used": [
      "NASA/POWER/Global_Horizontal_Irradiance",
      "USGS/SRTMGL1_003",
      "ESA/WorldCover/v100"
    ],
    "timestamp": "2025-11-26T10:30:00Z",
    "region": "Arizona",
    "energy_type": "solar"
  }
}
```

**Error Responses:**

`400 Bad Request` - Invalid parameters
```json
{
  "status": "error",
  "message": "Criteria weights must sum to 1.0"
}
```

`500 Internal Server Error` - Server error
```json
{
  "status": "error",
  "message": "Failed to query satellite data"
}
```

---

### 3. Get Datasets

**GET** `/api/datasets`

Retrieve list of available satellite datasets.

**Request:**
```bash
curl http://localhost:5000/api/datasets
```

**Response:** `200 OK`
```json
{
  "solar": [
    {
      "name": "NASA POWER GHI",
      "id": "NASA/POWER/Global_Horizontal_Irradiance",
      "description": "Daily solar irradiance data",
      "resolution": "0.5° (~50km)"
    },
    {
      "name": "NREL NSRDB",
      "id": "NREL/NSRDB",
      "description": "National Solar Radiation Database",
      "resolution": "4km"
    }
  ],
  "elevation": [
    {
      "name": "SRTM Digital Elevation",
      "id": "USGS/SRTMGL1_003",
      "description": "Shuttle Radar Topography Mission elevation data",
      "resolution": "30m"
    }
  ],
  "land_cover": [
    {
      "name": "ESA WorldCover",
      "id": "ESA/WorldCover/v100",
      "description": "Global land cover classification",
      "resolution": "10m"
    }
  ],
  "protected_areas": [
    {
      "name": "USGS PAD-US",
      "id": "USGS/GAP/PADUS",
      "description": "Protected areas database",
      "resolution": "Vector"
    }
  ]
}
```

---

### 4. Explain Site

**POST** `/api/explain-site`

Generate detailed explanation for a specific site.

**Request Body:**
```json
{
  "site_data": {
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
    }
  },
  "context": "solar farm in Arizona"
}
```

**Response:** `200 OK`
```json
{
  "status": "success",
  "explanation": "This site ranks #1 because it receives exceptional solar irradiance...",
  "key_strengths": [
    "High solar irradiance (6.8 kWh/m²/day)",
    "Flat terrain (1.2° slope)",
    "Close to grid (2.4 km)"
  ],
  "considerations": [
    "Standard environmental and permitting assessments needed"
  ],
  "next_steps": [
    "Conduct detailed geotechnical survey",
    "Verify land ownership and zoning",
    "Contact utility for interconnection study",
    "Assess environmental impact",
    "Obtain necessary permits and approvals"
  ]
}
```

---

## 📊 Data Models

### Site Object

```typescript
{
  rank: number,              // 1-10
  score: number,             // 0-100
  coordinates: {
    lat: number,             // Latitude
    lon: number              // Longitude
  },
  metrics: {
    solar_irradiance: number,        // kWh/m²/day
    solar_irradiance_score: number,  // 0-100
    slope: number,                   // degrees
    slope_score: number,             // 0-100
    grid_distance: number,           // km
    grid_distance_score: number,     // 0-100
    land_cover: string,              // "barren", "grassland", etc.
    land_cover_score: number         // 0-100
  },
  explanation: string        // AI-generated explanation
}
```

### Query Parsed Object

```typescript
{
  energy_type: string,       // "solar", "wind", "hydro"
  region: string,            // US state name
  acreage: number,           // acres
  priorities: string[],      // Extracted priorities
  constraints: string[],     // Extracted constraints
  confidence: number         // 0-1, AI confidence in parsing
}
```

---

## 🧪 Example Requests

### cURL Examples

**Basic Analysis:**
```bash
curl -X POST http://localhost:5000/api/analyze \
  -H "Content-Type: application/json" \
  -d '{
    "query": "solar farm in Arizona"
  }'
```

**Advanced Analysis with Custom Weights:**
```bash
curl -X POST http://localhost:5000/api/analyze \
  -H "Content-Type: application/json" \
  -d '{
    "query": "large solar installation in California",
    "energy_type": "solar",
    "filters": {
      "acreage": 100,
      "region": "California",
      "criteria_weights": {
        "irradiance": 0.5,
        "slope": 0.2,
        "grid_distance": 0.2,
        "land_cover": 0.1
      }
    }
  }'
```

### JavaScript Example

```javascript
const analyzeSites = async (query) => {
  const response = await fetch('http://localhost:5000/api/analyze', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query: query,
      energy_type: 'solar',
      filters: {
        acreage: 50,
        region: 'Arizona',
        criteria_weights: {
          irradiance: 0.4,
          slope: 0.3,
          grid_distance: 0.2,
          land_cover: 0.1
        }
      }
    })
  });

  const data = await response.json();
  console.log('Top site:', data.sites[0]);
  return data;
};

analyzeSites('50-acre solar farm in Arizona');
```

### Python Example

```python
import requests

def analyze_sites(query):
    url = "http://localhost:5000/api/analyze"
    payload = {
        "query": query,
        "energy_type": "solar",
        "filters": {
            "acreage": 50,
            "region": "Arizona",
            "criteria_weights": {
                "irradiance": 0.4,
                "slope": 0.3,
                "grid_distance": 0.2,
                "land_cover": 0.1
            }
        }
    }

    response = requests.post(url, json=payload)
    data = response.json()

    if data['status'] == 'success':
        print(f"Found {len(data['sites'])} sites")
        print(f"Top site score: {data['sites'][0]['score']}")
        return data['sites']
    else:
        print(f"Error: {data['message']}")
        return None

sites = analyze_sites("solar farm in Arizona")
```

---

## 🔐 Security Considerations

### Current MVP
- No authentication required
- CORS enabled for all origins
- No rate limiting

### Production Recommendations
1. **API Key Authentication**
   ```
   Authorization: Bearer YOUR_API_KEY
   ```

2. **Rate Limiting**
   - 10 requests/hour for free tier
   - 1000 requests/day for pro tier

3. **CORS Restrictions**
   - Whitelist specific domains
   - Disable for unauthorized origins

4. **Input Validation**
   - Sanitize user queries
   - Validate coordinate ranges
   - Limit query length

5. **HTTPS Only**
   - Enforce SSL in production
   - Use secure headers

---

## 📈 Performance

### Response Times (Target)
- `/api/health`: <100ms
- `/api/datasets`: <100ms
- `/api/analyze`: <3000ms
- `/api/explain-site`: <2000ms

### Caching Strategy

**Recommended caching:**
- Dataset information: 24 hours
- Site analysis results: 1 hour (varies by query)
- AI explanations: Permanent (keyed by site metrics)

### Optimization Tips

1. **Use query caching** for identical requests
2. **Batch explain requests** if analyzing multiple sites
3. **Implement pagination** for more than 10 sites
4. **Use CDN** for static assets
5. **Enable gzip compression**

---

## 🐛 Error Codes

| Code | Meaning | Solution |
|------|---------|----------|
| 400 | Bad Request | Check request format and parameters |
| 404 | Not Found | Verify endpoint URL |
| 429 | Too Many Requests | Wait before retrying (rate limit) |
| 500 | Internal Server Error | Check server logs, retry request |
| 503 | Service Unavailable | Gemini or GEE API is down |

---

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/yourusername/solarscope/issues)
- **Email**: support@solarscope.app
- **Documentation**: [solarscope.app/docs](https://solarscope.app/docs)

---

**API Version:** 1.0.0
**Last Updated:** November 26, 2025
