import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Activity, AlertCircle } from 'lucide-react';

const ActivityLevelForm = ({ activityLevel, setActivityLevel, onNext }) => {
  const [error, setError] = useState('');

  const activityLevels = [
    {
      value: 1.2,
      label: 'Sedentary',
      description: 'Little or no exercise, desk job'
    },
    {
      value: 1.375,
      label: 'Lightly Active',
      description: 'Light exercise 1-3 days/week'
    },
    {
      value: 1.55,
      label: 'Moderately Active',
      description: 'Moderate exercise 3-5 days/week'
    },
    {
      value: 1.725,
      label: 'Very Active',
      description: 'Heavy exercise 6-7 days/week'
    },
    {
      value: 1.9,
      label: 'Extra Active',
      description: 'Very heavy exercise, physical job or training twice per day'
    }
  ];

  // Add useEffect to log activity level changes
  useEffect(() => {
    console.log('Current activity level:', activityLevel);
  }, [activityLevel]);

  const handleActivitySelect = (value) => {
    console.log('Setting activity level to:', value);
    setActivityLevel(value);
    setError('');
  };

  const handleSubmit = () => {
    if (!activityLevel) {
      setError('Please select your activity level');
      return;
    }
    
    // Debug log before submitting
    console.log('Activity Level being passed:', activityLevel);
    
    // Make sure the value is a number
    const numericActivityLevel = Number(activityLevel);
    
    if (isNaN(numericActivityLevel)) {
      console.error('Invalid activity level:', activityLevel);
      setError('Invalid activity level');
      return;
    }

    // Update parent component with numeric value
    setActivityLevel(numericActivityLevel);
    console.log('Submitting activity level:', numericActivityLevel);
    onNext();
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
          <Activity className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-white">What's your activity level?</h2>
        <p className="text-white/70">This helps us calculate your daily calorie needs</p>
      </div>

      <div className="space-y-4">
        {activityLevels.map((level) => (
          <motion.button
            key={level.value}
            onClick={() => handleActivitySelect(level.value)}
            className={`w-full py-4 px-6 rounded-lg text-left transition-all ${
              activityLevel === level.value
                ? 'bg-purple-600/50 border border-purple-400'
                : 'bg-white/5 border border-white/10 hover:bg-white/10'
            }`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="flex flex-col">
              <span className="font-medium text-white">{level.label}</span>
              <span className="text-sm text-white/70">{level.description}</span>
            </div>
          </motion.button>
        ))}
      </div>

      {error && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-red-500 text-sm flex items-center justify-center"
        >
          <AlertCircle className="w-4 h-4 mr-1" />
          <span>{error}</span>
        </motion.div>
      )}

      <div className="pt-4">
        <motion.button
          onClick={handleSubmit}
          disabled={!activityLevel}
          className="w-full py-3 px-4 bg-gradient-to-r from-purple-600 to-violet-600 rounded-lg text-white font-medium hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          Continue
        </motion.button>
      </div>
    </motion.div>
  );
};

export default ActivityLevelForm;