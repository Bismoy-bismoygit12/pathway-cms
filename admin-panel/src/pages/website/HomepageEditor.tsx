import React, { useState } from 'react';
import { Plus, Trash2, Image as ImageIcon, ArrowUp, ArrowDown } from 'lucide-react';
import { useCms } from '@/context/CmsContext';
import { useAdminAuth } from '@/context/AdminAuthContext';
import { PublishToolbar } from '@/components/cms/PublishToolbar';
import { BilingualField } from '@/components/cms/BilingualField';
import { MediaPickerModal } from '@/components/cms/MediaPickerModal';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Tabs } from '@/components/ui/Tabs';
import { Input, Select } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Switch } from '@/components/ui/Switch';
import { HeroSlideItem, TestimonialItem } from '@/types/cms';

export const HomepageEditor: React.FC = () => {
  const { sections, updateDraft } = useCms();
  const { hasPermission } = useAdminAuth();
  const canEdit = hasPermission('cms:edit');
  const draft = sections.homepage.draft;

  const [tab, setTab] = useState('hero');
  const [pickerTarget, setPickerTarget] = useState<{ type: 'heroBg' } | { type: 'slide'; index: number } | null>(null);

  const patch = (updates: Partial<typeof draft>) => {
    updateDraft('homepage', (prev) => ({ ...prev, ...updates }));
  };

  const updateSlide = (idx: number, updates: Partial<HeroSlideItem>) => {
    updateDraft('homepage', (prev) => ({
      ...prev,
      carouselSlides: prev.carouselSlides.map((s, i) => (i === idx ? { ...s, ...updates } : s)),
    }));
  };

  const addSlide = () => {
    const newSlide: HeroSlideItem = {
      id: `slide-${Date.now()}`,
      imageUrl: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=900&auto=format&fit=crop',
      badgeEn: 'Clinical Care',
      badgeBn: 'ক্লিনিক্যাল সেবা',
      titleEn: 'New Clinical Highlight',
      titleBn: 'নতুন স্বাস্থ্যসেবা শিরোনাম',
      subtitleEn: 'Compassionate support backed by verified standards.',
      subtitleBn: 'যাচাইকৃত মানদণ্ডে সহমর্মিতাপূর্ণ সেবা।',
      statEn: '24/7',
      statBn: '২৪/৭',
      statLabelEn: 'Support Available',
      statLabelBn: 'সহায়তা উপলব্ধ',
    };
    patch({ carouselSlides: [...draft.carouselSlides, newSlide] });
  };

  const moveSlide = (idx: number, dir: -1 | 1) => {
    const next = [...draft.carouselSlides];
    const target = idx + dir;
    if (target < 0 || target >= next.length) return;
    [next[idx], next[target]] = [next[target], next[idx]];
    patch({ carouselSlides: next });
  };

  const removeSlide = (idx: number) => {
    patch({ carouselSlides: draft.carouselSlides.filter((_, i) => i !== idx) });
  };

  const addTestimonial = () => {
    const item: TestimonialItem = {
      id: `test-${Date.now()}`,
      quoteEn: 'A safe and supportive space that helped me take daily steps forward.',
      quoteBn: 'নিরাপদ ও সহমর্মিতাপূর্ণ পরিবেশ আমাকে এগিয়ে যেতে সাহায্য করেছে।',
      authorAlias: 'Community Member, Dhaka',
      roleOrContextEn: 'Verified Platform User',
      roleOrContextBn: 'নিবন্ধিত ব্যবহারকারী',
      enabled: true,
    };
    patch({ testimonials: [...draft.testimonials, item] });
  };

  return (
    <div className="space-y-6">
      <PublishToolbar
        section="homepage"
        title="Homepage Content Editor"
        description="Edit Pathway's public landing page sections in English & Bangla, preview across devices, and publish when ready."
      />

      <Tabs
        activeTab={tab}
        onChange={setTab}
        tabs={[
          { id: 'hero', label: 'Hero & CTAs' },
          { id: 'carousel', label: 'Hero Carousel', count: draft.carouselSlides.length },
          { id: 'pillars', label: '4 Core Pillars' },
          { id: 'metrics', label: 'Metrics & 4 Steps' },
          { id: 'featured', label: 'Featured & Testimonials' },
          { id: 'bottomCta', label: 'Bottom CTA' },
        ]}
      />

      {tab === 'hero' && (
        <Card>
          <CardHeader>
            <CardTitle>Hero Headline, Description, Background & Action Buttons</CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            <BilingualField
              label="Overline Tagline Pill"
              valueEn={draft.heroTagEn}
              valueBn={draft.heroTagBn}
              onChangeEn={(v) => patch({ heroTagEn: v })}
              onChangeBn={(v) => patch({ heroTagBn: v })}
              disabled={!canEdit}
            />

            <BilingualField
              label="Hero Heading Line 1"
              valueEn={draft.heroHeadingLine1En}
              valueBn={draft.heroHeadingLine1Bn}
              onChangeEn={(v) => patch({ heroHeadingLine1En: v })}
              onChangeBn={(v) => patch({ heroHeadingLine1Bn: v })}
              disabled={!canEdit}
            />

            <BilingualField
              label="Hero Heading Highlight (Blue Accent)"
              valueEn={draft.heroHeadingHighlightEn}
              valueBn={draft.heroHeadingHighlightBn}
              onChangeEn={(v) => patch({ heroHeadingHighlightEn: v })}
              onChangeBn={(v) => patch({ heroHeadingHighlightBn: v })}
              disabled={!canEdit}
            />

            <BilingualField
              label="Hero Description Paragraph"
              valueEn={draft.heroDescriptionEn}
              valueBn={draft.heroDescriptionBn}
              onChangeEn={(v) => patch({ heroDescriptionEn: v })}
              onChangeBn={(v) => patch({ heroDescriptionBn: v })}
              multiline
              disabled={!canEdit}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-slate-100">
              <div className="space-y-3">
                <BilingualField
                  label="Primary CTA Button Label"
                  valueEn={draft.primaryCtaTextEn}
                  valueBn={draft.primaryCtaTextBn}
                  onChangeEn={(v) => patch({ primaryCtaTextEn: v })}
                  onChangeBn={(v) => patch({ primaryCtaTextBn: v })}
                  disabled={!canEdit}
                />
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Primary CTA Route</label>
                  <Input
                    value={draft.primaryCtaLink}
                    onChange={(e) => patch({ primaryCtaLink: e.target.value })}
                    disabled={!canEdit}
                  />
                </div>
              </div>

              <div className="space-y-3">
                <BilingualField
                  label="Secondary CTA Button Label"
                  valueEn={draft.secondaryCtaTextEn}
                  valueBn={draft.secondaryCtaTextBn}
                  onChangeEn={(v) => patch({ secondaryCtaTextEn: v })}
                  onChangeBn={(v) => patch({ secondaryCtaTextBn: v })}
                  disabled={!canEdit}
                />
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Secondary CTA Route</label>
                  <Input
                    value={draft.secondaryCtaLink}
                    onChange={(e) => patch({ secondaryCtaLink: e.target.value })}
                    disabled={!canEdit}
                  />
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 space-y-2">
              <label className="block text-xs font-semibold text-slate-700">Hero Ambient / Background Image URL</label>
              <div className="flex flex-col sm:flex-row gap-2">
                <Input
                  value={draft.heroBackgroundImageUrl}
                  onChange={(e) => patch({ heroBackgroundImageUrl: e.target.value })}
                  disabled={!canEdit}
                />
                {canEdit && (
                  <Button variant="outline" onClick={() => setPickerTarget({ type: 'heroBg' })}>
                    <ImageIcon className="w-4 h-4" />
                    <span>Pick Media</span>
                  </Button>
                )}
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-700">Trust Highlights Strip</span>
                {canEdit && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() =>
                      patch({
                        trustHighlights: [
                          ...draft.trustHighlights,
                          { id: `th-${Date.now()}`, textEn: 'New Trust Item', textBn: 'নতুন তথ্য' },
                        ],
                      })
                    }
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Highlight</span>
                  </Button>
                )}
              </div>
              {draft.trustHighlights.map((th, idx) => (
                <div key={th.id} className="flex items-end gap-2 p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="flex-1">
                    <BilingualField
                      label={`Highlight #${idx + 1}`}
                      valueEn={th.textEn}
                      valueBn={th.textBn}
                      onChangeEn={(v) =>
                        patch({
                          trustHighlights: draft.trustHighlights.map((item, i) =>
                            i === idx ? { ...item, textEn: v } : item
                          ),
                        })
                      }
                      onChangeBn={(v) =>
                        patch({
                          trustHighlights: draft.trustHighlights.map((item, i) =>
                            i === idx ? { ...item, textBn: v } : item
                          ),
                        })
                      }
                      disabled={!canEdit}
                    />
                  </div>
                  {canEdit && (
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() =>
                        patch({ trustHighlights: draft.trustHighlights.filter((_, i) => i !== idx) })
                      }
                    >
                      <Trash2 className="w-4 h-4 text-rose-500" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {tab === 'carousel' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-xs text-slate-500">Manage slides displayed in HeroPharmaCarousel on the homepage.</p>
            {canEdit && (
              <Button size="sm" onClick={addSlide}>
                <Plus className="w-4 h-4" />
                <span>Add Carousel Slide</span>
              </Button>
            )}
          </div>

          {draft.carouselSlides.map((slide, idx) => (
            <Card key={slide.id}>
              <CardHeader>
                <CardTitle>
                  Slide #{idx + 1}: {slide.titleEn}
                </CardTitle>
                {canEdit && (
                  <div className="flex items-center gap-1">
                    <Button size="sm" variant="outline" disabled={idx === 0} onClick={() => moveSlide(idx, -1)}>
                      <ArrowUp className="w-3.5 h-3.5" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      disabled={idx === draft.carouselSlides.length - 1}
                      onClick={() => moveSlide(idx, 1)}
                    >
                      <ArrowDown className="w-3.5 h-3.5" />
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => removeSlide(idx)}>
                      <Trash2 className="w-3.5 h-3.5 text-rose-600" />
                    </Button>
                  </div>
                )}
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-col sm:flex-row gap-4 items-start">
                  <img
                    src={slide.imageUrl}
                    alt={slide.titleEn}
                    className="w-full sm:w-44 h-28 object-cover rounded-xl border border-slate-200 shrink-0"
                  />
                  <div className="flex-1 w-full space-y-2">
                    <label className="block text-xs font-medium text-slate-700">Slide Image URL</label>
                    <div className="flex gap-2">
                      <Input
                        value={slide.imageUrl}
                        onChange={(e) => updateSlide(idx, { imageUrl: e.target.value })}
                        disabled={!canEdit}
                      />
                      {canEdit && (
                        <Button variant="outline" onClick={() => setPickerTarget({ type: 'slide', index: idx })}>
                          <ImageIcon className="w-4 h-4" />
                          <span>Media</span>
                        </Button>
                      )}
                    </div>
                  </div>
                </div>

                <BilingualField
                  label="Slide Badge Label"
                  valueEn={slide.badgeEn}
                  valueBn={slide.badgeBn}
                  onChangeEn={(v) => updateSlide(idx, { badgeEn: v })}
                  onChangeBn={(v) => updateSlide(idx, { badgeBn: v })}
                  disabled={!canEdit}
                />
                <BilingualField
                  label="Slide Title"
                  valueEn={slide.titleEn}
                  valueBn={slide.titleBn}
                  onChangeEn={(v) => updateSlide(idx, { titleEn: v })}
                  onChangeBn={(v) => updateSlide(idx, { titleBn: v })}
                  disabled={!canEdit}
                />
                <BilingualField
                  label="Slide Subtitle"
                  valueEn={slide.subtitleEn}
                  valueBn={slide.subtitleBn}
                  onChangeEn={(v) => updateSlide(idx, { subtitleEn: v })}
                  onChangeBn={(v) => updateSlide(idx, { subtitleBn: v })}
                  disabled={!canEdit}
                />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <BilingualField
                    label="Floating Stat Value (e.g. 100%, 24/7)"
                    valueEn={slide.statEn}
                    valueBn={slide.statBn}
                    onChangeEn={(v) => updateSlide(idx, { statEn: v })}
                    onChangeBn={(v) => updateSlide(idx, { statBn: v })}
                    disabled={!canEdit}
                  />
                  <BilingualField
                    label="Floating Stat Label"
                    valueEn={slide.statLabelEn}
                    valueBn={slide.statLabelBn}
                    onChangeEn={(v) => updateSlide(idx, { statLabelEn: v })}
                    onChangeBn={(v) => updateSlide(idx, { statLabelBn: v })}
                    disabled={!canEdit}
                  />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {tab === 'pillars' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {draft.featurePillars.map((pillar, idx) => (
            <Card key={pillar.id}>
              <CardHeader>
                <CardTitle>Pillar Card #{idx + 1}</CardTitle>
                <Select
                  value={pillar.colorScheme}
                  disabled={!canEdit}
                  onChange={(e) =>
                    patch({
                      featurePillars: draft.featurePillars.map((p, i) =>
                        i === idx ? { ...p, colorScheme: e.target.value as typeof p.colorScheme } : p
                      ),
                    })
                  }
                >
                  <option value="blue">Blue Accent</option>
                  <option value="cyan">Cyan Accent</option>
                  <option value="indigo">Indigo Accent</option>
                  <option value="rose">Rose Accent</option>
                </Select>
              </CardHeader>
              <CardContent className="space-y-3">
                <BilingualField
                  label="Card Heading"
                  valueEn={pillar.titleEn}
                  valueBn={pillar.titleBn}
                  onChangeEn={(v) =>
                    patch({
                      featurePillars: draft.featurePillars.map((p, i) =>
                        i === idx ? { ...p, titleEn: v } : p
                      ),
                    })
                  }
                  onChangeBn={(v) =>
                    patch({
                      featurePillars: draft.featurePillars.map((p, i) =>
                        i === idx ? { ...p, titleBn: v } : p
                      ),
                    })
                  }
                  disabled={!canEdit}
                />
                <BilingualField
                  label="Card Description"
                  valueEn={pillar.descriptionEn}
                  valueBn={pillar.descriptionBn}
                  onChangeEn={(v) =>
                    patch({
                      featurePillars: draft.featurePillars.map((p, i) =>
                        i === idx ? { ...p, descriptionEn: v } : p
                      ),
                    })
                  }
                  onChangeBn={(v) =>
                    patch({
                      featurePillars: draft.featurePillars.map((p, i) =>
                        i === idx ? { ...p, descriptionBn: v } : p
                      ),
                    })
                  }
                  multiline
                  rows={2}
                  disabled={!canEdit}
                />
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {tab === 'metrics' && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Royal Blue Metrics Highlight Banner (4 Stats)</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {draft.metricsBanner.map((metric, idx) => (
                <div key={metric.id} className="p-4 rounded-xl border border-slate-200 space-y-3 bg-slate-50/50">
                  <BilingualField
                    label={`Metric #${idx + 1} Value`}
                    valueEn={metric.valueEn}
                    valueBn={metric.valueBn}
                    onChangeEn={(v) =>
                      patch({
                        metricsBanner: draft.metricsBanner.map((m, i) =>
                          i === idx ? { ...m, valueEn: v } : m
                        ),
                      })
                    }
                    onChangeBn={(v) =>
                      patch({
                        metricsBanner: draft.metricsBanner.map((m, i) =>
                          i === idx ? { ...m, valueBn: v } : m
                        ),
                      })
                    }
                    disabled={!canEdit}
                  />
                  <BilingualField
                    label="Metric Label"
                    valueEn={metric.labelEn}
                    valueBn={metric.labelBn}
                    onChangeEn={(v) =>
                      patch({
                        metricsBanner: draft.metricsBanner.map((m, i) =>
                          i === idx ? { ...m, labelEn: v } : m
                        ),
                      })
                    }
                    onChangeBn={(v) =>
                      patch({
                        metricsBanner: draft.metricsBanner.map((m, i) =>
                          i === idx ? { ...m, labelBn: v } : m
                        ),
                      })
                    }
                    disabled={!canEdit}
                  />
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>How It Works Section & 4 Steps</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <BilingualField
                label="Section Heading"
                valueEn={draft.howItWorksHeadingEn}
                valueBn={draft.howItWorksHeadingBn}
                onChangeEn={(v) => patch({ howItWorksHeadingEn: v })}
                onChangeBn={(v) => patch({ howItWorksHeadingBn: v })}
                disabled={!canEdit}
              />
              <BilingualField
                label="Section Subtitle"
                valueEn={draft.howItWorksSubtitleEn}
                valueBn={draft.howItWorksSubtitleBn}
                onChangeEn={(v) => patch({ howItWorksSubtitleEn: v })}
                onChangeBn={(v) => patch({ howItWorksSubtitleBn: v })}
                disabled={!canEdit}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                {draft.howItWorksSteps.map((step, idx) => (
                  <div key={step.id} className="p-4 rounded-xl border border-slate-200 space-y-3">
                    <div className="text-xs font-bold text-blue-700">Step {step.stepNumber}</div>
                    <BilingualField
                      label="Step Title"
                      valueEn={step.titleEn}
                      valueBn={step.titleBn}
                      onChangeEn={(v) =>
                        patch({
                          howItWorksSteps: draft.howItWorksSteps.map((s, i) =>
                            i === idx ? { ...s, titleEn: v } : s
                          ),
                        })
                      }
                      onChangeBn={(v) =>
                        patch({
                          howItWorksSteps: draft.howItWorksSteps.map((s, i) =>
                            i === idx ? { ...s, titleBn: v } : s
                          ),
                        })
                      }
                      disabled={!canEdit}
                    />
                    <BilingualField
                      label="Step Description"
                      valueEn={step.descriptionEn}
                      valueBn={step.descriptionBn}
                      onChangeEn={(v) =>
                        patch({
                          howItWorksSteps: draft.howItWorksSteps.map((s, i) =>
                            i === idx ? { ...s, descriptionEn: v } : s
                          ),
                        })
                      }
                      onChangeBn={(v) =>
                        patch({
                          howItWorksSteps: draft.howItWorksSteps.map((s, i) =>
                            i === idx ? { ...s, descriptionBn: v } : s
                          ),
                        })
                      }
                      multiline
                      rows={2}
                      disabled={!canEdit}
                    />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {tab === 'featured' && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Featured Doctors & Educational Library Section Headers</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <BilingualField
                label="Featured Doctors Overline"
                valueEn={draft.featuredDoctorsOverlineEn}
                valueBn={draft.featuredDoctorsOverlineBn}
                onChangeEn={(v) => patch({ featuredDoctorsOverlineEn: v })}
                onChangeBn={(v) => patch({ featuredDoctorsOverlineBn: v })}
                disabled={!canEdit}
              />
              <BilingualField
                label="Featured Doctors Heading"
                valueEn={draft.featuredDoctorsHeadingEn}
                valueBn={draft.featuredDoctorsHeadingBn}
                onChangeEn={(v) => patch({ featuredDoctorsHeadingEn: v })}
                onChangeBn={(v) => patch({ featuredDoctorsHeadingBn: v })}
                disabled={!canEdit}
              />
              <BilingualField
                label="Featured Library Heading"
                valueEn={draft.featuredLibraryHeadingEn}
                valueBn={draft.featuredLibraryHeadingBn}
                onChangeEn={(v) => patch({ featuredLibraryHeadingEn: v })}
                onChangeBn={(v) => patch({ featuredLibraryHeadingBn: v })}
                disabled={!canEdit}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Testimonials / Community Voices</CardTitle>
              {canEdit && (
                <Button size="sm" variant="outline" onClick={addTestimonial}>
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Testimonial</span>
                </Button>
              )}
            </CardHeader>
            <CardContent className="space-y-4">
              {draft.testimonials.map((t, idx) => (
                <div key={t.id} className="p-4 rounded-xl border border-slate-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-800">Testimonial #{idx + 1}</span>
                    <div className="flex items-center gap-3">
                      <Switch
                        checked={t.enabled}
                        disabled={!canEdit}
                        onChange={(val) =>
                          patch({
                            testimonials: draft.testimonials.map((x, i) =>
                              i === idx ? { ...x, enabled: val } : x
                            ),
                          })
                        }
                      />
                      {canEdit && (
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() =>
                            patch({ testimonials: draft.testimonials.filter((_, i) => i !== idx) })
                          }
                        >
                          <Trash2 className="w-4 h-4 text-rose-500" />
                        </Button>
                      )}
                    </div>
                  </div>
                  <BilingualField
                    label="Quote"
                    valueEn={t.quoteEn}
                    valueBn={t.quoteBn}
                    onChangeEn={(v) =>
                      patch({
                        testimonials: draft.testimonials.map((x, i) =>
                          i === idx ? { ...x, quoteEn: v } : x
                        ),
                      })
                    }
                    onChangeBn={(v) =>
                      patch({
                        testimonials: draft.testimonials.map((x, i) =>
                          i === idx ? { ...x, quoteBn: v } : x
                        ),
                      })
                    }
                    multiline
                    rows={2}
                    disabled={!canEdit}
                  />
                  <Input
                    value={t.authorAlias}
                    disabled={!canEdit}
                    onChange={(e) =>
                      patch({
                        testimonials: draft.testimonials.map((x, i) =>
                          i === idx ? { ...x, authorAlias: e.target.value } : x
                        ),
                      })
                    }
                    placeholder="Author Alias (e.g. Anonymous Member, Dhaka)"
                  />
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      )}

      {tab === 'bottomCta' && (
        <Card>
          <CardHeader>
            <CardTitle>Bottom Conversion Call-to-Action Card</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <BilingualField
              label="CTA Heading"
              valueEn={draft.bottomCtaHeadingEn}
              valueBn={draft.bottomCtaHeadingBn}
              onChangeEn={(v) => patch({ bottomCtaHeadingEn: v })}
              onChangeBn={(v) => patch({ bottomCtaHeadingBn: v })}
              disabled={!canEdit}
            />
            <BilingualField
              label="CTA Description"
              valueEn={draft.bottomCtaDescriptionEn}
              valueBn={draft.bottomCtaDescriptionBn}
              onChangeEn={(v) => patch({ bottomCtaDescriptionEn: v })}
              onChangeBn={(v) => patch({ bottomCtaDescriptionBn: v })}
              multiline
              disabled={!canEdit}
            />
            <BilingualField
              label="CTA Button Text"
              valueEn={draft.bottomCtaButtonTextEn}
              valueBn={draft.bottomCtaButtonTextBn}
              onChangeEn={(v) => patch({ bottomCtaButtonTextEn: v })}
              onChangeBn={(v) => patch({ bottomCtaButtonTextBn: v })}
              disabled={!canEdit}
            />
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">CTA Destination Route</label>
              <Input
                value={draft.bottomCtaButtonLink}
                disabled={!canEdit}
                onChange={(e) => patch({ bottomCtaButtonLink: e.target.value })}
              />
            </div>
          </CardContent>
        </Card>
      )}

      <MediaPickerModal
        isOpen={Boolean(pickerTarget)}
        onClose={() => setPickerTarget(null)}
        currentUrl={
          pickerTarget?.type === 'heroBg'
            ? draft.heroBackgroundImageUrl
            : pickerTarget?.type === 'slide'
            ? draft.carouselSlides[pickerTarget.index]?.imageUrl
            : undefined
        }
        onSelect={(url) => {
          if (!pickerTarget) return;
          if (pickerTarget.type === 'heroBg') patch({ heroBackgroundImageUrl: url });
          else updateSlide(pickerTarget.index, { imageUrl: url });
        }}
      />
    </div>
  );
};
