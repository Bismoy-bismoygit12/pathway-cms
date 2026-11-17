import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { contentService, CmsSectionsMap } from '@/services/contentService';
import { mediaService } from '@/services/mediaService';
import { useAdminAuth } from './AdminAuthContext';
import { CmsRevision, CmsSectionKey, CmsSiteBundle, MediaItem } from '@/types/cms';
import { INITIAL_CMS_BUNDLE, INITIAL_CMS_REVISIONS, INITIAL_MEDIA_LIBRARY } from '@/data/mockCmsData';

interface CmsContextType {
  sections: CmsSectionsMap;
  revisions: CmsRevision[];
  media: MediaItem[];
  loading: boolean;
  updateDraft: <K extends CmsSectionKey>(
    section: K,
    updater: CmsSiteBundle[K] | ((prev: CmsSiteBundle[K]) => CmsSiteBundle[K])
  ) => void;
  saveDraft: <K extends CmsSectionKey>(section: K) => Promise<void>;
  publishSection: <K extends CmsSectionKey>(section: K, summary?: string) => Promise<void>;
  discardDraft: <K extends CmsSectionKey>(section: K) => Promise<void>;
  restoreRevisionToDraft: (revision: CmsRevision) => Promise<void>;
  refreshMedia: () => Promise<void>;
  previewSection: CmsSectionKey | null;
  openPreview: (section: CmsSectionKey) => void;
  closePreview: () => void;
}

const CmsContext = createContext<CmsContextType | undefined>(undefined);

function createSyncInitialMap(): CmsSectionsMap {
  const keys = Object.keys(INITIAL_CMS_BUNDLE) as CmsSectionKey[];
  const out = {} as CmsSectionsMap;
  keys.forEach((k) => {
    const val = structuredClone(INITIAL_CMS_BUNDLE[k]);
    out[k] = {
      draft: structuredClone(val),
      published: structuredClone(val),
      hasUnpublishedChanges: false,
    } as never;
  });
  return out;
}

export const CmsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentAdmin } = useAdminAuth();
  const [sections, setSections] = useState<CmsSectionsMap>(createSyncInitialMap);
  const [revisions, setRevisions] = useState<CmsRevision[]>(INITIAL_CMS_REVISIONS);
  const [media, setMedia] = useState<MediaItem[]>(INITIAL_MEDIA_LIBRARY);
  const [loading, setLoading] = useState(true);
  const [previewSection, setPreviewSection] = useState<CmsSectionKey | null>(null);

  const refreshMedia = useCallback(async () => {
    const list = await mediaService.list();
    setMedia(list);
  }, []);

  useEffect(() => {
    Promise.all([contentService.loadAll(), mediaService.list()]).then(([cmsRes, mediaRes]) => {
      setSections(cmsRes.sections);
      setRevisions(cmsRes.revisions);
      setMedia(mediaRes);
      setLoading(false);
    });
  }, []);

  const updateDraft = useCallback(
    <K extends CmsSectionKey>(
      section: K,
      updater: CmsSiteBundle[K] | ((prev: CmsSiteBundle[K]) => CmsSiteBundle[K])
    ) => {
      setSections((prev) => {
        const cur = prev[section];
        const nextDraft =
          typeof updater === 'function'
            ? (updater as (p: CmsSiteBundle[K]) => CmsSiteBundle[K])(cur.draft)
            : updater;
        const hasUnpublishedChanges = JSON.stringify(nextDraft) !== JSON.stringify(cur.published);
        return {
          ...prev,
          [section]: {
            ...cur,
            draft: nextDraft,
            hasUnpublishedChanges,
          },
        };
      });
    },
    []
  );

  const saveDraft = useCallback(
    async <K extends CmsSectionKey>(section: K) => {
      const draftData = sections[section].draft;
      const savedState = await contentService.saveDraft(section, draftData);
      setSections((prev) => ({
        ...prev,
        [section]: savedState,
      }));
    },
    [sections]
  );

  const publishSection = useCallback(
    async <K extends CmsSectionKey>(section: K, summary?: string) => {
      const draftData = sections[section].draft;
      const { state, revision } = await contentService.publishSection(
        section,
        draftData,
        currentAdmin?.fullName || 'Content Manager',
        currentAdmin?.role || 'content_manager',
        summary
      );
      setSections((prev) => ({
        ...prev,
        [section]: state,
      }));
      setRevisions((prev) => [revision, ...prev]);
    },
    [sections, currentAdmin]
  );

  const discardDraft = useCallback(async <K extends CmsSectionKey>(section: K) => {
    const reverted = await contentService.discardDraft(section);
    setSections((prev) => ({
      ...prev,
      [section]: reverted,
    }));
  }, []);

  const restoreRevisionToDraft = useCallback(async (revision: CmsRevision) => {
    const section = revision.section;
    const restoredSnapshot = structuredClone(revision.snapshot) as CmsSiteBundle[typeof section];
    const savedState = await contentService.saveDraft(section, restoredSnapshot);
    setSections((prev) => ({
      ...prev,
      [section]: savedState,
    }));
  }, []);

  return (
    <CmsContext.Provider
      value={{
        sections,
        revisions,
        media,
        loading,
        updateDraft,
        saveDraft,
        publishSection,
        discardDraft,
        restoreRevisionToDraft,
        refreshMedia,
        previewSection,
        openPreview: (s) => setPreviewSection(s),
        closePreview: () => setPreviewSection(null),
      }}
    >
      {children}
    </CmsContext.Provider>
  );
};

export const useCms = () => {
  const ctx = useContext(CmsContext);
  if (!ctx) throw new Error('useCms must be used within CmsProvider');
  return ctx;
};
