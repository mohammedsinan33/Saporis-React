import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import React, { useState, useEffect } from "react";
import { supabase } from '../lib/supabase';
import UserAvatar from './UserAvatar';

const Navbar = () => {
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      const userEmail = localStorage.getItem('userEmail');
      if (userEmail) {
        const { data, error } = await supabase
          .from('Auth')
          .select('First_Name, Last_Name')
          .eq('email', userEmail)
          .single();

        if (!error && data) {
          setUserData(data);
        }
      }
    };

    fetchUserData();
  }, []);

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
          <div className="p-2">
            <UserAvatar />
            </div>
          
          {/* Tooltip */}
          <div className="absolute right-0 mt-2 w-48 py-2 px-3 bg-white/10 backdrop-blur-lg rounded-xl border border-white/20 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
            {userData && (
              <p className="text-sm text-white/70">
                {`${userData.First_Name} ${userData.Last_Name}`}
              </p>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Navbar;