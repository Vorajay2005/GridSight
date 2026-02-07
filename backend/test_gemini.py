"""Test script to verify Gemini API is working"""
import google.generativeai as genai
import os
from dotenv import load_dotenv

load_dotenv()

# Configure Gemini
api_key = os.getenv('GEMINI_API_KEY')
print(f"API Key found: {bool(api_key)}")
print(f"API Key starts with: {api_key[:10] if api_key else 'None'}...")

genai.configure(api_key=api_key)

# Test with gemini-pro
print("\nTesting with gemini-pro model...")
try:
    model = genai.GenerativeModel('gemini-pro')
    response = model.generate_content('Extract the state name from this query: "Solar farm in New Jersey". Return only the state name.')
    print(f"✅ Success! Response: {response.text}")
except Exception as e:
    print(f"❌ Error: {e}")

# Try to list available models
print("\nListing available models...")
try:
    for m in genai.list_models():
        if 'generateContent' in m.supported_generation_methods:
            print(f"  - {m.name}")
except Exception as e:
    print(f"❌ Error listing models: {e}")
