"""Utility functions for SolarScope backend"""
import random

def get_state_boundary(state_name):
    """
    Get bounding box coordinates for US states
    Returns (min_lon, min_lat, max_lon, max_lat)
    """
    boundaries = {
        # Southwest (high solar potential)
        'Arizona': (-114.8, 31.3, -109.0, 37.0),
        'Nevada': (-120.0, 35.0, -114.0, 42.0),
        'New Mexico': (-109.0, 31.3, -103.0, 37.0),
        'Utah': (-114.0, 37.0, -109.0, 42.0),

        # West Coast
        'California': (-124.4, 32.5, -114.1, 42.0),
        'Oregon': (-124.6, 42.0, -116.5, 46.3),
        'Washington': (-124.8, 45.5, -116.9, 49.0),

        # Mountain/Plains
        'Colorado': (-109.0, 37.0, -102.0, 41.0),
        'Wyoming': (-111.0, 41.0, -104.0, 45.0),
        'Montana': (-116.0, 45.0, -104.0, 49.0),

        # South Central
        'Texas': (-106.6, 25.8, -93.5, 36.5),
        'Oklahoma': (-103.0, 33.6, -94.4, 37.0),
        'Kansas': (-102.0, 37.0, -94.6, 40.0),

        # Southeast
        'Florida': (-87.6, 24.5, -80.0, 31.0),
        'Georgia': (-85.6, 30.4, -80.8, 35.0),
        'North Carolina': (-84.3, 33.8, -75.4, 36.6),
        'South Carolina': (-83.4, 32.0, -78.5, 35.2),

        # Northeast
        'New York': (-79.8, 40.5, -71.8, 45.0),
        'New Jersey': (-75.6, 38.9, -73.9, 41.4),
        'Pennsylvania': (-80.5, 39.7, -74.7, 42.3),
        'Massachusetts': (-73.5, 41.2, -69.9, 42.9),

        # Midwest
        'Illinois': (-91.5, 37.0, -87.5, 42.5),
        'Iowa': (-96.6, 40.4, -90.1, 43.5),
        'Wisconsin': (-92.9, 42.5, -86.2, 47.1),
        'Minnesota': (-97.2, 43.5, -89.5, 49.4),
    }
    return boundaries.get(state_name, boundaries['Arizona'])

def normalize_irradiance(value):
    """Normalize solar irradiance to 0-100 score"""
    min_val, max_val = 3.0, 7.5
    return max(0, min(100, ((value - min_val) / (max_val - min_val)) * 100))

def normalize_slope(value):
    """Normalize slope to 0-100 score (inverse - flatter is better)"""
    max_slope = 15.0
    return max(0, 100 - (value / max_slope * 100))

def score_land_cover(lc_code):
    """Score land cover based on suitability for solar"""
    suitability = {
        60: 95,   # Barren
        30: 85,   # Herbaceous vegetation
        40: 75,   # Cropland
        20: 40,   # Shrubland
        10: 10,   # Tree cover
        50: 5,    # Built-up
        80: 0,    # Permanent water
        95: 0,    # Mangroves
    }
    return suitability.get(lc_code, 50)

def land_cover_name(lc_code):
    """Convert land cover code to readable name"""
    names = {
        60: "barren",
        30: "grassland",
        40: "cropland",
        20: "shrubland",
        10: "forest",
        50: "built-up",
        80: "water"
    }
    return names.get(lc_code, "mixed")

def estimate_grid_distance_km():
    """Simplified grid distance estimation for MVP"""
    # In production, would query actual transmission line datasets
    return round(random.uniform(0.5, 25.0), 1)

def estimate_grid_score(distance_km):
    """Convert grid distance to score"""
    max_distance = 50.0
    return max(0, 100 - (distance_km / max_distance * 100))

def is_likely_water(lat, lon, state_name):
    """
    Check if coordinates are likely in water bodies
    Uses rough bounding boxes for major water bodies
    """
    # Major water bodies to avoid
    water_zones = {
        'New York': [
            # Long Island Sound
            {'min_lat': 40.8, 'max_lat': 41.3, 'min_lon': -73.8, 'max_lon': -72.0},
            # Lake Ontario (southern shore)
            {'min_lat': 43.2, 'max_lat': 43.9, 'min_lon': -79.5, 'max_lon': -76.0},
            # Lake Erie (eastern shore)
            {'min_lat': 42.1, 'max_lat': 42.9, 'min_lon': -79.8, 'max_lon': -78.9},
            # Atlantic coast
            {'min_lat': 40.5, 'max_lat': 41.0, 'min_lon': -74.0, 'max_lon': -71.8},
        ],
        'New Jersey': [
            # Atlantic coast
            {'min_lat': 38.9, 'max_lat': 40.5, 'min_lon': -75.0, 'max_lon': -73.9},
            # Delaware Bay
            {'min_lat': 38.9, 'max_lat': 39.6, 'min_lon': -75.6, 'max_lon': -74.8},
        ],
        'Florida': [
            # Atlantic coast (entire eastern shore)
            {'min_lat': 24.5, 'max_lat': 31.0, 'min_lon': -81.5, 'max_lon': -80.0},
            # Gulf coast (western shore)
            {'min_lat': 24.5, 'max_lat': 31.0, 'min_lon': -87.6, 'max_lon': -82.0},
        ],
        'California': [
            # Pacific coast
            {'min_lat': 32.5, 'max_lat': 42.0, 'min_lon': -124.4, 'max_lon': -117.0},
        ],
        'Massachusetts': [
            # Atlantic coast and Cape Cod
            {'min_lat': 41.2, 'max_lat': 42.9, 'min_lon': -71.2, 'max_lon': -69.9},
        ],
    }

    zones = water_zones.get(state_name, [])
    for zone in zones:
        if (zone['min_lat'] <= lat <= zone['max_lat'] and
            zone['min_lon'] <= lon <= zone['max_lon']):
            return True
    return False

def generate_sample_coordinates(boundary, num_points=50, state_name=None):
    """Generate random sample points within a boundary, avoiding water bodies"""
    min_lon, min_lat, max_lon, max_lat = boundary
    points = []

    # State-specific land zones to avoid major water bodies
    # These are rough inland zones that avoid coastal areas and large lakes
    state_land_adjustments = {
        'New Jersey': {
            'min_lon': -75.5,  # Avoid coast
            'max_lon': -74.2,
            'min_lat': 39.5,
            'max_lat': 41.3
        },
        'Florida': {
            'min_lon': -82.5,
            'max_lon': -81.0,  # Central corridor
            'min_lat': 27.0,
            'max_lat': 30.5
        },
        'Massachusetts': {
            'min_lon': -73.4,
            'max_lon': -71.0,  # Avoid coast
            'min_lat': 41.7,
            'max_lat': 42.8
        },
        'New York': {
            'min_lon': -78.5,
            'max_lon': -74.5,  # Avoid Long Island and coast
            'min_lat': 41.5,
            'max_lat': 44.0
        },
        'California': {
            'min_lon': -122.0,
            'max_lon': -116.0,  # Inland valleys
            'min_lat': 34.0,
            'max_lat': 40.0
        },
    }

    # Use adjusted bounds if available
    if state_name and state_name in state_land_adjustments:
        adjustments = state_land_adjustments[state_name]
        min_lon = adjustments['min_lon']
        min_lat = adjustments['min_lat']
        max_lon = adjustments['max_lon']
        max_lat = adjustments['max_lat']

    # Generate points with water body validation
    attempts = 0
    max_attempts = num_points * 3  # Try up to 3x to avoid infinite loops

    while len(points) < num_points and attempts < max_attempts:
        attempts += 1

        # Use margin from edges to avoid coastal areas
        lon_range = max_lon - min_lon
        lat_range = max_lat - min_lat
        margin_lon = lon_range * 0.15
        margin_lat = lat_range * 0.15

        lat = random.uniform(min_lat + margin_lat, max_lat - margin_lat)
        lon = random.uniform(min_lon + margin_lon, max_lon - margin_lon)

        # Check if point is in water
        if state_name and is_likely_water(lat, lon, state_name):
            continue

        points.append((lat, lon))

    return points
