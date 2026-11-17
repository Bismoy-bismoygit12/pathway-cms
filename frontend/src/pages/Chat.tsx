import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  MessageSquareHeart,
  Send,
  Sparkles,
  ShieldAlert,
  AlertTriangle,
  RotateCcw,
  Flag,
  Trash2,
  Stethoscope,
  PhoneCall,
  X,
  ExternalLink,
  Brain,
  Info
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import {
  getChatHistory,
  saveChatHistory,
  getChatMemory,
  saveChatMemory,
  generateBotResponse,
  detectCrisis,
  getChatDailyCount,
  incrementChatCount
} from '../services/chat';
import { ChatMessage } from '../types';
import { GetHelpModal } from '../components/common/GetHelpModal';

export const Chat: React.FC = () => {
  const { currentUser } = useAuth();
  const { language, t } = useLanguage();
  const isBn = language === 'bn';
  const navigate = useNavigate();

  const [messages, setMessages] = useState<ChatMessage[]>(() => getChatHistory());
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isMemoryOpen, setIsMemoryOpen] = useState(false);
  const [memoryItems, setMemoryItems] = useState<string[]>(() => getChatMemory());
  const [newMemoryDraft, setNewMemoryDraft] = useState('');
  const [isCrisisModalOpen, setIsCrisisModalOpen] = useState(false);
  const [reportedMsgId, setReportedMsgId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const dailyCountObj = getChatDailyCount();
  const isFreePlan = currentUser?.plan === 'free';
  const isDailyLimitReached = isFreePlan && dailyCountObj.count >= 10;

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    saveChatHistory(messages);
  }, [messages]);

  const handleSend = (textToSend?: string) => {
    const text = (textToSend || input).trim();
    if (!text) return;

    // Check Crisis Trigger First (Safety is never blocked by limits)
    if (detectCrisis(text)) {
      setIsCrisisModalOpen(true);
    }

    // Daily limit check for normal messages
    if (isDailyLimitReached && !detectCrisis(text)) {
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
    incrementChatCount();

    // Simulated typewriter response
    setTimeout(() => {
      const res = generateBotResponse(text, isBn ? 'bn' : 'en');
      const botMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        sender: 'assistant',
        text: res.reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        hasCopingTools: res.hasCopingTools
      };
      setMessages((prev) => [...prev, botMsg]);
      setIsTyping(false);
    }, 800);
  };

  const handleReportMessage = (msgId: string) => {
    setReportedMsgId(msgId);
    setTimeout(() => setReportedMsgId(null), 3000);
  };

  const handleAddMemory = () => {
    if (!newMemoryDraft.trim()) return;
    const updated = [...memoryItems, newMemoryDraft.trim()];
    setMemoryItems(updated);
    saveChatMemory(updated);
    setNewMemoryDraft('');
  };

  const handleDeleteMemory = (index: number) => {
    const updated = memoryItems.filter((_, i) => i !== index);
    setMemoryItems(updated);
    saveChatMemory(updated);
  };

  const handleClearAllHistory = () => {
    if (window.confirm('Clear all conversation history?')) {
      const resetMsg: ChatMessage[] = [
        {
          id: `msg-${Date.now()}`,
          sender: 'assistant',
          text: 'Conversation history cleared. I am here whenever you need a calm listening ear.',
          timestamp: 'Now'
        }
      ];
      setMessages(resetMsg);
      saveChatHistory(resetMsg);
    }
  };

  return (
    <div className="space-y-6 pb-12 max-w-4xl mx-auto h-[calc(100vh-8rem)] flex flex-col">
      {/* Top Banner: Disclaimer & Limits */}
      <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl p-4 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shrink-0">
        <div className="flex items-center gap-2 text-xs text-stone-600 dark:text-stone-300">
          <Info className="w-4 h-4 text-blue-600 shrink-0" />
          <span>
            {t('chat.disclaimer')}
          </span>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {currentUser?.consents.chatbotMemory && (
            <button
              onClick={() => setIsMemoryOpen(true)}
              className="px-3 py-1 rounded-xl border border-stone-300 dark:border-stone-700 text-xs font-medium hover:bg-stone-100 flex items-center gap-1.5"
            >
              <Brain className="w-3.5 h-3.5 text-blue-600" />
              <span>Memory ({memoryItems.length})</span>
            </button>
          )}

          <Link
            to="/doctors"
            className="px-3 py-1 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 text-blue-800 text-xs font-semibold flex items-center gap-1"
          >
            <Stethoscope className="w-3.5 h-3.5" />
            <span>Talk to a Doctor</span>
          </Link>
        </div>
      </div>

      {/* Messages Feed */}
      <div className="flex-1 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl p-5 sm:p-6 overflow-y-auto space-y-4 shadow-xs">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'}`}
          >
            <div
              className={`max-w-[85%] sm:max-w-[75%] rounded-3xl p-4 text-xs sm:text-sm leading-relaxed shadow-xs ${
                m.sender === 'user'
                  ? 'bg-blue-700 text-white rounded-br-xs'
                  : 'bg-stone-50 dark:bg-slate-900 text-stone-900 dark:text-stone-100 border border-stone-200 dark:border-stone-800 rounded-bl-xs'
              }`}
            >
              <p className="whitespace-pre-wrap">{m.text}</p>
            </div>

            {/* Assistant tool shortcuts if coping tools triggered */}
            {m.hasCopingTools && (
              <div className="mt-2 flex flex-wrap gap-2 text-xs">
                <Link
                  to="/library/understanding-craving-wave"
                  className="px-3 py-1.5 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-800 dark:text-blue-200 border border-blue-200 font-semibold"
                >
                  🌊 20-Min Urge Surfing Guide
                </Link>
                <Link
                  to="/library/54321-grounding-guide"
                  className="px-3 py-1.5 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-800 dark:text-blue-200 border border-blue-200 font-semibold"
                >
                  🌿 5-4-3-2-1 Sensory Grounding
                </Link>
              </div>
            )}

            {/* Message meta & Report button */}
            {m.sender === 'assistant' && (
              <div className="flex items-center gap-2 mt-1 px-1 text-[10px] text-stone-400">
                <span>{m.timestamp}</span>
                <span>&bull;</span>
                <button
                  onClick={() => handleReportMessage(m.id)}
                  className="hover:text-stone-600 flex items-center gap-0.5"
                >
                  <Flag className="w-2.5 h-2.5" />
                  <span>Report</span>
                </button>
                {reportedMsgId === m.id && (
                  <span className="text-blue-600 font-medium">Thank you for reporting.</span>
                )}
              </div>
            )}
          </div>
        ))}

        {isTyping && (
          <div className="flex items-start">
            <div className="bg-stone-50 dark:bg-slate-900 border border-stone-200 dark:border-stone-800 rounded-2xl p-3 text-stone-500 text-xs animate-pulse">
              {isBn ? 'পাথওয়ে সহায়ক চিন্তা করছে...' : 'Pathway is listening and typing gently...'}
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Free Plan Daily Limit Notice */}
      {isDailyLimitReached && (
        <div className="p-3 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 text-amber-900 rounded-2xl text-xs flex items-center justify-between">
          <span>{t('chat.limitReached')}</span>
          <Link to="/pricing" className="font-bold underline shrink-0">
            Upgrade for BDT 50
          </Link>
        </div>
      )}

      {/* Quick Chips Row */}
      <div className="flex items-center gap-2 overflow-x-auto text-xs shrink-0 py-1">
        <button
          onClick={() => handleSend(isBn ? 'আমি তীব্র আকাঙ্ক্ষা বা নেশার টান অনুভব করছি' : 'I feel a craving right now')}
          className="px-3 py-1.5 rounded-full bg-white dark:bg-slate-900 border border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-300 hover:border-blue-500 whitespace-nowrap transition"
        >
          🌊 {t('chat.quickCraving')}
        </button>
        <button
          onClick={() => handleSend(isBn ? 'আমার খুব অস্থির লাগছে' : 'I am feeling overwhelmed with stress')}
          className="px-3 py-1.5 rounded-full bg-white dark:bg-slate-900 border border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-300 hover:border-blue-500 whitespace-nowrap transition"
        >
          🌿 {t('chat.quickStress')}
        </button>
        <button
          onClick={() => handleSend(isBn ? 'আজ একটু ভুল হয়ে গেছে, কিন্তু আমি আবার শুরু করতে চাই' : 'I had a setback today and want to reset')}
          className="px-3 py-1.5 rounded-full bg-white dark:bg-slate-900 border border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-300 hover:border-blue-500 whitespace-nowrap transition"
        >
          🤍 {t('chat.quickSetback')}
        </button>
        <button
          onClick={handleClearAllHistory}
          className="px-2.5 py-1.5 rounded-full text-stone-400 hover:text-stone-600 text-xs ml-auto whitespace-nowrap"
          title="Clear conversation"
        >
          <Trash2 className="w-3.5 h-3.5 inline mr-1" />
          Clear
        </button>
      </div>

      {/* Input Form */}
      <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl p-2.5 flex items-center gap-2 shadow-xs shrink-0">
        <input
          type="text"
          value={input}
          disabled={isDailyLimitReached}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder={
            isDailyLimitReached
              ? 'Daily free limit reached (Safety emergency help is always available)'
              : t('chat.placeholder')
          }
          className="flex-1 px-4 py-2.5 text-xs sm:text-sm bg-transparent text-stone-900 dark:text-stone-100 focus:outline-none"
        />
        <button
          onClick={() => handleSend()}
          disabled={!input.trim() || isDailyLimitReached}
          className="px-5 py-2.5 rounded-2xl bg-blue-700 hover:bg-blue-800 text-white font-semibold text-xs shadow-sm disabled:opacity-40 transition flex items-center gap-1.5"
        >
          <Send className="w-3.5 h-3.5" />
          <span>{t('chat.send')}</span>
        </button>
      </div>

      {/* Memory Drawer Modal */}
      {isMemoryOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm"
        >
          <div className="bg-white dark:bg-stone-900 rounded-3xl p-6 max-w-md w-full space-y-4 shadow-xl border border-stone-200 dark:border-stone-800 animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <div className="flex items-center gap-2">
                <Brain className="w-4 h-4 text-blue-600" />
                <h3 className="font-bold text-sm text-stone-900 dark:text-stone-100">
                  {t('chat.memoryTitle')}
                </h3>
              </div>
              <button onClick={() => setIsMemoryOpen(false)} className="text-stone-400 hover:text-stone-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-stone-500">
              Items stored in AI memory to customize relaxation suggestions. You can edit or delete them at any time.
            </p>

            <div className="space-y-2 max-h-48 overflow-y-auto">
              {memoryItems.map((item, idx) => (
                <div
                  key={idx}
                  className="p-2.5 rounded-xl bg-stone-50 dark:bg-slate-900 flex items-center justify-between text-xs"
                >
                  <span className="text-stone-800 dark:text-stone-200">{item}</span>
                  <button
                    onClick={() => handleDeleteMemory(idx)}
                    className="text-stone-400 hover:text-rose-600 p-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>

            <div className="flex items-center gap-2 pt-2">
              <input
                type="text"
                value={newMemoryDraft}
                onChange={(e) => setNewMemoryDraft(e.target.value)}
                placeholder="Add custom preference (e.g. Likes green tea)..."
                className="flex-1 p-2 rounded-xl border border-stone-300 text-xs"
              />
              <button
                onClick={handleAddMemory}
                className="px-3 py-2 rounded-xl bg-blue-700 text-white font-semibold text-xs"
              >
                Add
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Emergency Crisis Trigger Modal */}
      <GetHelpModal isOpen={isCrisisModalOpen} onClose={() => setIsCrisisModalOpen(false)} />
    </div>
  );
};
