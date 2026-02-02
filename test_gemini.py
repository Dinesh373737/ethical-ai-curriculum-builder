"""
Simple test to verify Gemini API connectivity
"""
import google.generativeai as genai

# Configure API
GEMINI_API_KEY = "AIzaSyAnmhYDKkezEorWWxktcXhMbryrcndQCJM"
genai.configure(api_key=GEMINI_API_KEY)

try:
    print("Testing Gemini API connection...")
    print("Using models/gemini-2.5-flash-lite...")
    
    model = genai.GenerativeModel(model_name='models/gemini-2.5-flash-lite')
    
    response = model.generate_content("Say hello!")
    
    print("Success!")
    print(f"Response: {response.text}")
    
except Exception as e:
    print(f"Error: {type(e).__name__}: {str(e)}")
    import traceback
    traceback.print_exc()
