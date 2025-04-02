from fastapi import FastAPI, UploadFile, File, Body, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.encoders import jsonable_encoder
from pydantic import BaseModel
import os
import shutil
from typing import Dict
from llm import analyze_food_consumption, api_key
from prompts import prompt1
from pipeline import get_calorie_recommendations

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
