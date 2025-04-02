import React, { useState } from "react";
import { motion } from "framer-motion";
import { Ruler, AlertCircle } from "lucide-react";

const HeightForm = ({ height, setHeight, onNext }) => {
  const [error, setError] = useState("");

  const handleHeightChange = (e) => {
    const value = e.target.value;
    if (value < 100 || value > 250) {
      setError("Height must be between 100cm and 250cm");
    } else {
      setError("");
    }
    setHeight(value);
  };

  const handleNext = () => {
    if (!height) {
      setError("Please enter your height");
      return;
    }
    if (height < 100 || height > 250) {
      setError("Height must be between 100cm and 250cm");
      return;
    }
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
          <Ruler className="w-6 h-6 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-white">What's your height?</h2>
        <p className="text-white/70">This helps us calculate your calorie needs</p>
      </div>

      <div className="space-y-4">
        <div className="relative">
          <input
            type="number"
            value={height}
            onChange={handleHeightChange}
            className={`w-full pl-4 pr-4 py-3 bg-white/5 border ${
              error ? 'border-red-500' : 'border-white/10'
            } rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-center text-2xl`}
            placeholder="Height in cm"
            min="100"
            max="250"
            required
          />
          {error && (
            <div className="mt-2 text-red-500 text-sm flex items-center justify-center">
              <AlertCircle className="w-4 h-4 mr-1" />
              <span>{error}</span>
            </div>
          )}
        </div>

        <div className="text-center text-white/70 text-sm">
          <p>Enter your height in centimeters (cm)</p>
          <p>Average height range: 150-190cm</p>
        </div>
      </div>

      <div className="pt-4">
        <button
          onClick={handleNext}
          disabled={!height || error}
          className="w-full py-3 px-4 bg-gradient-to-r from-purple-600 to-violet-600 rounded-lg text-white font-medium hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Next
        </button>
      </div>
    </motion.div>
  );
};

export default HeightForm;