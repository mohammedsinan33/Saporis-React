import bcrypt from 'bcryptjs';
import { AnimatePresence, motion } from "framer-motion";
import { Lock, Mail, Sparkles, User } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from 'react-hot-toast';
import { supabase } from '../lib/supabase';
import AgeForm from "./AgeForm";
import GoalForm from "./GoalForm";
import HeightForm from "./HeightForm";
import WeightForm from "./WeightForm";
import ActivityLevelForm from "./ActivityLevelForm";
import LoginPopup from './Login';

const Signup = () => {
  const [showLoginPopup, setShowLoginPopup] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const isGoogleSignup = location.state?.isGoogleSignup;

  const [step, setStep] = useState(1); // Track current form step
  const [userData, setUserData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    confirmPassword: "",
    age: "",
    height: "",
    weight: "",
    goal: "",
    activityLevel:"",
  });
  const [loading, setLoading] = useState(false);
  const [completedSteps, setCompletedSteps] = useState([]);

  useEffect(() => {
    if (isGoogleSignup) {
      const googleData = JSON.parse(localStorage.getItem('googleUserData'));
      if (googleData) {
        setUserData(prev => ({
          ...prev,
          email: googleData.email,
          first_name: googleData.First_Name || '',
          last_name: googleData.Last_Name || '',
          password: '',
          confirmPassword: ''
        }));
        
        // Mark first step as completed and move to next
        setCompletedSteps([1]);
        setStep(2);
      }
    }
  }, [isGoogleSignup]);

  const calculateTDEE = (weight, height, age, activityLevel, goal) => {
    console.log('TDEE Calculation inputs:', { weight, height, age, activityLevel, goal }); // Debug log
    
    // Calculate BMR using Mifflin-St Jeor Equation
    const bmr = 10 * weight + 6.25 * height - 5 * age + 5;
    console.log('BMR:', bmr); // Debug log
    
    // Calculate TDEE by multiplying BMR with activity multiplier
    const tdee = bmr * parseFloat(activityLevel);
    console.log('TDEE before goal adjustment:', tdee); // Debug log
    
    // Adjust based on goal
    let finalTDEE;
    switch (goal) {
      case 'lose':
        finalTDEE = Math.round(tdee * 0.8); // 20% deficit
        break;
      case 'gain':
        finalTDEE = Math.round(tdee * 1.2); // 20% surplus
        break;
      default:
        finalTDEE = Math.round(tdee); // maintain
    }
    console.log('Final TDEE:', finalTDEE); // Debug log
    return finalTDEE;
  };

  const handleFinalSubmit = async (goalData) => {
    setLoading(true);
    try {
      // Debug log entire userData
      console.log('User Data before submission:', userData);

      const userInputs = {
        ...userData,
        goal: goalData.goal
      };

      // Debug log all inputs before TDEE calculation
      console.log('Activity Level before TDEE calc:', userInputs.activityLevel);
      console.log('All inputs for TDEE:', {
        weight: Number(userInputs.weight),
        height: Number(userInputs.height),
        age: Number(userInputs.age),
        activityLevel: Number(userInputs.activityLevel),
        goal: goalData.goal
      });

      // Calculate TDEE with activity level
      const tdee = calculateTDEE(
        Number(userInputs.weight),
        Number(userInputs.height),
        Number(userInputs.age),
        Number(userInputs.activityLevel),
        goalData.goal
      );

      console.log('Calculated TDEE:', tdee);

      // Hash password for non-Google signup
      let hashedPassword = null;
      if (!isGoogleSignup && userInputs.password) {
        const salt = await bcrypt.genSalt(10);
        hashedPassword = await bcrypt.hash(userInputs.password, salt);
      }

      // Prepare auth data
      const authData = {
        First_Name: userInputs.first_name,
        Last_Name: userInputs.last_name,
        email: userInputs.email.toLowerCase(),
        Password: hashedPassword,
        Height: parseInt(userInputs.height),
        Weight: parseInt(userInputs.weight),
        Age: parseInt(userInputs.age),
        Calorie_goal: tdee,
        goal: goalData.goal,
        Bg_colour: goalData.bgColor,
        Font_colour: goalData.fontColor,
        Multiplayer: Number(userInputs.activityLevel) // Use Number instead of parseFloat
      };

      // Debug log final data
      console.log('Data being sent to Supabase:', authData);

      // Insert into Auth table with return
      const { data, error: insertError } = await supabase
        .from('Auth')
        .insert([authData])
        .select(); // Add select to return the inserted data

      if (insertError) {
        console.error('Insert error:', insertError);
        throw new Error('Failed to create account');
      }

      console.log('Supabase response:', data); // Debug log

      // Save session data
      localStorage.setItem('userEmail', authData.email);
      localStorage.setItem('userName', authData.First_Name);

      // Update login history
      const existingHistory = JSON.parse(localStorage.getItem('loginHistory') || '[]');
      if (!existingHistory.includes(authData.email)) {
        localStorage.setItem('loginHistory', JSON.stringify([
          ...existingHistory, 
          authData.email
        ]));
      }

      toast.success('Account created successfully!');
      navigate('/Home');

    } catch (error) {
      console.error('Signup error:', error);
      toast.error(error.message || 'Failed to create account');
    } finally {
      setLoading(false);
    }
  };

  const updateStepCompletion = (stepNumber) => {
    if (!completedSteps.includes(stepNumber)) {
      setCompletedSteps([...completedSteps, stepNumber]);
    }
  };

  const handleInitialSubmit = (e) => {
    e.preventDefault();
    if (userData.password !== userData.confirmPassword) {
      alert("Passwords don't match!");
      return;
    }
    updateStepCompletion(1);
    setStep(2); // Move to age form
  };

  const renderFormStep = () => {
    switch (step) {
      case 1:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <form onSubmit={handleInitialSubmit} className="space-y-6">
              <div className="space-y-1">
                <label htmlFor="name" className="block text-sm font-medium text-white/80">
                  First Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="w-5 h-5 text-white/50" />
                  </div>
                  <input
                    type="text"
                    id="first_name"
                    name="first_name"
                    value={userData.first_name}
                    onChange={(e) => setUserData({ ...userData, first_name: e.target.value })}
                    className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="First Name"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label htmlFor="name" className="block text-sm font-medium text-white/80">
                  Last Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="w-5 h-5 text-white/50" />
                  </div>
                  <input
                    type="text"
                    id="last_name"
                    name="last_name"
                    value={userData.last_name}
                    onChange={(e) => setUserData({ ...userData, last_name: e.target.value })}
                    className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Last Name"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label htmlFor="email" className="block text-sm font-medium text-white/80">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="w-5 h-5 text-white/50" />
                  </div>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={userData.email}
                    onChange={(e) => setUserData({ ...userData, email: e.target.value })}
                    className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="you@example.com"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label htmlFor="password" className="block text-sm font-medium text-white/80">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="w-5 h-5 text-white/50" />
                  </div>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    value={userData.password}
                    onChange={(e) => setUserData({ ...userData, password: e.target.value })}
                    className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="••••••••"
                    required
                    minLength="8"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-white/80">
                  Confirm Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="w-5 h-5 text-white/50" />
                  </div>
                  <input
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    value={userData.confirmPassword}
                    onChange={(e) => setUserData({ ...userData, confirmPassword: e.target.value })}
                    className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="••••••••"
                    required
                    minLength="8"
                  />
                </div>
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  className="w-full py-3 px-4 bg-gradient-to-r from-purple-600 to-violet-600 rounded-lg text-white font-medium hover:shadow-lg transition-all"
                >
                  Continue
                </button>
              </div>
            </form>
          </motion.div>
        );
      case 2:
        return (
          <AgeForm
            age={userData.age}
            setAge={(age) => setUserData({ ...userData, age })}
            onNext={() => {
              updateStepCompletion(2);
              setStep(3);
            }}
          />
        );
      case 3:
        return (
          <HeightForm
            height={userData.height}
            setHeight={(height) => setUserData({ ...userData, height })}
            onNext={() => {
              updateStepCompletion(3);
              setStep(4);
            }}
          />
        );
      case 4:
        return (
          <WeightForm
            weight={userData.weight}
            setWeight={(weight) => setUserData({ ...userData, weight })}
            onNext={() => {
              updateStepCompletion(4);
              setStep(5);
            }}
          />
        );
      case 5:
        return (
          <ActivityLevelForm
            activityLevel={userData.activityLevel}
            setActivityLevel={(level) => setUserData({ ...userData, activityLevel: level })}
            onNext={() => {
              updateStepCompletion(5);
              setStep(6);
            }}
          />
        );
      case 6:
        return (
          <GoalForm 
            goal={userData.goal}
            setGoal={(value) => setUserData(prev => ({ ...prev, goal: value }))}
            onSubmit={handleFinalSubmit}
            userData={userData} // Make sure this contains all required fields
            isGoogleSignup={isGoogleSignup}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900 text-white">
      {/* Login Popup */}
      <LoginPopup 
        isOpen={showLoginPopup} 
        onClose={() => setShowLoginPopup(false)}
      />
      <div className="w-screen mx-auto p-10 flex flex-col md:flex-row items-center">
        {/* Left side */}
        <div className="md:w-1/2 mb-12 px-6 md:mb-0 md:pr-12">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
          >
            <div className="w-20 h-20 bg-gradient-to-br from-purple-600 to-violet-600 rounded-2xl flex items-center justify-center">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold leading-tight">
              Join <span className="bg-gradient-to-r from-purple-400 to-violet-400 bg-clip-text text-transparent">Saporis</span>
            </h1>
            <p className="text-xl text-white/80">
              Create your account to start analyzing your food's nutrition and get personalized recommendations.
            </p>
            <div className="pt-4">
              <button 
                onClick={() => setShowLoginPopup(true)}
                className="px-6 py-3 border border-white/20 rounded-lg hover:bg-white/10 transition-colors bg-gradient-to-br from-purple-600 to-violet-600"
              >
                Already have an account? Sign in
              </button>
            </div>
          </motion.div>
        </div>

        {/* Right side - Dynamic Form Content */}
        <div className="md:w-1/2 w-full bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 shadow-xl">
          <AnimatePresence mode="wait">
            {renderFormStep()}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default Signup;