import os
import json
from groq import Groq # <-- CHANGE: Import Groq instead of OpenAI
from dotenv import load_dotenv

load_dotenv()

# --- CHANGE: Initialize the Groq client ---
client = Groq(api_key=os.getenv("GROQ_API_KEY"))

# The model name you want to use
MODEL_NAME = "moonshotai/kimi-k2-instruct-0905"

def generate_dss_recommendations(claim_details: dict, env_data: dict):
    if not client.api_key:
        raise ValueError("Groq API key not set. Please set the GROQ_API_KEY environment variable.")

    # The prompt remains exactly the same
    prompt = f"""
    You are an expert policy advisor for the Ministry of Tribal Affairs, specializing in the Forest Rights Act (FRA) 
    and associated development schemes. Your task is to provide actionable recommendations for a specific FRA claim.

    **Claim Data:**
    - **Claimant:** {claim_details.get('claimant_name')}
    - **Claim Type:** {claim_details.get('claim_type')}
    - **Area for Self-Cultivation:** {claim_details.get('cultivation_area')} hectares
    - **Area for Habitation:** {claim_details.get('habitation_area')} hectares
    - **Other Traditional Rights Claimed:** "{claim_details.get('other_rights')}"

    **Environmental Data:**
    - **Average Vegetation Index (NDVI):** {env_data.get('avg_ndvi'):.2f} (where > 0.5 is high, < 0.2 is low)
    - **Average Water Index (NDWI):** {env_data.get('avg_ndwi'):.2f} (where > 0.2 is high, < 0 is low)

    **Your Task:**
    Based on all the data above, provide a list of 2-3 recommended Central Sector Schemes.
    For each recommendation, provide a brief, data-driven justification that directly references the provided data.
    If "tendu leaves" or other MFP are mentioned, recommend Van Dhan Yojana. If cultivation area is high and NDVI is low,
    recommend an irrigation scheme. If habitation area > 0, recommend housing or electricity schemes.

    **Output Format:**
    Return your response as a valid JSON array of objects. Each object must have three keys: "scheme", "description", and "priority" (High, Medium, or Low).
    Do not include any text outside of the JSON array.
    """

    try:
        # --- CHANGE: The API call now uses the Groq client and the new model name ---
        response = client.chat.completions.create(
            model=MODEL_NAME,
            messages=[
                {"role": "system", "content": "You are a helpful policy advisor providing output in valid JSON format."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.2, # Lower temperature for more factual, less creative responses
            max_tokens=1024,
            response_format={"type": "json_object"}, # Groq supports JSON mode
        )
        return json.loads(response.choices[0].message.content)
    except Exception as e:
        print(f"Error calling Groq API or parsing JSON: {e}")
        return None