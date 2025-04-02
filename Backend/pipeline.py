from llm import analyze_food_consumption
from prompts import prompt1
from llm import api_key
from llm import image_file_path as image_path

def get_calorie_recommendations(api_key: str, answer_array: str) -> dict:
    """
    Analyzes an image of food, gets user input for consumption,
    calculates calories, and recommends food items to reach a calorie goal.

    Args:
        image_path (str): Path to the image file.
        api_key (str): API key for LLM.

    Returns:
        dict: Dictionary containing calorie recommendations, protein, carbs and fat information
    """

    # Construct prompt for calorie calculation and recommendations.
    prompt2 = f"""You are a nutrition expert. Given the following data about food consumption, calculate the estimated calorie intake.

Data: {str(answer_array)}

1. Provide an estimate of the total calories consumed from the given data.
2. Show the detailed calculation of these calories.
3. Calculate the remaining calories needed to reach the calorie goal.
4. Calculate the total protein (in grams), total carbohydrates (in grams) and total fat (in grams) in the consumed food items.
5. IMPORTANT: You MUST place the nutritional summary within triple quotes (''') in this EXACT format without ANY additional characters:
   '''
   calories: [total calories]
   protein: [total protein in grams]
   carbs: [total carbs in grams]
   fat: [total fat in grams]
   '''
6. Recommend food items that can help the user reach their calorie goal, along with the approximate calorie value of each recommended food item. The food items should be Indian food items.
7. Only give me the number of calories, the calculation of the consumed calories, the nutritional summary in the specified format, and the recommended food items with their calorie values.
8. CRITICAL: Make sure to include the nutritional summary in the exact format specified above using triple quotes (''') not backticks.
"""

    # Send prompt to LLM and get final calculation with recommendations.
    llm_response = analyze_food_consumption("None", api_key, prompt2)
    
    # Extract nutritional data from triple quotes if present
    nutritional_data = {}
    nutritional_text = ""
    
    # Try to extract content between triple quotes and also try backticks as fallback
    import re
    # First try to find content between triple quotes
    nutritional_match = re.search(r"'''([\s\S]*?)'''", llm_response)
    # If not found, try to find content between triple backticks
    if not nutritional_match:
        nutritional_match = re.search(r"```([\s\S]*?)```", llm_response)
    
    if nutritional_match:
        nutritional_text = nutritional_match.group(1).strip()
        # Remove the matched part from the response
        llm_response = llm_response.replace(nutritional_match.group(0), "").strip()
        
        # Parse the nutritional data
        for line in nutritional_text.split('\n'):
            if ':' in line:
                key, value = line.split(':', 1)
                nutritional_data[key.strip()] = value.strip()
    
    # If nutritional data is still empty, try to extract in a more relaxed way
    if not nutritional_data:
        # Look for lines containing the key nutritional values
        for key in ["calories", "protein", "carbs", "fat"]:
            # Look for patterns like "calories: 300" anywhere in the text
            pattern = rf"{key}:\s*(\d+)"
            match = re.search(pattern, llm_response, re.IGNORECASE)
            if match:
                nutritional_data[key] = match.group(1)
    
    # Return both the recommendations and extracted nutritional data
    return {
        "recommendations": llm_response,
        "nutritional_data": nutritional_data
    }