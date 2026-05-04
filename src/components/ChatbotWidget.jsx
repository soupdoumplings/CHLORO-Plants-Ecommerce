import React, { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion as Motion } from 'framer-motion';
import { Bot, ChevronLeft, Leaf, X } from 'lucide-react';
import { useLocation } from 'react-router-dom';

const CATEGORIES = {
  Onboarding: [
    'Are you shopping for yourself, or looking for a gift?',
    'Are you a first-time plant parent or an experienced grower?',
    'What kind of space are you decorating: home, office, or balcony?',
  ],
  'Plant Finder': [
    'How much sunlight does your space get: bright, medium, or low light?',
    'Do you have pets or young children at home?',
    'How often would you like to water: daily, weekly, or rarely?',
    "What's your budget for a single plant?",
    'Do you prefer a small desk plant or a large statement plant?',
    'Are you looking for a flowering plant, foliage, or a succulent?',
  ],
  'Plant Care': [
    'Which plant are you asking about?',
    'Is your plant showing yellow leaves, drooping, or dry soil?',
    'Would you like seasonal care tips sent to your email?',
  ],
  'Orders & Delivery': [
    'Do you have an order number I can look up?',
    'Are you checking on delivery, a missing item, or a return?',
    'Did your plant arrive damaged?',
  ],
  Support: [
    'Are you having trouble with payment or checkout?',
    'Do you have questions about our return policy?',
    'Would you like to save this plant to your wishlist?',
  ],
  'Feature Guide': [
    'Did you know you can filter plants by sunlight, pet-safety, and price? Want me to show you?',
    'Want me to help you find our plant bundles and discounts?',
    'Shall I take you to our care guide section?',
  ],
};

const INITIAL_MESSAGES = [
  { id: 1, sender: 'bot', text: 'Namaste! Welcome to CHLORO.\nHow may I help you?' },
  { id: 2, sender: 'bot', text: 'Please select what you need help with:' },
];

const hiddenRoutes = ['/login', '/register', '/signup', '/archive'];

const formatTime = () => (
  new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
);

const isHiddenRoute = (pathname) => (
  hiddenRoutes.includes(pathname) || pathname.startsWith('/admin')
);

export default function ChatbotWidget() {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const [currentCategory, setCurrentCategory] = useState(null);
  const nextMessageId = useRef(INITIAL_MESSAGES.length + 1);
  const messagesEndRef = useRef(null);
  const hidden = isHiddenRoute(location.pathname);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen, currentCategory]);

  const getNextMessageId = () => {
    const id = nextMessageId.current;
    nextMessageId.current += 1;
    return id;
  };

  const handleCategoryClick = (category) => {
    setMessages((prev) => [
      ...prev,
      { id: getNextMessageId(), sender: 'user', text: category },
      { id: getNextMessageId(), sender: 'bot', text: `Here are some questions about ${category}:` },
    ]);
    setCurrentCategory(category);
  };

  const handleQuestionClick = (question) => {
    setMessages((prev) => [
      ...prev,
      { id: getNextMessageId(), sender: 'user', text: question },
      { id: getNextMessageId(), sender: 'bot', text: 'Thanks. I can help you narrow that down.' },
      { id: getNextMessageId(), sender: 'bot', text: 'Is there anything else I can help you with?' },
    ]);
    setCurrentCategory(null);
  };

  if (hidden) return null;

  return (
    <>
      <AnimatePresence>
        {!isOpen && (
          <Motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            onClick={() => setIsOpen(true)}
            className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-sm bg-[#375757] text-white shadow-2xl transition-colors hover:bg-[#244545] cursor-none group"
            title="Open botanical assistant"
          >
            <Leaf className="h-6 w-6 transition-transform group-hover:scale-110" />
          </Motion.button>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isOpen && (
          <Motion.div
            initial={{ opacity: 0, y: 20, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.96 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-6 right-6 z-50 flex h-[550px] w-[min(350px,calc(100vw-32px))] flex-col overflow-hidden rounded-sm border border-black/5 bg-white shadow-2xl cursor-auto"
          >
            <div className="flex items-center justify-between border-b border-gray-100 bg-[#FBF9F4] px-4 py-3 text-[#375757]">
              <div className="flex items-center gap-3">
                {currentCategory && (
                  <button
                    type="button"
                    onClick={() => setCurrentCategory(null)}
                    className="rounded-sm p-1 transition-colors hover:bg-[#375757]/10"
                    title="Back to categories"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                )}
                <div className="flex h-8 w-8 items-center justify-center rounded-sm bg-[#375757] text-white">
                  <Bot className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-label text-[13px] font-bold uppercase tracking-[0.12em]">Sprout</h3>
                  <p className="font-body text-[11px] text-[#5E6058]">Botanical Assistant</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="rounded-sm p-1 text-gray-400 transition-colors hover:bg-[#375757]/10 hover:text-[#375757]"
                title="Close botanical assistant"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="flex-1 space-y-4 overflow-y-auto bg-[#F8FAFC] p-4">
              <div className="mb-4 text-center font-body text-xs text-gray-400">Today, {formatTime()}</div>

              {messages.map((msg) => (
                <div key={msg.id} className={`flex max-w-full ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div
                    className={`max-w-[85%] px-4 py-2.5 text-[14px] leading-relaxed shadow-sm ${
                      msg.sender === 'user'
                        ? 'rounded-sm bg-[#375757] text-white'
                        : 'rounded-sm border border-gray-100 bg-white text-gray-800'
                    }`}
                  >
                    <div className="whitespace-pre-line">{msg.text}</div>
                  </div>
                </div>
              ))}

              {!currentCategory && (
                <div className="mt-2 flex flex-col items-end gap-2">
                  {Object.keys(CATEGORIES).map((category) => (
                    <button
                      key={category}
                      type="button"
                      onClick={() => handleCategoryClick(category)}
                      className="self-end rounded-sm border border-[#375757]/30 bg-white px-4 py-2 text-right text-[13px] font-medium text-[#375757] shadow-sm transition-colors hover:border-[#375757] hover:bg-[#375757]/5"
                    >
                      {category}
                    </button>
                  ))}
                </div>
              )}

              {currentCategory && (
                <div className="mt-2 flex flex-col items-end gap-2">
                  {CATEGORIES[currentCategory].map((question) => (
                    <button
                      key={question}
                      type="button"
                      onClick={() => handleQuestionClick(question)}
                      className="max-w-[85%] self-end rounded-sm border border-[#375757]/30 bg-white px-4 py-2 text-right text-[13px] font-medium text-[#375757] shadow-sm transition-colors hover:border-[#375757] hover:bg-[#375757]/5"
                    >
                      {question}
                    </button>
                  ))}
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            <div className="flex items-center justify-center border-t border-gray-100 bg-white px-4 py-3">
              <span className="font-label text-[10px] uppercase tracking-[0.16em] text-gray-400">
                Botanical Assistant
              </span>
            </div>
          </Motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
