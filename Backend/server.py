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
        questions.append("What is your estimated calorie goal?")
        
        questions_json = {}
        for i, question in enumerate(questions):
            questions_json[f"question{i+1}"] = question

        print(questions_json)
        return questions_json

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error saving image: {e}")

    finally:
        file.file.close() # Important to close the file.
        
@app.post("/get_calorie_recommendations/")
async def get_calorie_recommendations_from_user_input(data: UserInput):
    """
    Accepts the user input as a string (as sent by the frontend)
    and returns the calorie recommendations.
    """
    print("Request received")
    print("Received user_input:", data.user_input)
    try:
        calorie_recommendations = get_calorie_recommendations(api_key, data.user_input) # Replace dummy_api_key
        print("Calorie recommendations:", calorie_recommendations)
        return {"calorie_recommendations": calorie_recommendations}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error getting calorie recommendations: {e}")
