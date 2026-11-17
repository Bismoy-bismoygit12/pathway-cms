import { ChatMessage } from '../types';

const CHAT_HISTORY_KEY = 'pathway_chat_history';
const CHAT_MEMORY_KEY = 'pathway_chat_memory';
const CHAT_COUNT_KEY = 'pathway_chat_daily_count';

// Crisis trigger patterns
const CRISIS_PATTERNS = [
  /suicide/i,
  /kill myself/i,
  /want to die/i,
  /end my life/i,
  /self harm/i,
  /cut myself/i,
  /overdose/i,
  /মরে যেতে চাই/,
  /বাঁচতে ইচ্ছা করে না/,
  /আত্মহত্যা/,
  /জীবন শেষ/,
  /সহ্য হচ্ছে না আর/,
  /শেষ করে দেব/
];

export function detectCrisis(text: string): boolean {
  return CRISIS_PATTERNS.some((pattern) => pattern.test(text));
}

// Prohibited medical/illegal advice patterns
const PROHIBITED_PATTERNS = [
  /how to get weed/i,
  /where to buy drugs/i,
  /dose of yaba/i,
  /mix alcohol and/i,
  /can i take clonazepam with/i,
  /prescribe me/i,
  /কি ওষুধ খাব/
];

export function detectProhibitedQuery(text: string): boolean {
  return PROHIBITED_PATTERNS.some((pattern) => pattern.test(text));
}

export function getChatDailyCount(): { date: string; count: number } {
  const raw = localStorage.getItem(CHAT_COUNT_KEY);
  const today = new Date().toISOString().split('T')[0];
  if (!raw) return { date: today, count: 0 };
  try {
    const data = JSON.parse(raw);
    if (data.date !== today) return { date: today, count: 0 };
    return data;
  } catch {
    return { date: today, count: 0 };
  }
}

export function incrementChatCount() {
  const current = getChatDailyCount();
  const updated = { date: current.date, count: current.count + 1 };
  localStorage.setItem(CHAT_COUNT_KEY, JSON.stringify(updated));
}

export function getChatHistory(): ChatMessage[] {
  const raw = localStorage.getItem(CHAT_HISTORY_KEY);
  if (!raw) {
    return [
      {
        id: 'msg-welcome',
        sender: 'assistant',
        text: 'Hello. I am your Pathway AI helper. I am here to listen and share calm coping tools whenever you need a moment. Please remember: I am an AI, not a doctor. If you ever feel in danger or acute pain, tap Get Help Now.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ];
  }
  try {
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export function saveChatHistory(history: ChatMessage[]) {
  localStorage.setItem(CHAT_HISTORY_KEY, JSON.stringify(history));
}

export function getChatMemory(): string[] {
  const raw = localStorage.getItem(CHAT_MEMORY_KEY);
  if (!raw) {
    return [
      'Prefers slow box breathing when feeling anxious',
      'Feels most cravings around 7:00 PM to 9:00 PM',
      'Enjoys gentle tea and instrumental soundscapes'
    ];
  }
  try {
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export function saveChatMemory(memory: string[]) {
  localStorage.setItem(CHAT_MEMORY_KEY, JSON.stringify(memory));
}

// Generate kind, rule-based responses in English or Bangla
export function generateBotResponse(userInput: string, lang: 'en' | 'bn'): { reply: string; hasCopingTools?: boolean } {
  const isBangla = lang === 'bn' || /[\u0980-\u09FF]/.test(userInput);

  if (detectProhibitedQuery(userInput)) {
    if (isBangla) {
      return {
        reply: 'আমি একজন এআই সহায়ক, কোনো চিকিৎসক নই। তাই আমি কোনো নির্দিষ্ট ওষুধের প্রেসক্রিপশন, মাত্রা বা ক্ষতিকর পদার্থের বিষয়ে পরামর্শ দিতে পারব না। আপনার শারীরিক সুরক্ষার জন্য আমাদের অভিজ্ঞ সাইকিয়াট্রিস্টদের সাথে কথা বলার বা নিকটস্থ চিকিৎসকের পরামর্শ নেওয়ার অনুরোধ করছি।'
      };
    }
    return {
      reply: 'I am an AI companion, not a medical doctor. I cannot provide dosages, prescriptions, or advice on acquiring or combining substances. For safe clinical guidance, please consult one of our verified psychiatrists or your local physician.'
    };
  }

  const lower = userInput.toLowerCase();

  // Craving response
  if (lower.includes('craving') || lower.includes('urge') || lower.includes('আকাঙ্ক্ষা') || lower.includes('নেশা')) {
    if (isBangla) {
      return {
        reply: 'আমি বুঝতে পারছি এই মুহূর্তটি কঠিন লাগছে। মনে রাখবেন: তীব্র আকাঙ্ক্ষা চিরকাল থাকে না। এটি একটি ঢেউয়ের মতো—১০ থেকে ১৫ মিনিটে শীর্ষে পৌঁছে আবার শান্ত হয়ে যায়।\n\nআসুন আমরা একসাথে কয়েক মিনিট উর্জ সার্ফিং (Urge Surfing) করি। ঠাণ্ডা পানি পান করুন অথবা ৫-৪-৩-২-১ গ্রাউন্ডিং চেষ্টা করুন। আপনি নিরাপদে আছেন।',
        hasCopingTools: true
      };
    }
    return {
      reply: 'I hear you, and it takes courage to speak it aloud. Remember: cravings are like ocean waves. They rise, reach a peak in about 10–15 minutes, and then naturally break and fade away.\n\nYou do not have to fight the wave — you can ride it out safely. Let us try a quick grounding exercise or drink a cool glass of water right now.',
      hasCopingTools: true
    };
  }

  // Setback response
  if (lower.includes('setback') || lower.includes('relapse') || lower.includes('mistake') || lower.includes('ভুল') || lower.includes('ব্যর্থ')) {
    if (isBangla) {
      return {
        reply: 'অনুগ্রহ করে নিজের প্রতি কঠোর হবেন না। একটি ভুল বা সাময়িক বিপথগামিতা আপনার সমস্ত আগের অর্জন বা দিনগুলোকে মুছে দেয় না। আরোগ্য কোনো সোজা রাস্তা নয়—এতে চড়াই-উতরাই থাকে।\n\nআপনি আজ এখান থেকেই আবার নতুন করে শুরু করতে পারেন। এক গ্লাস পানি নিন, বিশ্রাম নিন, এবং প্রয়োজনে আপনার ডাক্তারের সাথে কথা বলুন।',
        hasCopingTools: true
      };
    }
    return {
      reply: 'Please be kind to yourself right now. A setback never erases the progress you have built. Recovery is not a fragile line; it is a muscle that grows with every time you choose to stand up again.\n\nYou did not fail. You are human, and you can begin again this very second. Would you like to review your safety plan or talk to your trusted contact?',
      hasCopingTools: true
    };
  }

  // Stress response
  if (lower.includes('stress') || lower.includes('anxious') || lower.includes('overwhelmed') || lower.includes('চাপ') || lower.includes('অস্থির')) {
    if (isBangla) {
      return {
        reply: 'আপনার মনের অস্থিরতা সম্পূর্ণ স্বাভাবিক। আসুন কাঁধ দুটো আলগা করে একটি দীর্ঘ গভীর শ্বাস নিই। নাক দিয়ে ৪ সেকেন্ড শ্বাস নিন, ৪ সেকেন্ড ধরে রাখুন এবং মুখ দিয়ে ধীরে ধীরে ছেড়ে দিন। আপনি এখন এই মুহূর্তে নিরাপদ।',
        hasCopingTools: true
      };
    }
    return {
      reply: 'Take a gentle, slow breath with me right now. Drop your shoulders away from your ears. Inhale softly for 4 seconds, hold gently for 4 seconds, and exhale slowly for 4 seconds. Whatever is pressing on your thoughts, you can address it one breath at a time.',
      hasCopingTools: true
    };
  }

  // Default warm response
  if (isBangla) {
    return {
      reply: 'আমি শুনছি এবং আপনার সাথে আছি। প্রতিদিনের এই ছোট ছোট মুহূর্তগুলোতে নিজের যত্ন নেওয়াই সবচেয়ে বড় শক্তি। আজ কি কোনো হালকা শ্বাসপ্রশ্বাসের অনুশীলন বা লাইব্রেরির কোনো শান্ত গল্প পড়তে চান?'
    };
  }

  return {
    reply: 'Thank you for sharing that with me. Every thought you notice and gently acknowledge is a step forward in rebuilding self-trust. Would you like to try a short 3-minute relaxation exercise or explore our soothing library articles?'
  };
}
