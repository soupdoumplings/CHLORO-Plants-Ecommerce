import React, { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion as Motion } from 'framer-motion';
import { ChevronLeft, Leaf, X } from 'lucide-react';
import { useLocation } from 'react-router-dom';

const CATEGORIES = {
  Onboarding: {
    description: 'Choose the right starting point.',
    actions: [
      'Find a first plant',
      'Choose a gift',
      'Style a home, office, or balcony',
    ],
  },
  'Plant Finder': {
    description: 'Match a plant to your space.',
    actions: [
      'Low-light recommendations',
      'Pet-safe options',
      'Statement plants',
      'Easy-care plants',
    ],
  },
  'Plant Care': {
    description: 'Diagnose care and watering issues.',
    actions: [
      'Yellow leaves',
      'Drooping stems',
      'Watering schedule',
      'Seasonal care',
    ],
  },
  'Orders & Delivery': {
    description: 'Track, change, or report an order.',
    actions: [
      'Track an order',
      'Delivery question',
      'Report damaged plant',
    ],
  },
  Support: {
    description: 'Payment, checkout, and account help.',
    actions: [
      'Payment issue',
      'Checkout help',
      'Return policy',
      'Wishlist help',
    ],
  },
  'Feature Guide': {
    description: 'Use CHLORO faster.',
    actions: [
      'Show filters',
      'Find bundles',
      'Open care guide',
    ],
  },
};

const INITIAL_MESSAGES = [
  { id: 1, sender: 'bot', text: 'Choose a topic to begin.' },
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
  const [isTyping, setIsTyping] = useState(false);
  const nextMessageId = useRef(INITIAL_MESSAGES.length + 1);
  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);
  const hidden = isHiddenRoute(location.pathname);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen, currentCategory, isTyping]);

  useEffect(() => (
    () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    }
  ), []);

  const getNextMessageId = () => {
    const id = nextMessageId.current;
    nextMessageId.current += 1;
    return id;
  };

  const handleCategoryClick = (category) => {
    setCurrentCategory(category);
  };

  const handleActionClick = (action) => {
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    setMessages((prev) => [
      ...prev,
      { id: getNextMessageId(), sender: 'user', text: action },
    ]);
    setIsTyping(true);

    typingTimeoutRef.current = setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        { id: getNextMessageId(), sender: 'bot', text: 'Got it. We can use this to guide your next step.' },
      ]);
      setIsTyping(false);
      typingTimeoutRef.current = null;
    }, 850);
  };

  if (hidden) return null;

  return (
    <>
      <AnimatePresence>
        {!isOpen && (
          <Motion.button
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 18 }}
            onClick={() => setIsOpen(true)}
            className="fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-full border border-[#0F3A3A]/10 bg-[#FBF9F4] px-4 py-3 text-[#0F3A3A] shadow-[0_16px_38px_rgba(15,58,58,0.14)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-white cursor-none group"
            title="Open botanical assistant"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#0F3A3A] text-[#FBF9F4]">
              <Leaf className="h-4 w-4" />
            </span>
            <span className="font-label text-[10px] font-bold uppercase tracking-[0.16em]">Help</span>
          </Motion.button>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isOpen && (
          <Motion.div
            initial={{ opacity: 0, y: 24, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.97 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            className="fixed bottom-6 right-6 z-50 flex max-h-[min(640px,calc(100vh-48px))] w-[min(410px,calc(100vw-28px))] flex-col overflow-hidden rounded-[8px] border border-[#D9DBCF] bg-[#FBF9F4] shadow-[0_24px_80px_rgba(15,58,58,0.16)] cursor-auto"
          >
            <div className="flex items-center justify-between border-b border-[#D9DBCF] bg-[#FBF9F4] px-5 py-4">
              <div className="flex min-w-0 items-center gap-3">
                {currentCategory && (
                  <button
                    type="button"
                    onClick={() => setCurrentCategory(null)}
                    className="shrink-0 rounded-full p-1.5 text-[#5E6058] transition-colors hover:bg-[#E8E9E0] hover:text-[#0F3A3A]"
                    title="Back to categories"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                )}
                <div className="min-w-0">
                  <h3 className="font-label text-[9px] font-bold uppercase tracking-[0.24em] text-[#0F3A3A]">
                    CHLORO Help
                  </h3>
                  <p className="mt-1 font-body text-[12px] text-[#797C73]">
                    {currentCategory || 'Quick guidance'}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="rounded-full p-1.5 text-[#797C73] transition-colors hover:bg-[#E8E9E0] hover:text-[#0F3A3A]"
                title="Close botanical assistant"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto bg-[#FBF9F4] px-5 py-5">
              <div className="mb-6 border-b border-[#D9DBCF] pb-6">
                <div className="mb-5 flex items-center justify-between">
                  <span className="font-label text-[8px] uppercase tracking-[0.24em] text-[#797C73]">
                    Assistant
                  </span>
                  <span className="font-label text-[8px] uppercase tracking-[0.2em] text-[#B0B0A8]">
                    {formatTime()}
                  </span>
                </div>
                <div>
                  <p className="font-headline text-[36px] leading-[0.95] text-[#1A1A1A]">
                    {currentCategory || 'How may we assist?'}
                  </p>
                  <p className="mt-3 max-w-[300px] font-body text-[13px] leading-relaxed text-[#5E6058]">
                    {currentCategory
                      ? CATEGORIES[currentCategory].description
                      : 'Plant selection, care, orders, and checkout guidance.'}
                  </p>
                </div>
              </div>

              {!currentCategory && (
                <div className="border-t border-[#D9DBCF]">
                  {Object.keys(CATEGORIES).map((category) => (
                    <button
                      key={category}
                      type="button"
                      onClick={() => handleCategoryClick(category)}
                      className="group flex w-full items-center justify-between border-b border-[#D9DBCF] py-4 text-left transition-colors duration-200 hover:bg-[#F5F4ED]"
                    >
                      <span className="font-label text-[10px] font-bold uppercase tracking-[0.18em] text-[#0F3A3A]">
                        {category}
                      </span>
                      <span className="max-w-[150px] text-right font-body text-[11px] leading-snug text-[#797C73]">
                        {CATEGORIES[category].description}
                      </span>
                    </button>
                  ))}
                </div>
              )}

              {currentCategory && (
                <div className="grid grid-cols-1 gap-2">
                  {CATEGORIES[currentCategory].actions.map((action) => (
                    <button
                      key={action}
                      type="button"
                      onClick={() => handleActionClick(action)}
                      className="flex w-full items-center justify-between rounded-[8px] border border-[#D9DBCF] bg-white px-4 py-3 text-left font-body text-[13px] leading-snug text-[#31332C] transition-colors duration-200 hover:border-[#0F3A3A]/35 hover:bg-[#F5F4ED]"
                    >
                      <span>{action}</span>
                      <span className="font-headline text-[18px] italic text-[#C5A059]">+</span>
                    </button>
                  ))}
                  <button
                    type="button"
                    onClick={() => setCurrentCategory(null)}
                    className="mt-2 font-label text-[9px] font-bold uppercase tracking-[0.18em] text-[#797C73] transition-colors hover:text-[#0F3A3A]"
                  >
                    All topics
                  </button>
                </div>
              )}

              {(messages.length > INITIAL_MESSAGES.length || isTyping) && (
                <div className="mt-6 border-t border-[#D9DBCF] pt-5">
                  <p className="font-label text-[8px] font-bold uppercase tracking-[0.22em] text-[#797C73]">
                    Latest
                  </p>
                  <div className="mt-3 rounded-[8px] border border-[#D9DBCF] bg-white p-4">
                    {isTyping ? (
                      <div className="flex items-center gap-2" aria-label="Sprout is typing">
                        <span className="font-label text-[8px] font-bold uppercase tracking-[0.18em] text-[#797C73]">
                          Sprout is typing
                        </span>
                        <span className="flex items-center gap-1">
                          {[0, 1, 2].map((dot) => (
                            <Motion.span
                              key={dot}
                              animate={{ opacity: [0.25, 1, 0.25], y: [0, -2, 0] }}
                              transition={{ duration: 0.9, repeat: Infinity, delay: dot * 0.14 }}
                              className="h-1.5 w-1.5 rounded-full bg-[#0F3A3A]"
                            />
                          ))}
                        </span>
                      </div>
                    ) : (
                      <p className="font-body text-[13px] leading-relaxed text-[#31332C]">
                        {messages[messages.length - 1].text}
                      </p>
                    )}
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            <div className="flex items-center justify-between border-t border-[#D9DBCF] bg-[#FBF9F4] px-5 py-3">
              <span className="font-label text-[8px] uppercase tracking-[0.22em] text-[#797C73]">Guided support</span>
              <span className="h-px w-12 bg-[#C5A059]" />
            </div>
          </Motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
