import { Goal } from '../types';
import { api } from './api';

const GOALS_STORAGE_KEY = 'pathway_daily_goals';

export function getInitialGoals(): Goal[] {
  return [
    {
      id: 'g-breathing-box',
      title: 'Box Breathing for Inner Peace',
      titleBn: 'বক্স ব্রিদিং: ৪-৪-৪-৪ গভীর শ্বাস',
      category: 'breathing',
      durationMinutes: 4,
      minDurationSeconds: 15,
      pointsReward: 25,
      source: 'suggested',
      completed: false,
      description: 'Slow 4-second box breathing to calm the nervous system.',
      descriptionBn: '৪ সেকেন্ড শ্বাস নিন, ৪ সেকেন্ড ধরে রাখুন, ৪ সেকেন্ড ছাড়ুন।',
      steps: [
        { text: 'Inhale gently through your nose for 4 seconds.', textBn: 'নাক দিয়ে ধীরে ধীরে ৪ সেকেন্ড গভীর শ্বাস নিন।' },
        { text: 'Hold your breath softly for 4 seconds without straining.', textBn: 'কোনো চাপ না দিয়ে ৪ সেকেন্ড শ্বাস ধরে রাখুন।' },
        { text: 'Exhale smoothly through your mouth for 4 seconds.', textBn: 'মুখ দিয়ে শান্তভাবে ৪ সেকেন্ডে শ্বাস ছাড়ুন।' },
        { text: 'Rest empty and relaxed for 4 seconds.', textBn: '৪ সেকেন্ড শান্তভাবে স্বাভাবিক থাকুন।' }
      ]
    },
    {
      id: 'g-hydration-check',
      title: 'Cool Water Reset',
      titleBn: 'এক গ্লাস ঠাণ্ডা পানি পান',
      category: 'hydration',
      durationMinutes: 2,
      minDurationSeconds: 10,
      pointsReward: 15,
      source: 'suggested',
      completed: true,
      completedAt: new Date().toISOString(),
      description: 'Drink a full tall glass of clean water slowly to replenish brain hydration.',
      descriptionBn: 'ধীরে ধীরে এক গ্লাস পানি পান করে শরীর ও মনকে সতেজ করুন।',
      steps: [
        { text: 'Pour a fresh glass of cool or room-temperature water.', textBn: 'এক গ্লাস পরিষ্কার পানি নিন।' },
        { text: 'Take 5 mindful sips, feeling the temperature in your throat.', textBn: 'ধীরেসুস্থে প্রতিটি চুমুক উপভোগ করুন।' },
        { text: 'Thank your body for carrying you today.', textBn: 'আজকের দিনটির জন্য নিজের শরীরের প্রতি কৃতজ্ঞ থাকুন।' }
      ]
    },
    {
      id: 'g-evening-walk',
      title: '10-Minute Mindful Fresh Air Walk',
      titleBn: '১০ মিনিটের হালকা সান্ধ্য হাঁটা',
      category: 'walk',
      durationMinutes: 10,
      minDurationSeconds: 20,
      pointsReward: 30,
      source: 'choice',
      completed: false,
      description: 'Step outside or walk around your veranda without looking at your phone.',
      descriptionBn: 'ফোন ছাড়া বারান্দায় বা খোলা বাতাসে ১০ মিনিট শান্তভাবে হাঁটুন।',
      steps: [
        { text: 'Leave your phone on the table or in your pocket on silent.', textBn: 'ফোনটি সাইলেন্ট রেখে নিরাপদ স্থানে রাখুন।' },
        { text: 'Feel your feet touch the ground with each slow step.', textBn: 'প্রতিটি পদক্ষেপে মাটির স্পর্শ অনুভব করুন।' },
        { text: 'Notice the evening breeze and sky.', textBn: 'আকাশের রং এবং সন্ধ্যার মৃদু বাতাস লক্ষ্য করুন।' }
      ]
    },
    {
      id: 'g-journal-gratitude',
      title: 'One Kind Thought Journal',
      titleBn: 'একটি কৃতজ্ঞতামূলক ছোট নোট',
      category: 'journal',
      durationMinutes: 3,
      minDurationSeconds: 15,
      pointsReward: 20,
      source: 'choice',
      completed: false,
      description: 'Write down one thing, however small, that brought you safety or comfort today.',
      descriptionBn: 'আজকের দিনে ভালো লেগেছে এমন ছোট একটি অনুভূতির কথা ভাবুন।',
      steps: [
        { text: 'Take a pen and notebook or your private digital pad.', textBn: 'আপনার ব্যক্তিগত খাতায় একটি লাইন লিখুন।' },
        { text: 'Finish this sentence: "Today, I was kind to myself when..."', textBn: '"আজ আমি নিজের প্রতি যত্নশীল ছিলাম যখন..."' }
      ]
    }
  ];
}

export function getDailyGoals(): Goal[] {
  const raw = localStorage.getItem(GOALS_STORAGE_KEY);
  if (!raw) {
    const initial = getInitialGoals();
    localStorage.setItem(GOALS_STORAGE_KEY, JSON.stringify(initial));
    return initial;
  }
  try {
    return JSON.parse(raw);
  } catch {
    return getInitialGoals();
  }
}

export function saveDailyGoals(goals: Goal[]) {
  localStorage.setItem(GOALS_STORAGE_KEY, JSON.stringify(goals));
}

export async function fetchGoalsFromBackend(): Promise<Goal[]> {
  try {
    const res = await api.get('/goals');
    if (res.success && res.data?.goals && Array.isArray(res.data.goals) && res.data.goals.length > 0) {
      saveDailyGoals(res.data.goals);
      return res.data.goals;
    }
  } catch (e) {
    console.warn('Backend goals unreachable, using cached goals', e);
  }
  return getDailyGoals();
}

export function completeDailyGoal(goalId: string): { success: boolean; goal?: Goal; pointsEarned: number } {
  // Fire API request asynchronously in background
  const rawId = String(goalId).replace('g-breathing-box', '1').replace('g-hydration-check', '2').replace('g-evening-walk', '3').replace('g-journal-gratitude', '4').replace('g-', '');
  api.post('/goals/complete', { goalId: rawId }).catch((e) => console.warn('Goal completion sync pending', e));

  const goals = getDailyGoals();
  const index = goals.findIndex((g) => g.id === goalId || String(g.id) === String(goalId));
  if (index === -1) return { success: false, pointsEarned: 0 };

  goals[index].completed = true;
  goals[index].completedAt = new Date().toISOString();
  saveDailyGoals(goals);

  return {
    success: true,
    goal: goals[index],
    pointsEarned: goals[index].pointsReward
  };
}

export function addDoctorGoal(goal: Omit<Goal, 'id' | 'completed' | 'source'>): Goal {
  const goals = getDailyGoals();
  const newGoal: Goal = {
    ...goal,
    id: `g-doc-${Date.now()}`,
    source: 'doctor',
    completed: false
  };
  goals.unshift(newGoal);
  saveDailyGoals(goals);
  return newGoal;
}
