from llm import analyze_food_consumption
from prompts import prompt1
from llm import api_key
from llm import image_file_path as image_path

def get_calorie_recommendations(api_key: str, answer_array: str) -> str:
    """
    Analyzes an image of food, gets user input for consumption,
    calculates calories, and recommends food items to reach a calorie goal.

    Args:
        image_path (str): Path to the image file.
        api_key (str): API key for LLM.

    Returns:
        str: LLM response containing calorie calculations and food recommendations.
    """


    # 4. Construct prompt for calorie calculation and recommendations.
    prompt2 = f"""You are a nutrition expert. Given the following data about food consumption, calculate the estimated calorie intake.

Data: {str(answer_array)}

1.  Provide an estimate of the total calories consumed from the given data.
2.  Show the detailed calculation of these calories.
3.  Calculate the remaining calories needed to reach the calorie goal.
4.  Recommend food items that can help the user reach their calorie goal, along with the approximate calorie value of each recommended food item and the food item should be a indian food item.
5.  Only give me the number of calories and the calculation of the consumed calories and the recommended food items with their calorie values.
    """

    # 5. Send prompt to LLM and get final calculation with recommendations.
    final_calc_with_recommendations = analyze_food_consumption("None", api_key, prompt2)
    return final_calc_with_recommendations