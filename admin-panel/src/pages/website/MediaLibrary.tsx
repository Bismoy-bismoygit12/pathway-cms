import React, { useState } from 'react';
import { Plus, Search, Trash2, Edit3, Copy, Cloud, Upload } from 'lucide-react';
import { useCms } from '@/context/CmsContext';
import { mediaService } from '@/services/mediaService';
import { useToast } from '@/components/ui/Toast';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Input, Select } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { MediaCategory, MediaItem } from '@/types/cms';
import { formatDate } from '@/lib/utils';

export const MediaLibrary: React.FC = () => {
  const { media, refreshMedia } = useCms();
  const { showToast } = useToast();

  const [category, setCategory] = useState<MediaCategory | 'all'>('all');
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<MediaItem | null>(null);

  // Form state for create/edit
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');
  const [altTextEn, setAltTextEn] = useState('');
  const [altTextBn, setAltTextBn] = useState('');
  const [assetCategory, setAssetCategory] = useState<MediaCategory>('general');
  const [storageProvider, setStorageProvider] = useState<MediaItem['storageProvider']>('s3_compatible');
  const [dimensions, setDimensions] = useState('1200x800');
  const [fileSize, setFileSize] = useState('450 KB');

  const filtered = media.filter((m) => {
    const matchesCat = category === 'all' || m.category === category;
    const q = search.trim().toLowerCase();
    const matchesSearch =
      !q ||
      m.title.toLowerCase().includes(q) ||
      m.altTextEn.toLowerCase().includes(q) ||
      m.altTextBn.toLowerCase().includes(q);
    return matchesCat && matchesSearch;
  });

  const openCreate = () => {
    setEditing(null);
    setTitle('');
    setUrl('');
    setAltTextEn('');
    setAltTextBn('');
    setAssetCategory('general');
    setStorageProvider('s3_compatible');
    setDimensions('1200x800');
    setFileSize('420 KB');
    setModalOpen(true);
  };

  const openEdit = (item: MediaItem) => {
    setEditing(item);
    setTitle(item.title);
    setUrl(item.url);
    setAltTextEn(item.altTextEn);
    setAltTextBn(item.altTextBn);
    setAssetCategory(item.category);
    setStorageProvider(item.storageProvider);
    setDimensions(item.dimensions);
    setFileSize(item.fileSize);
    setModalOpen(true);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const objectUrl = URL.createObjectURL(file);
    setTitle(title || file.name.replace(/\.[^.]+$/, ''));
    setUrl(objectUrl);
    setFileSize(`${Math.max(1, Math.round(file.size / 1024))} KB`);
    showToast('Local preview selected. In production, backend signs S3/Cloudinary upload.', 'info');
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !url.trim()) {
      showToast('Asset title and image URL are required.', 'error');
      return;
    }

    if (editing) {
      await mediaService.updateAsset(editing.id, {
        title,
        url,
        altTextEn,
        altTextBn,
        category: assetCategory,
        storageProvider,
        dimensions,
        fileSize,
      });
      showToast('Media asset metadata updated.');
    } else {
      await mediaService.createAsset({
        title,
        url,
        altTextEn,
        altTextBn,
        category: assetCategory,
        storageProvider,
        dimensions,
        fileSize,
        usedIn: [],
      });
      showToast('Media asset registered in cloud metadata library.');
    }
    await refreshMedia();
    setModalOpen(false);
  };

  const handleDelete = async (item: MediaItem) => {
    await mediaService.deleteAsset(item.id);
    await refreshMedia();
    showToast(`Deleted "${item.title}" from media library.`, 'info');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Media Library</h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Cloud-storage-ready media registry (S3 / Cloudinary URLs & bilingual alt text — zero binary blobs in MySQL).
          </p>
        </div>
        <Button size="sm" onClick={openCreate}>
          <Plus className="w-4 h-4" />
          <span>Upload / Register Asset</span>
        </Button>
      </div>

      <Card>
        <CardHeader className="flex-col sm:flex-row sm:items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search title or alt text..."
              className="pl-9"
            />
          </div>
          <Select
            value={category}
            onChange={(e) => setCategory(e.target.value as MediaCategory | 'all')}
            className="w-full sm:w-48"
          >
            <option value="all">All Categories</option>
            <option value="hero">Hero & Carousel</option>
            <option value="articles">Articles</option>
            <option value="doctors">Doctors</option>
            <option value="about">About Page</option>
            <option value="seo">SEO / OG Cards</option>
            <option value="general">General</option>
          </Select>
        </CardHeader>

        <CardContent className="p-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((item) => (
              <div
                key={item.id}
                className="rounded-xl border border-slate-200 bg-white overflow-hidden flex flex-col justify-between"
              >
                <div>
                  <div className="aspect-video bg-slate-100 relative overflow-hidden">
                    <img src={item.url} alt={item.altTextEn} className="w-full h-full object-cover" />
                    <div className="absolute top-2 left-2">
                      <Badge variant="blue">{item.category}</Badge>
                    </div>
                  </div>
                  <div className="p-4 space-y-1.5">
                    <div className="font-semibold text-sm text-slate-900 truncate">{item.title}</div>
                    <p className="text-[11px] text-slate-500 line-clamp-2">{item.altTextEn}</p>
                    <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1">
                      <span className="inline-flex items-center gap-1">
                        <Cloud className="w-3 h-3 text-teal-600" />
                        {item.storageProvider}
                      </span>
                      <span>
                        {item.dimensions} • {item.fileSize}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="px-4 py-3 border-t border-slate-100 flex items-center justify-between gap-2">
                  <span className="text-[10px] text-slate-400">{formatDate(item.uploadedAt)}</span>
                  <div className="flex items-center gap-1">
                    <Button
                      size="sm"
                      variant="outline"
                      title="Copy Image URL"
                      onClick={() => {
                        navigator.clipboard?.writeText(item.url);
                        showToast('Image URL copied to clipboard.');
                      }}
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => openEdit(item)}>
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>Edit</span>
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => handleDelete(item)}>
                      <Trash2 className="w-3.5 h-3.5 text-rose-600" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Upload / Edit Asset Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing ? `Edit Media: ${editing.title}` : 'Upload / Register Media Asset'}
        subtitle="Files upload to S3-compatible or Cloudinary object storage; MySQL stores URL & metadata."
        size="lg"
        footer={
          <>
            <Button variant="outline" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave}>{editing ? 'Save Metadata' : 'Add to Library'}</Button>
          </>
        }
      >
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">Upload File (Demo Local Preview)</label>
            <label className="flex items-center justify-center gap-2 p-4 border-2 border-dashed border-slate-300 rounded-xl hover:border-blue-400 cursor-pointer bg-slate-50 text-xs text-slate-600">
              <Upload className="w-4 h-4 text-blue-600" />
              <span>Choose image file or paste Cloud CDN URL below</span>
              <input type="file" accept="image/*" className="hidden" onChange={handleFileSelect} />
            </label>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Asset Title</label>
              <Input value={title} onChange={(e) => setTitle(e.target.value)} required />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Category</label>
              <Select
                value={assetCategory}
                onChange={(e) => setAssetCategory(e.target.value as MediaCategory)}
                className="w-full"
              >
                <option value="hero">Hero & Carousel</option>
                <option value="articles">Articles</option>
                <option value="doctors">Doctors</option>
                <option value="about">About Page</option>
                <option value="seo">SEO / OG Cards</option>
                <option value="general">General</option>
              </Select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">Cloud Asset URL</label>
            <Input
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://cdn.pathway.health/..."
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Alt Text (English)</label>
              <Input value={altTextEn} onChange={(e) => setAltTextEn(e.target.value)} />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Alt Text (বাংলা)</label>
              <Input value={altTextBn} onChange={(e) => setAltTextBn(e.target.value)} className="font-bn" />
            </div>
          </div>
        </form>
      </Modal>
    </div>
  );
};
