import React from 'react';
import { motion } from 'framer-motion';

const WeeklyTrendGraph = ({ data }) => {
  const maxValue = Math.max(...data.values);
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  return (
    <div className="w-full h-full p-4">
      <div className="relative h-full flex items-end justify-between">
        {days.map((day, index) => {
          const value = data.values[index];
          const height = (value / maxValue) * 100;
          
          return (
            <div key={day} className="flex flex-col items-center">
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: `${height}%` }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="w-8 bg-gradient-to-t from-purple-600 to-violet-400 rounded-t-lg relative group"
              >
                {/* Tooltip */}
                <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-white/10 backdrop-blur-sm px-2 py-1 rounded text-xs whitespace-nowrap">
                  {value} calories
                </div>
              </motion.div>
              <span className="mt-2 text-xs text-white/70">{day}</span>
            </div>
          );
        })}
        
        {/* Y-axis lines */}
        <div className="absolute left-0 top-0 h-full w-full -z-10">
          {[0, 1, 2, 3, 4].map((line) => (
            <div
              key={line}
              className="absolute w-full border-t border-white/5"
              style={{ bottom: `${(line * 25)}%` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default WeeklyTrendGraph;