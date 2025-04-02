import { motion } from "framer-motion";
import { BookOpen, Camera, User, ImagePlus, MessageCircle, Shield, Sparkles, Zap } from "lucide-react";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import LoginPopup from "../Auth/Login";


const Landing = () => {
    const navigate = useNavigate();
    const [showLogin, setShowLogin] = useState(false);

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900 text-white">
            {/* Navbar */}
            <nav className="w-full border-b border-white/10 bg-white/5 backdrop-blur-sm sticky top-0 z-50">
                <div className="p-4 flex justify-between items-center max-w-7xl mx-auto">
                    {/* Left Side - Logo */}
                    <div className="flex items-center space-x-3 cursor-pointer" onClick={() => navigate('/')}>
                        <motion.div 
                            className="p-2 rounded-lg bg-gradient-to-br from-purple-500 to-violet-600"
                            whileHover={{ rotate: 15 }}
                        >
                            <Sparkles className="w-5 h-5 text-white" />
                        </motion.div>
                        <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
                            Saporis
                        </h2>
                    </div>

                    {/* Navigation Links */}
                    <div className="hidden md:flex items-center space-x-8">
                        <button 
                            className="text-purple-100 hover:text-white transition-colors bg-gradient-to-br from-purple-600 to-violet-600 rounded-lg shadow-lg"
                            onClick={() => document.getElementById('features').scrollIntoView({ behavior: 'smooth' })}
                        >
                            Features
                        </button>
                        <button 
                            className="text-purple-100 hover:text-white transition-colors bg-gradient-to-br from-purple-600 to-violet-600 rounded-lg shadow-lg"
                            onClick={() => document.getElementById('how-it-works').scrollIntoView({ behavior: 'smooth' })}
                        >
                            How It Works
                        </button>
                        <button 
                            className="text-purple-100 hover:text-white transition-colors bg-gradient-to-br from-purple-600 to-violet-600 rounded-lg shadow-lg"
                            onClick={() => navigate('/about')}
                        >
                            About
                        </button>
                    </div>

                    {/* Right Side - Auth Buttons */}
                    <div className="flex items-center space-x-4">
                        <motion.button 
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="px-4 py-2 text-purple-100 hover:text-white transition-colors bg-gradient-to-br from-purple-600 to-violet-600 rounded-lg shadow-lg"
                            onClick={() => setShowLogin(true)}
                        >
                            Login
                        </motion.button>
                    </div>
                </div>
            </nav>

            {/* Move LoginPopup here, at root level */}
            <LoginPopup 
                isOpen={showLogin} 
                onClose={() => setShowLogin(false)} 
            />

            {/* Hero Section */}
            <section className="relative max-w-8xl mx-auto px-6 py-20 md:py-32 flex flex-col md:flex-row items-center">
                <div className="md:w-1/2 space-y-8">
                    <motion.h1 
                        className="text-4xl md:text-6xl font-bold leading-tight"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        Discover the <span className="bg-gradient-to-r from-purple-400 to-violet-400 bg-clip-text text-transparent">Nutrition</span> in Your Food
                    </motion.h1>
                    <motion.p 
                        className="text-xl text-white/80"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                    >
                        Saporis uses AI to analyze your food photos and provide instant nutritional information, calorie estimates, and healthy alternatives.
                    </motion.p>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.4 }}
                        className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-6"
                    >
                        <button 
                            className="px-8 py-4 bg-gradient-to-br from-purple-600 to-violet-600 rounded-xl shadow-lg text-lg font-medium flex items-center justify-center space-x-2"
                            onClick={() => setShowLogin(true)}
                        >
                            <Zap className="w-5 h-5" />
                            <span>Try It Now</span>
                        </button>
                        <button 
                            className="px-8 py-4 border border-white/20 bg-white/5 rounded-xl shadow-lg text-lg font-medium hover:bg-white/10 transition-colors"
                            onClick={() => document.getElementById('how-it-works').scrollIntoView({ behavior: 'smooth' })}
                        >
                            Learn More
                        </button>
                    </motion.div>
                </div>
                <div className="md:w-1/2 mt-16 md:mt-0 flex justify-center">
                    <motion.div 
                        className="relative w-full max-w-md"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                    >
                        <div className="absolute -top-6 -left-6 w-32 h-32 bg-purple-500/20 rounded-full blur-xl"></div>
                        <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-violet-500/20 rounded-full blur-xl"></div>
                        <div className="relative bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl overflow-hidden p-6">
                            <div className="bg-gradient-to-br from-purple-900 to-violet-900 p-4 rounded-lg">
                                <div className="flex items-center space-x-3 mb-4">
                                    <div className="p-2 bg-purple-600/30 rounded-lg">
                                        <ImagePlus className="w-5 h-5 text-purple-200" />
                                    </div>
                                    <div>
                                        <h3 className="font-medium text-white">Upload Food Photo</h3>
                                        <p className="text-sm text-purple-200">Get instant analysis</p>
                                    </div>
                                </div>
                                <div className="bg-black/30 rounded-lg p-4 border border-white/10">
                                    <div className="flex items-center justify-center h-40 bg-gradient-to-br from-purple-800/30 to-violet-800/30 rounded border border-dashed border-white/20 mb-3">
                                        <div className="text-center">
                                            <Camera className="w-8 h-8 mx-auto text-white/50 mb-2" />
                                            <p className="text-sm text-white/50">Take or upload photo</p>
                                        </div>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <div className="flex space-x-2">
                                            <div className="w-3 h-3 rounded-full bg-purple-500"></div>
                                            <div className="w-3 h-3 rounded-full bg-white/20"></div>
                                            <div className="w-3 h-3 rounded-full bg-white/20"></div>
                                        </div>
                                        <button className="px-4 py-2 bg-gradient-to-br from-purple-600 to-violet-600 rounded-lg text-sm">
                                            Analyze
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Features Section */}
            <section id="features" className="max-w-8xl mx-auto px-6 py-20">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">Powerful Features</h2>
                    <p className="text-xl text-white/80 max-w-2xl mx-auto">
                        Everything you need to make informed decisions about your nutrition
                    </p>
                </div>
                <div className="grid md:grid-cols-3 gap-8">
                    <motion.div 
                        className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-8"
                        whileHover={{ y: -5 }}
                    >
                        <div className="w-14 h-14 bg-gradient-to-br from-purple-600/20 to-violet-600/20 rounded-xl flex items-center justify-center mb-6">
                            <BookOpen className="w-6 h-6 text-purple-300" />
                        </div>
                        <h3 className="text-xl font-bold mb-3">Nutrition Analysis</h3>
                        <p className="text-white/70">
                            Get detailed breakdowns of calories, macronutrients, vitamins, and minerals in your food.
                        </p>
                    </motion.div>
                    <motion.div 
                        className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-8"
                        whileHover={{ y: -5 }}
                    >
                        <div className="w-14 h-14 bg-gradient-to-br from-purple-600/20 to-violet-600/20 rounded-xl flex items-center justify-center mb-6">
                            <MessageCircle className="w-6 h-6 text-purple-300" />
                        </div>
                        <h3 className="text-xl font-bold mb-3">AI Chat Assistant</h3>
                        <p className="text-white/70">
                            Ask questions about your food and get personalized recommendations from our AI.
                        </p>
                    </motion.div>
                    <motion.div 
                        className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-8"
                        whileHover={{ y: -5 }}
                    >
                        <div className="w-14 h-14 bg-gradient-to-br from-purple-600/20 to-violet-600/20 rounded-xl flex items-center justify-center mb-6">
                            <Shield className="w-6 h-6 text-purple-300" />
                        </div>
                        <h3 className="text-xl font-bold mb-3">Diet Tracking</h3>
                        <p className="text-white/70">
                            Track your daily intake and get insights to help you reach your health goals.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* How It Works Section */}
            <section id="how-it-works" className="max-w-7xl mx-auto px-6 py-20 bg-gradient-to-br from-purple-900/30 to-violet-900/30">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">How It Works</h2>
                    <p className="text-xl text-white/80 max-w-2xl mx-auto">
                        Get nutritional insights in just a few simple steps
                    </p>
                </div>
                <div className="grid md:grid-cols-3 gap-8">
                    <div className="flex flex-col items-center text-center">
                        <div className="w-20 h-20 bg-gradient-to-br from-purple-600 to-violet-600 rounded-full flex items-center justify-center mb-6 text-2xl font-bold">
                            1
                        </div>
                        <h3 className="text-xl font-bold mb-3">Upload a Photo</h3>
                        <p className="text-white/70">
                            Simply take or upload a photo of your food. Our AI will analyze it instantly.
                        </p>
                    </div>
                    <div className="flex flex-col items-center text-center">
                        <div className="w-20 h-20 bg-gradient-to-br from-purple-600 to-violet-600 rounded-full flex items-center justify-center mb-6 text-2xl font-bold">
                            2
                        </div>
                        <h3 className="text-xl font-bold mb-3">Get Analysis</h3>
                        <p className="text-white/70">
                            Receive detailed nutritional information about your meal.
                        </p>
                    </div>
                    <div className="flex flex-col items-center text-center">
                        <div className="w-20 h-20 bg-gradient-to-br from-purple-600 to-violet-600 rounded-full flex items-center justify-center mb-6 text-2xl font-bold">
                            3
                        </div>
                        <h3 className="text-xl font-bold mb-3">Ask Questions</h3>
                        <p className="text-white/70">
                            Chat with our AI to get personalized recommendations and alternatives.
                        </p>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="max-w-7xl mx-auto px-6 py-20 text-center">
                <div className="bg-gradient-to-br from-purple-900/50 to-violet-900/50 rounded-2xl p-12 border border-white/10">
                    <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Transform Your Nutrition?</h2>
                    <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto">
                        Join thousands of users who are making healthier choices with Saporis.
                    </p>
                    <button 
                        className="px-8 py-4 bg-gradient-to-br from-purple-600 to-violet-600 rounded-xl shadow-lg text-lg font-medium hover:shadow-xl transition-all"
                        onClick={() => navigate('/Home')}
                    >
                        Get Started for Free
                    </button>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-white/5 backdrop-blur-sm border-t border-white/10 py-12">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid md:grid-cols-4 gap-8 mb-12">
                        <div>
                            <div className="flex items-center space-x-3 mb-4">
                                <div className="p-2 rounded-lg bg-gradient-to-br from-purple-500 to-violet-600">
                                    <Sparkles className="w-5 h-5 text-white" />
                                </div>
                                <h2 className="text-xl font-bold bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
                                    Saporis
                                </h2>
                            </div>
                            <p className="text-white/70">
                                AI-powered nutrition analysis to help you make better food choices.
                            </p>
                        </div>
                        <div>
                            <h3 className="text-lg font-bold mb-4">Product</h3>
                            <ul className="space-y-2">
                                <li><button className="text-purple-100 hover:text-white transition-colors bg-gradient-to-br from-purple-600 to-violet-600 rounded-lg shadow-lg" onClick={() => navigate('/features')}>Features</button></li>
                                <li><button className="text-purple-100 hover:text-white transition-colors bg-gradient-to-br from-purple-600 to-violet-600 rounded-lg shadow-lg" onClick={() => navigate('/app')}>Demo</button></li>
                            </ul>
                        </div>
                        <div>
                            <h3 className="text-lg font-bold mb-4">Company</h3>
                            <ul className="space-y-2">
                                <li><button className=" hover:text-white transition-colors bg-gradient-to-br from-purple-600 to-violet-600 rounded-lg shadow-lg" onClick={() => navigate('/about')}>About</button></li>
                                <li><button className=" hover:text-white transition-colors bg-gradient-to-br from-purple-600 to-violet-600 rounded-lg shadow-lg" onClick={() => navigate('/blog')}>Blog</button></li>
                            </ul>
                        </div>
                        <div>
                            <h3 className="text-lg font-bold mb-4">Support</h3>
                            <ul className="space-y-2">
                                <li><button className="text-purple-100 hover:text-white transition-colors bg-gradient-to-br from-purple-600 to-violet-600 rounded-lg shadow-lg" onClick={() => navigate('/contact')}>Contact</button></li>
                                <li><button className="text-purple-100 hover:text-white transition-colors bg-gradient-to-br from-purple-600 to-violet-600 rounded-lg shadow-lg" onClick={() => navigate('/faq')}>FAQ</button></li>
                                <li><button className="text-purple-100 hover:text-white transition-colors bg-gradient-to-br from-purple-600 to-violet-600 rounded-lg shadow-lg" onClick={() => navigate('/privacy')}>Privacy Policy</button></li>
                            </ul>
                        </div>
                    </div>
                    <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center">
                        <p className="text-white/50 mb-4 md:mb-0">
                            © 2023 Saporis. All rights reserved.
                        </p>
                        <div className="flex space-x-6">
                            <button className="text-purple-100 hover:text-white transition-colors bg-gradient-to-br from-purple-600 to-violet-600 rounded-lg shadow-lg">
                                <span className="sr-only">GitHub</span>
                                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                                    <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                                </svg>
                            </button>
                            <button className="text-purple-100 hover:text-white transition-colors bg-gradient-to-br from-purple-600 to-violet-600 rounded-lg shadow-lg">
                                <span className="sr-only">Instagram</span>
                                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                                    <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Landing;