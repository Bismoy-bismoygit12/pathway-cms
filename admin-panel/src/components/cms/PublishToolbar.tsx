import React, { useState } from 'react';
import { Eye, Save, UploadCloud, RotateCcw, History, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useCms } from '@/context/CmsContext';
import { useAdminAuth } from '@/context/AdminAuthContext';
import { useToast } from '@/components/ui/Toast';
import { CmsRevision, CmsSectionKey } from '@/types/cms';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { formatDateTime } from '@/lib/utils';

interface PublishToolbarProps {
  section: CmsSectionKey;
  title: string;
  description: string;
}

export const PublishToolbar: React.FC<PublishToolbarProps> = ({ section, title, description }) => {
  const {
    sections,
    revisions,
    saveDraft,
    publishSection,
    discardDraft,
    restoreRevisionToDraft,
    openPreview,
  } = useCms();
  const { hasPermission } = useAdminAuth();
  const { showToast } = useToast();

  const [historyOpen, setHistoryOpen] = useState(false);
  const [publishModalOpen, setPublishModalOpen] = useState(false);
  const [publishSummary, setPublishSummary] = useState('');
  const [busy, setBusy] = useState(false);

  const state = sections[section];
  const sectionRevisions = revisions.filter((r) => r.section === section);
  const canEdit = hasPermission('cms:edit');
  const canPublish = hasPermission('cms:publish');

  const handleSaveDraft = async () => {
    setBusy(true);
    await saveDraft(section);
    setBusy(false);
    showToast('Draft saved locally. Changes are NOT live until you Publish.');
  };

  const handlePublish = async () => {
    setBusy(true);
    await publishSection(section, publishSummary);
    setBusy(false);
    setPublishModalOpen(false);
    setPublishSummary('');
    showToast(`${title} published live and recorded in revision history.`);
  };

  const handleDiscard = async () => {
    setBusy(true);
    await discardDraft(section);
    setBusy(false);
    showToast('Unpublished draft changes discarded. Reverted to live published state.', 'info');
  };

  const handleRestore = async (rev: CmsRevision) => {
    await restoreRevisionToDraft(rev);
    setHistoryOpen(false);
    showToast(`Version #${rev.versionNumber} restored to Draft. Preview or Publish when ready.`);
  };

  return (
    <>
      <div className="bg-white border border-slate-200 rounded-xl p-4 sm:p-5 space-y-4 shadow-[0_1px_3px_rgba(15,23,42,0.04)]">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2.5 flex-wrap">
              <h2 className="text-lg sm:text-xl font-bold text-slate-900">{title}</h2>
              {state.hasUnpublishedChanges ? (
                <Badge variant="amber">
                  <AlertCircle className="w-3 h-3" />
                  Unpublished Draft Changes
                </Badge>
              ) : (
                <Badge variant="emerald">
                  <CheckCircle2 className="w-3 h-3" />
                  Published & Synced
                </Badge>
              )}
            </div>
            <p className="text-xs text-slate-500">{description}</p>
            <div className="text-[11px] text-slate-400 flex flex-wrap items-center gap-x-3 gap-y-1 pt-0.5">
              {state.lastSavedDraftAt && <span>Draft saved: {formatDateTime(state.lastSavedDraftAt)}</span>}
              {state.lastPublishedAt && (
                <span>
                  Last published: {formatDateTime(state.lastPublishedAt)}
                  {state.lastPublishedBy ? ` by ${state.lastPublishedBy}` : ''}
                </span>
              )}
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Button size="sm" variant="outline" onClick={() => setHistoryOpen(true)}>
              <History className="w-3.5 h-3.5" />
              <span>Revisions ({sectionRevisions.length})</span>
            </Button>

            <Button size="sm" variant="outline" onClick={() => openPreview(section)}>
              <Eye className="w-3.5 h-3.5" />
              <span>Preview</span>
            </Button>

            {canEdit && state.hasUnpublishedChanges && (
              <Button size="sm" variant="ghost" disabled={busy} onClick={handleDiscard}>
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Discard Draft</span>
              </Button>
            )}

            {canEdit && (
              <Button size="sm" variant="secondary" disabled={busy} onClick={handleSaveDraft}>
                <Save className="w-3.5 h-3.5" />
                <span>Save Draft</span>
              </Button>
            )}

            {canPublish && (
              <Button
                size="sm"
                variant="teal"
                disabled={busy}
                onClick={() => setPublishModalOpen(true)}
              >
                <UploadCloud className="w-3.5 h-3.5" />
                <span>Publish Live</span>
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Confirm Publish Modal */}
      <Modal
        isOpen={publishModalOpen}
        onClose={() => setPublishModalOpen(false)}
        title={`Publish ${title} Live?`}
        subtitle="Publishing updates the live Pathway website payload and creates a versioned revision snapshot."
        size="md"
        footer={
          <>
            <Button variant="outline" onClick={() => setPublishModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="teal" disabled={busy} onClick={handlePublish}>
              <UploadCloud className="w-4 h-4" />
              <span>Confirm Publish</span>
            </Button>
          </>
        }
      >
        <div className="space-y-3">
          <p className="text-xs text-slate-600">
            Tip: Use <strong>Preview</strong> first to verify English and Bangla layouts across Desktop and Mobile before pushing live.
          </p>
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Release Note / Revision Summary (Optional)
            </label>
            <Input
              value={publishSummary}
              onChange={(e) => setPublishSummary(e.target.value)}
              placeholder="e.g. Updated Ramadan support hours and homepage banner"
            />
          </div>
        </div>
      </Modal>

      {/* Revision History Modal */}
      <Modal
        isOpen={historyOpen}
        onClose={() => setHistoryOpen(false)}
        title={`Revision History — ${title}`}
        subtitle="Restore any previous published snapshot back into your Draft editor"
        size="lg"
        footer={
          <Button variant="outline" onClick={() => setHistoryOpen(false)}>
            Close
          </Button>
        }
      >
        <div className="space-y-3">
          {sectionRevisions.length === 0 ? (
            <div className="py-8 text-center text-xs text-slate-500">
              No published revisions recorded for this section yet.
            </div>
          ) : (
            sectionRevisions.map((rev) => (
              <div
                key={rev.id}
                className="p-3.5 rounded-xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Badge variant="blue">v{rev.versionNumber}</Badge>
                    <span className="text-xs font-semibold text-slate-900">{rev.summary}</span>
                  </div>
                  <div className="text-[11px] text-slate-500">
                    Published by {rev.publishedBy} on {formatDateTime(rev.publishedAt)}
                  </div>
                </div>
                {canEdit && (
                  <Button size="sm" variant="outline" onClick={() => handleRestore(rev)}>
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Restore to Draft</span>
                  </Button>
                )}
              </div>
            ))
          )}
        </div>
      </Modal>
    </>
  );
};
