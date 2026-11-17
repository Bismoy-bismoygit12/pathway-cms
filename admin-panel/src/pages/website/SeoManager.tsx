import React, { useState } from 'react';
import { Image as ImageIcon, Globe } from 'lucide-react';
import { useCms } from '@/context/CmsContext';
import { useAdminAuth } from '@/context/AdminAuthContext';
import { PublishToolbar } from '@/components/cms/PublishToolbar';
import { MediaPickerModal } from '@/components/cms/MediaPickerModal';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Input, Textarea } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { PageSeoEntry } from '@/types/cms';

export const SeoManager: React.FC = () => {
  const { sections, updateDraft } = useCms();
  const { hasPermission } = useAdminAuth();
  const canEdit = hasPermission('cms:edit');
  const draft = sections.seo.draft;

  const [selectedRoute, setSelectedRoute] = useState(draft.pages[0]?.route || '/');
  const [pickerTarget, setPickerTarget] = useState<'global' | 'page' | null>(null);

  const patch = (updates: Partial<typeof draft>) => {
    updateDraft('seo', (prev) => ({ ...prev, ...updates }));
  };

  const activePage = draft.pages.find((p) => p.route === selectedRoute) || draft.pages[0];

  const updatePage = (route: string, updates: Partial<PageSeoEntry>) => {
    patch({
      pages: draft.pages.map((p) => (p.route === route ? { ...p, ...updates } : p)),
    });
  };

  return (
    <div className="space-y-6">
      <PublishToolbar
        section="seo"
        title="Website SEO & Metadata"
        description="Configure global search titles, OpenGraph social cards, canonical URLs, and per-page SEO tags."
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <Card className="lg:col-span-7">
          <CardHeader>
            <CardTitle>Global Site Defaults</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Default Global Title</label>
                <Input
                  value={draft.globalTitle}
                  disabled={!canEdit}
                  onChange={(e) => patch({ globalTitle: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Title Template</label>
                <Input
                  value={draft.globalTitleTemplate}
                  disabled={!canEdit}
                  onChange={(e) => patch({ globalTitleTemplate: e.target.value })}
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Global Meta Description</label>
              <Textarea
                rows={2}
                value={draft.globalMetaDescription}
                disabled={!canEdit}
                onChange={(e) => patch({ globalMetaDescription: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Default OpenGraph Title</label>
                <Input
                  value={draft.defaultOgTitle}
                  disabled={!canEdit}
                  onChange={(e) => patch({ defaultOgTitle: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Canonical Base URL</label>
                <Input
                  value={draft.siteCanonicalBaseUrl}
                  disabled={!canEdit}
                  onChange={(e) => patch({ siteCanonicalBaseUrl: e.target.value })}
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Default OG Image URL</label>
              <div className="flex gap-2">
                <Input
                  value={draft.defaultOgImage}
                  disabled={!canEdit}
                  onChange={(e) => patch({ defaultOgImage: e.target.value })}
                />
                {canEdit && (
                  <Button variant="outline" onClick={() => setPickerTarget('global')}>
                    <ImageIcon className="w-4 h-4" />
                    <span>Pick</span>
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Live Search & Social Card Preview */}
        <Card className="lg:col-span-5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="w-4 h-4 text-blue-700" />
              <span>Search & Social Preview</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {activePage && (
              <>
                <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/70 space-y-1">
                  <div className="text-[11px] text-emerald-700 truncate">{activePage.canonicalUrl}</div>
                  <div className="text-sm font-semibold text-blue-700 leading-snug">{activePage.title}</div>
                  <p className="text-xs text-slate-600 line-clamp-2">{activePage.description}</p>
                </div>

                <div className="rounded-xl border border-slate-200 overflow-hidden bg-white">
                  <img src={activePage.ogImage} alt={activePage.ogTitle} className="w-full h-36 object-cover" />
                  <div className="p-3 bg-slate-50 border-t border-slate-200 space-y-0.5">
                    <div className="text-[10px] uppercase text-slate-400">OpenGraph Social Card</div>
                    <div className="text-xs font-bold text-slate-900">{activePage.ogTitle}</div>
                    <div className="text-[11px] text-slate-500 line-clamp-1">{activePage.description}</div>
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Per-Page SEO Editor */}
      <Card>
        <CardHeader className="flex-col sm:flex-row sm:items-center justify-between gap-3">
          <CardTitle>Per-Page Metadata Settings</CardTitle>
          <div className="flex flex-wrap gap-1.5">
            {draft.pages.map((p) => (
              <button
                key={p.route}
                type="button"
                onClick={() => setSelectedRoute(p.route)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer ${
                  selectedRoute === p.route
                    ? 'bg-blue-700 text-white'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {p.pageName} ({p.route})
              </button>
            ))}
          </div>
        </CardHeader>
        <CardContent>
          {activePage && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Page Title ({activePage.title.length}/65 chars)
                  </label>
                  <Input
                    value={activePage.title}
                    disabled={!canEdit}
                    onChange={(e) => updatePage(activePage.route, { title: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Canonical URL</label>
                  <Input
                    value={activePage.canonicalUrl}
                    disabled={!canEdit}
                    onChange={(e) => updatePage(activePage.route, { canonicalUrl: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Meta Description ({activePage.description.length}/160 chars)
                </label>
                <Textarea
                  rows={2}
                  value={activePage.description}
                  disabled={!canEdit}
                  onChange={(e) => updatePage(activePage.route, { description: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">OG Share Title</label>
                  <Input
                    value={activePage.ogTitle}
                    disabled={!canEdit}
                    onChange={(e) => updatePage(activePage.route, { ogTitle: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">OG Image URL</label>
                  <div className="flex gap-2">
                    <Input
                      value={activePage.ogImage}
                      disabled={!canEdit}
                      onChange={(e) => updatePage(activePage.route, { ogImage: e.target.value })}
                    />
                    {canEdit && (
                      <Button variant="outline" onClick={() => setPickerTarget('page')}>
                        <ImageIcon className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <MediaPickerModal
        isOpen={Boolean(pickerTarget)}
        onClose={() => setPickerTarget(null)}
        currentUrl={pickerTarget === 'global' ? draft.defaultOgImage : activePage?.ogImage}
        onSelect={(url) => {
          if (pickerTarget === 'global') patch({ defaultOgImage: url });
          else if (pickerTarget === 'page' && activePage) updatePage(activePage.route, { ogImage: url });
        }}
      />
    </div>
  );
};
