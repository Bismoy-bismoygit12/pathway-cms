import React, { useState, useRef, useEffect } from 'react';
import { MessageSquareHeart, X, Send, ShieldAlert, Sparkles, ExternalLink } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import { generateBotResponse, detectCrisis } from '../../services/chat';
import { ChatMessage } from '../../types';

export const FloatingChatWidget: React.FC<{ onOpenEmergency: () => void }> = ({ onOpenEmergency }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-init',
      sender: 'assistant',
      text: 'Hello. I am your calm AI helper. What is on your mind today? (Remember, I am an AI helper, not a doctor).',
      timestamp: 'Now'
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { language } = useLanguage();
  const isBn = language === 'bn';

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  const handleSend = (textToSend?: string) => {
    const text = (textToSend || input).trim();
    if (!text) return;

    // Check crisis in real time
    if (detectCrisis(text)) {
      onOpenEmergency();
      setIsOpen(false);
      return;
    }

    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    // Simulate streaming reply
    setTimeout(() => {
      const botRes = generateBotResponse(text, isBn ? 'bn' : 'en');
      const botMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        sender: 'assistant',
        text: botRes.reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        hasCopingTools: botRes.hasCopingTools
      };
      setMessages((prev) => [...prev, botMsg]);
      setIsTyping(false);
    }, 700);
  };

  return (
    <>
      {/* Floating launcher trigger */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          title="Open AI Companion"
          aria-label="Open AI Companion Chat"
          className="fixed bottom-16 right-4 z-30 flex items-center gap-2 bg-blue-700 hover:bg-blue-800 text-white p-3.5 rounded-full shadow-xl shadow-blue-700/30 transition transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          <MessageSquareHeart className="w-5 h-5" />
          <span className="hidden sm:inline text-xs font-semibold pr-1">Pathway Chat</span>
        </button>
      )}

      {/* Floating Chat Modal */}
      {isOpen && (
        <div className="fixed bottom-4 right-4 z-50 w-92 sm:w-96 max-w-[calc(100vw-2rem)] h-[540px] bg-white dark:bg-stone-900 rounded-3xl shadow-2xl border border-stone-200 dark:border-stone-800 flex flex-col overflow-hidden animate-in slide-in-from-bottom-5">
          {/* Header */}
          <div className="p-4 bg-blue-700 text-white flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center">
                <MessageSquareHeart className="w-4 h-4 text-white" />
              </div>
              <div>
                <h4 className="font-bold text-xs sm:text-sm">Pathway Companion</h4>
                <p className="text-[10px] text-blue-200">AI helper &bull; Not a doctor</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1.5 rounded-full hover:bg-white/20 text-white transition"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Messages list */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 text-xs">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl p-3 leading-relaxed ${
                    m.sender === 'user'
                      ? 'bg-blue-700 text-white rounded-br-xs'
                      : 'bg-stone-100 dark:bg-stone-800 text-stone-800 dark:text-stone-200 rounded-bl-xs'
                  }`}
                >
                  <p className="whitespace-pre-wrap">{m.text}</p>
                  <span className="text-[9px] opacity-60 block text-right mt-1">{m.timestamp}</span>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-stone-100 dark:bg-stone-800 p-2.5 rounded-2xl rounded-bl-xs text-stone-500 text-[11px] animate-pulse">
                  {isBn ? 'সহায়ক লিখছে...' : 'Pathway is typing gently...'}
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick chips */}
          <div className="px-3 py-1.5 border-t border-stone-100 dark:border-stone-800 flex items-center gap-1.5 overflow-x-auto text-[11px]">
            <button
              onClick={() => handleSend(isBn ? 'আমি তীব্র আকাঙ্ক্ষা অনুভব করছি' : 'I feel a craving')}
              className="px-2.5 py-1 rounded-full bg-stone-100 dark:bg-stone-800 hover:bg-blue-50 hover:text-blue-700 whitespace-nowrap text-stone-600 transition"
            >
              🌊 {isBn ? 'আকাঙ্ক্ষা জাগছে' : 'I feel a craving'}
            </button>
            <button
              onClick={() => handleSend(isBn ? 'আমি মানসিক চাপে আছি' : 'I am stressed')}
              className="px-2.5 py-1 rounded-full bg-stone-100 dark:bg-stone-800 hover:bg-blue-50 hover:text-blue-700 whitespace-nowrap text-stone-600 transition"
            >
              🌿 {isBn ? 'চাপে আছি' : 'I feel stressed'}
            </button>
            <button
              onClick={() => handleSend(isBn ? 'আজ একটু ভুল হয়ে গেছে' : 'I had a setback')}
              className="px-2.5 py-1 rounded-full bg-stone-100 dark:bg-stone-800 hover:bg-blue-50 hover:text-blue-700 whitespace-nowrap text-stone-600 transition"
            >
              🤍 {isBn ? 'ভুল হয়েছে' : 'I had a setback'}
            </button>
          </div>

          {/* Input box */}
          <div className="p-3 bg-stone-50 dark:bg-stone-850 border-t border-stone-200 dark:border-stone-800 flex items-center gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder={isBn ? 'শান্তভাবে লিখুন...' : 'Write gently...'}
              className="flex-1 bg-white dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-xl px-3 py-2 text-xs text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={() => handleSend()}
              disabled={!input.trim()}
              className="p-2 rounded-xl bg-blue-700 hover:bg-blue-800 text-white disabled:opacity-40 transition"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </>
  );
};
