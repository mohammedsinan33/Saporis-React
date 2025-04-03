import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { motion } from 'framer-motion';
import { Clock, MessageSquare } from 'lucide-react';

const ChatHistory = () => {
    const [chatHistory, setChatHistory] = useState([]);

    useEffect(() => {
        fetchChatHistory();
    }, []);

    const fetchChatHistory = async () => {
        try {
            const userEmail = localStorage.getItem('userEmail');
            const { data, error } = await supabase
                .from('Chat_history')
                .select('*')
                .eq('email', userEmail)
                .order('created_at', { ascending: false });

            if (error) throw error;
            setChatHistory(data);
        } catch (error) {
            console.error('Error fetching chat history:', error);
        }
    };

    return (
        <div className="w-full max-w-md bg-white/5 backdrop-blur-lg rounded-2xl p-4">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
                <MessageSquare className="w-5 h-5 mr-2" />
                Chat History
            </h2>
            <div className="space-y-4">
                {chatHistory.map((chat, index) => (
                    <motion.div
                        key={chat.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="bg-white/10 rounded-xl p-4 hover:bg-white/15 transition-colors"
                    >
                        <div className="flex items-start space-x-4">
                            {chat.Image_URL && (
                                <img
                                    src={chat.Image_URL}
                                    alt="Food"
                                    className="w-20 h-20 rounded-lg object-cover"
                                />
                            )}
                            <div className="flex-1">
                                <div className="text-sm text-white/70 mb-2 flex items-center">
                                    <Clock className="w-4 h-4 mr-1" />
                                    {new Date(chat.created_at).toLocaleDateString()}
                                </div>
                                <div className="text-sm text-white/90 mb-2">
                                    {chat.First_Conversation}
                                </div>
                                <div className="text-xs text-white/50">
                                    Response: {chat.user_response}
                                </div>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

export default ChatHistory;