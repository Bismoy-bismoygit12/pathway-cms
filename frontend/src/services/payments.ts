import { api } from './api';

export interface PaymentRecord {
  id: string;
  userId: string;
  type: 'subscription' | 'consultation';
  title: string;
  titleBn: string;
  amountBDT: number;
  method: 'bkash' | 'nagad' | 'card' | 'clinic';
  status: 'completed' | 'refunded';
  date: string;
  referenceId: string;
}

const PAYMENTS_KEY = 'pathway_payment_records';

function getSeedPayments(): PaymentRecord[] {
  return [
    {
      id: 'pay-1',
      userId: 'user-shanto',
      type: 'consultation',
      title: 'Consultation with Prof. Dr. Tanvir Ahmed',
      titleBn: 'অধ্যাপক ডাঃ তানভীর আহমেদের অনলাইন ভিজিট ফি',
      amountBDT: 2000,
      method: 'bkash',
      status: 'completed',
      date: '2026-11-09',
      referenceId: 'BKASH-TXN-884912'
    }
  ];
}

export function getAllPayments(): PaymentRecord[] {
  const raw = localStorage.getItem(PAYMENTS_KEY);
  if (!raw) {
    const seeds = getSeedPayments();
    localStorage.setItem(PAYMENTS_KEY, JSON.stringify(seeds));
    return seeds;
  }
  try {
    return JSON.parse(raw);
  } catch {
    return getSeedPayments();
  }
}

export function savePayments(payments: PaymentRecord[]) {
  localStorage.setItem(PAYMENTS_KEY, JSON.stringify(payments));
}

export function getUserPayments(userId: string): PaymentRecord[] {
  const all = getAllPayments();
  return all.filter((p) => p.userId === userId || String(p.userId).includes('shanto'));
}

export async function fetchPaymentsFromBackend(): Promise<PaymentRecord[]> {
  try {
    const res = await api.get('/payments/my');
    if (res.success && res.data?.payments && Array.isArray(res.data.payments) && res.data.payments.length > 0) {
      savePayments(res.data.payments);
      return res.data.payments;
    }
  } catch (e) {
    console.warn('Backend payments unreachable, using local storage cache', e);
  }
  return getAllPayments();
}

export async function recordPayment(payment: Omit<PaymentRecord, 'id' | 'date'>): Promise<PaymentRecord> {
  const newRecord: PaymentRecord = {
    ...payment,
    id: `pay-${Date.now()}`,
    date: new Date().toISOString().split('T')[0]
  };

  try {
    await api.post('/payments', {
      appointmentId: payment.referenceId || '1',
      amount: payment.amountBDT,
      paymentMethod: payment.method,
      transactionReference: payment.referenceId
    });
  } catch (e) {
    console.warn('Payment recording API pending', e);
  }

  const all = getAllPayments();
  all.unshift(newRecord);
  savePayments(all);
  return newRecord;
}

// Download receipt printable summary
export function downloadReceipt(payment: PaymentRecord) {
  const receiptHtml = `
    <!DOCTYPE html>
    <html>
      <head>
        <title>Pathway Receipt - ${payment.referenceId}</title>
        <style>
          body { font-family: sans-serif; padding: 2.5rem; max-width: 600px; margin: 0 auto; color: #2d3748; border: 1px solid #e2e8f0; border-radius: 8px; }
          .header { border-bottom: 2px solid #1d4ed8; padding-bottom: 1rem; margin-bottom: 1.5rem; }
          .logo { font-size: 24px; font-weight: bold; color: #1d4ed8; }
          .badge { display: inline-block; padding: 3px 8px; border-radius: 4px; font-size: 12px; font-weight: bold; background: #dbeafe; color: #1e40af; }
          .table { width: 100%; border-collapse: collapse; margin: 1.5rem 0; }
          .table td { padding: 8px 0; border-bottom: 1px solid #edf2f7; }
          .total { font-size: 18px; font-weight: bold; color: #1a202c; }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="logo">Pathway</div>
          <p style="margin: 4px 0; font-size: 13px; color: #718096;">Digital Payment Receipt &bull; Tax Inclusive</p>
        </div>
        <p><span class="badge">Status: ${payment.status.toUpperCase()}</span> &bull; <strong>Ref:</strong> ${payment.referenceId}</p>
        <table class="table">
          <tr><td><strong>Date:</strong></td><td style="text-align: right;">${payment.date}</td></tr>
          <tr><td><strong>Description:</strong></td><td style="text-align: right;">${payment.title}</td></tr>
          <tr><td><strong>Payment Method:</strong></td><td style="text-align: right;">${payment.method.toUpperCase()}</td></tr>
          <tr class="total"><td>Total Paid:</td><td style="text-align: right;">BDT ${payment.amountBDT.toLocaleString()}</td></tr>
        </table>
        <p style="font-size: 11px; color: #a0aec0; margin-top: 2rem;">Pathway &bull; Dhaka, Bangladesh &bull; info@pathway.support</p>
      </body>
    </html>
  `;

  const blob = new Blob([receiptHtml], { type: 'text/html;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const win = window.open(url, '_blank');
  if (!win) {
    const a = document.createElement('a');
    a.href = url;
    a.download = `pathway-receipt-${payment.referenceId}.html`;
    a.click();
  }
}
