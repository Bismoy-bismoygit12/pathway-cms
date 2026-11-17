export type CmsSectionKey =
  | 'homepage'
  | 'navigation'
  | 'about'
  | 'contact'
  | 'faqs'
  | 'articles'
  | 'footer'
  | 'seo';

export type PublishStatus = 'published' | 'draft';

export interface HeroSlideItem {
  id: string;
  imageUrl: string;
  badgeEn: string;
  badgeBn: string;
  titleEn: string;
  titleBn: string;
  subtitleEn: string;
  subtitleBn: string;
  statEn: string;
  statBn: string;
  statLabelEn: string;
  statLabelBn: string;
}

export interface FeaturePillarItem {
  id: string;
  icon: 'ShieldCheck' | 'FlaskConical' | 'Globe2' | 'HeartHandshake';
  colorScheme: 'blue' | 'cyan' | 'indigo' | 'rose';
  titleEn: string;
  titleBn: string;
  descriptionEn: string;
  descriptionBn: string;
}

export interface MetricBannerItem {
  id: string;
  valueEn: string;
  valueBn: string;
  labelEn: string;
  labelBn: string;
}

export interface StepItem {
  id: string;
  stepNumber: number;
  titleEn: string;
  titleBn: string;
  descriptionEn: string;
  descriptionBn: string;
}

export interface TestimonialItem {
  id: string;
  quoteEn: string;
  quoteBn: string;
  authorAlias: string;
  roleOrContextEn: string;
  roleOrContextBn: string;
  enabled: boolean;
}

export interface HomepageContent {
  heroTagEn: string;
  heroTagBn: string;
  heroHeadingLine1En: string;
  heroHeadingHighlightEn: string;
  heroHeadingLine1Bn: string;
  heroHeadingHighlightBn: string;
  heroDescriptionEn: string;
  heroDescriptionBn: string;
  heroBackgroundImageUrl: string;
  primaryCtaTextEn: string;
  primaryCtaTextBn: string;
  primaryCtaLink: string;
  secondaryCtaTextEn: string;
  secondaryCtaTextBn: string;
  secondaryCtaLink: string;
  trustHighlights: { id: string; textEn: string; textBn: string }[];
  carouselSlides: HeroSlideItem[];
  featurePillars: FeaturePillarItem[];
  metricsBanner: MetricBannerItem[];
  howItWorksOverlineEn: string;
  howItWorksOverlineBn: string;
  howItWorksHeadingEn: string;
  howItWorksHeadingBn: string;
  howItWorksSubtitleEn: string;
  howItWorksSubtitleBn: string;
  howItWorksSteps: StepItem[];
  featuredDoctorsOverlineEn: string;
  featuredDoctorsOverlineBn: string;
  featuredDoctorsHeadingEn: string;
  featuredDoctorsHeadingBn: string;
  featuredLibraryOverlineEn: string;
  featuredLibraryOverlineBn: string;
  featuredLibraryHeadingEn: string;
  featuredLibraryHeadingBn: string;
  testimonials: TestimonialItem[];
  bottomCtaHeadingEn: string;
  bottomCtaHeadingBn: string;
  bottomCtaDescriptionEn: string;
  bottomCtaDescriptionBn: string;
  bottomCtaButtonTextEn: string;
  bottomCtaButtonTextBn: string;
  bottomCtaButtonLink: string;
}

export interface NavigationItem {
  id: string;
  labelEn: string;
  labelBn: string;
  url: string;
  order: number;
  enabled: boolean;
  openInNewTab: boolean;
}

export interface NavigationContent {
  announcementEn: string;
  announcementBn: string;
  showAnnouncementBar: boolean;
  items: NavigationItem[];
}

export interface AboutCardItem {
  id: string;
  titleEn: string;
  titleBn: string;
  descriptionEn: string;
  descriptionBn: string;
  icon: 'ShieldCheck' | 'Stethoscope' | 'Heart' | 'Users';
}

export interface AboutContent {
  badgeEn: string;
  badgeBn: string;
  pageTitleEn: string;
  pageTitleBn: string;
  pageDescriptionEn: string;
  pageDescriptionBn: string;
  missionTitleEn: string;
  missionTitleBn: string;
  missionBodyEn: string;
  missionBodyBn: string;
  visionTitleEn: string;
  visionTitleBn: string;
  visionBodyEn: string;
  visionBodyBn: string;
  heroImageUrl: string;
  cards: AboutCardItem[];
}

export interface ContactContent {
  pageTitleEn: string;
  pageTitleBn: string;
  pageDescriptionEn: string;
  pageDescriptionBn: string;
  supportEmail: string;
  privacyEmail: string;
  phoneNumber: string;
  crisisPhoneNumber: string;
  officeAddressEn: string;
  officeAddressBn: string;
  officeHoursEn: string;
  officeHoursBn: string;
  socialLinks: {
    facebook: string;
    linkedin: string;
    youtube: string;
    instagram: string;
  };
}

export interface FaqItem {
  id: string;
  questionEn: string;
  questionBn: string;
  answerEn: string;
  answerBn: string;
  order: number;
  enabled: boolean;
}

export type ArticleStatus = 'draft' | 'published' | 'scheduled';

export interface ArticleItem {
  id: string;
  slug: string;
  titleEn: string;
  titleBn: string;
  category: string;
  categoryBn: string;
  readTimeEn: string;
  readTimeBn: string;
  tags: string[];
  featuredImageUrl: string;
  summaryEn: string;
  summaryBn: string;
  contentEn: string;
  contentBn: string;
  audioPlaceholder: boolean;
  status: ArticleStatus;
  scheduledAt?: string;
  publishedAt?: string;
  updatedAt: string;
}

export type MediaCategory = 'hero' | 'articles' | 'doctors' | 'about' | 'seo' | 'general';

export interface MediaItem {
  id: string;
  title: string;
  altTextEn: string;
  altTextBn: string;
  url: string;
  category: MediaCategory;
  storageProvider: 's3_compatible' | 'cloudinary' | 'local_asset';
  dimensions: string;
  fileSize: string;
  uploadedAt: string;
  usedIn: string[];
}

export interface FooterLink {
  id: string;
  labelEn: string;
  labelBn: string;
  url: string;
}

export interface FooterColumn {
  id: string;
  headingEn: string;
  headingBn: string;
  links: FooterLink[];
}

export interface FooterContent {
  bannerHeadingEn: string;
  bannerHeadingBn: string;
  bannerSubtextEn: string;
  bannerSubtextBn: string;
  bannerButtonTextEn: string;
  bannerButtonTextBn: string;
  bannerButtonLink: string;
  brandTaglineEn: string;
  brandTaglineBn: string;
  privacyBadgeEn: string;
  privacyBadgeBn: string;
  contactEmail: string;
  contactPhone: string;
  officeLocationEn: string;
  columns: FooterColumn[];
  disclaimerEn: string;
  disclaimerBn: string;
  copyrightText: string;
}

export interface PageSeoEntry {
  route: string;
  pageName: string;
  title: string;
  description: string;
  ogTitle: string;
  ogImage: string;
  canonicalUrl: string;
}

export interface SeoSettings {
  globalTitle: string;
  globalTitleTemplate: string;
  globalMetaDescription: string;
  defaultOgTitle: string;
  defaultOgImage: string;
  siteCanonicalBaseUrl: string;
  pages: PageSeoEntry[];
}

export interface CmsSiteBundle {
  homepage: HomepageContent;
  navigation: NavigationContent;
  about: AboutContent;
  contact: ContactContent;
  faqs: FaqItem[];
  articles: ArticleItem[];
  footer: FooterContent;
  seo: SeoSettings;
}

export interface CmsRevision {
  id: string;
  section: CmsSectionKey;
  versionNumber: number;
  summary: string;
  publishedBy: string;
  publishedAt: string;
  snapshot: unknown;
}

export interface CmsSectionState<T> {
  draft: T;
  published: T;
  hasUnpublishedChanges: boolean;
  lastSavedDraftAt?: string;
  lastPublishedAt?: string;
  lastPublishedBy?: string;
}
