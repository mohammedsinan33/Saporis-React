import { motion } from "framer-motion";
import { Sparkles, User } from "lucide-react";
import React from "react";

const Navbar = () => {
  return (
    <div className="w-full border-b border-white/10 bg-white/5 backdrop-blur-sm">
      <div className="p-2 flex justify-between items-center max-w-7xl mx-auto">
        {/* Left side - Logo */}
        <div className="flex items-center space-x-3">
          <motion.div 
            className="p-2 rounded-lg bg-gradient-to-br from-purple-500 to-violet-600"
            whileHover={{ rotate: 15 }}
          >
            <Sparkles className="w-5 h-5 text-white" />
          </motion.div>
          <h2 className="text-4xl font-bold bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
            Saporis
          </h2>
        </div>

        {/* Right side - User Avatar */}
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="relative group"
        >
          <button className="p-0.5 rounded-full bg-gradient-to-br from-purple-500 to-violet-600 hover:opacity-80 transition-all">
            <div className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center">
              <User className="w-5 h-5 text-white" />
            </div>
          </button>
          
          {/* Tooltip */}
          <div className="absolute right-0 mt-2 w-48 py-2 px-3 bg-white/10 backdrop-blur-lg rounded-xl border border-white/20 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
            <p className="text-sm text-white/70">User Profile</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Navbar;