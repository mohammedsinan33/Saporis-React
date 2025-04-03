from fastapi import FastAPI, HTTPException, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import os
import shutil
from llm import analyze_food_consumption, api_key
from prompts import prompt1
from pipeline import get_calorie_recommendations
import re

app = FastAPI()

origins = [
    "http://localhost",
    "http://localhost:3000",
    "http://localhost:8080",
    "http://localhost:8000",
    "http://localhost:5173"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # Or "*" for testing (NOT production)
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class UserInput(BaseModel):
    user_input: str
    calorie_goal: int

class NutritionStats(BaseModel):
    calories: float
    protein: float
    carbs: float
    fat: float

class NutritionTrends(BaseModel):
    calories: str
    protein: str
    carbs: str
    fat: str

class NutritionSummaryInput(BaseModel):
    current_stats: NutritionStats
    calorie_goal: int
    weekly_trends: List[float]
    trends: NutritionTrends

def clean_markdown(text: str) -> str:
    # Remove code blocks
    text = re.sub(r'```[\s\S]*?```', '', text)
    
    # Convert numbered lists (1. 2. etc) to bullet points
    text = re.sub(r'^\d+\.\s*', '• ', text, flags=re.MULTILINE)
    
    # Convert bullet points to proper sentences
    text = re.sub(r'^[\s]*[-*][\s]*', '• ', text, flags=re.MULTILINE)
    
    # Convert headers to bold text and add proper spacing
    text = re.sub(r'^#+\s*(.*?)$', r'\1:', text, flags=re.MULTILINE)
    
    # Remove any remaining markdown syntax
    text = re.sub(r'[_*`]+', '', text)
    
    # Ensure bullet points are on new lines
    text = re.sub(r'(• [^\n]+)(?=\s*•)', r'\1\n', text)
    
    # Clean up extra whitespace but preserve intentional line breaks
    text = re.sub(r'\n\s*\n', '\n\n', text)
    text = text.strip()
    
    return text

@app.get("/health")
async def health_check():
    return {"status": "ok"}

@app.post("/upload_image/")
async def upload_image_and_give_back_questions(file: UploadFile):
    """
    accepts the image as input and returns the questions to be asked to the user
    """
    try:
        # Create 'images' folder if it doesn't exist
        images_dir = "images"
        os.makedirs(images_dir, exist_ok=True)

        # Construct the file path
        file_path = os.path.join(images_dir, file.filename)

        # Save the file
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        
        send_image_and_response = analyze_food_consumption(f"./images/{file.filename}", api_key, prompt1)
        questions = send_image_and_response.split("'''")[1::2]
        
        questions_json = {}
        for i, question in enumerate(questions):
            questions_json[f"question{i+1}"] = question.strip()

        print("Generated questions:", questions_json)
        return questions_json

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing image: {e}")

    finally:
        file.file.close()
        
@app.post("/get_calorie_recommendations/")
async def get_calorie_recommendations_from_user_input(data: UserInput):
    """
    Accepts the user input and calorie goal, returns personalized recommendations
    """
    print("Request received with calorie goal:", data.calorie_goal)
    try:
        # Add calorie goal to the user input for context
        full_input = f"{data.user_input}\nUser's Daily Calorie Goal: {data.calorie_goal} calories"
        result = get_calorie_recommendations(api_key, full_input)
        
        # Extract nutritional data and recommendations from result
        recommendations = result.get("recommendations", "")
        nutritional_data = result.get("nutritional_data", {})
        
        # Prepare response with recommendations and nutritional data
        response = {
            "calorie_recommendations": recommendations,
            "nutritional_data": nutritional_data
        }
        
        print("Generated response:", response)
        return response
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating recommendations: {e}")

@app.post("/get_nutrition_summary/")
async def get_nutrition_summary(data: NutritionSummaryInput):
    try:
        # Create a prompt for Gemini
        prompt = f"""
        Analyze the following nutrition data and provide a concise, informative summary:

        Current Stats:
        - Calories: {data.current_stats.calories} (Goal: {data.calorie_goal} calories)
        - Protein: {data.current_stats.protein}g ({data.trends.protein} change)
        - Carbs: {data.current_stats.carbs}g ({data.trends.carbs} change)
        - Fat: {data.current_stats.fat}g ({data.trends.fat} change)

        Weekly Calorie Trends:
        {', '.join(str(cal) for cal in data.weekly_trends)}

        Please provide a detailed analysis including:

        1. Macronutrient Balance Assessment:
           - Evaluate the proportion of protein, carbs, and fats
           - Compare against recommended ratios (50% carbs, 30% protein, 20% fat)
           - Identify any significant imbalances

        2. Calorie Goal Analysis:
           - Compare current intake vs target
           - Calculate the deficit or surplus
           - Assess if the current trend is sustainable

        3. Trend Analysis:
           - Weekly calorie pattern analysis
           - Identify peak and low consumption days
           - Note any concerning patterns

        4. Detailed Recommendations:
           - Specific food suggestions to improve balance
           - Meal timing recommendations
           - Portion size adjustments
           - Specific nutrients to focus on
           - Practical tips for hitting calorie goals
           - Strategies for maintaining consistency

        5. Exercise and Lifestyle Integration:
           - Relevant YouTube workout video recommendations based on goals
           - Meal prep tips and recipe suggestions
           - Quick healthy snack options
           - Pre and post-workout nutrition advice

        6. Additional Resources:
           - 2-3 beginner-friendly workout YouTube channels
           - 2-3 nutrition education YouTube channels
           - Quick healthy recipe YouTube videos
           - Links to workout routines matching their goals

        Format the response in clear sections with bullet points for easy reading.
        Keep recommendations practical and actionable.
        Include specific food examples and portion sizes where relevant.
        """
        
        # Get response from Gemini and clean it
        summary = analyze_food_consumption(None, api_key, prompt)
        cleaned_summary = clean_markdown(summary)
        
        return {
            "summary": cleaned_summary
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating summary: {str(e)}")
