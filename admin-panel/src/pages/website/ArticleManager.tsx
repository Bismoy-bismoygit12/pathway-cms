import React, { useState } from 'react';
import { Plus, Search, Edit3, Trash2, Image as ImageIcon, CalendarClock } from 'lucide-react';
import { useCms } from '@/context/CmsContext';
import { useAdminAuth } from '@/context/AdminAuthContext';
import { useToast } from '@/components/ui/Toast';
import { PublishToolbar } from '@/components/cms/PublishToolbar';
import { BilingualField } from '@/components/cms/BilingualField';
import { MediaPickerModal } from '@/components/cms/MediaPickerModal';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Input, Select } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { Switch } from '@/components/ui/Switch';
import { ArticleItem, ArticleStatus } from '@/types/cms';
import { formatDate } from '@/lib/utils';

export const ArticleManager: React.FC = () => {
  const { sections, updateDraft } = useCms();
  const { hasPermission } = useAdminAuth();
  const { showToast } = useToast();
  const canEdit = hasPermission('cms:edit');

  const articles = sections.articles.draft;
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<ArticleStatus | 'all'>('all');
  const [editing, setEditing] = useState<ArticleItem | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [pickerOpen, setPickerOpen] = useState(false);

  const filtered = articles.filter((a) => {
    const matchesStatus = statusFilter === 'all' || a.status === statusFilter;
    const q = search.trim().toLowerCase();
    const matchesSearch =
      !q ||
      a.titleEn.toLowerCase().includes(q) ||
      a.category.toLowerCase().includes(q) ||
      a.tags.some((t) => t.toLowerCase().includes(q));
    return matchesStatus && matchesSearch;
  });

  const openCreateModal = () => {
    setIsNew(true);
    setEditing({
      id: `art-${Date.now()}`,
      slug: `new-guide-${Date.now().toString().slice(-4)}`,
      titleEn: '',
      titleBn: '',
      category: 'Coping Tools',
      categoryBn: 'মানসিক কৌশল',
      readTimeEn: '4 min read',
      readTimeBn: '৪ মিনিট পড়া',
      tags: ['Recovery', 'Mindfulness'],
      featuredImageUrl: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&auto=format&fit=crop',
      summaryEn: '',
      summaryBn: '',
      contentEn: '',
      contentBn: '',
      audioPlaceholder: false,
      status: 'draft',
      updatedAt: new Date().toISOString(),
    });
  };

  const handleSaveArticle = () => {
    if (!editing || !editing.titleEn.trim()) {
      showToast('English article title is required.', 'error');
      return;
    }
    const normalized: ArticleItem = {
      ...editing,
      slug:
        editing.slug.trim() ||
        editing.titleEn
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)/g, ''),
      updatedAt: new Date().toISOString(),
      publishedAt: editing.status === 'published' ? editing.publishedAt || new Date().toISOString() : editing.publishedAt,
    };

    if (isNew) {
      updateDraft('articles', (prev) => [normalized, ...prev]);
      showToast('Article added to CMS draft.');
    } else {
      updateDraft('articles', (prev) => prev.map((a) => (a.id === normalized.id ? normalized : a)));
      showToast('Article updated in CMS draft.');
    }
    setEditing(null);
  };

  const handleDelete = (id: string) => {
    updateDraft('articles', (prev) => prev.filter((a) => a.id !== id));
    showToast('Article removed from draft.', 'info');
  };

  return (
    <div className="space-y-6">
      <PublishToolbar
        section="articles"
        title="Blog & Article Management"
        description="Create, edit, categorize, tag, schedule, and publish guides for the Pathway Educational Library."
      />

      <Card>
        <CardHeader className="flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex flex-col sm:flex-row gap-2 flex-1 w-full">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search title, category, or tag..."
                className="pl-9"
              />
            </div>
            <Select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as ArticleStatus | 'all')}
              className="sm:w-40"
            >
              <option value="all">All Statuses</option>
              <option value="published">Published</option>
              <option value="draft">Draft</option>
              <option value="scheduled">Scheduled</option>
            </Select>
          </div>

          {canEdit && (
            <Button size="sm" onClick={openCreateModal}>
              <Plus className="w-4 h-4" />
              <span>New Article</span>
            </Button>
          )}
        </CardHeader>

        <CardContent className="p-5">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {filtered.map((art) => (
              <div
                key={art.id}
                className="rounded-xl border border-slate-200 bg-white overflow-hidden flex flex-col justify-between"
              >
                <div>
                  <div className="aspect-video bg-slate-100 relative overflow-hidden">
                    <img src={art.featuredImageUrl} alt={art.titleEn} className="w-full h-full object-cover" />
                    <div className="absolute top-2.5 right-2.5">
                      <Badge
                        variant={
                          art.status === 'published'
                            ? 'emerald'
                            : art.status === 'scheduled'
                            ? 'blue'
                            : 'amber'
                        }
                      >
                        {art.status}
                      </Badge>
                    </div>
                  </div>
                  <div className="p-4 space-y-2">
                    <div className="flex items-center justify-between text-[11px] text-slate-500">
                      <span className="font-semibold text-blue-700">{art.category}</span>
                      <span>{art.readTimeEn}</span>
                    </div>
                    <h3 className="font-bold text-sm text-slate-900 line-clamp-2">{art.titleEn}</h3>
                    <p className="text-xs text-slate-500 line-clamp-2">{art.summaryEn}</p>
                    <div className="flex flex-wrap gap-1 pt-1">
                      {art.tags.map((t) => (
                        <Badge key={t} variant="slate">
                          {t}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="px-4 py-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                  <span>Updated {formatDate(art.updatedAt)}</span>
                  {canEdit && (
                    <div className="flex items-center gap-1">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setIsNew(false);
                          setEditing(structuredClone(art));
                        }}
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        <span>Edit</span>
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => handleDelete(art.id)}>
                        <Trash2 className="w-3.5 h-3.5 text-rose-600" />
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="py-12 text-center text-xs text-slate-500">
              No articles match your filters.
            </div>
          )}
        </CardContent>
      </Card>

      {/* Create / Edit Article Modal */}
      <Modal
        isOpen={Boolean(editing)}
        onClose={() => setEditing(null)}
        title={isNew ? 'Create Educational Article' : `Edit: ${editing?.titleEn}`}
        subtitle="Changes are saved to the CMS Draft until you click Publish Live in the toolbar."
        size="xl"
        footer={
          <>
            <Button variant="outline" onClick={() => setEditing(null)}>
              Cancel
            </Button>
            <Button onClick={handleSaveArticle}>Save Article to Draft</Button>
          </>
        }
      >
        {editing && (
          <div className="space-y-4">
            <BilingualField
              label="Article Title"
              valueEn={editing.titleEn}
              valueBn={editing.titleBn}
              onChangeEn={(v) => setEditing({ ...editing, titleEn: v })}
              onChangeBn={(v) => setEditing({ ...editing, titleBn: v })}
            />

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">URL Slug</label>
                <Input
                  value={editing.slug}
                  onChange={(e) => setEditing({ ...editing, slug: e.target.value })}
                  placeholder="urge-surfing-guide"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Publication Status</label>
                <Select
                  value={editing.status}
                  onChange={(e) => setEditing({ ...editing, status: e.target.value as ArticleStatus })}
                  className="w-full"
                >
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                  <option value="scheduled">Scheduled</option>
                </Select>
              </div>
              {editing.status === 'scheduled' && (
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1 flex items-center gap-1">
                    <CalendarClock className="w-3.5 h-3.5" />
                    <span>Schedule Date</span>
                  </label>
                  <Input
                    type="datetime-local"
                    value={editing.scheduledAt?.slice(0, 16) || ''}
                    onChange={(e) => setEditing({ ...editing, scheduledAt: e.target.value })}
                  />
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <BilingualField
                label="Category"
                valueEn={editing.category}
                valueBn={editing.categoryBn}
                onChangeEn={(v) => setEditing({ ...editing, category: v })}
                onChangeBn={(v) => setEditing({ ...editing, categoryBn: v })}
              />
              <BilingualField
                label="Estimated Read Time"
                valueEn={editing.readTimeEn}
                valueBn={editing.readTimeBn}
                onChangeEn={(v) => setEditing({ ...editing, readTimeEn: v })}
                onChangeBn={(v) => setEditing({ ...editing, readTimeBn: v })}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-end">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Tags (comma separated)</label>
                <Input
                  value={editing.tags.join(', ')}
                  onChange={(e) =>
                    setEditing({
                      ...editing,
                      tags: e.target.value
                        .split(',')
                        .map((t) => t.trim())
                        .filter(Boolean),
                    })
                  }
                />
              </div>
              <div className="flex items-center justify-between p-2.5 rounded-lg border border-slate-200">
                <span className="text-xs font-medium text-slate-700">Include Guided Audio Badge</span>
                <Switch
                  checked={editing.audioPlaceholder}
                  onChange={(val) => setEditing({ ...editing, audioPlaceholder: val })}
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Featured Image URL</label>
              <div className="flex gap-2">
                <Input
                  value={editing.featuredImageUrl}
                  onChange={(e) => setEditing({ ...editing, featuredImageUrl: e.target.value })}
                />
                <Button variant="outline" type="button" onClick={() => setPickerOpen(true)}>
                  <ImageIcon className="w-4 h-4" />
                  <span>Media</span>
                </Button>
              </div>
            </div>

            <BilingualField
              label="Short Summary"
              valueEn={editing.summaryEn}
              valueBn={editing.summaryBn}
              onChangeEn={(v) => setEditing({ ...editing, summaryEn: v })}
              onChangeBn={(v) => setEditing({ ...editing, summaryBn: v })}
              multiline
              rows={2}
            />

            <BilingualField
              label="Full Article Body (Markdown supported)"
              valueEn={editing.contentEn}
              valueBn={editing.contentBn}
              onChangeEn={(v) => setEditing({ ...editing, contentEn: v })}
              onChangeBn={(v) => setEditing({ ...editing, contentBn: v })}
              multiline
              rows={5}
            />
          </div>
        )}
      </Modal>

      <MediaPickerModal
        isOpen={pickerOpen}
        onClose={() => setPickerOpen(false)}
        currentUrl={editing?.featuredImageUrl}
        onSelect={(url) => editing && setEditing({ ...editing, featuredImageUrl: url })}
      />
    </div>
  );
};
