from llm import analyze_food_consumption
from prompts import prompt1
from llm import api_key
from llm import image_file_path as image_path

def get_calorie_recommendations(api_key: str, answer_array: str) -> dict:
    """
    Analyzes food consumption data and provides personalized recommendations based on calorie goals.

    Args:
        api_key (str): API key for LLM.
        answer_array (str): User's answers about food consumption including their calorie goal.

    Returns:
        dict: Dictionary containing calorie recommendations and nutritional data
    """

    # Extract calorie goal from the input if present
    calorie_goal = None
    for line in answer_array.split('\n'):
        if "Daily Calorie Goal:" in line or "Calorie Goal:" in line:
            try:
                calorie_goal = int(''.join(filter(str.isdigit, line)))
            except ValueError:
                pass

    # Construct prompt for calorie calculation and recommendations
    prompt2 = f"""You are a nutrition expert. Given the following data about food consumption and the user's daily calorie goal, provide personalized recommendations.

Data: {str(answer_array)}

1. Calculate the total calories consumed from the given food items.
2. Show the detailed calculation of these calories.
3. Calculate how many calories are remaining to reach the daily calorie goal of {calorie_goal if calorie_goal else 'specified'} calories.
4. Calculate the total protein (in grams), total carbohydrates (in grams) and total fat (in grams).
5. IMPORTANT: Place the nutritional summary within triple quotes (''') in this EXACT format:
   '''
   calories: [total calories]
   protein: [total protein in grams]
   carbs: [total carbs in grams]
   fat: [total fat in grams]
   remaining: [remaining calories to goal]
   '''
6. Based on the remaining calories, recommend specific Indian food items that would help the user reach their calorie goal while maintaining a balanced diet. Include portion sizes and approximate calorie values.
7. Format your response in this order:
   - Calorie calculation with breakdown
   - Nutritional summary (in triple quotes)
   - Specific food recommendations with portion sizes and calories
8. Keep recommendations practical and aligned with the user's calorie goal.
"""

    # Send prompt to LLM and get response
    llm_response = analyze_food_consumption("None", api_key, prompt2)
    
    # Extract nutritional data
    nutritional_data = {}
    import re
    
    # Try to extract content between triple quotes first
    nutritional_match = re.search(r"'''([\s\S]*?)'''", llm_response)
    if not nutritional_match:
        # Fallback to triple backticks if quotes not found
        nutritional_match = re.search(r"```([\s\S]*?)```", llm_response)
    
    if nutritional_match:
        nutritional_text = nutritional_match.group(1).strip()
        # Remove the matched part from the response
        llm_response = llm_response.replace(nutritional_match.group(0), "").strip()
        
        # Parse the nutritional data
        for line in nutritional_text.split('\n'):
            if ':' in line:
                key, value = line.split(':', 1)
                # Try to convert numerical values to integers
                try:
                    nutritional_data[key.strip()] = int(''.join(filter(str.isdigit, value)))
                except ValueError:
                    nutritional_data[key.strip()] = value.strip()
    
    # Fallback extraction for missing values
    if not nutritional_data:
        keys = ["calories", "protein", "carbs", "fat", "remaining"]
        for key in keys:
            pattern = rf"{key}:\s*(\d+)"
            match = re.search(pattern, llm_response, re.IGNORECASE)
            if match:
                nutritional_data[key] = int(match.group(1))
    
    # Clean up the recommendations text
    recommendations = llm_response.strip()
    if not recommendations:
        recommendations = "Unable to generate specific recommendations. Please ensure all food portions are specified correctly."
    
    return {
        "recommendations": recommendations,
        "nutritional_data": nutritional_data
    }