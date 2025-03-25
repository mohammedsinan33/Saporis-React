import React from "react";
import { motion } from "framer-motion";

const RecommendationSection = () => {
  return (
    <div className="w-full h-full flex items-center justify-center text-white/50">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h2 className="text-2xl font-bold mb-2">Recommendations</h2>
        <p>Your personalized food recommendations will appear here</p>
      </motion.div>
    </div>
  );
};

export default RecommendationSection;