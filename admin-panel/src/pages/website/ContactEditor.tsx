import React from 'react';
import { useCms } from '@/context/CmsContext';
import { useAdminAuth } from '@/context/AdminAuthContext';
import { PublishToolbar } from '@/components/cms/PublishToolbar';
import { BilingualField } from '@/components/cms/BilingualField';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';

export const ContactEditor: React.FC = () => {
  const { sections, updateDraft } = useCms();
  const { hasPermission } = useAdminAuth();
  const canEdit = hasPermission('cms:edit');
  const draft = sections.contact.draft;

  const patch = (updates: Partial<typeof draft>) => {
    updateDraft('contact', (prev) => ({ ...prev, ...updates }));
  };

  return (
    <div className="space-y-6">
      <PublishToolbar
        section="contact"
        title="Contact Page Editor"
        description="Manage public support emails, crisis helplines, office address, hours, and social links."
      />

      <Card>
        <CardHeader>
          <CardTitle>Page Header & Messaging</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <BilingualField
            label="Page Heading"
            valueEn={draft.pageTitleEn}
            valueBn={draft.pageTitleBn}
            onChangeEn={(v) => patch({ pageTitleEn: v })}
            onChangeBn={(v) => patch({ pageTitleBn: v })}
            disabled={!canEdit}
          />
          <BilingualField
            label="Intro Subtitle"
            valueEn={draft.pageDescriptionEn}
            valueBn={draft.pageDescriptionBn}
            onChangeEn={(v) => patch({ pageDescriptionEn: v })}
            onChangeBn={(v) => patch({ pageDescriptionBn: v })}
            multiline
            rows={2}
            disabled={!canEdit}
          />
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Emails, Phones & Office Location</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Support Email</label>
                <Input
                  value={draft.supportEmail}
                  disabled={!canEdit}
                  onChange={(e) => patch({ supportEmail: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Privacy Officer Email</label>
                <Input
                  value={draft.privacyEmail}
                  disabled={!canEdit}
                  onChange={(e) => patch({ privacyEmail: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">General Helpline Phone</label>
                <Input
                  value={draft.phoneNumber}
                  disabled={!canEdit}
                  onChange={(e) => patch({ phoneNumber: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Crisis Emergency Phone</label>
                <Input
                  value={draft.crisisPhoneNumber}
                  disabled={!canEdit}
                  onChange={(e) => patch({ crisisPhoneNumber: e.target.value })}
                />
              </div>
            </div>

            <BilingualField
              label="Office Address"
              valueEn={draft.officeAddressEn}
              valueBn={draft.officeAddressBn}
              onChangeEn={(v) => patch({ officeAddressEn: v })}
              onChangeBn={(v) => patch({ officeAddressBn: v })}
              disabled={!canEdit}
            />
            <BilingualField
              label="Support Hours"
              valueEn={draft.officeHoursEn}
              valueBn={draft.officeHoursBn}
              onChangeEn={(v) => patch({ officeHoursEn: v })}
              onChangeBn={(v) => patch({ officeHoursBn: v })}
              disabled={!canEdit}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Social Media Profiles</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Facebook URL</label>
              <Input
                value={draft.socialLinks.facebook}
                disabled={!canEdit}
                onChange={(e) => patch({ socialLinks: { ...draft.socialLinks, facebook: e.target.value } })}
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">LinkedIn URL</label>
              <Input
                value={draft.socialLinks.linkedin}
                disabled={!canEdit}
                onChange={(e) => patch({ socialLinks: { ...draft.socialLinks, linkedin: e.target.value } })}
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">YouTube URL</label>
              <Input
                value={draft.socialLinks.youtube}
                disabled={!canEdit}
                onChange={(e) => patch({ socialLinks: { ...draft.socialLinks, youtube: e.target.value } })}
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Instagram URL</label>
              <Input
                value={draft.socialLinks.instagram}
                disabled={!canEdit}
                onChange={(e) => patch({ socialLinks: { ...draft.socialLinks, instagram: e.target.value } })}
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
