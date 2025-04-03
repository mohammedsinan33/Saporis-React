# Saporis - Your Personal Nutrition Assistant

## What is Saporis?

Saporis is like having a nutrition expert in your pocket! This app helps you track what you eat, understand your nutritional intake, and make better food choices to meet your health goals.

Think of Saporis as a friend who:
- Takes photos of your food and recognizes what you're eating
- Keeps track of your calories, protein, carbs, and fat
- Answers your questions about nutrition
- Gives you personalized advice based on your eating habits

## How Does It Work?

### 1. Food Photo Analysis
Upload a photo of your meal, and Saporis will identify the food items and ask you about portion sizes. Just like having a friend ask, "How much rice did you eat?" or "How many chapatis did you have?"

### 2. Nutritional Tracking
Saporis calculates:
- Total calories consumed
- Protein, carbs, and fat intake
- How many calories you have left for the day

### 3. Interactive Chat
You can ask Saporis questions like:
- "How many more calories can I eat today?"
- "Am I getting enough protein?"
- "What nutrition am I missing from my diet today?"
- "Should I eat something else to reach my goals?"

### 4. Personalized Recommendations
Based on your eating habits and goals, Saporis will suggest:
- Food items to balance your diet
- Ways to meet your calorie goals
- Tips for better nutrition

## Technical Overview (For Developers)

### Backend Architecture

The backend is built with FastAPI and uses AI models through OpenRouter API to analyze food images and provide nutritional guidance. Here's how the main components work:

#### Key Components:

1. **Server (server.py)**
   - Handles API endpoints and request processing
   - Manages image uploads and user input
   - Routes requests to appropriate processing functions

2. **AI Interface (llm.py)**
   - Connects to AI models through OpenRouter
   - Processes images and text prompts
   - Returns AI-generated responses

3. **Food Analysis Pipeline (pipeline.py)**
   - Coordinates the flow of data between components
   - Extracts nutritional information from AI responses
   - Formats data for frontend consumption

#### API Endpoints:

- **/upload_image/**
  Accepts food photos and returns questions about food consumption

- **/get_calorie_recommendations/**
  Takes user's food intake description and returns nutritional analysis with recommendations

- **/get_nutrition_summary/**
  Provides detailed nutritional analysis based on consumption stats

- **/chat_with_nutrition**
  Interactive endpoint for users to ask nutrition-related questions and receive personalized answers

### Data Flow Example:

1. User uploads a photo of lunch (a plate of biryani and raita)
2. Backend sends image to AI model with prompt for food identification
3. AI recognizes items and asks for portions
4. User specifies "300g of biryani and 100g of raita"
5. Backend calculates nutritional values and updates user's daily intake
6. User can chat with Saporis: "What should I eat for dinner?"
7. Saporis analyzes remaining nutritional needs and provides personalized dinner suggestions

## Installation & Setup

1. Make sure you have Python 3.10+ installed
2. Install dependencies:
   ```
   pip install -r requirements.txt
   ```
3. Set up your OpenRouter API key in an .env file
4. Start the server:
   ```
   uvicorn server:app --reload
   ```

## Testing API Endpoints

You can test the API using the included script:
```
bash test_api_curl.sh
```

Or with individual curl commands like:
```
curl -X POST http://localhost:8000/get_calorie_recommendations/ -H "Content-Type: application/json" -d '{"user_input": "I ate 1 bowl of rice (200g), 2 chapatis, 100g of chicken curry. My calorie goal is 2000."}'
```