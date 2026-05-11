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
      'Choose a gift under Rs 2,500',
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
    text: 'Namaste. Tell me the occasion, budget, city, or plant symptom and I will point you to the right CHLORO next step.',
  },
];

const hiddenRoutes = ['/login', '/register', '/signup', '/archive'];

const normalizeText = (value) => String(value || '').toLowerCase();

const includesAny = (text, words) => words.some((word) => text.includes(word));

const compactSuggestions = (items) => {
  const values = Array.isArray(items) ? items : [items];
  return [...new Set(values.map((item) => String(item || '').trim()).filter(Boolean))].slice(0, 3);
};

const getContextualSuggestions = (text, suggestions = []) => {
  const lower = normalizeText(text);

  if (includesAny(lower, ['gift', 'friend', 'send', 'present', 'birthday', 'housewarming'])) {
    return compactSuggestions([
      'Browse gift-ready products',
      'Find easy-care plants',
      'Checkout help',
    ]);
  }

  if (includesAny(lower, ['diagnosis', 'diagnose', 'yellow', 'drooping', 'pest', 'fungal', 'sick', 'spots'])) {
    return compactSuggestions([
      'Open AI diagnosis',
      'Find care tools',
      'Ask about watering',
    ]);
  }

  if (includesAny(lower, ['order', 'delivery', 'track', 'payment', 'checkout'])) {
    return compactSuggestions([
      'Open my orders',
      'Checkout help',
      'Browse gift-ready products',
    ]);
  }

  return compactSuggestions(suggestions);
};

const getSuggestionRoute = (suggestion) => {
  const lower = normalizeText(suggestion);

  if (lower.includes('diagnosis') || lower.includes('upload a plant photo')) return '/ai-diagnosis';
  if (lower.includes('gift') || lower.includes('products') || lower.includes('bundle') || lower.includes('tools')) return '/products-gifts';
  if (lower.includes('easy-care') || lower.includes('easy care') || lower.includes('browse plants') || lower.includes('plant finder')) return '/discovery';
  if (lower.includes('orders') || lower.includes('track')) return '/orders';
  if (lower.includes('wishlist')) return '/wishlist';
  if (lower.includes('checkout') || lower.includes('payment')) return '/checkout';

  return '';
};

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
    className="group mt-3 grid grid-cols-[48px_1fr] gap-3 border border-[#D8D0C0] bg-[#F8F5EE] p-2 transition-colors duration-300 hover:border-[#11110E] hover:bg-[#FFFEFA]"
  >
    <div className="aspect-square overflow-hidden bg-[#E8E9E0]">
      {product.image ? (
        <img src={product.image} alt={product.name} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.06]" />
      ) : (
        <div className="flex h-full w-full items-center justify-center">
          <Leaf className="h-4 w-4 text-[#797C73]" />
        </div>
      )}
    </div>
    <div className="min-w-0">
      <p className="truncate font-label text-[9px] font-bold uppercase tracking-[0.16em] text-[#11110E]">{product.name}</p>
      <p className="mt-1 line-clamp-2 font-body text-[11px] leading-snug text-[#6E6A60]">{product.reason}</p>
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
          suggestions: getContextualSuggestions(trimmed, response.suggestedActions || []),
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
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={() => setIsOpen(true)}
            className="fixed bottom-5 right-5 z-50 flex h-9 w-9 items-center justify-center rounded-full bg-white shadow-[0_20px_50px_rgba(0,0,0,0.2)] transition-all hover:scale-110"
            title="Open botanical assistant"
          >
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#11110E] text-white">
              <Sparkles className="h-3.5 w-3.5" />
            </div>
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
            className="fixed bottom-3 left-3 right-3 z-50 flex max-h-[min(500px,calc(100vh-24px))] flex-col overflow-hidden border border-[#CFC6B5] bg-[#FFFEFA] shadow-[0_32px_100px_rgba(17,17,14,0.18)] sm:bottom-5 sm:left-auto sm:right-5 sm:w-[360px]"
          >
            <div className="flex items-center justify-between border-b border-[#D8D0C0] bg-[#11110E] px-3.5 py-2.5 text-[#FBF9F4]">
              <div className="flex min-w-0 items-center gap-3">
                {currentCategory && (
                  <button
                    type="button"
                    onClick={() => setCurrentCategory(null)}
                    className="shrink-0 p-1.5 text-[#FBF9F4]/65 transition-colors hover:bg-[#FBF9F4]/10 hover:text-[#FBF9F4]"
                    title="Back to categories"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                )}
                <div className="min-w-0">
                  <h3 className="font-label text-[9px] font-bold uppercase tracking-[0.26em] text-[#D8B56D]">
                    CHLORO ATELIER
                  </h3>
                  <p className="mt-0.5 truncate font-body text-[11px] text-[#FBF9F4]/58">
                    {currentCategory || 'Botanical concierge'}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="p-1.5 text-[#FBF9F4]/65 transition-colors hover:bg-[#FBF9F4]/10 hover:text-[#FBF9F4]"
                title="Close botanical assistant"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="no-scrollbar flex-1 overflow-y-auto bg-[#F8F5EE] px-3 py-3">
              {!hasConversation ? (
                <div className="mb-3 border-b border-[#D8D0C0] pb-3">
                  <div className="mb-2 flex items-center justify-between">
                    <span className="font-label text-[8px] uppercase tracking-[0.24em] text-[#7A756A]">
                      Concierge
                    </span>
                    <span className="font-label text-[8px] uppercase tracking-[0.2em] text-[#A49B8C]">
                      {formatTime()}
                    </span>
                  </div>
                  <p className="font-headline text-[24px] leading-[0.95] text-[#11110E]">
                    {currentCategory || 'How may we assist?'}
                  </p>
                  <p className="mt-2 max-w-[320px] font-body text-[12px] leading-relaxed text-[#6E6A60]">
                    {currentCategory
                      ? CATEGORIES[currentCategory].description
                      : 'Plant selection, diagnosis, gifts, products, and checkout guidance.'}
                  </p>
                </div>
              ) : (
                <div className="mb-3 flex items-center justify-between border-b border-[#D8D0C0] pb-2">
                  <span className="font-label text-[8px] uppercase tracking-[0.24em] text-[#7A756A]">
                    Concierge
                  </span>
                  <span className="max-w-[180px] truncate text-right font-label text-[8px] uppercase tracking-[0.18em] text-[#A49B8C]">
                    {currentCategory || 'Live assist'}
                  </span>
                </div>
              )}

              {!currentCategory && !hasConversation && (
                <div className="mb-4 border-t border-[#D8D0C0]">
                  {Object.keys(CATEGORIES).map((category) => (
                    <button
                      key={category}
                      type="button"
                      onClick={() => setCurrentCategory(category)}
                      className="group flex w-full items-center justify-between gap-3 border-b border-[#D8D0C0] py-3 text-left transition-colors duration-200 hover:bg-[#FFFEFA]"
                    >
                      <span className="font-label text-[10px] font-bold uppercase tracking-[0.18em] text-[#11110E]">
                        {category}
                      </span>
                      <span className="max-w-[150px] text-right font-body text-[11px] leading-snug text-[#7A756A]">
                        {CATEGORIES[category].description}
                      </span>
                    </button>
                  ))}
                </div>
              )}

              {currentCategory && !hasConversation && (
                <div className="mb-4 grid grid-cols-1 gap-2">
                  {CATEGORIES[currentCategory].actions.map((action) => (
                    <button
                      key={action}
                      type="button"
                      onClick={() => handleActionClick(action)}
                      disabled={isTyping}
                      className="flex w-full items-center justify-between gap-3 border border-[#D8D0C0] bg-[#FFFEFA] px-3.5 py-2.5 text-left font-body text-[12px] leading-snug text-[#31332C] transition-colors duration-200 hover:border-[#11110E] hover:bg-white disabled:opacity-55"
                    >
                      <span>{action}</span>
                      <span className="font-headline text-[22px] italic text-[#9A6C1D]">+</span>
                    </button>
                  ))}
                </div>
              )}

              <div className={`space-y-2.5 ${hasConversation ? '' : 'border-t border-[#D8D0C0] pt-4'}`}>
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[86%] border px-3.5 py-2.5 shadow-[0_10px_26px_rgba(17,17,14,0.04)] ${
                        message.sender === 'user'
                          ? 'border-[#0F3A3A] bg-[#0F3A3A] text-[#FBF9F4]'
                          : message.tone === 'error'
                            ? 'border border-[#A90000]/20 bg-[#A90000]/5 text-[#7A211F]'
                            : 'border-[#D8D0C0] bg-white text-[#31332C]'
                      }`}
                    >
                      <p className="whitespace-pre-line font-body text-[12px] leading-relaxed">{message.text}</p>
                      {message.products?.map((product) => (
                        <ProductPill key={product.id} product={product} />
                      ))}
                      {message.suggestions?.length > 0 && (
                        <div className="mt-3 flex flex-wrap gap-2">
                          {message.suggestions.slice(0, 3).map((suggestion) => {
                            const route = getSuggestionRoute(suggestion);
                            const actionClassName = 'border border-[#D8D0C0] bg-[#F8F5EE] px-3 py-1.5 font-label text-[8px] font-bold uppercase tracking-[0.12em] text-[#11110E] transition-colors hover:border-[#11110E] hover:bg-white';

                            if (route) {
                              return (
                                <Link
                                  key={suggestion}
                                  to={route}
                                  onClick={() => setIsOpen(false)}
                                  className={actionClassName}
                                >
                                  {suggestion}
                                </Link>
                              );
                            }

                            return (
                              <button
                                key={suggestion}
                                type="button"
                                onClick={() => sendMessage(suggestion)}
                                className={actionClassName}
                              >
                                {suggestion}
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  </div>
                ))}

                {isTyping && (
                  <div className="flex justify-start">
                    <div className="flex items-center gap-2 border border-[#D8D0C0] bg-white px-3.5 py-2.5">
                      <Loader2 className="h-3.5 w-3.5 animate-spin text-[#11110E]" />
                      <span className="font-label text-[8px] font-bold uppercase tracking-[0.18em] text-[#7A756A]">
                        Atelier is thinking
                      </span>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            </div>

            <form onSubmit={handleSubmit} className="flex items-center gap-2 border-t border-[#D8D0C0] bg-[#FFFEFA] px-3 py-2.5">
              <input
                value={draft}
                onChange={(event) => setDraft(event.target.value)}
                placeholder="Ask about care, gifts, checkout..."
                className="min-w-0 flex-1 border border-[#D8D0C0] bg-white px-3 py-2.5 font-body text-[12px] text-[#31332C] outline-none transition-colors placeholder:text-[#797C73]/70 focus:border-[#11110E]"
              />
              <button
                type="submit"
                disabled={!draft.trim() || isTyping}
                className="flex h-10 w-10 shrink-0 items-center justify-center bg-[#0F3A3A] text-[#FBF9F4] transition-colors hover:bg-[#11110E] disabled:bg-[#B1B3A9]"
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
