# Supported US States

SolarScope currently supports **24 US states** across all regions:

## 🌵 Southwest (High Solar Potential)
- ✅ Arizona
- ✅ Nevada
- ✅ New Mexico
- ✅ Utah

## 🌊 West Coast
- ✅ California
- ✅ Oregon
- ✅ Washington

## ⛰️ Mountain/Plains
- ✅ Colorado
- ✅ Wyoming
- ✅ Montana

## 🌾 South Central
- ✅ Texas
- ✅ Oklahoma
- ✅ Kansas

## 🌴 Southeast
- ✅ Florida
- ✅ Georgia
- ✅ North Carolina
- ✅ South Carolina

## 🏙️ Northeast
- ✅ New York
- ✅ New Jersey
- ✅ Pennsylvania
- ✅ Massachusetts

## 🌽 Midwest
- ✅ Illinois
- ✅ Iowa
- ✅ Wisconsin
- ✅ Minnesota

---

## Example Queries by State

### Southwest
```
"50-acre solar farm in Arizona with flat terrain"
"Solar installation in Nevada near grid"
"Large solar site in New Mexico, high irradiance"
"Solar farm in Utah with minimal slope"
```

### West Coast
```
"Solar installation in California, <5° slope"
"Solar farm in Oregon near existing infrastructure"
"Solar site in Washington with good sun exposure"
```

### Northeast
```
"Solar farm in New Jersey near grid"
"50-acre solar site in New York, flat terrain"
"Solar installation in Pennsylvania near transmission lines"
"Solar farm in Massachusetts with high irradiance"
```

### Southeast
```
"Solar farm in Florida with flat terrain"
"Solar installation in Georgia near grid"
"Large solar site in North Carolina"
"Solar farm in South Carolina with good sun"
```

### Texas & South Central
```
"100-acre solar farm in Texas with excellent sun"
"Solar installation in Oklahoma near grid"
"Solar site in Kansas, flat terrain preferred"
```

### Midwest
```
"Solar farm in Illinois near grid infrastructure"
"Solar installation in Iowa with flat terrain"
"Solar site in Wisconsin with minimal slope"
"Solar farm in Minnesota, good sun exposure"
```

### Mountain States
```
"Solar farm in Colorado with high irradiance"
"Solar installation in Wyoming, flat terrain"
"Solar site in Montana near grid"
```

---

## Adding More States

To add more states, edit:
1. **Backend**: `/backend/utils.py` - Add state boundaries
2. **Frontend**: `/frontend/src/components/SearchPanel.jsx` - Add to states array

**Format for boundaries:**
```python
'State Name': (min_lon, min_lat, max_lon, max_lat)
```

**Example:**
```python
'Idaho': (-117.2, 42.0, -111.0, 49.0)
```

---

**Total Coverage**: 24 states representing all major US regions! 🇺🇸
