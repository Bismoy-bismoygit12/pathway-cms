import React, { useState } from 'react';
import { Check, Search, Image as ImageIcon } from 'lucide-react';
import { useCms } from '@/context/CmsContext';
import { MediaCategory } from '@/types/cms';
import { Modal } from '@/components/ui/Modal';
import { Input, Select } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';

interface MediaPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (url: string) => void;
  currentUrl?: string;
}

export const MediaPickerModal: React.FC<MediaPickerModalProps> = ({
  isOpen,
  onClose,
  onSelect,
  currentUrl,
}) => {
  const { media } = useCms();
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState<MediaCategory | 'all'>('all');
  const [customUrl, setCustomUrl] = useState('');

  const filtered = media.filter((m) => {
    const matchesCat = category === 'all' || m.category === category;
    const q = search.trim().toLowerCase();
    const matchesSearch = !q || m.title.toLowerCase().includes(q) || m.altTextEn.toLowerCase().includes(q);
    return matchesCat && matchesSearch;
  });

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Select Media Asset"
      subtitle="Choose an approved cloud asset from Media Library or provide an external image URL"
      size="xl"
      footer={
        <Button variant="outline" onClick={onClose}>
          Close
        </Button>
      }
    >
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search media library..."
              className="pl-9"
            />
          </div>
          <Select
            value={category}
            onChange={(e) => setCategory(e.target.value as MediaCategory | 'all')}
            className="sm:w-44"
          >
            <option value="all">All Categories</option>
            <option value="hero">Hero & Carousel</option>
            <option value="articles">Articles</option>
            <option value="doctors">Doctors</option>
            <option value="about">About Page</option>
            <option value="seo">SEO / OG Images</option>
            <option value="general">General</option>
          </Select>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {filtered.map((item) => {
            const selected = item.url === currentUrl;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  onSelect(item.url);
                  onClose();
                }}
                className={`text-left rounded-xl border overflow-hidden transition cursor-pointer ${
                  selected ? 'border-blue-600 ring-2 ring-blue-600/20' : 'border-slate-200 hover:border-blue-400'
                }`}
              >
                <div className="aspect-video bg-slate-100 relative overflow-hidden">
                  <img src={item.url} alt={item.altTextEn} className="w-full h-full object-cover" />
                  {selected && (
                    <span className="absolute top-2 right-2 w-6 h-6 rounded-full bg-blue-700 text-white flex items-center justify-center shadow">
                      <Check className="w-3.5 h-3.5" />
                    </span>
                  )}
                </div>
                <div className="p-2.5 space-y-1">
                  <div className="text-xs font-semibold text-slate-900 truncate">{item.title}</div>
                  <div className="flex items-center justify-between">
                    <Badge variant="slate">{item.category}</Badge>
                    <span className="text-[10px] text-slate-400">{item.dimensions}</span>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        <div className="pt-3 border-t border-slate-200 flex flex-col sm:flex-row gap-2 items-stretch sm:items-end">
          <div className="flex-1">
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Or Paste Direct Cloud / CDN Image URL
            </label>
            <Input
              value={customUrl}
              onChange={(e) => setCustomUrl(e.target.value)}
              placeholder="https://cdn.pathway.health/assets/..."
            />
          </div>
          <Button
            variant="teal"
            disabled={!customUrl.trim()}
            onClick={() => {
              onSelect(customUrl.trim());
              setCustomUrl('');
              onClose();
            }}
          >
            <ImageIcon className="w-4 h-4" />
            <span>Use Custom URL</span>
          </Button>
        </div>
      </div>
    </Modal>
  );
};
