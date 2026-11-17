import React, { useState, useRef } from 'react';
import { Upload, Check, Camera } from 'lucide-react';
import avatars from '../../data/avatars.json';
import { useLanguage } from '../../context/LanguageContext';

interface AvatarPickerProps {
  selectedAvatar: string;
  customAvatarUrl?: string;
  onSelect: (avatarId: string, customUrl?: string) => void;
}

export const AvatarPicker: React.FC<AvatarPickerProps> = ({ selectedAvatar, customAvatarUrl, onSelect }) => {
  const { language } = useLanguage();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const isBn = language === 'bn';

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const url = event.target?.result as string;
        onSelect('custom', url);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 uppercase tracking-wider mb-2">
          {isBn ? 'শান্ত ও সুন্দর প্রোফাইল আইকন নির্বাচন করুন' : 'Choose a Friendly Illustrated Avatar'}
        </label>
        <p className="text-xs text-stone-500 mb-3">
          {isBn
            ? 'আসল ছবি দেওয়া বাধ্যতামূলক নয়। যেকোনো পছন্দের প্রতীক নির্বাচন করতে পারেন।'
            : 'A real photo is never required. Choose any peaceful symbol or upload your own.'}
        </p>
      </div>

      <div className="grid grid-cols-4 sm:grid-cols-8 gap-2.5">
        {avatars.map((av) => {
          const isSelected = selectedAvatar === av.id && !customAvatarUrl;
          return (
            <button
              key={av.id}
              type="button"
              onClick={() => onSelect(av.id)}
              className={`p-3 rounded-2xl border flex flex-col items-center justify-center text-xl transition transform hover:scale-105 relative ${
                av.color
              } ${isSelected ? 'ring-2 ring-blue-600 ring-offset-2 border-blue-500' : 'opacity-80 hover:opacity-100'}`}
              title={isBn ? av.nameBn : av.name}
            >
              <span>{av.emoji}</span>
              {isSelected && (
                <div className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-xs">
                  <Check className="w-2.5 h-2.5" />
                </div>
              )}
            </button>
          );
        })}
      </div>

      <div className="flex items-center gap-3 pt-2">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileUpload}
        />
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl border border-stone-300 dark:border-stone-700 text-stone-700 dark:text-stone-300 text-xs font-medium hover:bg-stone-50 dark:hover:bg-stone-800 transition"
        >
          <Camera className="w-3.5 h-3.5" />
          <span>{isBn ? 'অথবা নিজস্ব ছবি আপলোড করুন' : 'Or upload personal picture'}</span>
        </button>

        {customAvatarUrl && (
          <span className="text-xs text-blue-600 font-medium flex items-center gap-1">
            <Check className="w-3.5 h-3.5" />
            <span>{isBn ? 'নিজস্ব ছবি যুক্ত হয়েছে' : 'Custom picture selected'}</span>
          </span>
        )}
      </div>
    </div>
  );
};
