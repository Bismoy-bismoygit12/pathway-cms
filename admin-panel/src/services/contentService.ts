import { apiClient, USE_MOCK_MODE } from './api';
import { INITIAL_CMS_BUNDLE, INITIAL_CMS_REVISIONS } from '@/data/mockCmsData';
import { mockStore } from '@/data/mockStore';
import { CmsRevision, CmsSectionKey, CmsSectionState, CmsSiteBundle } from '@/types/cms';

const CMS_STORAGE_KEY = 'pathway_admin_cms_sections_v1';
const CMS_REVISIONS_KEY = 'pathway_admin_cms_revisions_v1';

export type CmsSectionsMap = {
  [K in CmsSectionKey]: CmsSectionState<CmsSiteBundle[K]>;
};

function buildInitialSections(): CmsSectionsMap {
  const keys = Object.keys(INITIAL_CMS_BUNDLE) as CmsSectionKey[];
  const result = {} as CmsSectionsMap;
  keys.forEach((key) => {
    const val = structuredClone(INITIAL_CMS_BUNDLE[key]);
    result[key] = {
      draft: structuredClone(val),
      published: structuredClone(val),
      hasUnpublishedChanges: false,
      lastPublishedAt: '2026-11-16T18:30:00Z',
      lastPublishedBy: 'Rafiqul Islam',
    } as never;
  });
  return result;
}

function readStoredSections(): CmsSectionsMap {
  try {
    const raw = localStorage.getItem(CMS_STORAGE_KEY);
    if (!raw) return buildInitialSections();
    const parsed = JSON.parse(raw) as Partial<CmsSectionsMap>;
    const defaults = buildInitialSections();
    return { ...defaults, ...parsed } as CmsSectionsMap;
  } catch {
    return buildInitialSections();
  }
}

function writeStoredSections(sections: CmsSectionsMap) {
  localStorage.setItem(CMS_STORAGE_KEY, JSON.stringify(sections));
}

function readStoredRevisions(): CmsRevision[] {
  try {
    const raw = localStorage.getItem(CMS_REVISIONS_KEY);
    return raw ? JSON.parse(raw) : structuredClone(INITIAL_CMS_REVISIONS);
  } catch {
    return structuredClone(INITIAL_CMS_REVISIONS);
  }
}

function writeStoredRevisions(revisions: CmsRevision[]) {
  localStorage.setItem(CMS_REVISIONS_KEY, JSON.stringify(revisions));
}

export const contentService = {
  async loadAll(): Promise<{ sections: CmsSectionsMap; revisions: CmsRevision[] }> {
    if (!USE_MOCK_MODE) {
      const { data } = await apiClient.get<{ sections: CmsSectionsMap; revisions: CmsRevision[] }>('/cms/admin/all');
      return data;
    }
    return {
      sections: readStoredSections(),
      revisions: readStoredRevisions(),
    };
  },

  async saveDraft<K extends CmsSectionKey>(
    section: K,
    draftData: CmsSiteBundle[K]
  ): Promise<CmsSectionState<CmsSiteBundle[K]>> {
    if (!USE_MOCK_MODE) {
      const { data } = await apiClient.put<CmsSectionState<CmsSiteBundle[K]>>(`/cms/admin/${section}/draft`, {
        content: draftData,
      });
      return data;
    }

    const sections = readStoredSections();
    const current = sections[section];
    const hasUnpublishedChanges = JSON.stringify(draftData) !== JSON.stringify(current.published);
    const updated: CmsSectionState<CmsSiteBundle[K]> = {
      ...current,
      draft: structuredClone(draftData),
      hasUnpublishedChanges,
      lastSavedDraftAt: new Date().toISOString(),
    };
    sections[section] = updated as never;
    writeStoredSections(sections);
    return updated;
  },

  async publishSection<K extends CmsSectionKey>(
    section: K,
    draftData: CmsSiteBundle[K],
    actorName: string,
    actorRole: string,
    summary?: string
  ): Promise<{ state: CmsSectionState<CmsSiteBundle[K]>; revision: CmsRevision }> {
    if (!USE_MOCK_MODE) {
      const { data } = await apiClient.post<{ state: CmsSectionState<CmsSiteBundle[K]>; revision: CmsRevision }>(
        `/cms/admin/${section}/publish`,
        { content: draftData, summary }
      );
      return data;
    }

    const sections = readStoredSections();
    const revisions = readStoredRevisions();
    const now = new Date().toISOString();

    const state: CmsSectionState<CmsSiteBundle[K]> = {
      draft: structuredClone(draftData),
      published: structuredClone(draftData),
      hasUnpublishedChanges: false,
      lastSavedDraftAt: now,
      lastPublishedAt: now,
      lastPublishedBy: actorName,
    };
    sections[section] = state as never;
    writeStoredSections(sections);

    const existingForSection = revisions.filter((r) => r.section === section);
    const nextVersion = existingForSection.length > 0 ? Math.max(...existingForSection.map((r) => r.versionNumber)) + 1 : 1;

    const revision: CmsRevision = {
      id: `rev-${Date.now()}`,
      section,
      versionNumber: nextVersion,
      summary: summary?.trim() || `Published ${section} updates`,
      publishedBy: actorName,
      publishedAt: now,
      snapshot: structuredClone(draftData),
    };
    const nextRevisions = [revision, ...revisions];
    writeStoredRevisions(nextRevisions);

    mockStore.addActivity({
      category: 'website_content',
      actorName,
      actorRole,
      action: `Published Website ${section.toUpperCase()} Update`,
      target: `Public Pathway Website (/${section})`,
      details: revision.summary,
    });

    return { state, revision };
  },

  async discardDraft<K extends CmsSectionKey>(section: K): Promise<CmsSectionState<CmsSiteBundle[K]>> {
    if (!USE_MOCK_MODE) {
      const { data } = await apiClient.post<CmsSectionState<CmsSiteBundle[K]>>(`/cms/admin/${section}/discard`);
      return data;
    }

    const sections = readStoredSections();
    const current = sections[section];
    const updated: CmsSectionState<CmsSiteBundle[K]> = {
      ...current,
      draft: structuredClone(current.published),
      hasUnpublishedChanges: false,
      lastSavedDraftAt: undefined,
    };
    sections[section] = updated as never;
    writeStoredSections(sections);
    return updated;
  },
};
