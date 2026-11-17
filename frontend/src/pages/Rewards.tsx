import React, { useState } from 'react';
import {
  Award,
  Sparkles,
  Ticket,
  BookOpen,
  CheckCircle2,
  Anchor,
  Flame,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import rewardsData from '../data/rewards.json';
import { Reward, RedeemedReward } from '../types';
import { Celebration } from '../components/common/Celebration';

export const Rewards: React.FC = () => {
  const { currentUser, updateCurrentUser } = useAuth();
  const { language, t } = useLanguage();
  const isBn = language === 'bn';

  const [redeemedList, setRedeemedList] = useState<RedeemedReward[]>([
    {
      id: 'red-1',
      rewardId: 'badge-first-step',
      rewardName: 'First Step Anchor',
      rewardNameBn: 'প্রথম পদক্ষেপ ব্যাজ',
      redeemedAt: '2026-10-25',
      pointsSpent: 50
    }
  ]);

  const [selectedRewardToRedeem, setSelectedRewardToRedeem] = useState<Reward | null>(null);
  const [celebrationData, setCelebrationData] = useState<{ show: boolean; title: string; subtitle: string }>({
    show: false,
    title: '',
    subtitle: ''
  });

  const points = currentUser?.points || 0;

  const handleConfirmRedeem = () => {
    if (!selectedRewardToRedeem || !currentUser) return;
    if (points < selectedRewardToRedeem.pointsCost) return;

    // Deduct points
    updateCurrentUser({
      points: points - selectedRewardToRedeem.pointsCost
    });

    const newRedemption: RedeemedReward = {
      id: `red-${Date.now()}`,
      rewardId: selectedRewardToRedeem.id,
      rewardName: selectedRewardToRedeem.name,
      rewardNameBn: selectedRewardToRedeem.nameBn,
      redeemedAt: new Date().toISOString().split('T')[0],
      code: `PATHWAY-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
      pointsSpent: selectedRewardToRedeem.pointsCost
    };

    setRedeemedList([newRedemption, ...redeemedList]);
    const r = selectedRewardToRedeem;
    setSelectedRewardToRedeem(null);

    setCelebrationData({
      show: true,
      title: 'Reward Unlocked!',
      subtitle: `You successfully redeemed ${r.name}.`
    });
  };

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Anchor':
        return Anchor;
      case 'Flame':
        return Flame;
      case 'Sparkles':
        return Sparkles;
      case 'Ticket':
        return Ticket;
      default:
        return BookOpen;
    }
  };

  return (
    <div className="space-y-8 pb-16 max-w-5xl mx-auto">
      {/* Title & Points Header */}
      <div className="bg-gradient-to-r from-blue-800 to-blue-700 text-white rounded-3xl p-6 sm:p-8 shadow-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div className="space-y-1">
          <span className="text-xs font-semibold text-blue-200 uppercase tracking-wider block">
            Achievements & Motivation
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Pathway Rewards Catalog
          </h1>
          <p className="text-xs sm:text-sm text-blue-100 max-w-md">
            Earn points with each daily micro-goal. Redeem for telehealth discounts, digital badges, and journals.
          </p>
        </div>

        <div className="bg-white/10 backdrop-blur-md px-5 py-4 rounded-2xl border border-white/20 text-center shrink-0">
          <span className="text-[10px] text-blue-200 block uppercase font-bold tracking-wider">
            Your Points Balance
          </span>
          <div className="text-3xl font-extrabold text-amber-300 flex items-center justify-center gap-1.5 mt-0.5">
            <Sparkles className="w-5 h-5 text-amber-400" />
            <span>{points}</span>
          </div>
        </div>
      </div>

      {/* Rewards Catalog Grid */}
      <div className="space-y-4">
        <h2 className="text-base font-bold text-stone-900 dark:text-stone-100">
          Available Rewards
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {(rewardsData as Reward[]).map((reward) => {
            const Icon = getIcon(reward.icon);
            const canAfford = points >= reward.pointsCost;
            const isRedeemed = redeemedList.some((r) => r.rewardId === reward.id);

            return (
              <div
                key={reward.id}
                className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl p-6 shadow-xs flex flex-col justify-between space-y-4 hover:border-blue-300 transition"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 flex items-center justify-center shrink-0">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-xs font-bold text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 px-2.5 py-1 rounded-full border border-amber-200">
                      {reward.pointsCost} Points
                    </span>
                  </div>

                  <div>
                    <h3 className="font-bold text-base text-stone-900 dark:text-stone-100">
                      {isBn ? reward.nameBn : reward.name}
                    </h3>
                    <span className="text-[10px] font-semibold text-stone-400 uppercase">
                      {isBn ? reward.categoryBn : reward.category}
                    </span>
                    <p className="text-xs text-stone-600 dark:text-stone-400 mt-1 leading-relaxed">
                      {isBn ? reward.descriptionBn : reward.description}
                    </p>
                  </div>
                </div>

                <div className="pt-3 border-t border-stone-100 dark:border-stone-800 flex items-center justify-between">
                  {isRedeemed ? (
                    <span className="text-xs font-semibold text-blue-600 flex items-center gap-1">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Unlocked & Active</span>
                    </span>
                  ) : canAfford ? (
                    <button
                      onClick={() => setSelectedRewardToRedeem(reward)}
                      className="px-4 py-2 rounded-xl bg-blue-700 hover:bg-blue-800 text-white font-semibold text-xs transition"
                    >
                      Redeem with {reward.pointsCost} pts
                    </button>
                  ) : (
                    <span className="text-xs text-stone-400 font-medium">
                      Need {reward.pointsCost - points} more pts
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Redemption History */}
      <div className="space-y-4 pt-4 border-t border-stone-200 dark:border-stone-800">
        <h2 className="text-base font-bold text-stone-900 dark:text-stone-100">
          Redemption History
        </h2>

        <div className="divide-y divide-stone-100 dark:divide-stone-800 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl p-4">
          {redeemedList.map((item) => (
            <div key={item.id} className="py-3 px-2 flex items-center justify-between text-xs">
              <div>
                <span className="font-bold text-stone-900 dark:text-stone-100">
                  {isBn ? item.rewardNameBn : item.rewardName}
                </span>
                <span className="text-stone-400 block text-[11px]">
                  Redeemed on {item.redeemedAt} &bull; Spent {item.pointsSpent} pts
                </span>
              </div>
              {item.code && (
                <span className="font-mono text-xs font-bold text-blue-700 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/40 px-2.5 py-1 rounded-lg">
                  {item.code}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Confirmation Modal */}
      {selectedRewardToRedeem && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm"
        >
          <div className="bg-white dark:bg-stone-900 rounded-3xl p-6 sm:p-7 max-w-sm w-full space-y-4 shadow-xl border border-stone-200 dark:border-stone-800 text-center animate-in zoom-in-95">
            <h3 className="font-bold text-base text-stone-900 dark:text-stone-100">
              Confirm Redemption
            </h3>
            <p className="text-xs text-stone-500 leading-relaxed">
              Redeem <strong>{selectedRewardToRedeem.name}</strong> for {selectedRewardToRedeem.pointsCost} points?
            </p>
            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={() => setSelectedRewardToRedeem(null)}
                className="flex-1 py-2 rounded-xl border border-stone-300 text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmRedeem}
                className="flex-1 py-2 rounded-xl bg-blue-700 text-white text-xs font-semibold shadow-sm"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Celebration */}
      <Celebration
        show={celebrationData.show}
        title={celebrationData.title}
        subtitle={celebrationData.subtitle}
        onClose={() => setCelebrationData((c) => ({ ...c, show: false }))}
      />
    </div>
  );
};
