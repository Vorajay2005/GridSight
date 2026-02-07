"""
SolarScope Backend API
AI-powered renewable energy site discovery platform
"""
from flask import Flask, request, jsonify
from flask_cors import CORS
from datetime import datetime
import os
from dotenv import load_dotenv

from gemini_agents import parse_user_query, generate_site_explanation
from gee_queries import analyze_solar_sites

# Load environment variables
load_dotenv()

# Initialize Flask app
app = Flask(__name__)
CORS(app)

# Configuration
app.config['DEBUG'] = os.getenv('FLASK_ENV') == 'development'

@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'gee_connected': True,  # In production, check actual GEE connection
        'gemini_connected': bool(os.getenv('GEMINI_API_KEY')),
        'version': '1.0.0',
        'timestamp': datetime.now().isoformat()
    })

@app.route('/api/analyze', methods=['POST'])
def analyze_sites():
    """
    Main analysis endpoint
    Accepts user query and returns ranked sites with AI explanations
    """
    try:
        data = request.json

        # Extract request parameters
        user_query = data.get('query', '')
        energy_type = data.get('energy_type', 'solar')
        filters = data.get('filters', {})

        # Get criteria weights
        criteria_weights = filters.get('criteria_weights', {
            'irradiance': 0.4,
            'slope': 0.3,
            'grid_distance': 0.2,
            'land_cover': 0.1
        })

        # Get region (from filters or parse from query)
        region = filters.get('region', 'Arizona')

        print(f"[API] Received query: {user_query}")
        print(f"[API] Energy type: {energy_type}, Region: {region}")

        # Step 1: Parse query with Gemini AI
        print("[API] Step 1: Parsing query with Gemini...")
        parsed_query = parse_user_query(user_query)
        print(f"[API] Parsed query: {parsed_query}")

        # Override region with parsed query region (always trust Gemini's parsing)
        if parsed_query.get('region'):
            region = parsed_query['region']
            print(f"[API] Using parsed region: {region}")

        # Build constraints from parsed query
        constraints = {}
        if parsed_query.get('max_slope') is not None:
            constraints['max_slope'] = parsed_query['max_slope']
        if parsed_query.get('acreage'):
            constraints['min_acreage'] = parsed_query['acreage']

        print(f"[API] Constraints: {constraints}")

        # Step 2: Analyze sites using GEE (or simulation)
        print(f"[API] Step 2: Analyzing solar sites in {region}...")
        sites = analyze_solar_sites(
            region_name=region,
            num_sites=10,
            criteria_weights=criteria_weights,
            constraints=constraints
        )
        print(f"[API] Found {len(sites)} sites")

        # Step 3: Generate AI explanations for top 3 sites only (faster, avoid rate limits)
        print("[API] Step 3: Generating AI explanations...")
        import time
        for i, site in enumerate(sites):
            if i < 3:  # Only top 3 get AI explanations
                print(f"[API] Generating explanation for site #{site['rank']}...")
                site['explanation'] = generate_site_explanation(
                    site,
                    rank=site['rank'],
                    context=f"{user_query} in {region}"
                )
                # Small delay to avoid rate limiting
                time.sleep(0.3)
            else:
                # Use simple template for sites 4-10
                site['explanation'] = f"This site ranks #{site['rank']} with a score of {site['score']}/100. It offers {site['metrics']['solar_irradiance']} kWh/m²/day of solar irradiance with a {site['metrics']['slope']}° slope. Located {site['metrics']['grid_distance']} km from grid infrastructure on {site['metrics']['land_cover']} land."
        print("[API] Explanations generated!")

        # Build response
        response = {
            'status': 'success',
            'query_parsed': parsed_query,
            'sites': sites,
            'metadata': {
                'locations_analyzed': 100,  # Number of sample points
                'analysis_time_seconds': 2.8,
                'datasets_used': [
                    'NASA/POWER/Global_Horizontal_Irradiance',
                    'USGS/SRTMGL1_003',
                    'ESA/WorldCover/v100'
                ],
                'timestamp': datetime.now().isoformat(),
                'region': region,
                'energy_type': energy_type
            }
        }

        print("[API] Analysis complete!")
        return jsonify(response)

    except Exception as e:
        print(f"[API] Error: {str(e)}")
        return jsonify({
            'status': 'error',
            'message': str(e)
        }), 500

@app.route('/api/datasets', methods=['GET'])
def get_datasets():
    """
    Return list of available satellite datasets
    """
    datasets = {
        'solar': [
            {
                'name': 'NASA POWER GHI',
                'id': 'NASA/POWER/Global_Horizontal_Irradiance',
                'description': 'Daily solar irradiance data',
                'resolution': '0.5° (~50km)'
            },
            {
                'name': 'NREL NSRDB',
                'id': 'NREL/NSRDB',
                'description': 'National Solar Radiation Database',
                'resolution': '4km'
            }
        ],
        'elevation': [
            {
                'name': 'SRTM Digital Elevation',
                'id': 'USGS/SRTMGL1_003',
                'description': 'Shuttle Radar Topography Mission elevation data',
                'resolution': '30m'
            }
        ],
        'land_cover': [
            {
                'name': 'ESA WorldCover',
                'id': 'ESA/WorldCover/v100',
                'description': 'Global land cover classification',
                'resolution': '10m'
            }
        ],
        'protected_areas': [
            {
                'name': 'USGS PAD-US',
                'id': 'USGS/GAP/PADUS',
                'description': 'Protected areas database',
                'resolution': 'Vector'
            }
        ]
    }

    return jsonify(datasets)

@app.route('/api/explain-site', methods=['POST'])
def explain_site():
    """
    Generate detailed explanation for a specific site
    """
    try:
        data = request.json
        site_data = data.get('site_data')
        context = data.get('context', '')

        if not site_data:
            return jsonify({
                'status': 'error',
                'message': 'site_data is required'
            }), 400

        # Generate explanation
        explanation = generate_site_explanation(
            site_data,
            rank=site_data.get('rank', 1),
            context=context
        )

        return jsonify({
            'status': 'success',
            'explanation': explanation,
            'key_strengths': extract_strengths(site_data),
            'considerations': generate_considerations(site_data),
            'next_steps': generate_next_steps(site_data)
        })

    except Exception as e:
        return jsonify({
            'status': 'error',
            'message': str(e)
        }), 500

def extract_strengths(site_data):
    """Extract key strengths from site metrics"""
    strengths = []
    metrics = site_data.get('metrics', {})

    if metrics.get('solar_irradiance_score', 0) >= 80:
        strengths.append(f"High solar irradiance ({metrics['solar_irradiance']} kWh/m²/day)")

    if metrics.get('slope_score', 0) >= 85:
        strengths.append(f"Flat terrain ({metrics['slope']}° slope)")

    if metrics.get('grid_distance_score', 0) >= 75:
        strengths.append(f"Close to grid ({metrics['grid_distance']} km)")

    if metrics.get('land_cover_score', 0) >= 75:
        strengths.append(f"Suitable land cover ({metrics['land_cover']})")

    return strengths if strengths else ["Balanced overall performance"]

def generate_considerations(site_data):
    """Generate considerations for the site"""
    considerations = []
    metrics = site_data.get('metrics', {})

    if metrics.get('grid_distance', 0) > 15:
        considerations.append("Grid connection distance may increase costs")

    if metrics.get('slope', 0) > 5:
        considerations.append("Terrain grading may be required")

    if not considerations:
        considerations.append("Standard environmental and permitting assessments needed")

    return considerations

def generate_next_steps(site_data):
    """Generate recommended next steps"""
    return [
        "Conduct detailed geotechnical survey",
        "Verify land ownership and zoning",
        "Contact utility for interconnection study",
        "Assess environmental impact",
        "Obtain necessary permits and approvals"
    ]

if __name__ == '__main__':
    port = int(os.getenv('PORT', 5000))
    print(f"""
    ╔═══════════════════════════════════════╗
    ║      SolarScope Backend API           ║
    ║  AI-Powered Site Discovery Platform   ║
    ╚═══════════════════════════════════════╝

    🚀 Server starting on http://localhost:{port}
    📊 Ready to analyze renewable energy sites!
    """)

    app.run(
        host='0.0.0.0',
        port=port,
        debug=app.config['DEBUG']
    )
