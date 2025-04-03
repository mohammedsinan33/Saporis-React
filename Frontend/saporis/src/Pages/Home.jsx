import { AnimatePresence, motion } from "framer-motion";
import { Camera, ImagePlus, Send, Sparkles, Upload, X } from "lucide-react";
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

    useEffect(() => {
        fetchUserData();
    }, []);

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

    useEffect(() => {
        const initialBotMessage = {
            text: "Hello! I'm Saporis. Please upload a photo of the food you'd like to know about, and I'll help you with recipes, and nutrition info!",
            sender: "bot",
            timestamp: new Date().toLocaleTimeString()
        };
        setMessages([initialBotMessage]);
    }, []);

    const handleSendMessage = async (messageData) => {
        const userMessage = {
            text: messageData.text,
            image: messageData.image,
            sender: "user",
            timestamp: new Date().toLocaleTimeString()
        };

        setMessages(prevMessages => [...prevMessages, userMessage]);

        // Handle confirmation response
        if (showConfirmation) {
            if (messageData.text.toLowerCase() === 'yes') {
                await saveFoodDetails();
            } else {
                const cancelMessage = {
                    text: "Okay, I won't record this meal. Feel free to upload another food photo when you're ready!",
                    sender: "bot",
                    timestamp: new Date().toLocaleTimeString()
                };
                setMessages(prevMessages => [...prevMessages, cancelMessage]);
            }
            setShowConfirmation(false);
            setHasImage(false);
            return;
        }

        if (messageData.image && !hasImage) {
            setHasImage(true);
            setIsAwaitingResponse(true);
            try {
                const formData = new FormData();
                const file = dataURLtoFile(messageData.image, 'food.jpg');
                formData.append('file', file);

                const processingMessage = {
                    sender: "bot",
                    timestamp: new Date().toLocaleTimeString()
                };
                setMessages(prevMessages => [...prevMessages, processingMessage]);

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
                    timestamp: new Date().toLocaleTimeString()
                };
                setMessages(prevMessages => [...prevMessages, firstQuestion]);

            } catch (error) {
                console.error('Error uploading image:', error);
                const errorMessage = {
                    text: "Sorry, I couldn't analyze your image. Please try uploading again.",
                    sender: "bot",
                    timestamp: new Date().toLocaleTimeString()
                };
                setMessages(prevMessages => [...prevMessages, errorMessage]);
            } finally {
                setIsAwaitingResponse(false);
            }
        } else if (messageData.text && questions.length > 0) {
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
                    timestamp: new Date().toLocaleTimeString()
                }
                setMessages(prevMessages => [...prevMessages, nextBotMessage]);
            } else {
                try {
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
                    
                    // Send recommendations
                    const recommendationMessage = {
                        text: `Here are your calorie recommendations:\n\n${data.calorie_recommendations}`,
                        sender: "bot",
                        timestamp: new Date().toLocaleTimeString()
                    };
                    setMessages(prevMessages => [...prevMessages, recommendationMessage]);

                    // Ask for confirmation
                    setTimeout(() => {
                        const confirmationMessage = {
                            text: "Have you eaten this food? Reply with 'Yes' or 'No'",
                            sender: "bot",
                            timestamp: new Date().toLocaleTimeString()
                        };
                        setMessages(prevMessages => [...prevMessages, confirmationMessage]);
                        setShowConfirmation(true);
                    }, 1000);

                } catch (error) {
                    console.error('Error sending data:', error);
                    const errorMessage = {
                        text: "Failed to get calorie recommendations. Please try again.",
                        sender: "bot",
                        timestamp: new Date().toLocaleTimeString()
                    }
                    setMessages(prevMessages => [...prevMessages, errorMessage]);
                }

                setQuestions([]);
                setAnswers({});
                setCurrentQuestionIndex(0);
                setHasImage(true);
            }
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

            // Add success message to chat
            const successMessage = {
                text: existingRecord 
                    ? "Great! I've updated your food consumption for today."
                    : "Great! I've recorded your food consumption for today.",
                sender: "bot",
                timestamp: new Date().toLocaleTimeString()
            };
            setMessages(prevMessages => [...prevMessages, successMessage]);
        } catch (error) {
            console.error('Error in saveFoodDetails:', error);
            const errorMessage = {
                text: "Sorry, I couldn't save your food details. Please try again.",
                sender: "bot",
                timestamp: new Date().toLocaleTimeString()
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
                                        ${isUser
                                            ? 'bg-gradient-to-br from-purple-600 to-violet-600 text-white shadow-lg'
                                            : 'bg-white/10 text-white backdrop-blur-sm'
                                        }`}
                                    >
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
                            <div className="bg-white/10 text-white backdrop-blur-sm p-4 rounded-2xl max-w-md animate-pulse">
                                Processing your request...
                            </div>
                        </motion.div>
                    )}
                </div>

                {/* Input Box */}
                <div className="p-6 pt-0">
                    <Inputbox onSendMessage={handleSendMessage} hasImage={hasImage} />
                </div>
            </div>
        </div>
    );
};

export default Home;