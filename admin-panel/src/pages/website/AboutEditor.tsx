import React, { useState } from 'react';
import { Plus, Trash2, Image as ImageIcon } from 'lucide-react';
import { useCms } from '@/context/CmsContext';
import { useAdminAuth } from '@/context/AdminAuthContext';
import { PublishToolbar } from '@/components/cms/PublishToolbar';
import { BilingualField } from '@/components/cms/BilingualField';
import { MediaPickerModal } from '@/components/cms/MediaPickerModal';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Input, Select } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

export const AboutEditor: React.FC = () => {
  const { sections, updateDraft } = useCms();
  const { hasPermission } = useAdminAuth();
  const canEdit = hasPermission('cms:edit');
  const draft = sections.about.draft;
  const [mediaOpen, setMediaOpen] = useState(false);

  const patch = (updates: Partial<typeof draft>) => {
    updateDraft('about', (prev) => ({ ...prev, ...updates }));
  };

  return (
    <div className="space-y-6">
      <PublishToolbar
        section="about"
        title="About Us Page Editor"
        description="Manage Pathway's mission, vision, page intro, hero visual, and core value cards."
      />

      <Card>
        <CardHeader>
          <CardTitle>Header & Mission Introduction</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <BilingualField
            label="Overline Badge"
            valueEn={draft.badgeEn}
            valueBn={draft.badgeBn}
            onChangeEn={(v) => patch({ badgeEn: v })}
            onChangeBn={(v) => patch({ badgeBn: v })}
            disabled={!canEdit}
          />
          <BilingualField
            label="Main Page Heading"
            valueEn={draft.pageTitleEn}
            valueBn={draft.pageTitleBn}
            onChangeEn={(v) => patch({ pageTitleEn: v })}
            onChangeBn={(v) => patch({ pageTitleBn: v })}
            disabled={!canEdit}
          />
          <BilingualField
            label="Intro Description"
            valueEn={draft.pageDescriptionEn}
            valueBn={draft.pageDescriptionBn}
            onChangeEn={(v) => patch({ pageDescriptionEn: v })}
            onChangeBn={(v) => patch({ pageDescriptionBn: v })}
            multiline
            disabled={!canEdit}
          />

          <div className="pt-2 border-t border-slate-100 space-y-2">
            <label className="block text-xs font-semibold text-slate-700">About Feature Image URL</label>
            <div className="flex flex-col sm:flex-row gap-2">
              <Input
                value={draft.heroImageUrl}
                disabled={!canEdit}
                onChange={(e) => patch({ heroImageUrl: e.target.value })}
              />
              {canEdit && (
                <Button variant="outline" onClick={() => setMediaOpen(true)}>
                  <ImageIcon className="w-4 h-4" />
                  <span>Choose Media</span>
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Our Mission Statement</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <BilingualField
              label="Mission Title"
              valueEn={draft.missionTitleEn}
              valueBn={draft.missionTitleBn}
              onChangeEn={(v) => patch({ missionTitleEn: v })}
              onChangeBn={(v) => patch({ missionTitleBn: v })}
              disabled={!canEdit}
            />
            <BilingualField
              label="Mission Body"
              valueEn={draft.missionBodyEn}
              valueBn={draft.missionBodyBn}
              onChangeEn={(v) => patch({ missionBodyEn: v })}
              onChangeBn={(v) => patch({ missionBodyBn: v })}
              multiline
              disabled={!canEdit}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Our Vision Statement</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <BilingualField
              label="Vision Title"
              valueEn={draft.visionTitleEn}
              valueBn={draft.visionTitleBn}
              onChangeEn={(v) => patch({ visionTitleEn: v })}
              onChangeBn={(v) => patch({ visionTitleBn: v })}
              disabled={!canEdit}
            />
            <BilingualField
              label="Vision Body"
              valueEn={draft.visionBodyEn}
              valueBn={draft.visionBodyBn}
              onChangeEn={(v) => patch({ visionBodyEn: v })}
              onChangeBn={(v) => patch({ visionBodyBn: v })}
              multiline
              disabled={!canEdit}
            />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>About Pillar Cards ({draft.cards.length})</CardTitle>
          {canEdit && (
            <Button
              size="sm"
              variant="outline"
              onClick={() =>
                patch({
                  cards: [
                    ...draft.cards,
                    {
                      id: `ab-${Date.now()}`,
                      titleEn: 'New Value Pillar',
                      titleBn: 'নতুন মূলনীতি',
                      descriptionEn: 'Describe this commitment clearly.',
                      descriptionBn: 'মূলনীতির বিবরণ লিখুন।',
                      icon: 'Heart',
                    },
                  ],
                })
              }
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Card</span>
            </Button>
          )}
        </CardHeader>
        <CardContent className="space-y-4">
          {draft.cards.map((card, idx) => (
            <div key={card.id} className="p-4 rounded-xl border border-slate-200 space-y-3">
              <div className="flex items-center justify-between gap-2">
                <Select
                  value={card.icon}
                  disabled={!canEdit}
                  onChange={(e) =>
                    patch({
                      cards: draft.cards.map((c, i) =>
                        i === idx ? { ...c, icon: e.target.value as typeof c.icon } : c
                      ),
                    })
                  }
                >
                  <option value="ShieldCheck">Shield Icon</option>
                  <option value="Stethoscope">Stethoscope Icon</option>
                  <option value="Heart">Heart Icon</option>
                  <option value="Users">Users Icon</option>
                </Select>
                {canEdit && (
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => patch({ cards: draft.cards.filter((_, i) => i !== idx) })}
                  >
                    <Trash2 className="w-4 h-4 text-rose-500" />
                  </Button>
                )}
              </div>

              <BilingualField
                label="Card Title"
                valueEn={card.titleEn}
                valueBn={card.titleBn}
                onChangeEn={(v) =>
                  patch({ cards: draft.cards.map((c, i) => (i === idx ? { ...c, titleEn: v } : c)) })
                }
                onChangeBn={(v) =>
                  patch({ cards: draft.cards.map((c, i) => (i === idx ? { ...c, titleBn: v } : c)) })
                }
                disabled={!canEdit}
              />
              <BilingualField
                label="Card Description"
                valueEn={card.descriptionEn}
                valueBn={card.descriptionBn}
                onChangeEn={(v) =>
                  patch({ cards: draft.cards.map((c, i) => (i === idx ? { ...c, descriptionEn: v } : c)) })
                }
                onChangeBn={(v) =>
                  patch({ cards: draft.cards.map((c, i) => (i === idx ? { ...c, descriptionBn: v } : c)) })
                }
                multiline
                rows={2}
                disabled={!canEdit}
              />
            </div>
          ))}
        </CardContent>
      </Card>

      <MediaPickerModal
        isOpen={mediaOpen}
        onClose={() => setMediaOpen(false)}
        currentUrl={draft.heroImageUrl}
        onSelect={(url) => patch({ heroImageUrl: url })}
      />
    </div>
  );
};
