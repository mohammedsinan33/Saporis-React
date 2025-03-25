import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, ImagePlus, X, Camera, Upload } from "lucide-react";

// Reusable Button Component (assuming it's in a separate file)
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

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onloadend = () => {
            setPreviewImage(reader.result);
            setShowUploadOptions(false); // Hide options after image selection
            onSendMessage({ image: reader.result, text: '' }); // Send image data
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

export default Inputbox;
