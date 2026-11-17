import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { useNotifications } from '../context/NotificationContext';
import { detectCrisis } from '../services/chat';
import { Users, Heart, MessageSquare, Send, ShieldAlert, Flag, Sparkles, Filter, AlertTriangle } from 'lucide-react';
import { GetHelpModal } from '../components/common/GetHelpModal';

interface Post {
  id: string;
  authorAlias: string;
  authorAvatar: string;
  streakDays: number;
  content: string;
  category: 'encouragement' | 'cravings' | 'milestones' | 'calm';
  likes: number;
  likedByMe: boolean;
  replies: {
    id: string;
    authorAlias: string;
    content: string;
    createdAt: string;
  }[];
  createdAt: string;
}

const INITIAL_POSTS: Post[] = [
  {
    id: 'post-1',
    authorAlias: 'RiverBreeze',
    authorAvatar: 'river',
    streakDays: 42,
    content: 'Hit 40 days today. When urges strike in the evening, drinking cold water and doing the 4-4-4 box breathing makes all the difference. Stay strong everyone.',
    category: 'milestones',
    likes: 18,
    likedByMe: false,
    replies: [
      {
        id: 'rep-1',
        authorAlias: 'CalmPebble',
        content: 'Huge congratulations! Box breathing has saved my evenings as well.',
        createdAt: new Date(Date.now() - 3600000).toISOString(),
      },
    ],
    createdAt: new Date(Date.now() - 7200000).toISOString(),
  },
  {
    id: 'post-2',
    authorAlias: 'MorningSun',
    authorAvatar: 'sun',
    streakDays: 14,
    content: 'Day 14. First full weekend without giving in. My sleep is finally getting peaceful again.',
    category: 'encouragement',
    likes: 24,
    likedByMe: true,
    replies: [],
    createdAt: new Date(Date.now() - 18000000).toISOString(),
  },
  {
    id: 'post-3',
    authorAlias: 'SilentLotus',
    authorAvatar: 'lotus',
    streakDays: 8,
    content: 'Had a strong urge after work today due to stress. Instead of reaching out for old habits, I took a 15-minute walk and listened to a guided audio here. The craving passed in 10 minutes.',
    category: 'cravings',
    likes: 12,
    likedByMe: false,
    replies: [],
    createdAt: new Date(Date.now() - 36000000).toISOString(),
  },
];

export const CommunityPage: React.FC = () => {
  const { user } = useAuth();
  const { language, formatLocalizedDate, toBanglaDigits } = useLanguage();
  const { addNotification } = useNotifications();

  const [posts, setPosts] = useState<Post[]>(INITIAL_POSTS);
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'encouragement' | 'cravings' | 'milestones' | 'calm'>('all');
  const [newContent, setNewContent] = useState('');
  const [postCategory, setPostCategory] = useState<'encouragement' | 'cravings' | 'milestones' | 'calm'>('encouragement');
  const [replyInputs, setReplyInputs] = useState<Record<string, string>>({});
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [flaggedNotice, setFlaggedNotice] = useState(false);

  const filteredPosts = posts.filter((p) => {
    if (selectedCategory === 'all') return true;
    return p.category === selectedCategory;
  });

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newContent.trim() || !user) return;

    // Safety check for crisis keywords
    if (detectCrisis(newContent)) {
      setShowHelpModal(true);
      return;
    }

    const newPost: Post = {
      id: 'post-' + Date.now(),
      authorAlias: user.nickname || 'KindTraveler',
      authorAvatar: user.avatar || 'sprout',
      streakDays: user.streakDays || 1,
      content: newContent.trim(),
      category: postCategory,
      likes: 0,
      likedByMe: false,
      replies: [],
      createdAt: new Date().toISOString(),
    };

    setPosts([newPost, ...posts]);
    setNewContent('');

    addNotification({
      category: 'motivation',
      title: 'Reflection Shared',
      titleBn: 'আপনার অনুভূতি শেয়ার করা হয়েছে',
      body: 'Thank you for supporting others in our anonymous circle.',
      bodyBn: 'আমাদের বেনামী গ্রুপে অন্যদের অনুপ্রেরণা দেওয়ার জন্য ধন্যবাদ।',
      link: '/community',
    });
  };

  const toggleLike = (postId: string) => {
    setPosts(
      posts.map((p) => {
        if (p.id === postId) {
          const liked = !p.likedByMe;
          return {
            ...p,
            likedByMe: liked,
            likes: liked ? p.likes + 1 : p.likes - 1,
          };
        }
        return p;
      })
    );
  };

  const handleAddReply = (postId: string) => {
    const text = replyInputs[postId]?.trim();
    if (!text || !user) return;

    if (detectCrisis(text)) {
      setShowHelpModal(true);
      return;
    }

    setPosts(
      posts.map((p) => {
        if (p.id === postId) {
          return {
            ...p,
            replies: [
              ...p.replies,
              {
                id: 'rep-' + Date.now(),
                authorAlias: user.nickname || 'KindTraveler',
                content: text,
                createdAt: new Date().toISOString(),
              },
            ],
          };
        }
        return p;
      })
    );

    setReplyInputs({ ...replyInputs, [postId]: '' });
  };

  const handleReportPost = () => {
    setFlaggedNotice(true);
    setTimeout(() => setFlaggedNotice(false), 4000);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-16">
      {/* Top Banner */}
      <div>
        <h1 className="text-2xl font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2.5">
          <Users className="w-6 h-6 text-blue-600" />
          {language === 'bn' ? 'সহমর্মিতা সার্কেল' : 'Compassion Circle'}
        </h1>
        <p className="text-sm text-stone-600 dark:text-stone-400 mt-1">
          {language === 'bn'
            ? 'সম্পূর্ণ বেনামী এবং নিরাপদ প্ল্যাটফর্ম। একে অপরকে উৎসাহিত করুন ও অভিজ্ঞতা ভাগ করুন।'
            : 'A 100% anonymous, safe space to share milestones and encourage fellow travelers.'}
        </p>
      </div>

      {flaggedNotice && (
        <div className="p-3 bg-stone-100 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-xl text-xs text-stone-700 dark:text-stone-300 flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0" />
          <span>
            {language === 'bn'
              ? 'রিপোর্ট গৃহীত হয়েছে। আমাদের টিম পর্যালোচনা করবে।'
              : 'Report submitted. Our moderation system will review this post.'}
          </span>
        </div>
      )}

      {/* Community Guidelines banner */}
      <div className="bg-blue-50/60 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900/40 rounded-2xl p-4 text-xs text-blue-900 dark:text-blue-300 flex items-start gap-3">
        <Sparkles className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
        <div>
          <span className="font-semibold">
            {language === 'bn' ? 'সার্কেল নিয়মাবলী:' : 'Circle Guidelines:'}
          </span>{' '}
          {language === 'bn'
            ? 'সহমর্মিতা প্রকাশ করুন, ব্যক্তিগত যোগাযোগের তথ্য শেয়ার করবেন না এবং কোনো ওষুধের প্রেসক্রিপশন প্রদান বা চাওয়া থেকে বিরত থাকুন।'
            : 'Be gentle and supportive. Never share personal contact numbers, real names, or give medical advice.'}
        </div>
      </div>

      {/* Share a thought input */}
      {user && (
        <form
          onSubmit={handleCreatePost}
          className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl p-4 shadow-xs space-y-3"
        >
          <div className="flex items-center gap-2 text-xs font-medium text-stone-600 dark:text-stone-400">
            <span>
              {language === 'bn' ? 'পোস্ট করছেন:' : 'Posting as:'}{' '}
              <strong className="text-stone-900 dark:text-stone-100">{user.nickname || 'Anonymous'}</strong>
            </span>
            <span className="text-stone-400">•</span>
            <span className="text-blue-600 dark:text-blue-400 font-semibold">
              {toBanglaDigits(user.streakDays || 1)} {language === 'bn' ? 'দিনের সুস্থতা' : 'days streak'}
            </span>
          </div>

          <textarea
            value={newContent}
            onChange={(e) => setNewContent(e.target.value)}
            rows={3}
            placeholder={
              language === 'bn'
                ? 'আজকের কোনো জয়, ভাবনা বা অনুপ্রেরণা ভাগ করুন...'
                : 'Share a gentle milestone, insight, or encouraging words...'
            }
            className="w-full text-sm p-3 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50/50 dark:bg-stone-800/50 text-stone-900 dark:text-stone-100 outline-hidden focus:ring-2 focus:ring-blue-500"
          />

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
            <div className="flex items-center gap-2 text-xs">
              <span className="text-stone-500">{language === 'bn' ? 'ক্যাটাগরি:' : 'Topic:'}</span>
              <select
                value={postCategory}
                onChange={(e) => setPostCategory(e.target.value as any)}
                className="bg-stone-100 dark:bg-stone-800 border-none rounded-lg text-xs font-medium px-2 py-1.5 text-stone-700 dark:text-stone-300 outline-hidden"
              >
                <option value="encouragement">{language === 'bn' ? 'অনুপ্রেরণা' : 'Encouragement'}</option>
                <option value="cravings">{language === 'bn' ? 'আবেগ নিয়ন্ত্রণ' : 'Overcoming Cravings'}</option>
                <option value="milestones">{language === 'bn' ? 'মাইলস্টোন উদযাপন' : 'Milestones'}</option>
                <option value="calm">{language === 'bn' ? 'শান্তি ও মননশীলতা' : 'Mindfulness & Calm'}</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={!newContent.trim()}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl flex items-center justify-center gap-1.5 transition-colors disabled:opacity-40 shadow-xs"
            >
              <Send className="w-3.5 h-3.5" />
              {language === 'bn' ? 'শেয়ার করুন' : 'Share Anonymously'}
            </button>
          </div>
        </form>
      )}

      {/* Topic Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
        {[
          { id: 'all', label: language === 'bn' ? 'সকল' : 'All Topics' },
          { id: 'encouragement', label: language === 'bn' ? 'অনুপ্রেরণা' : 'Encouragement' },
          { id: 'milestones', label: language === 'bn' ? 'মাইলস্টোন' : 'Milestones' },
          { id: 'cravings', label: language === 'bn' ? 'আবেগ নিয়ন্ত্রণ' : 'Craving Tools' },
          { id: 'calm', label: language === 'bn' ? 'শান্তি' : 'Calm Moments' },
        ].map((item) => (
          <button
            key={item.id}
            onClick={() => setSelectedCategory(item.id as any)}
            className={`px-3 py-1.5 rounded-xl whitespace-nowrap transition-colors ${
              selectedCategory === item.id
                ? 'bg-blue-600 text-white font-medium'
                : 'bg-white dark:bg-stone-800 text-stone-600 dark:text-stone-400 border border-stone-200 dark:border-stone-700 hover:bg-stone-50'
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      {/* Posts Stream */}
      <div className="space-y-4">
        {filteredPosts.map((post) => (
          <div
            key={post.id}
            className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl p-5 shadow-xs space-y-4"
          >
            {/* Post Author */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 flex items-center justify-center font-bold text-sm">
                  {post.authorAlias.slice(0, 2)}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-stone-900 dark:text-stone-100">
                      {post.authorAlias}
                    </span>
                    <span className="text-[11px] px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-800/40 font-medium">
                      {toBanglaDigits(post.streakDays)} {language === 'bn' ? 'দিন' : 'days'}
                    </span>
                  </div>
                  <span className="text-[11px] text-stone-400">
                    {formatLocalizedDate(post.createdAt)}
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={handleReportPost}
                className="text-stone-400 hover:text-stone-600 dark:hover:text-stone-300 p-1"
                title="Flag post"
              >
                <Flag className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Post Content */}
            <p className="text-sm text-stone-800 dark:text-stone-200 whitespace-pre-line leading-relaxed">
              {post.content}
            </p>

            {/* Actions: Like & Reply count */}
            <div className="flex items-center gap-4 pt-2 border-t border-stone-100 dark:border-stone-800/80 text-xs text-stone-500">
              <button
                type="button"
                onClick={() => toggleLike(post.id)}
                className={`flex items-center gap-1.5 font-medium transition-colors ${
                  post.likedByMe
                    ? 'text-rose-600 dark:text-rose-400 font-bold'
                    : 'hover:text-rose-600'
                }`}
              >
                <Heart
                  className={`w-4 h-4 ${post.likedByMe ? 'fill-rose-600 text-rose-600' : ''}`}
                />
                <span>{toBanglaDigits(post.likes)}</span>
              </button>

              <div className="flex items-center gap-1">
                <MessageSquare className="w-4 h-4" />
                <span>{toBanglaDigits(post.replies.length)}</span>
              </div>
            </div>

            {/* Existing Replies */}
            {post.replies.length > 0 && (
              <div className="space-y-2 pt-2">
                {post.replies.map((rep) => (
                  <div
                    key={rep.id}
                    className="p-3 rounded-xl bg-stone-50 dark:bg-stone-800/50 text-xs space-y-1"
                  >
                    <div className="flex items-center justify-between text-stone-500">
                      <span className="font-semibold text-stone-700 dark:text-stone-300">
                        {rep.authorAlias}
                      </span>
                      <span className="text-[10px]">{formatLocalizedDate(rep.createdAt)}</span>
                    </div>
                    <p className="text-stone-700 dark:text-stone-300">{rep.content}</p>
                  </div>
                ))}
              </div>
            )}

            {/* Reply Input */}
            {user && (
              <div className="flex gap-2 pt-1">
                <input
                  type="text"
                  value={replyInputs[post.id] || ''}
                  onChange={(e) =>
                    setReplyInputs({ ...replyInputs, [post.id]: e.target.value })
                  }
                  placeholder={
                    language === 'bn' ? 'উৎসাহমূলক উত্তর লিখুন...' : 'Write kind reply...'
                  }
                  className="flex-1 text-xs px-3 py-2 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50/50 dark:bg-stone-800/50 text-stone-900 dark:text-stone-100 outline-hidden focus:ring-1 focus:ring-blue-500"
                />
                <button
                  type="button"
                  onClick={() => handleAddReply(post.id)}
                  disabled={!replyInputs[post.id]?.trim()}
                  className="px-3 py-2 bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-300 rounded-xl text-xs font-semibold disabled:opacity-40"
                >
                  {language === 'bn' ? 'উত্তর' : 'Reply'}
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      <GetHelpModal isOpen={showHelpModal} onClose={() => setShowHelpModal(false)} />
    </div>
  );
};
