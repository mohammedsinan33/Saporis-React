from openai import OpenAI
from image_conversion import image_to_base64
import os

def analyze_food_consumption(image_path: str, api_key: str, prompt: str) -> str:
    """
    Analyzes an image of food and generates questions about consumption.

    Args:
        image_path: The path to the image file. If "None", only the prompt is sent.
        api_key: The OpenRouter API key.
        prompt: The text prompt to send to the LLM.

    Returns:
        A string containing the LLM's response, or an error message.
    """

    client = OpenAI(
        base_url="https://openrouter.ai/api/v1",
        api_key=api_key,
    )

    messages = [{"role": "user", "content": [{"type": "text", "text": prompt}]}]

    if image_path and image_path.lower() != "none":  # Check if image_path is valid
        if not os.path.exists(image_path):
            return f"Error: Image file not found at {image_path}"

        base64_image = image_to_base64(image_path)

        if not base64_image:
            return "Error: Image conversion to base64 failed."

        messages[0]["content"].append({"type": "image_url", "image_url": {"url": base64_image}})

    try:
        completion = client.chat.completions.create(
            model="google/gemini-2.0-flash-thinking-exp:free",
            messages=messages,
        )
        return completion.choices[0].message.content
    except Exception as e:
        return f"An error occurred during API call: {e}"

# Example usage (with image):
image_file_path = "./images/homemade-kerala-porotta-parathalayered-flat-260nw-1885213180.webp"
api_key = "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"