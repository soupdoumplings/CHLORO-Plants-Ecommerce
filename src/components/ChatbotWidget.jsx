import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, ChevronLeft, Bot, User } from 'lucide-react';
import { useLocation } from 'react-router-dom';

const CATEGORIES = {
  "Onboarding": [
    "Are you shopping for yourself or as a gift?",
    "Are you a first-time plant parent or an experienced grower?",
    "What kind of space are you decorating: home, office, or balcony?"
  ],
  "Plant Finder": [
    "How much sunlight does your space get: bright, medium, or low light?",
    "Do you have pets or young children at home?",
    "How often would you like to water: daily, weekly, or rarely?",
    "What's your budget for a single plant?",
    "Do you prefer a small desk plant or a large statement plant?",
    "Are you looking for a flowering plant, foliage, or a succulent?"
  ],
  "Plant Care": [
    "Which plant are you asking about?",
    "Is your plant showing yellow leaves, drooping, or dry soil?",
    "Would you like seasonal care tips sent to your email?"
  ],
  "Orders & Delivery": [
    "Do you have an order number I can look up?",
    "Are you checking on delivery, a missing item, or a return?",
    "Did your plant arrive damaged?"
  ],
  "Support": [
    "Are you having trouble with payment or checkout?",
    "Do you have questions about our return policy?",
    "Would you like to save this plant to your wishlist?"
  ],
  "Feature Guide": [
    "Did you know you can filter plants by sunlight, pet-safety, and price? Want me to show you?",
    "Want me to help you find our plant bundles and discounts?",
    "Shall I take you to our care guide section?"
  ]
};

const INITIAL_MESSAGES = [
  { id: 1, sender: 'bot', text: 'नमस्ते Namaste! 🙏\nWelcome to Chloro!\nHow may I help you?' },
  { id: 2, sender: 'bot', text: 'Please select the options you need help with:' }
];

export default function ChatbotWidget() {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const isHidden = ['/login', '/register', '/signup', '/archive'].includes(location.pathname) || location.pathname.startsWith('/admin');

  if (isHidden) return null;
  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const [currentCategory, setCurrentCategory] = useState(null);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen, currentCategory]);

  const handleCategoryClick = (category) => {
    // Add user message
    const userMsg = { id: Date.now(), sender: 'user', text: category };
    const botMsg = { id: Date.now() + 1, sender: 'bot', text: `Here are some questions about ${category}:` };
    setMessages((prev) => [...prev, userMsg, botMsg]);
    setCurrentCategory(category);
  };

  const handleQuestionClick = (question) => {
    // Add user message
    const userMsg = { id: Date.now(), sender: 'user', text: question };
    const botMsg1 = { id: Date.now() + 1, sender: 'bot', text: "hmmm..." };
    const botMsg2 = { id: Date.now() + 2, sender: 'bot', text: 'Is there anything else I can help you with?' };
    
    setMessages((prev) => [...prev, userMsg, botMsg1, botMsg2]);
    setCurrentCategory(null);
  };

  const handleBack = () => {
    setCurrentCategory(null);
  };

  const formatTime = () => {
    const now = new Date();
    return now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <>
      {/* Floating Action Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            onClick={() => setIsOpen(true)}
            className="fixed bottom-6 right-6 w-14 h-14 bg-[#375757] text-white rounded-full flex items-center justify-center shadow-2xl hover:bg-[#244545] transition-colors z-50 group cursor-pointer"
            style={{ cursor: 'none' }} // Integrate with global custom cursor if present
          >
            <MessageCircle className="w-6 h-6 group-hover:scale-110 transition-transform" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-6 right-6 w-[350px] h-[550px] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden z-50 border border-black/5"
          >
            <div className="bg-[#FBF9F4] text-[#375757] px-4 py-3 flex items-center justify-between border-b border-gray-100">
              <div className="flex items-center space-x-3">
                {currentCategory && (
                  <button onClick={handleBack} className="p-1 hover:bg-[#375757]/10 rounded-full transition-colors">
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                )}
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-[#375757] rounded-full flex items-center justify-center text-white">
                    <Bot className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-[15px]">Sprout</h3>
                  </div>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} className="p-1 hover:bg-[#375757]/10 rounded-full transition-colors text-gray-400 hover:text-[#375757]">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Chat Body */}
            <div className="flex-1 overflow-y-auto p-4 bg-[#F8FAFC] space-y-4">
              <div className="text-center text-xs text-gray-400 mb-4">Today, {formatTime()}</div>
              
              {messages.map((msg) => (
                <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'} max-w-full`}>
                  <div className="flex items-end max-w-[85%]">
                    <div
                      className={`px-4 py-2.5 text-[14px] leading-relaxed shadow-sm ${
                        msg.sender === 'user'
                          ? 'bg-[#375757] text-white rounded-2xl rounded-br-sm'
                          : 'bg-white text-gray-800 border border-gray-100 rounded-2xl rounded-bl-sm'
                      }`}
                    >
                      <div className="whitespace-pre-line">{msg.text}</div>
                    </div>
                  </div>
                </div>
              ))}

              {/* Options / Buttons */}
              {!currentCategory && (
                <div className="flex flex-col items-end space-y-2 mt-2">
                  {Object.keys(CATEGORIES).map((category) => (
                    <button
                      key={category}
                      onClick={() => handleCategoryClick(category)}
                      className="px-4 py-2 bg-white border border-[#375757]/30 text-[#375757] text-[13px] font-medium rounded-full hover:bg-[#375757]/5 transition-colors shadow-sm self-end text-right hover:border-[#375757]"
                    >
                      {category}
                    </button>
                  ))}
                </div>
              )}

              {currentCategory && (
                <div className="flex flex-col items-end space-y-2 mt-2">
                  {CATEGORIES[currentCategory].map((question, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleQuestionClick(question)}
                      className="px-4 py-2 bg-white border border-[#375757]/30 text-[#375757] text-[13px] font-medium rounded-2xl rounded-tr-sm hover:bg-[#375757]/5 transition-colors shadow-sm self-end text-right hover:border-[#375757] max-w-[85%]"
                    >
                      {question}
                    </button>
                  ))}
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>

            {/* Footer / Powered By */}
            <div className="bg-white px-4 py-3 border-t border-gray-100 flex items-center justify-center">
              <span className="text-[11px] text-gray-400 flex items-center">
                Botanical Assistant
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
