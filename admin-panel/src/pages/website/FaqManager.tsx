import React from 'react';
import { Plus, Trash2, ArrowUp, ArrowDown } from 'lucide-react';
import { useCms } from '@/context/CmsContext';
import { useAdminAuth } from '@/context/AdminAuthContext';
import { PublishToolbar } from '@/components/cms/PublishToolbar';
import { BilingualField } from '@/components/cms/BilingualField';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Switch } from '@/components/ui/Switch';
import { Badge } from '@/components/ui/Badge';
import { FaqItem } from '@/types/cms';

export const FaqManager: React.FC = () => {
  const { sections, updateDraft } = useCms();
  const { hasPermission } = useAdminAuth();
  const canEdit = hasPermission('cms:edit');

  const sortedFaqs = [...sections.faqs.draft].sort((a, b) => a.order - b.order);

  const updateFaq = (id: string, updates: Partial<FaqItem>) => {
    updateDraft('faqs', (prev) => prev.map((f) => (f.id === id ? { ...f, ...updates } : f)));
  };

  const addFaq = () => {
    const nextOrder = sortedFaqs.length > 0 ? Math.max(...sortedFaqs.map((f) => f.order)) + 1 : 1;
    const item: FaqItem = {
      id: `faq-${Date.now()}`,
      questionEn: 'New Frequently Asked Question',
      questionBn: 'নতুন প্রশ্ন লিখুন',
      answerEn: 'Provide a clear, reassuring, compassionate answer here.',
      answerBn: 'সহজ ও সহানুভূতিশীল উত্তর লিখুন।',
      order: nextOrder,
      enabled: true,
    };
    updateDraft('faqs', (prev) => [...prev, item]);
  };

  const moveFaq = (idx: number, dir: -1 | 1) => {
    const target = idx + dir;
    if (target < 0 || target >= sortedFaqs.length) return;
    const list = [...sortedFaqs];
    [list[idx], list[target]] = [list[target], list[idx]];
    updateDraft(
      'faqs',
      list.map((item, i) => ({ ...item, order: i + 1 }))
    );
  };

  const deleteFaq = (id: string) => {
    updateDraft('faqs', (prev) =>
      prev.filter((f) => f.id !== id).map((item, i) => ({ ...item, order: i + 1 }))
    );
  };

  return (
    <div className="space-y-6">
      <PublishToolbar
        section="faqs"
        title="FAQ Manager"
        description="Create, edit, reorder, enable/disable, or delete questions shown on Pathway's public /faq page."
      />

      <div className="flex items-center justify-between">
        <div className="text-xs text-slate-500">
          {sortedFaqs.filter((f) => f.enabled).length} enabled of {sortedFaqs.length} total FAQs
        </div>
        {canEdit && (
          <Button size="sm" onClick={addFaq}>
            <Plus className="w-4 h-4" />
            <span>Add New FAQ</span>
          </Button>
        )}
      </div>

      <div className="space-y-4">
        {sortedFaqs.map((faq, idx) => (
          <Card key={faq.id}>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Badge variant="blue">#{idx + 1}</Badge>
                <CardTitle className="line-clamp-1">{faq.questionEn}</CardTitle>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5 text-xs text-slate-600">
                  <span>{faq.enabled ? 'Visible' : 'Hidden'}</span>
                  <Switch
                    checked={faq.enabled}
                    disabled={!canEdit}
                    onChange={(val) => updateFaq(faq.id, { enabled: val })}
                  />
                </div>
                {canEdit && (
                  <div className="flex items-center gap-1">
                    <Button size="sm" variant="outline" disabled={idx === 0} onClick={() => moveFaq(idx, -1)}>
                      <ArrowUp className="w-3.5 h-3.5" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      disabled={idx === sortedFaqs.length - 1}
                      onClick={() => moveFaq(idx, 1)}
                    >
                      <ArrowDown className="w-3.5 h-3.5" />
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => deleteFaq(faq.id)}>
                      <Trash2 className="w-3.5 h-3.5 text-rose-600" />
                    </Button>
                  </div>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <BilingualField
                label="Question"
                valueEn={faq.questionEn}
                valueBn={faq.questionBn}
                onChangeEn={(v) => updateFaq(faq.id, { questionEn: v })}
                onChangeBn={(v) => updateFaq(faq.id, { questionBn: v })}
                disabled={!canEdit}
              />
              <BilingualField
                label="Answer"
                valueEn={faq.answerEn}
                valueBn={faq.answerBn}
                onChangeEn={(v) => updateFaq(faq.id, { answerEn: v })}
                onChangeBn={(v) => updateFaq(faq.id, { answerBn: v })}
                multiline
                rows={3}
                disabled={!canEdit}
              />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
