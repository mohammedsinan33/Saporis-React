import { LogOut, MessageCircleMore, PieChart, Sparkles, UserCircle } from "lucide-react";
import React, { useState } from 'react';

import { AnimatePresence, motion } from "framer-motion";
import { useLocation, useNavigate } from 'react-router-dom';

const Sidenavbar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [showLogout, setShowLogout] = useState(false);

    const isActive = (path) => location.pathname === path;

    const handleLogout = () => {
        localStorage.removeItem('userEmail');
        setShowLogout(false);
        navigate('/');
    };

    const handleProfileClick = () => {
        setShowLogout(false);
        navigate('/UserProfile');
    };

    return (
        <div className="h-full w-20 bg-white/5 backdrop-blur-lg border-r border-white/10 p-4 flex flex-col items-center">
            <div className="mt-4 flex flex-col space-y-4">
                {/* Messages Button */}
                <button 
                    onClick={() => navigate('/Home')}
                    className={`p-3 rounded-2xl transition-all
                        ${isActive('/Home') 
                            ? 'bg-gradient-to-br from-purple-500 to-violet-500 shadow-lg shadow-purple-500/20' 
                            : 'bg-white/10 hover:bg-gradient-to-br hover:from-purple-600 hover:to-violet-600'
                        }
                    `}
                >
                    <MessageCircleMore className="w-6 h-6 text-white" />
                </button>
                
                {/* Analysis Button */}
                <button 
                    onClick={() => navigate('/analysis')}
                    className={`p-3 rounded-2xl transition-all
                        ${isActive('/analysis') 
                            ? 'bg-gradient-to-br from-purple-500 to-violet-500 shadow-lg shadow-purple-500/20' 
                            : 'bg-white/10 hover:bg-gradient-to-br hover:from-purple-600 hover:to-violet-600'
                        }
                    `}
                >
                    <PieChart className="w-6 h-6 text-white" />
                </button>
            </div>
            <div className="relative mt-auto mb-6">
                <motion.button
                    onClick={() => setShowLogout(!showLogout)}
                    className=" w-15 h-15 rounded-md bg-gradient-to-br from-purple-600 to-violet-600 flex items-center justify-center"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                >
                    <Sparkles className="w-10 h-10 text-white" />
                </motion.button>

                <AnimatePresence>
                    {showLogout && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 bg-white/10 backdrop-blur-lg rounded-lg overflow-hidden"
                        >
                            <button
                                onClick={handleProfileClick}
                                className="w-full px-4 py-2 text-white flex items-center space-x-2 hover:bg-white/10 transition-colors"
                            >
                                <UserCircle className="w-4 h-4" />
                                <span>Profile</span>
                            </button>
                            
                            <button
                                onClick={handleLogout}
                                className="w-full px-4 py-2 text-red-500 flex items-center space-x-2 hover:bg-white/10 transition-colors from-purple-500 to-violet-500"
                            >
                                <LogOut className="w-4 h-4 " />
                                <span>Logout</span>
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default Sidenavbar;