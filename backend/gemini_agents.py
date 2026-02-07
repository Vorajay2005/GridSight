"""Gemini AI agents for query parsing and site explanations"""
import google.generativeai as genai
import os
import json
import re
from dotenv import load_dotenv
from google.generativeai.types import HarmCategory, HarmBlockThreshold

load_dotenv()

# Configure Gemini
genai.configure(api_key=os.getenv('GEMINI_API_KEY'))

# Configure safety settings to be more permissive
safety_settings = {
    HarmCategory.HARM_CATEGORY_HARASSMENT: HarmBlockThreshold.BLOCK_NONE,
    HarmCategory.HARM_CATEGORY_HATE_SPEECH: HarmBlockThreshold.BLOCK_NONE,
    HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT: HarmBlockThreshold.BLOCK_NONE,
    HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT: HarmBlockThreshold.BLOCK_NONE,
}

# Use Gemini 2.5 Flash - latest fast model
model = genai.GenerativeModel('gemini-2.5-flash', safety_settings=safety_settings)

def parse_user_query_regex(user_input):
    """
    Fallback regex-based parser when Gemini API fails
    Extracts state names and basic parameters from query
    """
    # List of all US states
    states = [
        'Arizona', 'Nevada', 'New Mexico', 'Utah',
        'California', 'Oregon', 'Washington',
        'Colorado', 'Wyoming', 'Montana',
        'Texas', 'Oklahoma', 'Kansas',
        'Florida', 'Georgia', 'North Carolina', 'South Carolina',
        'New York', 'New Jersey', 'Pennsylvania', 'Massachusetts',
        'Illinois', 'Iowa', 'Wisconsin', 'Minnesota'
    ]

    # Find state in query (case insensitive)
    region = 'Arizona'  # default
    for state in states:
        if re.search(r'\b' + state + r'\b', user_input, re.IGNORECASE):
            region = state
            break

    # Extract acreage if mentioned
    acreage = 50  # default
    acreage_match = re.search(r'(\d+)[\s-]*(acre|acres|ac)', user_input, re.IGNORECASE)
    if acreage_match:
        acreage = int(acreage_match.group(1))

    # Extract slope constraints (e.g., "<5 degrees", "< 5°", "under 3 degree")
    max_slope = None
    slope_match = re.search(r'[<≤]?\s*(\d+)[\s°]*(?:degree|deg|slope)', user_input, re.IGNORECASE)
    if slope_match:
        max_slope = float(slope_match.group(1))

    # Detect energy type
    energy_type = 'solar'  # default
    if re.search(r'\b(wind|wind farm)\b', user_input, re.IGNORECASE):
        energy_type = 'wind'

    # Extract priorities
    priorities = []
    if re.search(r'\b(flat|level|gentle)\b', user_input, re.IGNORECASE):
        priorities.append('flat terrain')
        if max_slope is None:
            max_slope = 3.0  # Implicit constraint for "flat"
    if re.search(r'\b(grid|transmission|power line)\b', user_input, re.IGNORECASE):
        priorities.append('near grid')
    if re.search(r'\b(sun|solar|irradiance)\b', user_input, re.IGNORECASE):
        priorities.append('high irradiance')

    print(f"[REGEX PARSER] Extracted: region={region}, acreage={acreage}, max_slope={max_slope}, type={energy_type}")

    return {
        "energy_type": energy_type,
        "region": region,
        "acreage": acreage,
        "max_slope": max_slope,
        "priorities": priorities,
        "constraints": [],
        "confidence": 0.8  # Good confidence from regex
    }

def parse_user_query(user_input):
    """
    Parse natural language query into structured parameters using Gemini
    Falls back to regex parser if Gemini fails
    """
    prompt = f"""
You are an expert renewable energy site analyst. Parse this user query into structured JSON.

User Query: "{user_input}"

Extract and return ONLY valid JSON (no markdown, no explanation) with these fields:
{{
  "energy_type": "solar" | "wind" | "hydro" | "geothermal",
  "region": "specific US state name",
  "acreage": number (default 50 if not mentioned),
  "max_slope": number or null (maximum slope in degrees, e.g., 5 for "<5 degrees"),
  "priorities": ["list", "of", "user", "priorities"],
  "constraints": ["any", "exclusions", "mentioned"],
  "confidence": 0.0 to 1.0
}}

Rules:
- If energy type not mentioned, assume "solar"
- If region not mentioned, use "Arizona" as default
- Extract max_slope from phrases like "<5 degrees", "under 3° slope", "flat terrain" (flat = 3)
- Extract priorities like "high irradiance", "flat terrain", "near grid", "avoid protected areas"
- Be intelligent about synonyms (e.g., "sun exposure" = "irradiance", "level ground" = "flat terrain")

Examples:
Input: "Find me a large solar site in Texas with good sun"
Output: {{"energy_type": "solar", "region": "Texas", "acreage": 100, "max_slope": null, "priorities": ["high irradiance"], "constraints": [], "confidence": 0.9}}

Input: "50-acre solar site in Arizona, flat terrain"
Output: {{"energy_type": "solar", "region": "Arizona", "acreage": 50, "max_slope": 3, "priorities": ["flat terrain"], "constraints": [], "confidence": 0.95}}

Input: "Solar installation in California, <5° slope"
Output: {{"energy_type": "solar", "region": "California", "acreage": 50, "max_slope": 5, "priorities": [], "constraints": [], "confidence": 0.9}}
"""

    try:
        # Set generation config for faster, more focused responses
        generation_config = {
            'temperature': 0.3,  # Lower temperature for more consistent JSON
            'max_output_tokens': 150,
        }
        response = model.generate_content(prompt, generation_config=generation_config)

        # Check if response has candidates and parts
        if not response or not response.candidates:
            print("[WARNING] No candidates in Gemini response - possibly blocked by safety filters")
            raise ValueError("No candidates in response")

        if not response.candidates[0].content.parts:
            print("[WARNING] No parts in response - possibly blocked")
            raise ValueError("No parts in response")

        # Now safe to access text
        response_text = response.text.strip()

        if not response_text:
            print("[WARNING] Empty text in Gemini response")
            raise ValueError("Empty response text")

        response_text = response_text.replace('```json', '').replace('```', '').strip()

        parsed = json.loads(response_text)
        print(f"[API] Successfully parsed query: {parsed}")
        return parsed
    except Exception as e:
        print(f"[WARNING] Error parsing query with Gemini: {e}")
        print("[FALLBACK] Using regex-based parser instead")
        # Use regex fallback parser
        return parse_user_query_regex(user_input)

def generate_site_explanation(site_data, rank, context=""):
    """
    Generate natural language explanation for why a site scored well
    """
    prompt = f"""
You are explaining why this renewable energy site is optimal for development.

Site Ranking: #{rank}
Overall Score: {site_data['score']}/100

Detailed Metrics:
- Solar Irradiance: {site_data['metrics']['solar_irradiance']} kWh/m²/day (Score: {site_data['metrics']['solar_irradiance_score']}/100)
- Terrain Slope: {site_data['metrics']['slope']}° average (Score: {site_data['metrics']['slope_score']}/100)
- Distance to Grid: {site_data['metrics']['grid_distance']} km (Score: {site_data['metrics']['grid_distance_score']}/100)
- Land Cover Type: {site_data['metrics']['land_cover']} (Score: {site_data['metrics']['land_cover_score']}/100)

Location: {site_data['coordinates']['lat']:.4f}°N, {abs(site_data['coordinates']['lon']):.4f}°W
Context: {context}

Write a compelling 3-4 sentence explanation covering:
1. WHY this site scored high (cite specific impressive metrics with context)
2. WHAT makes it practical for development (location advantages)
3. ONE consideration or next step for developers

Style guidelines:
- Be specific with numbers ("{site_data['metrics']['solar_irradiance']} kWh/m²/day" not "high irradiance")
- Add context ("top 5% in the region" or "15% above state average")
- Sound confident and professional, like a consultant
- No bullet points, write in flowing prose
- Keep it concise but impactful

Generate ONLY the explanation text, no preamble.
"""

    try:
        # Set generation config for faster responses
        generation_config = {
            'temperature': 0.7,
            'max_output_tokens': 200,  # Limit output length
        }
        response = model.generate_content(prompt, generation_config=generation_config)

        # Check if response has candidates and parts before accessing text
        if not response or not response.candidates:
            print(f"[WARNING] No candidates in Gemini response for site #{rank}")
            raise ValueError("No candidates in response")

        if not response.candidates[0].content.parts:
            print(f"[WARNING] No parts in response for site #{rank}")
            raise ValueError("No parts in response")

        response_text = response.text.strip()
        if not response_text:
            print(f"[WARNING] Empty text in Gemini response for site #{rank}")
            raise ValueError("Empty response text")

        return response_text
    except Exception as e:
        print(f"[WARNING] Error generating explanation for site #{rank}: {e}")
        # Fallback explanation
        return f"This site ranks #{rank} with a score of {site_data['score']}/100. It offers {site_data['metrics']['solar_irradiance']} kWh/m²/day of solar irradiance with a gentle {site_data['metrics']['slope']}° slope, making it suitable for solar panel installation. Located {site_data['metrics']['grid_distance']} km from grid infrastructure, it presents a balanced opportunity for renewable energy development."
