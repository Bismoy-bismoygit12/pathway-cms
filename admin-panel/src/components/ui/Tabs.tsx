import React from 'react';
import { cn } from '@/lib/utils';

export interface TabOption {
  id: string;
  label: string;
  count?: number;
}

interface TabsProps {
  tabs: TabOption[];
  activeTab: string;
  onChange: (id: string) => void;
  className?: string;
}

export const Tabs: React.FC<TabsProps> = ({ tabs, activeTab, onChange, className }) => (
  <div className={cn('inline-flex flex-wrap items-center gap-1 p-1 bg-slate-100 rounded-xl border border-slate-200/80', className)}>
    {tabs.map((tab) => {
      const active = tab.id === activeTab;
      return (
        <button
          key={tab.id}
          type="button"
          onClick={() => onChange(tab.id)}
          className={cn(
            'px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 cursor-pointer',
            active ? 'bg-white text-blue-700 shadow-xs font-semibold' : 'text-slate-600 hover:text-slate-900'
          )}
        >
          <span>{tab.label}</span>
          {tab.count !== undefined && (
            <span
              className={cn(
                'px-1.5 py-0.2 rounded-full text-[10px]',
                active ? 'bg-blue-50 text-blue-700' : 'bg-slate-200 text-slate-600'
              )}
            >
              {tab.count}
            </span>
          )}
        </button>
      );
    })}
  </div>
);
