"use client";
import { useState } from "react";
import { MessageCircle, X, Send, Paperclip, Smile, Mic, Image as ImageIcon } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export function WhatsAppChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");

  const phoneNumber = "916378990158"; // Your WhatsApp number
  const defaultMessage = "Hi! I'm interested in your study materials.";

  const handleSendMessage = () => {
    const text = message || defaultMessage;
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(text)}`;
    window.open(whatsappUrl, '_blank');
    setMessage("");
    setIsOpen(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute bottom-20 right-0 w-80 sm:w-96 h-[500px] bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-200"
          >
            {/* Header */}
            <div className="bg-green-500 text-white p-4 flex items-center space-x-3">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                <MessageCircle className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold">Notes Ninja</h3>
                <p className="text-xs text-white/90">We reply within minutes</p>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-white/80 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Chat Content */}
            <div className="flex-1 p-4 bg-gray-50 h-[340px] overflow-y-auto">
              <div className="bg-white rounded-lg p-3 shadow-sm mb-3 max-w-[80%]">
                <p className="text-sm text-gray-800">
                  Hey! 👋 Welcome to Notes Ninja! How can I help you today?
                </p>
                <p className="text-xs text-gray-500 mt-1">Typically replies instantly</p>
              </div>
              
              <div className="bg-white rounded-lg p-3 shadow-sm max-w-[80%]">
                <p className="text-sm text-gray-800">
                  Feel free to ask about our study materials, pricing, or any questions you have about your courses!
                </p>
              </div>
            </div>

            {/* Input Area */}
            <div className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-3">
              <div className="flex items-center space-x-2">
                <button className="text-gray-500 hover:text-gray-700 transition-colors">
                  <Paperclip className="w-5 h-5" />
                </button>
                <button className="text-gray-500 hover:text-gray-700 transition-colors">
                  <ImageIcon className="w-5 h-5" />
                </button>
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type a message..."
                  className="flex-1 px-3 py-2 bg-gray-100 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                />
                <button className="text-gray-500 hover:text-gray-700 transition-colors">
                  <Smile className="w-5 h-5" />
                </button>
                <button className="text-gray-500 hover:text-gray-700 transition-colors">
                  <Mic className="w-5 h-5" />
                </button>
                <button
                  onClick={handleSendMessage}
                  className="bg-green-500 hover:bg-green-600 text-white p-2 rounded-full transition-colors"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* WhatsApp Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="bg-green-500 hover:bg-green-600 text-white p-4 rounded-full shadow-lg transition-all duration-200 relative group"
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div
              key="close"
              initial={{ rotate: -180, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 180, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <X className="w-6 h-6" />
            </motion.div>
          ) : (
            <motion.div
              key="whatsapp"
              initial={{ rotate: 180, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -180, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <MessageCircle className="w-6 h-6" />
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Tooltip */}
        <span className="absolute bottom-full right-0 mb-2 px-3 py-1 bg-gray-800 text-white text-xs rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          Chat with us on WhatsApp
        </span>
      </motion.button>
    </div>
  );
}
