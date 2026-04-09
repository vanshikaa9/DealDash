import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageCircle, X, Send, Bot, User } from 'lucide-react';

type Message = {
  id: number;
  from: 'bot' | 'user';
  text: string;
};

const BOT_RESPONSES: { keywords: string[]; reply: string }[] = [
  {
    keywords: ['coupon', 'code', 'work', 'not working', 'expired', 'invalid'],
    reply: "If a coupon isn't working, it may have expired or reached its usage limit. Check the expiry date on the deal page. You can also try clearing your cart and re-applying the code.",
  },
  {
    keywords: ['worth it', 'rating', 'conditional', 'not worth'],
    reply: "Our Worth It ratings are assigned based on discount percentage, minimum order, and conditions. 'Worth It' means a clear win, 'Conditional' means it depends on your situation, and 'Not Worth It' means the savings are too small to bother.",
  },
  {
    keywords: ['add', 'submit', 'new coupon', 'my coupon', 'contribute'],
    reply: "You can add a coupon by clicking '+ Add Coupon' in the top navigation. Fill in the platform, discount, code, and expiry date. It'll appear on the homepage right away!",
  },
  {
    keywords: ['amazon', 'flipkart', 'swiggy', 'zomato', 'myntra', 'bigbasket', 'makemytrip', 'paytm'],
    reply: "We cover Amazon, Flipkart, Swiggy, Zomato, Myntra, BigBasket, MakeMyTrip, and Paytm. Use the platform filter on the homepage to browse deals by platform.",
  },
  {
    keywords: ['expir', 'soon', 'today', 'last day'],
    reply: "Check the 'Expiring Soon' page for deals ending within 3 days. You'll also see a strip on the homepage with the most urgent deals.",
  },
  {
    keywords: ['free', 'cost', 'paid', 'subscription', 'sign up', 'account'],
    reply: "DealDash is completely free — no sign-up, no subscription, no hidden fees. Just browse and save.",
  },
  {
    keywords: ['contact', 'email', 'support', 'help', 'team'],
    reply: "You can reach us at hello@dealdash.in or call +91 98765 43210. We're based in Bengaluru and usually respond within a few hours on weekdays.",
  },
  {
    keywords: ['update', 'fresh', 'new', 'latest', 'recent'],
    reply: "Our team updates deals daily. We also pull live data from select platforms. The homepage always shows the most current coupons.",
  },
  {
    keywords: ['hi', 'hello', 'hey', 'hii', 'helo'],
    reply: "Hey there! 👋 I'm the DealDash assistant. Ask me anything about coupons, ratings, or how the platform works.",
  },
  {
    keywords: ['thank', 'thanks', 'great', 'awesome', 'helpful'],
    reply: "Happy to help! Let me know if you have any other questions. Happy saving! 🎉",
  },
];

const SUGGESTIONS = [
  'How do ratings work?',
  'How to add a coupon?',
  'Why is a code not working?',
  'Is DealDash free?',
];

function getBotReply(input: string): string {
  const lower = input.toLowerCase();
  for (const { keywords, reply } of BOT_RESPONSES) {
    if (keywords.some((kw) => lower.includes(kw))) return reply;
  }
  return "I'm not sure about that one. Try asking about coupon ratings, adding deals, or specific platforms. Or email us at hello@dealdash.in for anything else!";
}

let msgId = 0;
const nextId = () => ++msgId;

const INITIAL_MESSAGES: Message[] = [
  { id: nextId(), from: 'bot', text: "Hi! I'm the DealDash assistant. How can I help you today?" },
];

export default function HelpChat() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 200);
    }
  }, [open]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, typing]);

  const sendMessage = (text: string) => {
    const trimmed = text.trim();
    if (!trimmed) return;

    setMessages((prev) => [...prev, { id: nextId(), from: 'user', text: trimmed }]);
    setInput('');
    setTyping(true);

    setTimeout(() => {
      setTyping(false);
      setMessages((prev) => [...prev, { id: nextId(), from: 'bot', text: getBotReply(trimmed) }]);
    }, 900 + Math.random() * 400);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  return (
    <>
      {/* Floating button */}
      <div className="fixed bottom-6 right-6 z-50">
        <AnimatePresence>
          {!open && (
            <motion.button
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ duration: 0.2, ease: 'easeOut' as const }}
              onClick={() => setOpen(true)}
              aria-label="Open help chat"
              className="w-14 h-14 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full shadow-lg shadow-indigo-300 dark:shadow-indigo-900 flex items-center justify-center transition-colors"
            >
              <MessageCircle size={22} />
            </motion.button>
          )}
        </AnimatePresence>

        {/* Chat window */}
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 16 }}
              transition={{ duration: 0.22, ease: 'easeOut' as const }}
              className="absolute bottom-0 right-0 w-[340px] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-2xl shadow-slate-300/50 dark:shadow-black/50 flex flex-col overflow-hidden"
              style={{ maxHeight: '480px' }}
            >
              {/* Header */}
              <div className="flex items-center justify-between px-4 py-3 bg-indigo-600 text-white flex-shrink-0">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                    <Bot size={16} />
                  </div>
                  <div>
                    <div className="text-sm font-bold leading-none">DealDash Help</div>
                    <div className="text-xs text-indigo-200 mt-0.5 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full inline-block" />
                      Online
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setOpen(false)}
                  className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-white/20 transition-colors"
                  aria-label="Close chat"
                >
                  <X size={15} />
                </button>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3" style={{ minHeight: 0 }}>
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex items-end gap-2 ${msg.from === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
                  >
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${
                      msg.from === 'bot'
                        ? 'bg-indigo-100 dark:bg-indigo-900/50'
                        : 'bg-slate-100 dark:bg-slate-800'
                    }`}>
                      {msg.from === 'bot'
                        ? <Bot size={12} className="text-indigo-600 dark:text-indigo-400" />
                        : <User size={12} className="text-slate-500 dark:text-slate-400" />
                      }
                    </div>
                    <div
                      className={`max-w-[220px] px-3 py-2 rounded-2xl text-xs leading-relaxed ${
                        msg.from === 'bot'
                          ? 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-bl-sm'
                          : 'bg-indigo-600 text-white rounded-br-sm'
                      }`}
                    >
                      {msg.text}
                    </div>
                  </div>
                ))}

                {typing && (
                  <div className="flex items-end gap-2">
                    <div className="w-6 h-6 rounded-full bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center flex-shrink-0">
                      <Bot size={12} className="text-indigo-600 dark:text-indigo-400" />
                    </div>
                    <div className="bg-slate-100 dark:bg-slate-800 px-3 py-2.5 rounded-2xl rounded-bl-sm flex items-center gap-1">
                      {[0, 1, 2].map((i) => (
                        <motion.span
                          key={i}
                          className="w-1.5 h-1.5 bg-slate-400 dark:bg-slate-500 rounded-full block"
                          animate={{ y: [0, -4, 0] }}
                          transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15, ease: 'easeInOut' as const }}
                        />
                      ))}
                    </div>
                  </div>
                )}
                <div ref={bottomRef} />
              </div>

              {/* Quick suggestions */}
              {messages.length <= 2 && (
                <div className="px-4 pb-2 flex gap-1.5 flex-wrap flex-shrink-0">
                  {SUGGESTIONS.map((s) => (
                    <button
                      key={s}
                      onClick={() => sendMessage(s)}
                      className="text-xs bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-800 px-2.5 py-1 rounded-full hover:bg-indigo-100 dark:hover:bg-indigo-900/50 transition-colors"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              )}

              {/* Input */}
              <form
                onSubmit={handleSubmit}
                className="flex items-center gap-2 px-3 py-3 border-t border-slate-100 dark:border-slate-800 flex-shrink-0"
              >
                <input
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask a question..."
                  className="flex-1 text-xs px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-300 dark:focus:ring-indigo-700 transition-all"
                />
                <button
                  type="submit"
                  disabled={!input.trim() || typing}
                  className="w-8 h-8 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-xl flex items-center justify-center transition-colors flex-shrink-0"
                  aria-label="Send"
                >
                  <Send size={13} />
                </button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}
