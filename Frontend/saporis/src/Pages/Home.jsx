import React, { useEffect, useState, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Camera, ImagePlus, MessageCircleMore, Send, Sparkles, Upload, X } from "lucide-react";
import ReactMarkdown from 'react-markdown';
import Navbar from "../Components/Navbar"; // Import the Navbar component
import Sidenavbar from "../Components/Sidenavbar"; // Import the Sidenavbar component

// Reusable Button Component
const Button = ({ onClick, variant, className, children, disabled }) => (
    <button
        onClick={onClick}
        className={`
            ${variant === 'ghost' ? 'text-white' : ''}
            ${className}
            ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        `}
        disabled={disabled}
    >
        {children}
    </button>
);

const Inputbox = ({ onSendMessage, hasImage }) => {
    const [message, setMessage] = useState('');
    const [isFocused, setIsFocused] = useState(false);
    const [previewImage, setPreviewImage] = useState(null);
    const [showUploadOptions, setShowUploadOptions] = useState(!hasImage);
    const [confirmAnswer, setConfirmAnswer] = useState('yes');
    const [calorieRecommendations, setCalorieRecommendations] = useState(null);
    const fileInputRef = useRef(null);
    const cameraInputRef = useRef(null);

    const handleSend = () => {
        if (message.trim() || previewImage) {
            onSendMessage({ text: message, image: previewImage });
            setMessage('');
            setPreviewImage(null);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onloadend = () => {
            setPreviewImage(reader.result);
            setShowUploadOptions(false); // Hide options after image selection
            onSendMessage({ image: reader.result, text: '' }); //send image
        };
        reader.readAsDataURL(file);
    };

    const removeImage = () => {
        setPreviewImage(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
        if (cameraInputRef.current) cameraInputRef.current.value = '';
        setShowUploadOptions(true);
    };

    const toggleUploadOptions = () => {
        setShowUploadOptions(!showUploadOptions);
    };

    return (
        <div className="w-full relative">
            {/* Initial Upload Prompt */}
            {!previewImage && !hasImage && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-6 text-center"
                >
                    <div className="inline-flex flex-col items-center">
                        <Sparkles className="w-8 h-8 mb-3 text-white/30" />
                        <p className="text-white/70 mb-4">Upload a photo of food you'd like to know about</p>
                    </div>
                </motion.div>
            )}

            {/* Image Preview */}
            {previewImage && (
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="relative mb-3 rounded-xl overflow-hidden"
                >
                    <img
                        src={previewImage}
                        alt="Preview"
                        className="w-full max-h-48 object-cover rounded-xl"
                    />
                    <button
                        onClick={removeImage}
                        className="absolute top-2 right-2 p-1.5 bg-black/50 rounded-full hover:bg-black/70 transition-all"
                    >
                        <X className="w-4 h-4 text-white" />
                    </button>
                </motion.div>
            )}

            {/* Input Area */}
            <motion.div
                className="flex space-x-3 items-center"
                animate={{
                    y: isFocused ? -2 : 0,
                }}
            >
                {/* Hidden file inputs */}
                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleImageUpload}
                    accept="image/*"
                    className="hidden"
                    id="file-upload"
                />
                <input
                    type="file"
                    ref={cameraInputRef}
                    onChange={handleImageUpload}
                    accept="image/*"
                    capture="environment"
                    className="hidden"
                    id="camera-upload"
                />

                {/* Upload Button with Options */}
                <div className="relative">
                    <Button
                        onClick={toggleUploadOptions}
                        variant="ghost"
                        className="p-3 aspect-square bg-gradient-to-br from-purple-600 to-violet-600 text-white"
                    >
                        <ImagePlus className="w-5 h-5" />
                    </Button>

                    <AnimatePresence>
                        {showUploadOptions && (
                            <motion.div
                                initial={{ opacity: 0, y: 10, scale: 0.9 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: 10, scale: 0.9 }}
                                transition={{ type: "spring", damping: 25 }}
                                className="absolute bottom-full left-0 mb-2 w-48 bg-white/10 backdrop-blur-lg rounded-xl p-2 shadow-lg border border-white/20 z-10"
                            >
                                <label
                                    htmlFor="camera-upload"
                                    className="flex items-center space-x-2 p-3 rounded-lg hover:bg-white/10 cursor-pointer transition-all"
                                >
                                    <Camera className="w-5 h-5 text-white" />
                                    <span className="text-white">Take Photo</span>
                                </label>
                                <label
                                    htmlFor="file-upload"
                                    className="flex items-center space-x-2 p-3 rounded-lg hover:bg-white/10 cursor-pointer transition-all"
                                >
                                    <Upload className="w-5 h-5 text-white" />
                                    <span className="text-white">Upload from Device</span>
                                </label>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Text Input - Only shown after image is uploaded */}
                {(previewImage || hasImage) && (
                    <div className="relative flex-grow">
                        <motion.input
                            type="text"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            onKeyPress={handleKeyPress}
                            onFocus={() => setIsFocused(true)}
                            onBlur={() => setIsFocused(false)}
                            placeholder="Ask about this food..."
                            className="w-full p-4 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 focus:border-purple-400 focus:ring-2 focus:ring-purple-500/30 text-white placeholder-white/40 transition-all"
                        />
                        {isFocused && (
                            <motion.div
                                className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-purple-500 to-violet-600"
                                initial={{ scaleX: 0 }}
                                animate={{ scaleX: 1 }}
                                transition={{ duration: 0.3 }}
                            />
                        )}
                    </div>
                )}

                {/* Send Button - Only shown after image is uploaded */}
                {(previewImage || hasImage) && (
                    <Button
                        onClick={handleSend}
                        className="p-4 aspect-square bg-gradient-to-br from-purple-600 to-violet-600"
                        disabled={!message.trim() && !previewImage}
                    >
                        <Send className="w-5 h-5" />
                    </Button>
                )}
            </motion.div>
        </div>
    );
};



const Home = () => {
    const [messages, setMessages] = useState([]);
    const [hasImage, setHasImage] = useState(false);
    const [questions, setQuestions] = useState([]);
    const [answers, setAnswers] = useState({});
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [isAwaitingResponse, setIsAwaitingResponse] = useState(false);

    // Add initial bot message when component mounts
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

        const newMessages = [...messages, userMessage];
        setMessages(newMessages);

        if (messageData.image && !hasImage) {
            setHasImage(true);
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

                // Add confirmation question at the end
                const updatedQuestions = Object.entries(data).map(([key, value]) => ({
                    id: key,
                    text: value,
                })).concat([{
                    id: 'confirmation',
                    text: 'Do you confirm the information you provided is correct? (Yes/No)'
                }]);

                setQuestions(updatedQuestions);
                setCurrentQuestionIndex(0);
                const firstBotMessage = {
                    text: updatedQuestions[0].text,
                    sender: "bot",
                    timestamp: new Date().toLocaleTimeString()
                }
                setMessages(prevMessages => [...prevMessages, firstBotMessage]);

            } catch (error) {
                console.error('Error uploading image:', error);
                const errorMessage = {
                    text: "Sorry, there was an error processing your image. Please try again.",
                    sender: "bot",
                    timestamp: new Date().toLocaleTimeString(),
                };
                setMessages(prevMessages => [...prevMessages, errorMessage]);
            } finally {
                setIsAwaitingResponse(false);
            }
        } else if (messageData.text && questions.length > 0) {
            const currentQuestion = questions[currentQuestionIndex];

            // Store the answer
            setAnswers(prevAnswers => ({
                ...prevAnswers,
                [currentQuestion.id]: {
                    question: currentQuestion.text,
                    answer: messageData.text
                }
            }));

            if (currentQuestionIndex < questions.length - 1) {
                // Show next question
                setCurrentQuestionIndex(currentQuestionIndex + 1);
                const nextBotMessage = {
                    text: questions[currentQuestionIndex + 1].text,
                    sender: "bot",
                    timestamp: new Date().toLocaleTimeString()
                }
                setMessages(prevMessages => [...prevMessages, nextBotMessage]);
            } else {
                // After the last question, directly process the answers
                try {
                    const formattedAnswers = Object.entries(answers)
                        .map(([id, answerObj]) => {
                            const questionObj = questions.find(q => q.id === id);
                            const questionText = questionObj?.text || "Unknown Question";
                            return `${questionText}: ${answerObj.answer}`;
                        })
                        .join('\n');

                    const response = await fetch('http://127.0.0.1:8000/get_calorie_recommendations/', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ user_input: formattedAnswers }),
                    });

                    if (!response.ok) {
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }

                    const data = await response.json();
                    const recommendationMessage = {
                        text: `Here are your calorie recommendations:\n\n${data.calorie_recommendations}`,
                        sender: "bot",
                        timestamp: new Date().toLocaleTimeString()
                    };
                    setMessages(prevMessages => [...prevMessages, recommendationMessage]);

                } catch (error) {
                    console.error('Error sending data:', error);
                    const errorMessage = {
                        text: "Failed to get calorie recommendations. Please try again.",
                        sender: "bot",
                        timestamp: new Date().toLocaleTimeString()
                    }
                    setMessages(prevMessages => [...prevMessages, errorMessage]);
                }

                // Reset state
                setQuestions([]);
                setAnswers({});
                setCurrentQuestionIndex(0);
                setHasImage(true);
            }
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
                                        {[...new Set(msg.text.split("\n"))].map((paragraph, i) => {
                                            // Add special formatting for recommendations
                                            if (paragraph.startsWith("Here are your calorie recommendations:")) {
                                                return (
                                                    <div key={i} className="space-y-2">
                                                        <h3 className="font-semibold text-lg mb-2">{paragraph}</h3>
                                                        <div className="pl-4 border-l-2 border-purple-400">
                                                            <ReactMarkdown
                                                                components={{
                                                                    // ...existing components remain the same...
                                                                }}
                                                            >
                                                                {msg.text.split('\n').slice(2).join('\n')}
                                                            </ReactMarkdown>
                                                        </div>
                                                    </div>
                                                );
                                            }
                                            // Skip both the header and content of calorie recommendations
                                            if (paragraph.startsWith("Here are your calorie recommendations:") ||
                                                msg.text.split('\n').slice(2).join('\n').includes(paragraph)) {
                                                return null;
                                            }
                                            return (
                                                <ReactMarkdown
                                                    key={i}
                                                    components={{
                                                        p: ({ node, ...props }) => <p className="mb-2 last:mb-0" {...props} />,
                                                        strong: ({ node, ...props }) => <strong className="font-semibold" {...props} />,
                                                        em: ({ node, ...props }) => <em className="italic" {...props} />,
                                                    }}
                                                >
                                                    {paragraph}
                                                </ReactMarkdown>
                                            );
                                        })}
                                        <div className={`text-xs mt-2 ${isUser ? 'text-white/70' : 'text-white/50'}`}>
                                            {msg.timestamp}
                                        </div>
                                        {isUser && (
                                            <div className="absolute -bottom-4 -right-4 w-16 h-16 bg-purple-400/10 rounded-full"></div>
                                        )}
                                    </div>
                                </motion.div>
                            )
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
