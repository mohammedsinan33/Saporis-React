import React from "react";
import { motion } from "framer-motion";

const Button = ({ 
  children, 
  onClick, 
  className = '', 
  disabled = false,
  variant = 'primary'
}) => {
  const baseClasses = "flex items-center justify-center rounded-xl font-medium";
  
  const variantClasses = {
    primary: 'bg-gradient-to-br from-purple-500 to-violet-600 text-white shadow-lg shadow-purple-500/30',
    secondary: 'bg-white/10 text-white backdrop-blur-sm hover:bg-white/20',
    ghost: 'text-white/70 hover:text-white hover:bg-white/5'
  };
  
  return (
    <motion.button
      onClick={onClick}
      disabled={disabled}
      whileTap={!disabled ? { scale: 0.95 } : {}}
      whileHover={!disabled ? { scale: 1.03 } : {}}
      className={`
        ${baseClasses}
        ${variantClasses[variant]}
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        ${className}
      `}
    >
      {children}
    </motion.button>
  );
};

export default Button;