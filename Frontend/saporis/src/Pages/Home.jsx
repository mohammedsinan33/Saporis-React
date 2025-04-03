import { AnimatePresence, motion } from "framer-motion";
import { Camera, ImagePlus, MessageCircle, Send, Sparkles, Upload, X, Calculator, Info, CheckCircle } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import ReactMarkdown from 'react-markdown';
import Navbar from "../Components/Navbar";
import Sidenavbar from "../Components/Sidenavbar";
import Inputbox from "../Components/Inputbox";
import { supabase } from '../lib/supabase';

const Home = () => {
    const [messages, setMessages] = useState([]);
    const [hasImage, setHasImage] = useState(false);
    const [questions, setQuestions] = useState([]);
    const [answers, setAnswers] = useState({});
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [isAwaitingResponse, setIsAwaitingResponse] = useState(false);
    const [userData, setUserData] = useState(null);
    const [calorieGoal, setCalorieGoal] = useState(null);
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [foodDetails, setFoodDetails] = useState(null);
    const [lastAnswers, setLastAnswers] = useState('');
    const [nutritionContext, setNutritionContext] = useState(null);
    const [chatMode, setChatMode] = useState(false);
    const [dailyConsumption, setDailyConsumption] = useState(null);
    const messagesEndRef = useRef(null);
    const [typingText, setTypingText] = useState('');

    // Message types for better visual distinction
    const MESSAGE_TYPES = {
        GREETING: 'greeting',
        QUESTION: 'question',
        CONFIRMATION: 'confirmation',
        RECOMMENDATION: 'recommendation', 
        NUTRITION_INFO: 'nutrition_info',
        ERROR: 'error',
        SUCCESS: 'success',
        GENERAL: 'general'
    };

    useEffect(() => {
        fetchUserData();
    }, []);

    // Auto-scroll to the latest message
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    // Typing animation effect
    useEffect(() => {
        if (isAwaitingResponse) {
            const texts = ["Thinking", "Processing", "Analyzing"];
            let currentTextIndex = 0;
            let currentDotCount = 0;
            
            const interval = setInterval(() => {
                currentDotCount = (currentDotCount + 1) % 4;
                const dots = '.'.repeat(currentDotCount);
                setTypingText(`${texts[currentTextIndex]}${dots}`);
                
                // Cycle through different text prompts
                if (currentDotCount === 0) {
                    currentTextIndex = (currentTextIndex + 1) % texts.length;
                }
            }, 500);
            
            return () => clearInterval(interval);
        }
    }, [isAwaitingResponse]);

    const fetchUserData = async () => {
        try {
            const userEmail = localStorage.getItem('userEmail');
            if (!userEmail) {
                console.error('No user email found');
                return;
            }

            const { data, error } = await supabase
                .from('Auth')
                .select('Calorie_goal')
                .eq('email', userEmail)
                .single();

            if (error) {
                console.error('Error fetching user data:', error);
                return;
            }

            if (data) {
                console.log('Fetched user data:', data);
                setCalorieGoal(data.Calorie_goal);
                setUserData(data);
            }
        } catch (error) {
            console.error('Error in fetchUserData:', error);
        }
    };

    // Fetch today's consumption data
    const fetchDailyConsumption = async () => {
        try {
            const today = new Date().toISOString().split('T')[0];
            const userEmail = localStorage.getItem('userEmail');
            
            const { data, error } = await supabase
                .from('Food_and_calorie_details')
                .select('Consumed_Calorie, Protien, Carb, Fat, Food_details')
                .eq('Date', today)
                .eq('email', userEmail)
                .single();

            if (error && error.code !== 'PGRST116') { // PGRST116 is "no rows returned" error
                console.error('Error fetching daily consumption:', error);
                return null;
            }

            return data || {
                Consumed_Calorie: 0,
                Protien: 0, 
                Carb: 0,
                Fat: 0,
                Food_details: ''
            };
        } catch (error) {
            console.error('Error in fetchDailyConsumption:', error);
            return null;
        }
    };

    useEffect(() => {
        const initialBotMessage = {
            text: "Hello! I'm Saporis. Please upload a photo of the food you'd like to know about, and I'll help you with recipes, and nutrition info!",
            sender: "bot",
            timestamp: new Date().toLocaleTimeString(),
            type: MESSAGE_TYPES.GREETING
        };
        setMessages([initialBotMessage]);
    }, []);

    const handleSendMessage = async (messageData) => {
        // Special case: Handle new image upload with priority, regardless of other states
        if (messageData.image) {
            // Always add the user message to the chat first
            const userMessage = {
                text: messageData.text,
                image: messageData.image,
                sender: "user",
                timestamp: new Date().toLocaleTimeString()
            };
            
            setMessages(prevMessages => [...prevMessages, userMessage]);
            
            // Clean all states to start fresh image processing
            setHasImage(true);
            setQuestions([]);
            setAnswers({});
            setCurrentQuestionIndex(0);
            setChatMode(false); // Important: Turn off chat mode when processing a new image
            setShowConfirmation(false);
            setIsAwaitingResponse(true);
            
            try {
                const formData = new FormData();
                const file = dataURLtoFile(messageData.image, 'food.jpg');
                formData.append('file', file);

                const response = await fetch('http://127.0.0.1:8000/upload_image/', {
                    method: 'POST',
                    body: formData,
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const data = await response.json();
                console.log("Server response:", data);

                const questionArray = Object.values(data).map((questionText, index) => ({
                    id: `question${index + 1}`,
                    text: questionText.trim()
                }));

                questionArray.push({
                    id: 'confirmation',
                    text: 'Do you confirm these portions are correct? (Yes/No)'
                });

                setQuestions(questionArray);
                setCurrentQuestionIndex(0);

                const firstQuestion = {
                    text: questionArray[0].text,
                    sender: "bot",
                    timestamp: new Date().toLocaleTimeString(),
                    type: MESSAGE_TYPES.QUESTION
                };
                setMessages(prevMessages => {
                    // Remove any processing messages
                    const filteredMessages = prevMessages.filter(msg => msg.text || msg.image);
                    return [...filteredMessages, firstQuestion];
                });

            } catch (error) {
                console.error('Error uploading image:', error);
                const errorMessage = {
                    text: "Sorry, I couldn't analyze your image. Please try uploading again.",
                    sender: "bot",
                    timestamp: new Date().toLocaleTimeString(),
                    type: MESSAGE_TYPES.ERROR
                };
                setMessages(prevMessages => [...prevMessages, errorMessage]);
                // Reset state for new attempt
                setHasImage(false);
            } finally {
                setIsAwaitingResponse(false);
            }
            
            return; // Exit early after handling image
        }
        
        // If we get here, we're handling a text message (no image)
        const userMessage = {
            text: messageData.text,
            sender: "user",
            timestamp: new Date().toLocaleTimeString()
        };
        
        setMessages(prevMessages => [...prevMessages, userMessage]);

        // Handle chat mode (nutrition context chat)
        if (chatMode && !showConfirmation) {
            await handleNutritionChat(messageData.text);
            return;
        }

        // Handle confirmation response
        if (showConfirmation) {
            if (messageData.text.toLowerCase() === 'yes') {
                await saveFoodDetails();
            } else {
                const cancelMessage = {
                    text: "Okay, I won't record this meal. Feel free to upload another food photo when you're ready!",
                    sender: "bot",
                    timestamp: new Date().toLocaleTimeString(),
                    type: MESSAGE_TYPES.GENERAL
                };
                setMessages(prevMessages => [...prevMessages, cancelMessage]);
            }
            setShowConfirmation(false);
            setHasImage(false);
            // Reset to neutral state but keep input box
            setChatMode(true);
            return;
        }

        // Handle question flow
        if (questions.length > 0) {
            const currentQuestion = questions[currentQuestionIndex];

            setAnswers(prevAnswers => ({
                ...prevAnswers,
                [currentQuestion.id]: {
                    question: currentQuestion.text,
                    answer: messageData.text
                }
            }));

            if (currentQuestionIndex < questions.length - 1) {
                setCurrentQuestionIndex(currentQuestionIndex + 1);
                const nextBotMessage = {
                    text: questions[currentQuestionIndex + 1].text,
                    sender: "bot",
                    timestamp: new Date().toLocaleTimeString(),
                    type: currentQuestionIndex === questions.length - 2 ? MESSAGE_TYPES.CONFIRMATION : MESSAGE_TYPES.QUESTION
                }
                setMessages(prevMessages => [...prevMessages, nextBotMessage]);
            } else {
                setIsAwaitingResponse(true);
                try {
                    // Get today's consumption data
                    const dailyData = await fetchDailyConsumption();
                    setDailyConsumption(dailyData);
                    
                    const formattedAnswers = Object.entries(answers)
                        .map(([id, answerObj]) => {
                            const questionObj = questions.find(q => q.id === id);
                            const questionText = questionObj?.text || "Unknown Question";
                            return `${questionText}: ${answerObj.answer}`;
                        })
                        .concat([`Daily Calorie Goal: ${calorieGoal} calories`])
                        .join('\n');

                    setLastAnswers(formattedAnswers);

                    const response = await fetch('http://127.0.0.1:8000/get_calorie_recommendations/', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ 
                            user_input: formattedAnswers,
                            calorie_goal: calorieGoal 
                        }),
                    });

                    if (!response.ok) {
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }

                    const data = await response.json();
                    
                    // Save nutritional data
                    setFoodDetails(data.nutritional_data);
                    
                    // Store nutrition context for future chat
                    setNutritionContext(data.calorie_recommendations);
                    
                    // Send recommendations
                    const recommendationMessage = {
                        text: `Here are your calorie recommendations:\n\n${data.calorie_recommendations}`,
                        sender: "bot",
                        timestamp: new Date().toLocaleTimeString(),
                        type: MESSAGE_TYPES.RECOMMENDATION
                    };
                    setMessages(prevMessages => [...prevMessages, recommendationMessage]);

                    // Ask for confirmation
                    setTimeout(() => {
                        const confirmationMessage = {
                            text: "Have you eaten this food? Reply with 'Yes' or 'No'",
                            sender: "bot",
                            timestamp: new Date().toLocaleTimeString(),
                            type: MESSAGE_TYPES.CONFIRMATION
                        };
                        setMessages(prevMessages => [...prevMessages, confirmationMessage]);
                        setShowConfirmation(true);
                    }, 1000);

                } catch (error) {
                    console.error('Error sending data:', error);
                    const errorMessage = {
                        text: "Failed to get calorie recommendations. Please try again.",
                        sender: "bot",
                        timestamp: new Date().toLocaleTimeString(),
                        type: MESSAGE_TYPES.ERROR
                    }
                    setMessages(prevMessages => [...prevMessages, errorMessage]);
                } finally {
                    setIsAwaitingResponse(false);
                }

                setQuestions([]);
                setAnswers({});
                setCurrentQuestionIndex(0);
                setChatMode(true);
            }
        } else {
            // If we reach here, it's an unexpected state - send a helpful message
            const helpMessage = {
                text: "I'm not sure how to respond to that. Would you like to upload a photo of food or ask a question about your nutrition?",
                sender: "bot",
                timestamp: new Date().toLocaleTimeString(),
                type: MESSAGE_TYPES.GENERAL
            };
            setMessages(prevMessages => [...prevMessages, helpMessage]);
        }
    };

    // New function to handle chat with nutrition context
    const handleNutritionChat = async (message) => {
        setIsAwaitingResponse(true);
        try {
            // Fetch latest daily consumption
            const dailyData = await fetchDailyConsumption();
            
            const chatContext = {
                user_message: message,
                nutrition_context: nutritionContext || "",
                daily_consumption: {
                    calories: dailyData?.Consumed_Calorie || 0,
                    protein: dailyData?.Protien || 0,
                    carbs: dailyData?.Carb || 0,
                    fat: dailyData?.Fat || 0,
                    food_items: dailyData?.Food_details || ""
                },
                calorie_goal: calorieGoal || 2000
            };
            
            const response = await fetch('http://127.0.0.1:8000/chat_with_nutrition/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(chatContext),
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            
            // Process the response to ensure proper Markdown formatting
            let formattedResponse = data.response;
            
            // Add section headers if they don't exist
            if (!formattedResponse.includes('#')) {
                // Split response into paragraphs
                const paragraphs = formattedResponse.split('\n\n').filter(p => p.trim());
                
                // Format response with better structure
                if (paragraphs.length > 1) {
                    // Add summary header to first paragraph if it looks like a summary
                    if (paragraphs[0].length < 200) {
                        formattedResponse = `## Nutrition Analysis\n\n${paragraphs[0]}\n\n`;
                        
                        // Add details header to subsequent paragraphs
                        formattedResponse += `## Details\n\n${paragraphs.slice(1).join('\n\n')}`;
                    } else {
                        formattedResponse = paragraphs.join('\n\n');
                    }
                }
            }
            
            // Convert bullet points if they exist but aren't properly formatted
            if (formattedResponse.includes('•') || formattedResponse.includes('-')) {
                formattedResponse = formattedResponse.replace(/^(•|-)\s+(.+)$/gm, '* $2');
            }
            
            // Emphasize important numbers
            formattedResponse = formattedResponse.replace(/(\d+(?:\.\d+)?)\s*(calories|grams|g|protein|carbs|fat)/gi, '**$1** $2');
            
            // Highlight key terms
            const keywords = ['calorie deficit', 'calorie surplus', 'protein', 'carbs', 'fat', 'goal', 'recommended', 'target'];
            keywords.forEach(keyword => {
                const regex = new RegExp(`\\b${keyword}\\b`, 'gi');
                formattedResponse = formattedResponse.replace(regex, `**${keyword}**`);
            });
            
            // Add response to chat
            const botResponse = {
                text: formattedResponse,
                sender: "bot",
                timestamp: new Date().toLocaleTimeString(),
                type: MESSAGE_TYPES.NUTRITION_INFO
            };
            
            setMessages(prevMessages => [...prevMessages, botResponse]);
            
            // If there's an image upload suggestion
            if (data.suggest_upload) {
                setTimeout(() => {
                    const uploadSuggestion = {
                        text: "Would you like to upload another food item? You can take a new photo or upload one from your device.",
                        sender: "bot",
                        timestamp: new Date().toLocaleTimeString(),
                        type: MESSAGE_TYPES.GENERAL
                    };
                    setMessages(prevMessages => [...prevMessages, uploadSuggestion]);
                }, 1000);
            }
            
        } catch (error) {
            console.error('Error in nutrition chat:', error);
            const errorMessage = {
                text: "Sorry, I'm having trouble responding. Please try again.",
                sender: "bot",
                timestamp: new Date().toLocaleTimeString(),
                type: MESSAGE_TYPES.ERROR
            };
            setMessages(prevMessages => [...prevMessages, errorMessage]);
        } finally {
            setIsAwaitingResponse(false);
        }
    };

    // Add function to save food details to Supabase
    const saveFoodDetails = async () => {
        try {
            const today = new Date().toISOString().split('T')[0];
            const userEmail = localStorage.getItem('userEmail');
            const dayOfWeek = new Date().toLocaleString('en-US', { weekday: 'long' });

            // First, check if there's an existing record for today
            const { data: existingRecord, error: fetchError } = await supabase
                .from('Food_and_calorie_details')
                .select('*')
                .eq('Date', today)
                .eq('email', userEmail)
                .single();

            if (fetchError && fetchError.code !== 'PGRST116') { // PGRST116 is "no rows returned" error
                console.error('Error fetching existing record:', fetchError);
                throw fetchError;
            }

            let error;
            if (existingRecord) {
                // Extract food details from lastAnswers - assuming it contains the food description
                const newFoodItem = lastAnswers.split('\n')[0]; // Get first line which typically contains the food item

                // Update existing record
                const { error: updateError } = await supabase
                    .from('Food_and_calorie_details')
                    .update({
                        Consumed_Calorie: parseFloat(existingRecord.Consumed_Calorie) + parseFloat(foodDetails.calories),
                        Protien: parseFloat(existingRecord.Protien) + parseFloat(foodDetails.protein),
                        Fat: parseFloat(existingRecord.Fat) + parseFloat(foodDetails.fat),
                        Carb: parseFloat(existingRecord.Carb) + parseFloat(foodDetails.carbs),
                        Food_details: existingRecord.Food_details + '\n' + newFoodItem // Append new food item
                    })
                    .eq('Date', today)
                    .eq('email', userEmail);

                error = updateError;
            } else {
                // Create new record if none exists
                const { error: insertError } = await supabase
                    .from('Food_and_calorie_details')
                    .insert([{
                        Consumed_Calorie: parseFloat(foodDetails.calories),
                        Protien: parseFloat(foodDetails.protein),
                        Fat: parseFloat(foodDetails.fat),
                        Carb: parseFloat(foodDetails.carbs),
                        Date: today,
                        Food_details: lastAnswers.split('\n')[0], // Only store the food item description
                        email: userEmail,
                        Day_in_week: dayOfWeek
                    }]);

                error = insertError;
            }

            if (error) {
                console.error('Error saving food details:', error);
                throw error;
            }
            
            // Refresh daily consumption data
            const updatedConsumption = await fetchDailyConsumption();
            setDailyConsumption(updatedConsumption);

            // Add success message to chat
            const successMessage = {
                text: existingRecord 
                    ? "Great! I've updated your food consumption for today. You can continue chatting with me about your nutrition or upload another food item when you're ready."
                    : "Great! I've recorded your food consumption for today. You can continue chatting with me about your nutrition or upload another food item when you're ready.",
                sender: "bot",
                timestamp: new Date().toLocaleTimeString(),
                type: MESSAGE_TYPES.SUCCESS
            };
            setMessages(prevMessages => [...prevMessages, successMessage]);
            
            // Enable chat mode after recording
            setChatMode(true);
        } catch (error) {
            console.error('Error in saveFoodDetails:', error);
            const errorMessage = {
                text: "Sorry, I couldn't save your food details. Please try again.",
                sender: "bot",
                timestamp: new Date().toLocaleTimeString(),
                type: MESSAGE_TYPES.ERROR
            };
            setMessages(prevMessages => [...prevMessages, errorMessage]);
        }
    };

    //Helper function
    const dataURLtoFile = (dataurl, filename) => {
        var arr = dataurl.split(','),
            mime = arr[0].match(/:(.*?);/)[1],
            bstr = atob(arr[1]),
            n = bstr.length,
            u8arr = new Uint8Array(n);
        while (n--) {
            u8arr[n] = bstr.charCodeAt(n);
        }
        return new File([u8arr], filename, { type: mime });
    }

    // Get message icon based on message type
    const getMessageIcon = (type) => {
        switch(type) {
            case MESSAGE_TYPES.GREETING:
                return <MessageCircle className="w-4 h-4 text-blue-300" />;
            case MESSAGE_TYPES.QUESTION:
                return <Info className="w-4 h-4 text-yellow-300" />;
            case MESSAGE_TYPES.CONFIRMATION:
                return <CheckCircle className="w-4 h-4 text-green-300" />;
            case MESSAGE_TYPES.RECOMMENDATION:
                return <Calculator className="w-4 h-4 text-purple-300" />;
            case MESSAGE_TYPES.NUTRITION_INFO:
                return <Calculator className="w-4 h-4 text-purple-300" />;
            case MESSAGE_TYPES.ERROR:
                return <X className="w-4 h-4 text-red-300" />;
            case MESSAGE_TYPES.SUCCESS:
                return <CheckCircle className="w-4 h-4 text-green-300" />;
            default:
                return <MessageCircle className="w-4 h-4 text-blue-300" />;
        }
    };

    // Get bubble style based on message type
    const getBubbleStyle = (type, isUser) => {
        if (isUser) return "bg-gradient-to-br from-purple-600 to-violet-600 text-white shadow-lg";
        
        switch(type) {
            case MESSAGE_TYPES.GREETING:
                return "bg-gradient-to-br from-blue-500/20 to-blue-600/20 border border-blue-500/30 text-white backdrop-blur-sm";
            case MESSAGE_TYPES.QUESTION:
                return "bg-gradient-to-br from-yellow-500/20 to-amber-500/20 border border-yellow-500/30 text-white backdrop-blur-sm";
            case MESSAGE_TYPES.CONFIRMATION:
                return "bg-gradient-to-br from-green-500/20 to-emerald-500/20 border border-green-500/30 text-white backdrop-blur-sm";
            case MESSAGE_TYPES.RECOMMENDATION:
                return "bg-gradient-to-br from-purple-500/20 to-violet-500/20 border border-purple-500/30 text-white backdrop-blur-sm";
            case MESSAGE_TYPES.NUTRITION_INFO:
                return "bg-gradient-to-br from-purple-500/20 to-violet-500/20 border border-purple-500/30 text-white backdrop-blur-sm";
            case MESSAGE_TYPES.ERROR:
                return "bg-gradient-to-br from-red-500/20 to-pink-500/20 border border-red-500/30 text-white backdrop-blur-sm";
            case MESSAGE_TYPES.SUCCESS:
                return "bg-gradient-to-br from-green-500/20 to-emerald-500/20 border border-green-500/30 text-white backdrop-blur-sm";
            default:
                return "bg-white/10 text-white backdrop-blur-sm";
        }
    };

    return (
        <div className="w-screen h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900 flex text-white overflow-hidden">
            {/* Sidebar */}
            <Sidenavbar />

            {/* Main Content */}
            <div className="flex-1 flex flex-col h-full overflow-hidden">
                <Navbar /> {/* Use the imported Navbar component here */}

                {/* Messages Area */}
                <div className="flex-1 overflow-y-auto p-6 pt-4 custom-scrollbar">
                    {messages.length === 0 ? (
                        <div className="h-full flex items-center justify-center text-white/50 italic">
                            <div className="inline-flex flex-col items-center">
                                <Sparkles className="w-8 h-8 mb-3 text-white/30" />
                                <span>Loading conversation...</span>
                            </div>
                        </div>
                    ) : (
                        messages.map((msg, index) => {
                            const isUser = msg.sender === 'user';
                            return (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.3 }}
                                    className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}
                                >
                                    <div className={`
                                        max-w-md p-4 rounded-2xl relative overflow-hidden
                                        ${getBubbleStyle(msg.type, isUser)}
                                    `}
                                    >
                                        {!isUser && msg.type && (
                                            <div className="absolute top-2 right-2 opacity-70">
                                                {getMessageIcon(msg.type)}
                                            </div>
                                        )}
                                        
                                        {msg.image && (
                                            <img
                                                src={msg.image}
                                                alt="Uploaded food"
                                                className="mb-2 rounded-lg max-w-full max-h-48 object-cover"
                                            />
                                        )}
                                        {msg.text && (
                                            <div className="prose prose-invert max-w-none">
                                                <ReactMarkdown
                                                    components={{
                                                        h1: ({node, ...props}) => <h1 className="text-2xl font-bold mb-4" {...props} />,
                                                        h2: ({node, ...props}) => <h2 className="text-xl font-bold mb-3" {...props} />,
                                                        h3: ({node, ...props}) => <h3 className="text-lg font-bold mb-2" {...props} />,
                                                        p: ({node, ...props}) => <p className="mb-2 last:mb-0" {...props} />,
                                                        ul: ({node, ...props}) => <ul className="list-disc ml-4 mb-4" {...props} />,
                                                        ol: ({node, ...props}) => <ol className="list-decimal ml-4 mb-4" {...props} />,
                                                        li: ({node, ...props}) => <li className="mb-1" {...props} />,
                                                        strong: ({node, ...props}) => <strong className="font-semibold text-purple-300" {...props} />,
                                                        em: ({node, ...props}) => <em className="text-purple-200 italic" {...props} />,
                                                        hr: ({node, ...props}) => <hr className="my-4 border-white/10" {...props} />,
                                                        blockquote: ({node, ...props}) => (
                                                            <blockquote className="border-l-4 border-purple-500 pl-4 my-4 italic text-white/80" {...props} />
                                                        ),
                                                    }}
                                                >
                                                    {msg.text}
                                                </ReactMarkdown>
                                            </div>
                                        )}
                                        <div className={`text-xs mt-2 ${isUser ? 'text-white/70' : 'text-white/50'}`}>
                                            {msg.timestamp}
                                        </div>
                                        {isUser && (
                                            <div className="absolute -bottom-4 -right-4 w-16 h-16 bg-purple-400/10 rounded-full" />
                                        )}
                                    </div>
                                </motion.div>
                            );
                        })
                    )}
                    {isAwaitingResponse && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.2 }}
                            className="flex justify-start mb-4"
                        >
                            <div className="bg-white/10 text-white backdrop-blur-sm p-4 rounded-2xl max-w-md">
                                <div className="flex items-center space-x-2">
                                    <div className="flex space-x-1">
                                        <motion.div
                                            animate={{
                                                scale: [1, 1.2, 1],
                                                opacity: [0.4, 1, 0.4]
                                            }}
                                            transition={{
                                                duration: 1.5,
                                                repeat: Infinity,
                                                repeatDelay: 0
                                            }}
                                            className="w-2 h-2 bg-purple-400 rounded-full"
                                        />
                                        <motion.div
                                            animate={{
                                                scale: [1, 1.2, 1],
                                                opacity: [0.4, 1, 0.4]
                                            }}
                                            transition={{
                                                duration: 1.5,
                                                repeat: Infinity,
                                                repeatDelay: 0,
                                                delay: 0.2
                                            }}
                                            className="w-2 h-2 bg-purple-300 rounded-full"
                                        />
                                        <motion.div
                                            animate={{
                                                scale: [1, 1.2, 1],
                                                opacity: [0.4, 1, 0.4]
                                            }}
                                            transition={{
                                                duration: 1.5,
                                                repeat: Infinity,
                                                repeatDelay: 0,
                                                delay: 0.4
                                            }}
                                            className="w-2 h-2 bg-purple-200 rounded-full"
                                        />
                                    </div>
                                    <span>{typingText}</span>
                                </div>
                            </div>
                        </motion.div>
                    )}
                    <div ref={messagesEndRef} /> {/* Auto-scroll reference element */}
                </div>

                {/* Input Box */}
                <div className="p-6 pt-0">
                    <Inputbox onSendMessage={handleSendMessage} hasImage={hasImage || chatMode} />
                </div>
            </div>
        </div>
    );
};

export default Home;
