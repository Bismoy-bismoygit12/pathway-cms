import { MedicalReport, ExtractedValue } from '../types';
import { api } from './api';

const REPORTS_KEY = 'pathway_medical_reports';

function getSeedReports(): MedicalReport[] {
  return [
    {
      id: 'rep-1',
      userId: 'user-shanto',
      title: 'Routine Liver & Metabolic Panel',
      fileName: 'blood_test_oct2026.pdf',
      fileSize: '1.4 MB',
      uploadedAt: '2026-10-20',
      extractedValues: [
        {
          label: 'ALT (SGPT)',
          labelBn: 'এসজিপিটি (ALT)',
          value: '38 U/L',
          referenceRange: '7 - 56 U/L',
          status: 'normal',
          explanation: 'ALT is an enzyme found inside liver cells. Your level is well within the healthy normal range, showing steady liver recovery.',
          explanationBn: 'এটি লিভার কোষের একটি এনজাইম। আপনার মাত্রা স্বাভাবিক সীমার মধ্যে রয়েছে, যা লিভার সুস্থ হওয়ার লক্ষণ।'
        },
        {
          label: 'AST (SGOT)',
          labelBn: 'এসজিওটি (AST)',
          value: '34 U/L',
          referenceRange: '10 - 40 U/L',
          status: 'normal',
          explanation: 'AST levels are within healthy boundaries. This indicates low liver stress over the recent weeks.',
          explanationBn: 'আপনার এসজিওটি মাত্রা পুরোপুরি স্বাভাবিক সীমার ভেতরে।'
        },
        {
          label: 'Serum Bilirubin (Total)',
          labelBn: 'সিরাম বিলিরুবিন',
          value: '0.9 mg/dL',
          referenceRange: '0.2 - 1.2 mg/dL',
          status: 'normal',
          explanation: 'Clear processing of red blood cell breakdown products.',
          explanationBn: 'রক্তের বিলিরুবিন নিষ্কাশন স্বাভাবিক রয়েছে।'
        },
        {
          label: 'Serum Creatinine',
          labelBn: 'সিরাম ক্রিয়েটিনিন',
          value: '1.0 mg/dL',
          referenceRange: '0.7 - 1.3 mg/dL',
          status: 'normal',
          explanation: 'Good kidney filtration. Staying well-hydrated helps maintain this.',
          explanationBn: 'কিডনির কার্যকারিতা ভালো রয়েছে।'
        }
      ],
      lifestyleTips: [
        'Continue drinking 2.5 to 3 liters of water across the day.',
        'Enjoy antioxidant-rich seasonal fruits like amla, papaya, and oranges.',
        'Limit highly processed or deep-fried street foods in the evening.'
      ],
      lifestyleTipsBn: [
        'সারাদিনে পর্যাপ্ত পানি (২.৫ থেকে ৩ লিটার) পান করুন।',
        'আমলকী, পাকা পেঁপে ও লেবুজাতীয় দেশীয় ফল খান।',
        'সন্ধ্যার পর অতিরিক্ত তৈলাক্ত খাবার এড়িয়ে চলুন।'
      ],
      doctorTypeToSee: 'Psychiatrist or General Physician for annual routine wellness check.',
      doctorTypeToSeeBn: 'বাৎসরিক সাধারণ চেকআপের জন্য সাইকিয়াট্রিস্ট বা জেনারেল ফিজিশিয়ান।',
      sharedWithDoctorIds: ['dr-tanvir-ahmed']
    }
  ];
}

export function saveReports(reports: MedicalReport[]) {
  localStorage.setItem(REPORTS_KEY, JSON.stringify(reports));
}

export function getAllReports(): MedicalReport[] {
  const raw = localStorage.getItem(REPORTS_KEY);
  if (!raw) {
    const seeds = getSeedReports();
    localStorage.setItem(REPORTS_KEY, JSON.stringify(seeds));
    return seeds;
  }
  try {
    return JSON.parse(raw);
  } catch {
    return getSeedReports();
  }
}

export function getUserReports(userId: string): MedicalReport[] {
  const all = getAllReports();
  return all.filter((r) => r.userId === userId || String(r.userId).includes('shanto'));
}

export async function fetchReportsFromBackend(): Promise<MedicalReport[]> {
  try {
    const res = await api.get('/reports');
    if (res.success && res.data?.reports && Array.isArray(res.data.reports) && res.data.reports.length > 0) {
      saveReports(res.data.reports);
      return res.data.reports;
    }
  } catch (e) {
    console.warn('Backend reports unreachable, using cached reports', e);
  }
  return getAllReports();
}

export async function addMedicalReport(report: Omit<MedicalReport, 'id' | 'uploadedAt'>): Promise<MedicalReport> {
  try {
    const res = await api.post('/reports', {
      title: report.title,
      fileName: report.fileName,
      reportType: report.doctorTypeToSee || 'Lab Investigation'
    });
    if (res.success && res.data?.report) {
      const all = getAllReports();
      all.unshift(res.data.report);
      saveReports(all);
      return res.data.report;
    }
  } catch (e) {
    console.warn('Backend report creation unreachable, saving locally', e);
  }

  const all = getAllReports();
  const newReport: MedicalReport = {
    ...report,
    id: `rep-${Date.now()}`,
    uploadedAt: new Date().toISOString().split('T')[0]
  };

  all.unshift(newReport);
  saveReports(all);
  return newReport;
}

export async function deleteMedicalReport(reportId: string): Promise<boolean> {
  try {
    const rawId = String(reportId).replace('rep-', '');
    await api.delete(`/reports/${rawId}`);
  } catch (e) {
    console.warn('Backend report deletion unreachable', e);
  }

  const all = getAllReports();
  const filtered = all.filter((r) => r.id !== reportId && String(r.id) !== String(reportId));
  saveReports(filtered);
  return true;
}

export function toggleDoctorReportShare(reportId: string, doctorId: string): MedicalReport | null {
  const all = getAllReports();
  const index = all.findIndex((r) => r.id === reportId);
  if (index === -1) return null;

  const shared = all[index].sharedWithDoctorIds || [];
  if (shared.includes(doctorId)) {
    all[index].sharedWithDoctorIds = shared.filter((id) => id !== doctorId);
  } else {
    all[index].sharedWithDoctorIds = [...shared, doctorId];
  }

  saveReports(all);
  return all[index];
}
