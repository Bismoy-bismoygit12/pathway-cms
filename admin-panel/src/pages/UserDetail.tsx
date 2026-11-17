import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  ShieldAlert,
  ShieldCheck,
  Lock,
  CheckCircle2,
  Target,
  Activity,
  TrendingUp,
  User as UserIcon,
} from 'lucide-react';
import { userService } from '@/services/userService';
import { ManagedUser, ManagedUserStatus } from '@/types/admin';
import { useAdminAuth } from '@/context/AdminAuthContext';
import { useToast } from '@/components/ui/Toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Input, Select } from '@/components/ui/Input';
import { UserStatusBadge } from '@/components/common/StatusBadges';
import { formatDate, formatDateTime } from '@/lib/utils';

export const UserDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { currentAdmin, hasPermission } = useAdminAuth();
  const { showToast } = useToast();

  const [user, setUser] = useState<ManagedUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState<ManagedUserStatus>('active');
  const [statusReason, setStatusReason] = useState('');

  // Sensitive recovery authorization state
  const [accessPurpose, setAccessPurpose] = useState('');
  const [recoveryUnlocked, setRecoveryUnlocked] = useState(false);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    setRecoveryUnlocked(false);
    setAccessPurpose('');
    userService.getById(id).then((res) => {
      setUser(res);
      if (res) setSelectedStatus(res.status);
      setLoading(false);
    });
  }, [id]);

  const canManageStatus = hasPermission('users:manage');
  const canViewRecoveryRole = hasPermission('users:view_recovery');

  const handleUpdateStatus = async () => {
    if (!user || !canManageStatus) return;
    const updated = await userService.updateStatus(
      user.id,
      selectedStatus,
      currentAdmin?.fullName || 'Admin',
      currentAdmin?.role || 'admin',
      statusReason.trim() || 'Updated on User Profile screen'
    );
    setUser(updated);
    setStatusReason('');
    showToast(`Account status updated to ${updated.status}`);
  };

  const handleUnlockRecovery = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !canViewRecoveryRole || !user.shareRecoveryWithAdmin) return;
    if (accessPurpose.trim().length < 8) {
      showToast('Please enter a valid clinical or support justification (min 8 chars).', 'error');
      return;
    }
    await userService.logSensitiveRecoveryView(
      user.id,
      user.fullName,
      currentAdmin?.fullName || 'Admin',
      currentAdmin?.role || 'admin',
      accessPurpose.trim()
    );
    setRecoveryUnlocked(true);
    showToast('Recovery records unlocked and logged in audit trail.');
  };

  if (loading) {
    return <div className="p-8 text-center text-sm text-slate-500">Loading user profile...</div>;
  }

  if (!user) {
    return (
      <Card>
        <CardContent className="py-12 text-center space-y-3">
          <div className="text-base font-semibold text-slate-900">User Not Found</div>
          <Link to="/users" className="text-xs text-blue-700 font-semibold hover:underline">
            &larr; Return to User Directory
          </Link>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <Link
            to="/users"
            className="p-2 rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 transition"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-xl font-bold text-slate-900">{user.fullName}</h2>
              <UserStatusBadge status={user.status} />
            </div>
            <p className="text-xs text-slate-500">
              {user.id} • Nickname: @{user.nickname} • {user.email}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Basic Profile & Registration Details */}
        <Card className="lg:col-span-5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserIcon className="w-4 h-4 text-blue-700" />
              <span>Profile & Account Control</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            <dl className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <dt className="text-slate-400">Numeric User ID</dt>
                <dd className="font-mono font-semibold text-slate-900 mt-0.5">#{user.numericId}</dd>
              </div>
              <div>
                <dt className="text-slate-400">Subscription Plan</dt>
                <dd className="mt-0.5">
                  <Badge variant={user.plan === 'premium' ? 'amber' : 'slate'}>
                    {user.plan === 'premium' ? 'Premium' : 'Free Plan'}
                  </Badge>
                </dd>
              </div>
              <div>
                <dt className="text-slate-400">City / Region</dt>
                <dd className="font-medium text-slate-900 mt-0.5">{user.city || 'Not provided'}</dd>
              </div>
              <div>
                <dt className="text-slate-400">Phone</dt>
                <dd className="font-medium text-slate-900 mt-0.5">{user.phone || 'Hidden'}</dd>
              </div>
              <div>
                <dt className="text-slate-400">Registered On</dt>
                <dd className="font-medium text-slate-900 mt-0.5">{formatDate(user.registeredAt)}</dd>
              </div>
              <div>
                <dt className="text-slate-400">Last Login</dt>
                <dd className="font-medium text-slate-900 mt-0.5">{formatDateTime(user.lastLoginAt)}</dd>
              </div>
              <div>
                <dt className="text-slate-400">Wellness Streak</dt>
                <dd className="font-semibold text-teal-700 mt-0.5">{user.streakDays} days</dd>
              </div>
              <div>
                <dt className="text-slate-400">Points Earned</dt>
                <dd className="font-semibold text-blue-700 mt-0.5">{user.points} pts</dd>
              </div>
            </dl>

            <div className="pt-4 border-t border-slate-100 space-y-3">
              <div className="text-xs font-semibold text-slate-800">Account Status Management</div>
              <div className="space-y-2">
                <Select
                  value={selectedStatus}
                  disabled={!canManageStatus}
                  onChange={(e) => setSelectedStatus(e.target.value as ManagedUserStatus)}
                  className="w-full"
                >
                  <option value="active">Active</option>
                  <option value="paused">Paused</option>
                  <option value="locked">Locked</option>
                  <option value="pending_deletion">Pending Deletion</option>
                  <option value="inactive">Inactive</option>
                </Select>
                <Input
                  value={statusReason}
                  disabled={!canManageStatus}
                  onChange={(e) => setStatusReason(e.target.value)}
                  placeholder="Optional reason for audit log..."
                />
                <Button
                  className="w-full"
                  disabled={!canManageStatus || selectedStatus === user.status}
                  onClick={handleUpdateStatus}
                >
                  Update Account Status
                </Button>
                {!canManageStatus && (
                  <p className="text-[11px] text-rose-600">
                    Your role lacks <code className="font-mono">users:manage</code> permission.
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Sensitive Recovery Information (Permission & Consent Gated) */}
        <Card className="lg:col-span-7">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-teal-600" />
              <span>Sensitive Recovery Information</span>
            </CardTitle>
            <Badge variant={user.shareRecoveryWithAdmin ? 'teal' : 'rose'}>
              {user.shareRecoveryWithAdmin ? 'User Consent Granted' : 'Private (No Consent)'}
            </Badge>
          </CardHeader>

          <CardContent>
            {!canViewRecoveryRole ? (
              <div className="p-6 rounded-xl bg-rose-50 border border-rose-200 text-center space-y-2">
                <ShieldAlert className="w-8 h-8 text-rose-600 mx-auto" />
                <h4 className="text-sm font-semibold text-rose-900">Insufficient Role Permission</h4>
                <p className="text-xs text-rose-700 max-w-md mx-auto">
                  Viewing patient recovery goals, mood check-ins, and progress history requires the{' '}
                  <code className="font-mono font-semibold">users:view_recovery</code> permission.
                </p>
              </div>
            ) : !user.shareRecoveryWithAdmin ? (
              <div className="p-6 rounded-xl bg-slate-50 border border-slate-200 text-center space-y-2">
                <Lock className="w-8 h-8 text-slate-400 mx-auto" />
                <h4 className="text-sm font-semibold text-slate-900">Protected by User Privacy Consent</h4>
                <p className="text-xs text-slate-600 max-w-md mx-auto">
                  This user has disabled administrative access to personal recovery journals and check-ins in their Pathway Privacy Settings.
                </p>
              </div>
            ) : !recoveryUnlocked ? (
              <form onSubmit={handleUnlockRecovery} className="p-5 rounded-xl bg-blue-50/60 border border-blue-200 space-y-4">
                <div className="flex items-start gap-3">
                  <Lock className="w-5 h-5 text-blue-700 shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <h4 className="text-sm font-semibold text-slate-900">Audit Verification Required</h4>
                    <p className="text-xs text-slate-600">
                      This user consented to share recovery records for care support. Accessing sensitive recovery goals and mood history logs an immutable entry with your identity and purpose.
                    </p>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="block text-xs font-medium text-slate-700">
                    Valid Access Purpose / Ticket Reference
                  </label>
                  <Input
                    value={accessPurpose}
                    onChange={(e) => setAccessPurpose(e.target.value)}
                    placeholder="e.g. Support ticket #PW-204: verify goal streak sync issue"
                    required
                  />
                </div>
                <Button type="submit" variant="teal">
                  Authorize & View Recovery Records
                </Button>
              </form>
            ) : (
              <div className="space-y-6">
                <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Access audited under purpose: &ldquo;{accessPurpose}&rdquo;</span>
                </div>

                {/* Recovery Goals */}
                <div className="space-y-2.5">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                    <Target className="w-3.5 h-3.5 text-blue-600" />
                    <span>Recovery Goals ({user.activeGoals.length})</span>
                  </h4>
                  <div className="space-y-2">
                    {user.activeGoals.map((g) => (
                      <div
                        key={g.id}
                        className="flex items-center justify-between gap-3 p-3 rounded-lg border border-slate-200 bg-slate-50/50 text-xs"
                      >
                        <div>
                          <div className="font-semibold text-slate-900">{g.title}</div>
                          <div className="text-[11px] text-slate-500">
                            {g.category} • {g.points} pts
                          </div>
                        </div>
                        <Badge variant={g.completed ? 'emerald' : 'amber'}>
                          {g.completed ? 'Completed' : 'In Progress'}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Progress History */}
                <div className="space-y-2.5">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                    <TrendingUp className="w-3.5 h-3.5 text-teal-600" />
                    <span>Progress & Mood History</span>
                  </h4>
                  <div className="overflow-x-auto border border-slate-200 rounded-lg">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-50 border-b border-slate-200 text-[11px] text-slate-500">
                        <tr>
                          <th className="py-2 px-3">Date</th>
                          <th className="py-2 px-3">Mood</th>
                          <th className="py-2 px-3">Craving (0-10)</th>
                          <th className="py-2 px-3">Goals Done</th>
                          <th className="py-2 px-3">Notes</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {user.progressHistory.map((p, i) => (
                          <tr key={i}>
                            <td className="py-2 px-3 font-medium">{p.date}</td>
                            <td className="py-2 px-3 capitalize">{p.mood}</td>
                            <td className="py-2 px-3">{p.cravingLevel}/10</td>
                            <td className="py-2 px-3">{p.goalsCompleted}</td>
                            <td className="py-2 px-3 text-slate-500">{p.notes || '—'}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Completed Activities */}
                <div className="space-y-2.5">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                    <Activity className="w-3.5 h-3.5 text-indigo-600" />
                    <span>Recent Recovery Activities</span>
                  </h4>
                  <div className="space-y-1.5">
                    {user.recentActivities.map((a) => (
                      <div key={a.id} className="flex items-center justify-between text-xs py-1.5 border-b border-slate-100 last:border-0">
                        <span className="text-slate-800 font-medium">{a.title}</span>
                        <span className="text-[11px] text-slate-400">{formatDateTime(a.timestamp)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
