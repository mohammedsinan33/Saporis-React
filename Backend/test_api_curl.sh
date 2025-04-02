#!/bin/bash

# Test script for the /get_calorie_recommendations/ endpoint using curl

# Set the API endpoint URL - modify this if your server runs on a different port
API_URL="http://localhost:8000/get_calorie_recommendations/"

# Test case 1: Basic food input
echo "Test 1: Basic food input"
curl -X POST \
  -H "Content-Type: application/json" \
  -d '{"user_input": "I ate 1 bowl of rice (200g), 2 chapatis, 100g of chicken curry, and 1 cup of dal. My calorie goal is 2000."}' \
  $API_URL | jq .

echo -e "\n\n"
sleep 2

# Test case 2: More detailed input
echo "Test 2: Detailed food input"
curl -X POST \
  -H "Content-Type: application/json" \
  -d '{"user_input": "I had breakfast: 2 slices of whole wheat bread with 1 tbsp butter, 2 eggs, 1 glass (250ml) of orange juice. For lunch: 1 plate of biryani (300g) with raita (100g). For dinner: 2 rotis, 150g palak paneer, 1 bowl of rice (150g). My calorie goal is 2500."}' \
  $API_URL | jq .

echo -e "\n\n"
sleep 2

# Test case 3: Minimal input
echo "Test 3: Minimal input"
curl -X POST \
  -H "Content-Type: application/json" \
  -d '{"user_input": "I ate 2 samosas and 1 cup chai. My calorie goal is 1800."}' \
  $API_URL | jq .

echo -e "\n\n"

# Note: This script uses 'jq' to format the JSON response.
# If 'jq' is not installed, install it using 'sudo apt install jq' (Ubuntu/Debian)
# or remove '| jq .' to get unformatted output