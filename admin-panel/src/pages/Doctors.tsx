import React, { useEffect, useState, useCallback } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Search, CheckCircle2, XCircle, Eye, MapPin, Building2, Award } from 'lucide-react';
import { doctorService, DoctorCounts } from '@/services/doctorService';
import { DoctorApprovalStatus, ManagedDoctor } from '@/types/admin';
import { useAdminAuth } from '@/context/AdminAuthContext';
import { useToast } from '@/components/ui/Toast';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Input, Textarea } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Tabs } from '@/components/ui/Tabs';
import { Modal } from '@/components/ui/Modal';
import { DoctorStatusBadge } from '@/components/common/StatusBadges';
import { formatDate } from '@/lib/utils';

export const Doctors: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialStatus = (searchParams.get('status') as DoctorApprovalStatus | 'all') || 'all';

  const { currentAdmin, hasPermission } = useAdminAuth();
  const { showToast } = useToast();

  const [statusTab, setStatusTab] = useState<DoctorApprovalStatus | 'all'>(initialStatus);
  const [search, setSearch] = useState('');
  const [doctors, setDoctors] = useState<ManagedDoctor[]>([]);
  const [counts, setCounts] = useState<DoctorCounts>({ all: 0, pending: 0, approved: 0, rejected: 0 });

  // Review modal state
  const [reviewTarget, setReviewTarget] = useState<{
    doctor: ManagedDoctor;
    decision: 'approved' | 'rejected';
  } | null>(null);
  const [reviewNotes, setReviewNotes] = useState('');

  const loadDoctors = useCallback(async () => {
    const res = await doctorService.list({ status: statusTab, search });
    setDoctors(res.items);
    setCounts(res.counts);
  }, [statusTab, search]);

  useEffect(() => {
    loadDoctors();
  }, [loadDoctors]);

  const handleConfirmReview = async () => {
    if (!reviewTarget) return;
    if (reviewTarget.decision === 'rejected' && !reviewNotes.trim()) {
      showToast('Please provide a reason when rejecting an application.', 'error');
      return;
    }

    await doctorService.reviewApplication(
      reviewTarget.doctor.id,
      reviewTarget.decision,
      reviewNotes,
      currentAdmin?.fullName || 'Admin',
      currentAdmin?.role || 'doctor_manager'
    );

    showToast(
      `${reviewTarget.doctor.fullName} has been ${reviewTarget.decision === 'approved' ? 'approved' : 'rejected'}.`
    );
    setReviewTarget(null);
    setReviewNotes('');
    loadDoctors();
  };

  const canApprove = hasPermission('doctors:approve');

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Doctor Management</h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Verify psychiatrist credentials, review pending BMDC applications, and manage availability.
          </p>
        </div>
      </div>

      <Card>
        <CardHeader className="flex-col lg:flex-row lg:items-center justify-between gap-3">
          <Tabs
            activeTab={statusTab}
            onChange={(id) => {
              const next = id as DoctorApprovalStatus | 'all';
              setStatusTab(next);
              if (next === 'all') searchParams.delete('status');
              else searchParams.set('status', next);
              setSearchParams(searchParams, { replace: true });
            }}
            tabs={[
              { id: 'all', label: 'All Doctors', count: counts.all },
              { id: 'pending', label: 'Pending Approvals', count: counts.pending },
              { id: 'approved', label: 'Approved', count: counts.approved },
              { id: 'rejected', label: 'Rejected', count: counts.rejected },
            ]}
          />

          <div className="relative w-full lg:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search name, BMDC, hospital, specialty..."
              className="pl-9"
            />
          </div>
        </CardHeader>

        <CardContent className="p-5">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {doctors.map((doc) => (
              <div
                key={doc.id}
                className="rounded-xl border border-slate-200 bg-white p-4 flex flex-col justify-between gap-4 hover:border-blue-300 transition-colors"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <img
                        src={doc.photo}
                        alt={doc.fullName}
                        className="w-12 h-12 rounded-xl object-cover bg-slate-100 border border-slate-200 shrink-0"
                      />
                      <div className="min-w-0">
                        <h3 className="font-semibold text-sm text-slate-900 truncate">{doc.fullName}</h3>
                        <p className="text-[11px] text-slate-500 truncate">{doc.qualifications}</p>
                        <div className="text-[11px] font-mono text-blue-700 mt-0.5">{doc.licenseNumber}</div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-2">
                    <DoctorStatusBadge status={doc.approvalStatus} />
                    <span className="text-xs font-bold text-slate-900">৳{doc.consultationFeeBDT}</span>
                  </div>

                  <div className="space-y-1 text-xs text-slate-600">
                    <div className="flex items-center gap-1.5 truncate">
                      <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="truncate">{doc.hospital}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>
                        {doc.city} • {doc.experienceYears} yrs exp
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Award className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="truncate">{doc.specialties.slice(0, 2).join(', ')}</span>
                    </div>
                  </div>

                  {doc.reviewNotes && (
                    <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 text-[11px] text-slate-600 line-clamp-2">
                      {doc.reviewNotes}
                    </div>
                  )}
                </div>

                <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
                  <span className="text-[11px] text-slate-400">Applied {formatDate(doc.appliedAt)}</span>

                  <div className="flex flex-wrap items-center gap-1.5">
                    {canApprove && doc.approvalStatus === 'pending' && (
                      <>
                        <Button
                          size="sm"
                          variant="teal"
                          onClick={() => {
                            setReviewNotes('BMDC credentials verified and approved for Pathway directory.');
                            setReviewTarget({ doctor: doc, decision: 'approved' });
                          }}
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Approve</span>
                        </Button>
                        <Button
                          size="sm"
                          variant="danger"
                          onClick={() => {
                            setReviewNotes('');
                            setReviewTarget({ doctor: doc, decision: 'rejected' });
                          }}
                        >
                          <XCircle className="w-3.5 h-3.5" />
                          <span>Reject</span>
                        </Button>
                      </>
                    )}

                    <Link
                      to={`/doctors/${doc.id}`}
                      className="inline-flex items-center gap-1 h-8 px-2.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-xs font-medium text-slate-700"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Details</span>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {doctors.length === 0 && (
            <div className="py-12 text-center text-xs text-slate-500">
              No doctors match this filter.
            </div>
          )}
        </CardContent>
      </Card>

      {/* Approval / Rejection Confirmation Modal */}
      <Modal
        isOpen={Boolean(reviewTarget)}
        onClose={() => setReviewTarget(null)}
        title={
          reviewTarget?.decision === 'approved'
            ? `Approve ${reviewTarget.doctor.fullName}?`
            : `Reject ${reviewTarget?.doctor.fullName}?`
        }
        subtitle={`License: ${reviewTarget?.doctor.licenseNumber} • ${reviewTarget?.doctor.hospital}`}
        size="md"
        footer={
          <>
            <Button variant="outline" onClick={() => setReviewTarget(null)}>
              Cancel
            </Button>
            <Button
              variant={reviewTarget?.decision === 'approved' ? 'teal' : 'danger'}
              onClick={handleConfirmReview}
            >
              {reviewTarget?.decision === 'approved' ? 'Confirm Approval' : 'Confirm Rejection'}
            </Button>
          </>
        }
      >
        <div className="space-y-3">
          <p className="text-xs text-slate-600">
            {reviewTarget?.decision === 'approved'
              ? 'Approving makes this psychiatrist visible in the public Pathway directory and enables patient appointment booking.'
              : 'Provide clear credential feedback explaining why this application was declined.'}
          </p>
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Review Notes {reviewTarget?.decision === 'rejected' && <span className="text-rose-500">*</span>}
            </label>
            <Textarea
              rows={3}
              value={reviewNotes}
              onChange={(e) => setReviewNotes(e.target.value)}
              placeholder="Enter verification notes or rejection rationale..."
            />
          </div>
        </div>
      </Modal>
    </div>
  );
};
