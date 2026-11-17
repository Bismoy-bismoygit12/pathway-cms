import React, { useState } from 'react';
import { Monitor, Tablet, Smartphone, Globe, ShieldCheck, ArrowRight, ChevronDown } from 'lucide-react';
import { useCms } from '@/context/CmsContext';
import { Modal } from '@/components/ui/Modal';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';

export const SitePreviewModal: React.FC = () => {
  const { sections, previewSection, closePreview } = useCms();
  const [viewport, setViewport] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [lang, setLang] = useState<'en' | 'bn'>('en');
  const [mode, setMode] = useState<'draft' | 'published'>('draft');

  if (!previewSection) return null;

  const isBn = lang === 'bn';
  const homepage = sections.homepage[mode];
  const nav = sections.navigation[mode];
  const about = sections.about[mode];
  const contact = sections.contact[mode];
  const faqs = sections.faqs[mode];
  const articles = sections.articles[mode];
  const footer = sections.footer[mode];
  const seo = sections.seo[mode];

  const viewportWidth =
    viewport === 'desktop' ? 'w-full' : viewport === 'tablet' ? 'max-w-[768px] mx-auto' : 'max-w-[375px] mx-auto';

  return (
    <Modal
      isOpen={Boolean(previewSection)}
      onClose={closePreview}
      title={`Visual Public Website Preview — ${previewSection.toUpperCase()}`}
      subtitle="Compare unpublished Draft changes against Live Published content before publishing"
      size="full"
      footer={
        <Button variant="outline" onClick={closePreview}>
          Close Preview
        </Button>
      }
    >
      <div className="space-y-4">
        {/* Preview Controls */}
        <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-xl bg-slate-100 border border-slate-200">
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => setMode('draft')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer ${
                mode === 'draft' ? 'bg-amber-500 text-white shadow-xs' : 'bg-white text-slate-700'
              }`}
            >
              Previewing Draft
            </button>
            <button
              type="button"
              onClick={() => setMode('published')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer ${
                mode === 'published' ? 'bg-emerald-600 text-white shadow-xs' : 'bg-white text-slate-700'
              }`}
            >
              Published Live
            </button>
            {sections[previewSection].hasUnpublishedChanges && (
              <Badge variant="amber">Draft differs from Published</Badge>
            )}
          </div>

          <div className="flex items-center gap-2">
            <div className="inline-flex bg-white p-1 rounded-lg border border-slate-200">
              <button
                type="button"
                onClick={() => setViewport('desktop')}
                className={`p-1.5 rounded cursor-pointer ${viewport === 'desktop' ? 'bg-blue-50 text-blue-700' : 'text-slate-500'}`}
                title="Desktop Preview"
              >
                <Monitor className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setViewport('tablet')}
                className={`p-1.5 rounded cursor-pointer ${viewport === 'tablet' ? 'bg-blue-50 text-blue-700' : 'text-slate-500'}`}
                title="Tablet Preview (768px)"
              >
                <Tablet className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setViewport('mobile')}
                className={`p-1.5 rounded cursor-pointer ${viewport === 'mobile' ? 'bg-blue-50 text-blue-700' : 'text-slate-500'}`}
                title="Mobile Preview (375px)"
              >
                <Smartphone className="w-4 h-4" />
              </button>
            </div>

            <button
              type="button"
              onClick={() => setLang((l) => (l === 'en' ? 'bn' : 'en'))}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-xs font-semibold text-slate-700 cursor-pointer"
            >
              <Globe className="w-3.5 h-3.5 text-blue-600" />
              <span>{lang === 'en' ? 'English' : 'বাংলা'}</span>
            </button>
          </div>
        </div>

        {/* Simulated Public Browser Frame */}
        <div className={`border border-slate-300 rounded-2xl overflow-hidden bg-white shadow-inner transition-all ${viewportWidth}`}>
          {/* Simulated Header / Navigation */}
          {(previewSection === 'navigation' || previewSection === 'homepage') && (
            <div>
              {nav.showAnnouncementBar && (
                <div className="bg-slate-900 text-slate-200 text-[11px] px-4 py-1.5 text-center">
                  {isBn ? nav.announcementBn : nav.announcementEn}
                </div>
              )}
              <div className="px-5 py-3 border-b border-slate-200 flex items-center justify-between gap-4 bg-white">
                <div className="font-extrabold text-base text-slate-900 flex items-center gap-2">
                  <span className="w-5 h-5 rounded bg-blue-700 inline-block" />
                  <span>Pathway</span>
                </div>
                <div className="hidden sm:flex items-center gap-4 text-xs font-semibold text-slate-600">
                  {nav.items
                    .filter((i) => i.enabled)
                    .sort((a, b) => a.order - b.order)
                    .map((item) => (
                      <span key={item.id}>{isBn ? item.labelBn : item.labelEn}</span>
                    ))}
                </div>
                <span className="px-3 py-1 rounded-lg bg-blue-700 text-white text-xs font-semibold">Sign Up</span>
              </div>
            </div>
          )}

          {/* Homepage Preview */}
          {previewSection === 'homepage' && (
            <div className="p-6 space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center bg-blue-50/60 p-6 rounded-2xl">
                <div className="md:col-span-6 space-y-3">
                  <span className="inline-block px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-[11px] font-semibold">
                    {isBn ? homepage.heroTagBn : homepage.heroTagEn}
                  </span>
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 leading-tight">
                    {isBn ? homepage.heroHeadingLine1Bn : homepage.heroHeadingLine1En}{' '}
                    <span className="text-blue-700">
                      {isBn ? homepage.heroHeadingHighlightBn : homepage.heroHeadingHighlightEn}
                    </span>
                  </h1>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {isBn ? homepage.heroDescriptionBn : homepage.heroDescriptionEn}
                  </p>
                  <div className="flex flex-wrap gap-2 pt-1">
                    <span className="px-4 py-2 rounded-xl bg-blue-700 text-white text-xs font-semibold inline-flex items-center gap-1">
                      {isBn ? homepage.primaryCtaTextBn : homepage.primaryCtaTextEn}
                      <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                    <span className="px-4 py-2 rounded-xl border border-blue-600 text-blue-700 text-xs font-semibold">
                      {isBn ? homepage.secondaryCtaTextBn : homepage.secondaryCtaTextEn}
                    </span>
                  </div>
                </div>
                <div className="md:col-span-6">
                  {homepage.carouselSlides[0] && (
                    <div className="relative rounded-2xl overflow-hidden aspect-4/3 bg-slate-900">
                      <img
                        src={homepage.carouselSlides[0].imageUrl}
                        alt={homepage.carouselSlides[0].titleEn}
                        className="w-full h-full object-cover opacity-85"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-transparent p-4 flex flex-col justify-end text-white">
                        <span className="text-[10px] font-bold uppercase text-cyan-300">
                          {isBn ? homepage.carouselSlides[0].badgeBn : homepage.carouselSlides[0].badgeEn}
                        </span>
                        <div className="text-sm font-bold">
                          {isBn ? homepage.carouselSlides[0].titleBn : homepage.carouselSlides[0].titleEn}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {homepage.featurePillars.map((p) => (
                  <div key={p.id} className="p-3.5 rounded-xl border border-slate-200 bg-white">
                    <div className="text-xs font-bold text-slate-900">{isBn ? p.titleBn : p.titleEn}</div>
                    <div className="text-[11px] text-slate-500 mt-1 line-clamp-2">
                      {isBn ? p.descriptionBn : p.descriptionEn}
                    </div>
                  </div>
                ))}
              </div>

              <div className="rounded-2xl bg-blue-800 text-white p-5 grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
                {homepage.metricsBanner.map((m) => (
                  <div key={m.id}>
                    <div className="text-xl font-extrabold">{isBn ? m.valueBn : m.valueEn}</div>
                    <div className="text-[11px] text-blue-100">{isBn ? m.labelBn : m.labelEn}</div>
                  </div>
                ))}
              </div>

              <div className="rounded-2xl bg-slate-900 text-white p-6 text-center space-y-2">
                <div className="text-lg font-bold">{isBn ? homepage.bottomCtaHeadingBn : homepage.bottomCtaHeadingEn}</div>
                <p className="text-xs text-slate-300 max-w-md mx-auto">
                  {isBn ? homepage.bottomCtaDescriptionBn : homepage.bottomCtaDescriptionEn}
                </p>
                <span className="inline-block mt-2 px-4 py-2 rounded-xl bg-white text-blue-900 text-xs font-bold">
                  {isBn ? homepage.bottomCtaButtonTextBn : homepage.bottomCtaButtonTextEn}
                </span>
              </div>
            </div>
          )}

          {/* About Preview */}
          {previewSection === 'about' && (
            <div className="p-6 space-y-5">
              <div className="text-center space-y-2 max-w-xl mx-auto">
                <span className="px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold">
                  {isBn ? about.badgeBn : about.badgeEn}
                </span>
                <h2 className="text-2xl font-extrabold text-slate-900">
                  {isBn ? about.pageTitleBn : about.pageTitleEn}
                </h2>
                <p className="text-xs text-slate-600">{isBn ? about.pageDescriptionBn : about.pageDescriptionEn}</p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {about.cards.map((c) => (
                  <div key={c.id} className="p-4 rounded-xl border border-slate-200 space-y-1.5">
                    <ShieldCheck className="w-5 h-5 text-blue-600" />
                    <div className="text-sm font-bold text-slate-900">{isBn ? c.titleBn : c.titleEn}</div>
                    <p className="text-xs text-slate-600">{isBn ? c.descriptionBn : c.descriptionEn}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Contact Preview */}
          {previewSection === 'contact' && (
            <div className="p-6 space-y-4">
              <div className="text-center space-y-1">
                <h2 className="text-xl font-bold text-slate-900">{isBn ? contact.pageTitleBn : contact.pageTitleEn}</h2>
                <p className="text-xs text-slate-500">{isBn ? contact.pageDescriptionBn : contact.pageDescriptionEn}</p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="font-semibold text-slate-900">Support Email</div>
                  <div className="text-blue-700">{contact.supportEmail}</div>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="font-semibold text-slate-900">Phone & Helpline</div>
                  <div className="text-slate-700">{contact.phoneNumber} • Crisis: {contact.crisisPhoneNumber}</div>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 sm:col-span-2">
                  <div className="font-semibold text-slate-900">Office Location & Hours</div>
                  <div className="text-slate-600">
                    {isBn ? contact.officeAddressBn : contact.officeAddressEn} ({isBn ? contact.officeHoursBn : contact.officeHoursEn})
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* FAQs Preview */}
          {previewSection === 'faqs' && (
            <div className="p-6 space-y-3">
              <h2 className="text-lg font-bold text-slate-900 text-center">Frequently Asked Questions</h2>
              {faqs
                .filter((f) => f.enabled)
                .sort((a, b) => a.order - b.order)
                .map((f) => (
                  <div key={f.id} className="p-3.5 rounded-xl border border-slate-200 space-y-1.5">
                    <div className="flex items-center justify-between text-xs font-bold text-slate-900">
                      <span>{isBn ? f.questionBn : f.questionEn}</span>
                      <ChevronDown className="w-4 h-4 text-slate-400" />
                    </div>
                    <p className="text-xs text-slate-600">{isBn ? f.answerBn : f.answerEn}</p>
                  </div>
                ))}
            </div>
          )}

          {/* Articles Preview */}
          {previewSection === 'articles' && (
            <div className="p-6 space-y-4">
              <h2 className="text-lg font-bold text-slate-900">Educational Library Articles</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {articles.map((a) => (
                  <div key={a.id} className="rounded-xl border border-slate-200 overflow-hidden">
                    <img src={a.featuredImageUrl} alt={a.titleEn} className="w-full h-28 object-cover" />
                    <div className="p-3 space-y-1">
                      <div className="flex items-center justify-between text-[10px]">
                        <span className="font-semibold text-blue-700">{isBn ? a.categoryBn : a.category}</span>
                        <Badge variant={a.status === 'published' ? 'emerald' : 'amber'}>{a.status}</Badge>
                      </div>
                      <div className="text-xs font-bold text-slate-900 line-clamp-2">
                        {isBn ? a.titleBn : a.titleEn}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Footer Preview */}
          {previewSection === 'footer' && (
            <div className="bg-slate-50 border-t border-slate-200">
              <div className="bg-blue-800 text-white p-5 flex flex-col sm:flex-row items-center justify-between gap-3">
                <div>
                  <div className="font-bold text-sm">{isBn ? footer.bannerHeadingBn : footer.bannerHeadingEn}</div>
                  <div className="text-xs text-blue-100">{isBn ? footer.bannerSubtextBn : footer.bannerSubtextEn}</div>
                </div>
                <span className="px-4 py-2 rounded-lg bg-white text-blue-900 text-xs font-bold">
                  {isBn ? footer.bannerButtonTextBn : footer.bannerButtonTextEn}
                </span>
              </div>
              <div className="p-6 grid grid-cols-1 sm:grid-cols-4 gap-5 text-xs">
                <div>
                  <div className="font-bold text-slate-900 mb-1">Pathway</div>
                  <p className="text-slate-500">{isBn ? footer.brandTaglineBn : footer.brandTaglineEn}</p>
                </div>
                {footer.columns.map((col) => (
                  <div key={col.id}>
                    <div className="font-bold text-slate-900 mb-2">{isBn ? col.headingBn : col.headingEn}</div>
                    <ul className="space-y-1 text-slate-500">
                      {col.links.map((l) => (
                        <li key={l.id}>{isBn ? l.labelBn : l.labelEn}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
              <div className="px-6 py-4 border-t border-slate-200 flex flex-col sm:flex-row justify-between gap-2 text-[11px] text-slate-500">
                <p>{isBn ? footer.disclaimerBn : footer.disclaimerEn}</p>
                <span>{footer.copyrightText}</span>
              </div>
            </div>
          )}

          {/* SEO SERP Preview */}
          {previewSection === 'seo' && (
            <div className="p-6 space-y-5">
              <div className="p-4 rounded-xl border border-slate-200 space-y-1 max-w-xl">
                <div className="text-[11px] text-emerald-700">{seo.siteCanonicalBaseUrl}</div>
                <div className="text-base font-medium text-blue-700">{seo.globalTitle}</div>
                <p className="text-xs text-slate-600">{seo.globalMetaDescription}</p>
              </div>
              <div className="rounded-xl border border-slate-200 overflow-hidden max-w-md">
                <img src={seo.defaultOgImage} alt="OG preview" className="w-full h-44 object-cover" />
                <div className="p-3 bg-slate-50">
                  <div className="text-xs font-bold text-slate-900">{seo.defaultOgTitle}</div>
                  <div className="text-[11px] text-slate-500 truncate">{seo.globalMetaDescription}</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
};
