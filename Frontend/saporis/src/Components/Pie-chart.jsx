import React from 'react';
import { PieChart as PieChartLucide } from 'lucide-react';
import { motion } from 'framer-motion';

const PieChartComponent = ({ data }) => {
  const total = data.reduce((sum, item) => sum + item.value, 0);
  let currentAngle = 0;

  return (
    <div className="relative w-full h-full flex items-center justify-center">
      <svg viewBox="0 0 100 100" className="w-64 h-64">
        {data.map((item, index) => {
          const angle = (item.value / total) * 360;
          const startAngle = currentAngle;
          currentAngle += angle;

          // Calculate coordinates for pie slice
          const x1 = 50 + 40 * Math.cos((startAngle * Math.PI) / 180);
          const y1 = 50 + 40 * Math.sin((startAngle * Math.PI) / 180);
          const x2 = 50 + 40 * Math.cos(((startAngle + angle) * Math.PI) / 180);
          const y2 = 50 + 40 * Math.sin(((startAngle + angle) * Math.PI) / 180);
          
          // Calculate text position (middle of the slice)
          const textAngle = startAngle + (angle / 2);
          const textRadius = 25; // Slightly inside the pie for the percentage
          const labelRadius = 32; // Further out for the label
          
          const textX = 50 + textRadius * Math.cos((textAngle * Math.PI) / 180);
          const textY = 50 + textRadius * Math.sin((textAngle * Math.PI) / 180);
          
          const labelX = 50 + labelRadius * Math.cos((textAngle * Math.PI) / 180);
          const labelY = 50 + labelRadius * Math.sin((textAngle * Math.PI) / 180);
          
          const largeArcFlag = angle > 180 ? 1 : 0;

          return (
            <React.Fragment key={index}>
              <motion.path
                d={`M 50 50 L ${x1} ${y1} A 40 40 0 ${largeArcFlag} 1 ${x2} ${y2} Z`}
                fill={item.color}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: index * 0.1 }}
                className="hover:opacity-80 transition-opacity cursor-pointer"
              />
              {/* Percentage text */}
              <motion.text
                x={textX}
                y={textY}
                textAnchor="middle"
                dominantBaseline="middle"
                fill="white"
                fontSize="4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: index * 0.1 + 0.2 }}
              >
                {item.value}%
              </motion.text>
              {/* Macro label */}
              <motion.text
                x={labelX}
                y={labelY}
                textAnchor="middle"
                dominantBaseline="middle"
                fill="white"
                fontSize="3.5"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: index * 0.1 + 0.2 }}
              >
                {item.label}
              </motion.text>
            </React.Fragment>
          );
        })}
      </svg>

      {/* Legend */}
      <div className="absolute -right-27 top-1/2 -translate-y-1/2 space-y-2">
        {data.map((item, index) => (
          <motion.div
            key={index}
            className="flex items-center space-x-2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <div 
              className="w-3 h-3 rounded-full" 
              style={{ backgroundColor: item.color }} 
            />
            <span className="text-sm text-white/70">{item.label}</span>
            <span className="text-sm font-medium text-white/90">{item.value}%</span>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default PieChartComponent;