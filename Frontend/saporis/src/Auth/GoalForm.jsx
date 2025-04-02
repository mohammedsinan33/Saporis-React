import { motion } from "framer-motion";
import { AlertCircle, Target } from "lucide-react";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { supabase } from "../lib/supabase";
import bcrypt from 'bcryptjs';

const GoalForm = ({ goal, setGoal, onSubmit, userData, isGoogleSignup }) => {
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const goals = [
    { 
      value: "lose", 
      label: "Lose Weight",
      description: "Reduce body fat while maintaining muscle mass"
    },
    { 
      value: "maintain", 
      label: "Maintain Weight",
      description: "Keep your current weight while improving body composition"
    },
    { 
      value: "gain", 
      label: "Gain Weight",
      description: "Build muscle mass and strength"
    }
  ];

  // Function to generate random hex color
  const generateRandomColor = () => {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };

  const handleSubmit = async () => {
    if (!goal) {
      setError("Please select a goal");
      return;
    }

    // Validate userData
    if (!userData || !userData.first_name || !userData.last_name || !userData.email || 
        !userData.height || !userData.weight || !userData.age) {
      setError("Missing required user information");
      console.error('Missing user data:', userData);
      return;
    }

    setIsSubmitting(true);
    try {
      const bgColor = generateRandomColor();
      const fontColor = generateRandomColor();

      // Calculate calorie goal
      const calorieGoal = calculateCalorieGoal(
        parseInt(userData.weight),
        parseInt(userData.height),
        parseInt(userData.age),
        goal
      );

      // Prepare auth data
      const authData = {
        First_Name: userData.first_name,
        Last_Name: userData.last_name,
        email: userData.email.toLowerCase(),
        Height: parseInt(userData.height),
        Weight: parseInt(userData.weight),
        Age: parseInt(userData.age),
        Calorie_goal: calorieGoal,
        Bg_colour: bgColor,
        Font_colour: fontColor
      };

      // Add password for non-Google signup
      if (!isGoogleSignup && userData.password) {
        const salt = await bcrypt.genSalt(10);
        authData.Password = await bcrypt.hash(userData.password, salt);
      }

      // Insert into Auth table
      const { error: insertError } = await supabase
        .from('Auth')
        .insert([authData]);

      if (insertError) {
        console.error('Insert error:', insertError);
        throw new Error('Failed to create account');
      }

      // Save session data
      localStorage.setItem('userEmail', authData.email);
      localStorage.setItem('userName', authData.First_Name);

      toast.success('Account created successfully!');
      navigate('/Home');

    } catch (error) {
      console.error('Submission error:', error);
      setError(error.message || "Failed to complete setup");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
      <div className="text-center mb-6">
        <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-violet-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <Target className="w-6 h-6 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-white">What's your goal?</h2>
        <p className="text-white/70">We'll adjust your calorie target accordingly</p>
      </div>

      <div className="space-y-4">
        {goals.map((item) => (
          <motion.button
            key={item.value}
            type="button"
            onClick={() => {
              setGoal(item.value);
              setError("");
            }}
            className={`w-full py-4 px-6 rounded-lg text-left transition-all ${
              goal === item.value 
                ? 'bg-purple-600/50 border border-purple-400' 
                : 'bg-white/5 border border-white/10 hover:bg-white/10'
            }`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="flex flex-col">
              <span className="font-medium text-white">{item.label}</span>
              <span className="text-sm text-white/70">{item.description}</span>
            </div>
          </motion.button>
        ))}

        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-red-500 text-sm flex items-center justify-center mt-2"
          >
            <AlertCircle className="w-4 h-4 mr-1" />
            <span>{error}</span>
          </motion.div>
        )}
      </div>

      <div className="pt-4">
        <motion.button
          onClick={handleSubmit}
          disabled={!goal || isSubmitting}
          className="w-full py-3 px-4 bg-gradient-to-r from-purple-600 to-violet-600 rounded-lg text-white font-medium hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          {isSubmitting ? (
            <div className="flex items-center justify-center">
              <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Setting up...
            </div>
          ) : (
            'Complete Setup'
          )}
        </motion.button>
      </div>
    </motion.div>
  );
};

// Helper function to calculate calorie goal
const calculateCalorieGoal = (weight, height, age, goal) => {
  // Basic BMR calculation using Harris-Benedict equation
  const bmr = 10 * weight + 6.25 * height - 5 * age;
  
  // Adjust based on goal
  switch (goal) {
    case 'lose':
      return Math.round(bmr * 0.8); // 20% deficit
    case 'gain':
      return Math.round(bmr * 1.2); // 20% surplus
    default:
      return Math.round(bmr); // maintain
  }
};

export default GoalForm;