import React, { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion as Motion } from 'framer-motion';
import { ChevronLeft, Leaf, Loader2, Send, Sparkles, X } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { sendBotanicalChat } from '../lib/gemini';

const CATEGORIES = {
  Onboarding: {
    description: 'Choose the right starting point.',
    actions: [
      'Find a first plant for a Kathmandu apartment',
      'Choose a gift under NPR 2,500',
      'Style a balcony with easy plants',
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
      'Watering schedule for Nepal weather',
      'Monsoon care',
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
      'Find gifts',
      'Open care diagnosis',
      'Find bundles',
    ],
  },
};

const INITIAL_MESSAGES = [
  {
    id: 1,
    sender: 'bot',
    text: 'Namaste. Ask me about plant care, gifts, products, or what to do next.',
  },
];

const hiddenRoutes = ['/login', '/register', '/signup', '/archive'];

const formatTime = () => (
  new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
);

const isHiddenRoute = (pathname) => (
  hiddenRoutes.includes(pathname) || pathname.startsWith('/admin')
);

const getAssistantErrorMessage = (error) => {
  const message = error?.message || '';

  if (message.toLowerCase().includes('json')) {
    return 'The assistant response could not be shaped cleanly. Please try once more.';
  }

  if (message.toLowerCase().includes('api key')) {
    return 'The AI connection needs a valid Gemini key before I can answer.';
  }

  if (message.toLowerCase().includes('edge function')) {
    return 'The AI service is not reachable yet. Please try again after the function is online.';
  }

  return message || 'I could not reach the AI assistant right now.';
};

const ProductPill = ({ product }) => (
  <Link
    to={`/catalogue/${product.id}`}
    className="mt-3 grid grid-cols-[44px_1fr] gap-3 border border-[#D9DBCF] bg-[#F5F4ED] p-2 transition-colors hover:bg-white"
  >
    <div className="aspect-square overflow-hidden bg-[#E8E9E0]">
      {product.image ? (
        <img src={product.image} alt={product.name} className="h-full w-full object-cover" />
      ) : (
        <div className="flex h-full w-full items-center justify-center">
          <Leaf className="h-4 w-4 text-[#797C73]" />
        </div>
      )}
    </div>
    <div className="min-w-0">
      <p className="truncate font-label text-[9px] font-bold uppercase tracking-[0.14em] text-[#0F3A3A]">{product.name}</p>
      <p className="mt-1 line-clamp-2 font-body text-[11px] leading-snug text-[#797C73]">{product.reason}</p>
    </div>
  </Link>
);

export default function ChatbotWidget() {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const [currentCategory, setCurrentCategory] = useState(null);
  const [draft, setDraft] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const nextMessageId = useRef(INITIAL_MESSAGES.length + 1);
  const messagesEndRef = useRef(null);
  const hidden = isHiddenRoute(location.pathname);
  const hasConversation = messages.length > INITIAL_MESSAGES.length;

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen, currentCategory, isTyping]);

  const getNextMessageId = () => {
    const id = nextMessageId.current;
    nextMessageId.current += 1;
    return id;
  };

  const sendMessage = async (text) => {
    const trimmed = text.trim();
    if (!trimmed || isTyping) return;

    const userMessage = { id: getNextMessageId(), sender: 'user', text: trimmed };
    const nextMessages = [...messages, userMessage];

    setMessages(nextMessages);
    setDraft('');
    setIsTyping(true);

    try {
      const response = await sendBotanicalChat({
        messages: nextMessages.map((message) => ({
          sender: message.sender,
          text: message.text,
        })),
        context: `${currentCategory || 'General'} on ${location.pathname}`,
      });

      setMessages((prev) => [
        ...prev,
        {
          id: getNextMessageId(),
          sender: 'bot',
          text: response.reply,
          products: response.productRecommendations || [],
          suggestions: response.suggestedActions || [],
        },
      ]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          id: getNextMessageId(),
          sender: 'bot',
          text: getAssistantErrorMessage(err),
          tone: 'error',
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleActionClick = (action) => {
    sendMessage(`${currentCategory}: ${action}`);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    sendMessage(draft);
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
              <Sparkles className="h-4 w-4" />
            </span>
            <span className="font-label text-[10px] font-bold uppercase tracking-[0.16em]">AI Help</span>
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
            className="fixed bottom-5 right-5 z-50 flex max-h-[min(640px,calc(100vh-40px))] w-[min(398px,calc(100vw-24px))] flex-col overflow-hidden rounded-[8px] border border-[#D9DBCF] bg-[#FBF9F4] shadow-[0_28px_90px_rgba(15,58,58,0.18)] cursor-auto"
          >
            <div className="flex items-center justify-between border-b border-[#D9DBCF] bg-[#FFFEFA] px-5 py-4">
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
                    CHLORO AI
                  </h3>
                  <p className="mt-1 font-body text-[12px] text-[#797C73]">
                    {currentCategory || 'Smart botanical support'}
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

            <div className="no-scrollbar flex-1 overflow-y-auto bg-[#FBF9F4] px-5 py-5">
              <div className="mb-5 border-b border-[#D9DBCF] pb-5">
                <div className="mb-4 flex items-center justify-between">
                  <span className="font-label text-[8px] uppercase tracking-[0.24em] text-[#797C73]">
                    Assistant
                  </span>
                  <span className="font-label text-[8px] uppercase tracking-[0.2em] text-[#B0B0A8]">
                    {formatTime()}
                  </span>
                </div>
                <p className="font-headline text-[30px] leading-[0.95] text-[#1A1A1A]">
                  {currentCategory || 'How may we assist?'}
                </p>
                <p className="mt-3 max-w-[320px] font-body text-[13px] leading-relaxed text-[#5E6058]">
                  {currentCategory
                    ? CATEGORIES[currentCategory].description
                    : 'Plant selection, diagnosis, gifts, products, and checkout guidance.'}
                </p>
              </div>

              {!currentCategory && !hasConversation && (
                <div className="mb-5 border-t border-[#D9DBCF]">
                  {Object.keys(CATEGORIES).map((category) => (
                    <button
                      key={category}
                      type="button"
                      onClick={() => setCurrentCategory(category)}
                      className="group flex w-full items-center justify-between border-b border-[#D9DBCF] py-3.5 text-left transition-colors duration-200 hover:bg-[#F5F4ED]"
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

              {currentCategory && !hasConversation && (
                <div className="mb-5 grid grid-cols-1 gap-2">
                  {CATEGORIES[currentCategory].actions.map((action) => (
                    <button
                      key={action}
                      type="button"
                      onClick={() => handleActionClick(action)}
                      disabled={isTyping}
                      className="flex w-full items-center justify-between rounded-[7px] border border-[#D9DBCF] bg-white px-4 py-3 text-left font-body text-[13px] leading-snug text-[#31332C] transition-colors duration-200 hover:border-[#0F3A3A]/35 hover:bg-[#F5F4ED] disabled:opacity-55"
                    >
                      <span>{action}</span>
                      <span className="font-headline text-[18px] italic text-[#C5A059]">+</span>
                    </button>
                  ))}
                </div>
              )}

              <div className="space-y-3 border-t border-[#D9DBCF] pt-5">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[88%] rounded-[8px] px-4 py-3 ${
                        message.sender === 'user'
                          ? 'bg-[#0F3A3A] text-[#FBF9F4]'
                          : message.tone === 'error'
                            ? 'border border-[#A90000]/20 bg-[#A90000]/5 text-[#7A211F]'
                            : 'border border-[#D9DBCF] bg-white text-[#31332C]'
                      }`}
                    >
                      <p className="whitespace-pre-line font-body text-[13px] leading-relaxed">{message.text}</p>
                      {message.products?.map((product) => (
                        <ProductPill key={product.id} product={product} />
                      ))}
                      {message.suggestions?.length > 0 && (
                        <div className="mt-3 flex flex-wrap gap-2">
                          {message.suggestions.slice(0, 3).map((suggestion) => (
                            <button
                              key={suggestion}
                              type="button"
                              onClick={() => sendMessage(suggestion)}
                              className="rounded-full border border-[#D9DBCF] bg-[#F5F4ED] px-3 py-1.5 font-label text-[8px] font-bold uppercase tracking-[0.12em] text-[#0F3A3A] hover:bg-white"
                            >
                              {suggestion}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}

                {isTyping && (
                  <div className="flex justify-start">
                    <div className="flex items-center gap-2 rounded-[8px] border border-[#D9DBCF] bg-white px-4 py-3">
                      <Loader2 className="h-3.5 w-3.5 animate-spin text-[#0F3A3A]" />
                      <span className="font-label text-[8px] font-bold uppercase tracking-[0.18em] text-[#797C73]">
                        Sprout is thinking
                      </span>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            </div>

            <form onSubmit={handleSubmit} className="flex items-center gap-2 border-t border-[#D9DBCF] bg-[#FBF9F4] px-4 py-3">
              <input
                value={draft}
                onChange={(event) => setDraft(event.target.value)}
                placeholder="Ask about care, gifts, checkout..."
                className="min-w-0 flex-1 rounded-full border border-[#D9DBCF] bg-white px-4 py-2.5 font-body text-[13px] text-[#31332C] outline-none transition-colors placeholder:text-[#797C73]/70 focus:border-[#0F3A3A]"
              />
              <button
                type="submit"
                disabled={!draft.trim() || isTyping}
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#0F3A3A] text-[#FBF9F4] transition-colors hover:bg-[#1D241F] disabled:bg-[#B1B3A9]"
                title="Send message"
              >
                <Send className="h-4 w-4" />
              </button>
            </form>
          </Motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
