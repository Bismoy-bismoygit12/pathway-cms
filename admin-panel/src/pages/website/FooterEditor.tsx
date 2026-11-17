import React from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { useCms } from '@/context/CmsContext';
import { useAdminAuth } from '@/context/AdminAuthContext';
import { PublishToolbar } from '@/components/cms/PublishToolbar';
import { BilingualField } from '@/components/cms/BilingualField';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

export const FooterEditor: React.FC = () => {
  const { sections, updateDraft } = useCms();
  const { hasPermission } = useAdminAuth();
  const canEdit = hasPermission('cms:edit');
  const draft = sections.footer.draft;

  const patch = (updates: Partial<typeof draft>) => {
    updateDraft('footer', (prev) => ({ ...prev, ...updates }));
  };

  return (
    <div className="space-y-6">
      <PublishToolbar
        section="footer"
        title="Footer Management"
        description="Edit the Pathway footer CTA banner, brand tagline, navigation columns, medical disclaimer, and copyright."
      />

      <Card>
        <CardHeader>
          <CardTitle>Royal Blue Top Footer CTA Banner</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <BilingualField
            label="Banner Heading"
            valueEn={draft.bannerHeadingEn}
            valueBn={draft.bannerHeadingBn}
            onChangeEn={(v) => patch({ bannerHeadingEn: v })}
            onChangeBn={(v) => patch({ bannerHeadingBn: v })}
            disabled={!canEdit}
          />
          <BilingualField
            label="Banner Subtext"
            valueEn={draft.bannerSubtextEn}
            valueBn={draft.bannerSubtextBn}
            onChangeEn={(v) => patch({ bannerSubtextEn: v })}
            onChangeBn={(v) => patch({ bannerSubtextBn: v })}
            disabled={!canEdit}
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
            <BilingualField
              label="Banner Button Label"
              valueEn={draft.bannerButtonTextEn}
              valueBn={draft.bannerButtonTextBn}
              onChangeEn={(v) => patch({ bannerButtonTextEn: v })}
              onChangeBn={(v) => patch({ bannerButtonTextBn: v })}
              disabled={!canEdit}
            />
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Banner Button Route</label>
              <Input
                value={draft.bannerButtonLink}
                disabled={!canEdit}
                onChange={(e) => patch({ bannerButtonLink: e.target.value })}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Brand Tagline, Privacy Badge & Contact Snippet</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <BilingualField
            label="Brand Tagline"
            valueEn={draft.brandTaglineEn}
            valueBn={draft.brandTaglineBn}
            onChangeEn={(v) => patch({ brandTaglineEn: v })}
            onChangeBn={(v) => patch({ brandTaglineBn: v })}
            disabled={!canEdit}
          />
          <BilingualField
            label="Privacy Pledge Badge"
            valueEn={draft.privacyBadgeEn}
            valueBn={draft.privacyBadgeBn}
            onChangeEn={(v) => patch({ privacyBadgeEn: v })}
            onChangeBn={(v) => patch({ privacyBadgeBn: v })}
            disabled={!canEdit}
          />
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Footer Email</label>
              <Input
                value={draft.contactEmail}
                disabled={!canEdit}
                onChange={(e) => patch({ contactEmail: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Footer Phone</label>
              <Input
                value={draft.contactPhone}
                disabled={!canEdit}
                onChange={(e) => patch({ contactPhone: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Office Location</label>
              <Input
                value={draft.officeLocationEn}
                disabled={!canEdit}
                onChange={(e) => patch({ officeLocationEn: e.target.value })}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {draft.columns.map((col, colIdx) => (
          <Card key={col.id}>
            <CardHeader>
              <CardTitle>Column #{colIdx + 1}</CardTitle>
              {canEdit && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() =>
                    patch({
                      columns: draft.columns.map((c, i) =>
                        i === colIdx
                          ? {
                              ...c,
                              links: [
                                ...c.links,
                                { id: `fl-${Date.now()}`, labelEn: 'New Link', labelBn: 'নতুন লিংক', url: '/' },
                              ],
                            }
                          : c
                      ),
                    })
                  }
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Link</span>
                </Button>
              )}
            </CardHeader>
            <CardContent className="space-y-4">
              <BilingualField
                label="Column Heading"
                valueEn={col.headingEn}
                valueBn={col.headingBn}
                onChangeEn={(v) =>
                  patch({
                    columns: draft.columns.map((c, i) => (i === colIdx ? { ...c, headingEn: v } : c)),
                  })
                }
                onChangeBn={(v) =>
                  patch({
                    columns: draft.columns.map((c, i) => (i === colIdx ? { ...c, headingBn: v } : c)),
                  })
                }
                disabled={!canEdit}
              />

              <div className="space-y-2.5 pt-2 border-t border-slate-100">
                {col.links.map((link, linkIdx) => (
                  <div key={link.id} className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <Input
                        value={link.labelEn}
                        disabled={!canEdit}
                        placeholder="EN label"
                        onChange={(e) =>
                          patch({
                            columns: draft.columns.map((c, i) =>
                              i === colIdx
                                ? {
                                    ...c,
                                    links: c.links.map((l, j) =>
                                      j === linkIdx ? { ...l, labelEn: e.target.value } : l
                                    ),
                                  }
                                : c
                            ),
                          })
                        }
                      />
                      {canEdit && (
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() =>
                            patch({
                              columns: draft.columns.map((c, i) =>
                                i === colIdx
                                  ? { ...c, links: c.links.filter((_, j) => j !== linkIdx) }
                                  : c
                              ),
                            })
                          }
                        >
                          <Trash2 className="w-3.5 h-3.5 text-rose-500" />
                        </Button>
                      )}
                    </div>
                    <Input
                      value={link.labelBn}
                      disabled={!canEdit}
                      placeholder="BN label"
                      className="font-bn"
                      onChange={(e) =>
                        patch({
                          columns: draft.columns.map((c, i) =>
                            i === colIdx
                              ? {
                                  ...c,
                                  links: c.links.map((l, j) =>
                                    j === linkIdx ? { ...l, labelBn: e.target.value } : l
                                  ),
                                }
                              : c
                          ),
                        })
                      }
                    />
                    <Input
                      value={link.url}
                      disabled={!canEdit}
                      placeholder="/route"
                      onChange={(e) =>
                        patch({
                          columns: draft.columns.map((c, i) =>
                            i === colIdx
                              ? {
                                  ...c,
                                  links: c.links.map((l, j) =>
                                    j === linkIdx ? { ...l, url: e.target.value } : l
                                  ),
                                }
                              : c
                          ),
                        })
                      }
                    />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Medical Disclaimer & Copyright</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <BilingualField
            label="Required Medical Disclaimer"
            valueEn={draft.disclaimerEn}
            valueBn={draft.disclaimerBn}
            onChangeEn={(v) => patch({ disclaimerEn: v })}
            onChangeBn={(v) => patch({ disclaimerBn: v })}
            multiline
            rows={2}
            disabled={!canEdit}
          />
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">Copyright Line</label>
            <Input
              value={draft.copyrightText}
              disabled={!canEdit}
              onChange={(e) => patch({ copyrightText: e.target.value })}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
