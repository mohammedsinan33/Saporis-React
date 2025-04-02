export const calculateFitnessMetrics = (userData) => {
  const { gender, age, height, weight, activityLevel } = userData;

  // Convert height to meters for BMI calculation
  const heightInMeters = height / 100;

  // Calculate BMI
  const bmi = weight / (heightInMeters * heightInMeters);

  // Determine BMI category
  const getBMICategory = (bmi) => {
    if (bmi < 18.5) return "Underweight";
    if (bmi < 25) return "Normal weight";
    if (bmi < 30) return "Overweight";
    return "Obese";
  };

  // Calculate BMR using Mifflin-St Jeor Equation
  const bmr = gender === "male"
    ? (10 * weight) + (6.25 * height) - (5 * age) + 5
    : (10 * weight) + (6.25 * height) - (5 * age) - 161;

  // Activity level multipliers
  const activityMultipliers = {
    sedentary: 1.2,
    light: 1.375,
    moderate: 1.55,
    very: 1.725,
    super: 1.9
  };

  // Calculate TDEE
  const tdee = bmr * activityMultipliers[activityLevel];

  // Calculate calorie goals
  const calorieGoals = {
    lose: Math.round(tdee - 500),
    maintain: Math.round(tdee),
    gain: Math.round(tdee + 500)
  };

  return {
    bmi: {
      value: Math.round(bmi * 10) / 10,
      category: getBMICategory(bmi)
    },
    bmr: Math.round(bmr),
    tdee: Math.round(tdee),
    calorieGoals
  };
};