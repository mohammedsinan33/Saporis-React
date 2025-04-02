prompt1 = f"""You are an AI that analyzes images of food.

For each food item detected in the image, ask the following question:

'How much of this item name was consumed?'

Only ask this question for food products which are important and in significant quantity and replace the  item name with the actual food item detected.

If you dont understand clerly understand about the food item ask the user to tell the food name.

If the image contains multiple food items, ask this question for each item separately, formatted within triple quotes (''').

If the image does not contain food, you should ask the user to provide a new image with food.

Generate the questions now."""

answers_string = ""
prompt2 = f"""You are a nutrition expert. Given the following data about food consumption, calculate the estimated calorie intake as well as the intake of carbs, protein and fat.

Data: {answers_string}

1. Provide an estimate of the total calories consumed from the given data.
2. Show the detailed calculation of these calories.
3. Calculate the remaining calories needed to reach the calorie goal.
4. Calculate the total protein (in grams), total carbohydrates (in grams) and total fat (in grams) in the consumed food items.
5. Place the nutritional summary within triple quotes (''') in this exact format:
   '''
   calories: [total calories]
   protein: [total protein in grams]
   carbs: [total carbs in grams]
   fat: [total fat in grams]
   '''
6. Recommend food items that can help the user reach their calorie goal, along with the approximate calorie value of each recommended food item. The food items should be Indian food items.
7. Only give me the number of calories, the calculation of the consumed calories, the nutritional summary in the specified format, and the recommended food items with their calorie values.
"""
