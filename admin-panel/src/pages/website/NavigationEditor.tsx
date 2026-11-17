import React from 'react';
import { Plus, Trash2, ArrowUp, ArrowDown } from 'lucide-react';
import { useCms } from '@/context/CmsContext';
import { useAdminAuth } from '@/context/AdminAuthContext';
import { PublishToolbar } from '@/components/cms/PublishToolbar';
import { BilingualField } from '@/components/cms/BilingualField';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Switch } from '@/components/ui/Switch';
import { NavigationItem } from '@/types/cms';

export const NavigationEditor: React.FC = () => {
  const { sections, updateDraft } = useCms();
  const { hasPermission } = useAdminAuth();
  const canEdit = hasPermission('cms:edit');
  const draft = sections.navigation.draft;

  const sortedItems = [...draft.items].sort((a, b) => a.order - b.order);

  const updateItem = (id: string, updates: Partial<NavigationItem>) => {
    updateDraft('navigation', (prev) => ({
      ...prev,
      items: prev.items.map((item) => (item.id === id ? { ...item, ...updates } : item)),
    }));
  };

  const addItem = () => {
    const maxOrder = sortedItems.length > 0 ? Math.max(...sortedItems.map((i) => i.order)) : 0;
    const nextItem: NavigationItem = {
      id: `nav-${Date.now()}`,
      labelEn: 'New Menu Link',
      labelBn: 'নতুন মেনু',
      url: '/about',
      order: maxOrder + 1,
      enabled: true,
      openInNewTab: false,
    };
    updateDraft('navigation', (prev) => ({ ...prev, items: [...prev.items, nextItem] }));
  };

  const moveItem = (index: number, dir: -1 | 1) => {
    const targetIdx = index + dir;
    if (targetIdx < 0 || targetIdx >= sortedItems.length) return;
    const reordered = [...sortedItems];
    [reordered[index], reordered[targetIdx]] = [reordered[targetIdx], reordered[index]];
    const normalized = reordered.map((item, i) => ({ ...item, order: i + 1 }));
    updateDraft('navigation', (prev) => ({ ...prev, items: normalized }));
  };

  const removeItem = (id: string) => {
    updateDraft('navigation', (prev) => ({
      ...prev,
      items: prev.items.filter((item) => item.id !== id).map((item, i) => ({ ...item, order: i + 1 })),
    }));
  };

  return (
    <div className="space-y-6">
      <PublishToolbar
        section="navigation"
        title="Navigation Menu Editor"
        description="Manage Pathway's top announcement bar and public header links across English and Bangla."
      />

      <Card>
        <CardHeader>
          <CardTitle>Top Announcement Bar</CardTitle>
          <Switch
            checked={draft.showAnnouncementBar}
            disabled={!canEdit}
            onChange={(val) => updateDraft('navigation', (prev) => ({ ...prev, showAnnouncementBar: val }))}
            label="Show announcement bar"
          />
        </CardHeader>
        <CardContent>
          <BilingualField
            label="Announcement Text"
            valueEn={draft.announcementEn}
            valueBn={draft.announcementBn}
            onChangeEn={(v) => updateDraft('navigation', (prev) => ({ ...prev, announcementEn: v }))}
            onChangeBn={(v) => updateDraft('navigation', (prev) => ({ ...prev, announcementBn: v }))}
            disabled={!canEdit}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Header Navigation Links ({sortedItems.length})</CardTitle>
          {canEdit && (
            <Button size="sm" onClick={addItem}>
              <Plus className="w-4 h-4" />
              <span>Add Menu Link</span>
            </Button>
          )}
        </CardHeader>
        <CardContent className="space-y-4">
          {sortedItems.map((item, idx) => (
            <div key={item.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="text-xs font-bold text-slate-800">
                  #{idx + 1} • {item.labelEn}
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1.5 text-xs text-slate-600">
                    <span>Enabled</span>
                    <Switch
                      checked={item.enabled}
                      disabled={!canEdit}
                      onChange={(val) => updateItem(item.id, { enabled: val })}
                    />
                  </div>
                  {canEdit && (
                    <div className="flex items-center gap-1">
                      <Button size="sm" variant="outline" disabled={idx === 0} onClick={() => moveItem(idx, -1)}>
                        <ArrowUp className="w-3.5 h-3.5" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        disabled={idx === sortedItems.length - 1}
                        onClick={() => moveItem(idx, 1)}
                      >
                        <ArrowDown className="w-3.5 h-3.5" />
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => removeItem(item.id)}>
                        <Trash2 className="w-3.5 h-3.5 text-rose-600" />
                      </Button>
                    </div>
                  )}
                </div>
              </div>

              <BilingualField
                label="Menu Label"
                valueEn={item.labelEn}
                valueBn={item.labelBn}
                onChangeEn={(v) => updateItem(item.id, { labelEn: v })}
                onChangeBn={(v) => updateItem(item.id, { labelBn: v })}
                disabled={!canEdit}
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-center">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Destination URL / Path</label>
                  <Input
                    value={item.url}
                    disabled={!canEdit}
                    onChange={(e) => updateItem(item.id, { url: e.target.value })}
                  />
                </div>
                <div className="flex items-center justify-between pt-5">
                  <span className="text-xs text-slate-600">Open in new browser tab</span>
                  <Switch
                    checked={item.openInNewTab}
                    disabled={!canEdit}
                    onChange={(val) => updateItem(item.id, { openInNewTab: val })}
                  />
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};
