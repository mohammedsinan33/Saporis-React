import { MessageCircleMore, PieChart, Sparkles } from "lucide-react";
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const Sidenavbar = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const isActive = (path) => location.pathname === path;

    return (
        <div className="h-full w-20 bg-white/5 backdrop-blur-lg border-r border-white/10 p-4 flex flex-col items-center">
            <div className="mt-4 flex flex-col space-y-4">
                {/* Messages Button */}
                <button 
                    onClick={() => navigate('/')}
                    className={`p-3 rounded-2xl transition-all
                        ${isActive('/') 
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
            <div className="mt-auto mb-6 w-10 h-10 rounded-full bg-gradient-to-br from-purple-600 to-violet-600 flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-white" />
            </div>
        </div>
    );
};

export default Sidenavbar;