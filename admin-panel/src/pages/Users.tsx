import React, { useEffect, useState, useCallback } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Search, Eye, ShieldCheck, ShieldOff, ChevronLeft, ChevronRight, Lock, PauseCircle, CheckCircle2 } from 'lucide-react';
import { userService } from '@/services/userService';
import { ManagedUser, ManagedUserStatus } from '@/types/admin';
import { useAdminAuth } from '@/context/AdminAuthContext';
import { useToast } from '@/components/ui/Toast';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Input, Select } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { UserStatusBadge } from '@/components/common/StatusBadges';
import { formatDate, formatDateTime } from '@/lib/utils';

export const Users: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialStatus = (searchParams.get('status') as ManagedUserStatus | 'all') || 'all';

  const { currentAdmin, hasPermission } = useAdminAuth();
  const { showToast } = useToast();

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<ManagedUserStatus | 'all'>(initialStatus);
  const [page, setPage] = useState(1);
  const [users, setUsers] = useState<ManagedUser[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const loadUsers = useCallback(async () => {
    const res = await userService.list({
      search,
      status: statusFilter,
      page,
      pageSize: 6,
    });
    setUsers(res.items);
    setTotal(res.total);
    setTotalPages(res.totalPages);
  }, [search, statusFilter, page]);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  const handleStatusChange = async (user: ManagedUser, nextStatus: ManagedUserStatus) => {
    if (!hasPermission('users:manage')) {
      showToast('Your role does not allow modifying user status.', 'error');
      return;
    }
    await userService.updateStatus(
      user.id,
      nextStatus,
      currentAdmin?.fullName || 'Admin',
      currentAdmin?.role || 'admin',
      `Status changed from ${user.status} to ${nextStatus} via User Directory.`
    );
    showToast(`Updated ${user.fullName} to ${nextStatus.replace('_', ' ')}`);
    loadUsers();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-slate-900">User Management</h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Search registered users, monitor login activity, manage account status, and inspect consented recovery data.
          </p>
        </div>
        <Badge variant="blue">{total} Matching Users</Badge>
      </div>

      <Card>
        <CardHeader className="flex-col md:flex-row md:items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <Input
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              placeholder="Search by full name, nickname, email, or user ID (e.g. usr-101, 101)..."
              className="pl-9"
            />
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto">
            <Select
              aria-label="Filter by account status"
              value={statusFilter}
              onChange={(e) => {
                const val = e.target.value as ManagedUserStatus | 'all';
                setStatusFilter(val);
                setPage(1);
                if (val === 'all') searchParams.delete('status');
                else searchParams.set('status', val);
                setSearchParams(searchParams, { replace: true });
              }}
              className="w-full md:w-48"
            >
              <option value="all">All Account Statuses</option>
              <option value="active">Active</option>
              <option value="paused">Paused</option>
              <option value="locked">Locked</option>
              <option value="pending_deletion">Pending Deletion</option>
              <option value="inactive">Inactive</option>
            </Select>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          {/* Desktop Table */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/80 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                  <th className="py-3 px-4">User</th>
                  <th className="py-3 px-4">ID / Plan</th>
                  <th className="py-3 px-4">Registered</th>
                  <th className="py-3 px-4">Last Login</th>
                  <th className="py-3 px-4">Recovery Consent</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {users.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-slate-900">{u.fullName}</div>
                      <div className="text-[11px] text-slate-500">
                        @{u.nickname} • {u.email}
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-mono text-[11px] text-slate-600">{u.id}</div>
                      <Badge variant={u.plan === 'premium' ? 'amber' : 'slate'} className="mt-1">
                        {u.plan === 'premium' ? 'Premium' : 'Free'}
                      </Badge>
                    </td>
                    <td className="py-3.5 px-4 text-slate-600 whitespace-nowrap">{formatDate(u.registeredAt)}</td>
                    <td className="py-3.5 px-4 text-slate-600 whitespace-nowrap">{formatDateTime(u.lastLoginAt)}</td>
                    <td className="py-3.5 px-4">
                      {u.shareRecoveryWithAdmin ? (
                        <span className="inline-flex items-center gap-1 text-teal-700 font-medium">
                          <ShieldCheck className="w-3.5 h-3.5" />
                          <span>Consented</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-slate-400">
                          <ShieldOff className="w-3.5 h-3.5" />
                          <span>Private</span>
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4">
                      <UserStatusBadge status={u.status} />
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center justify-end gap-1.5">
                        {hasPermission('users:manage') && u.status !== 'active' && (
                          <Button
                            size="sm"
                            variant="outline"
                            title="Activate Account"
                            onClick={() => handleStatusChange(u, 'active')}
                          >
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          </Button>
                        )}
                        {hasPermission('users:manage') && u.status === 'active' && (
                          <Button
                            size="sm"
                            variant="outline"
                            title="Pause Account"
                            onClick={() => handleStatusChange(u, 'paused')}
                          >
                            <PauseCircle className="w-3.5 h-3.5 text-amber-600" />
                          </Button>
                        )}
                        {hasPermission('users:manage') && u.status !== 'locked' && (
                          <Button
                            size="sm"
                            variant="outline"
                            title="Lock Account"
                            onClick={() => handleStatusChange(u, 'locked')}
                          >
                            <Lock className="w-3.5 h-3.5 text-rose-600" />
                          </Button>
                        )}
                        <Link
                          to={`/users/${u.id}`}
                          className="inline-flex items-center gap-1 h-8 px-2.5 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 font-semibold text-xs transition"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Profile</span>
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}

                {users.length === 0 && (
                  <tr>
                    <td colSpan={7} className="py-10 text-center text-slate-500 text-xs">
                      No users match your search or filter criteria.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="md:hidden divide-y divide-slate-100">
            {users.map((u) => (
              <div key={u.id} className="p-4 space-y-2.5">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <div className="font-semibold text-sm text-slate-900 truncate">{u.fullName}</div>
                    <div className="text-xs text-slate-500 truncate">{u.email}</div>
                    <div className="text-[11px] font-mono text-slate-400 mt-0.5">
                      {u.id} • @{u.nickname}
                    </div>
                  </div>
                  <UserStatusBadge status={u.status} />
                </div>

                <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-500">
                  <span>Last login: {formatDate(u.lastLoginAt)}</span>
                  <span className="font-medium text-teal-700">
                    {u.shareRecoveryWithAdmin ? 'Recovery Shared' : 'Recovery Private'}
                  </span>
                </div>

                <div className="flex items-center justify-end gap-2 pt-1">
                  <Link
                    to={`/users/${u.id}`}
                    className="inline-flex items-center gap-1.5 h-8 px-3 rounded-lg bg-blue-700 text-white text-xs font-semibold"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>View Profile</span>
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination Footer */}
          <div className="px-4 py-3 border-t border-slate-200 flex items-center justify-between text-xs text-slate-600">
            <span>
              Page {page} of {totalPages} ({total} total)
            </span>
            <div className="flex items-center gap-1.5">
              <Button
                size="sm"
                variant="outline"
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
              >
                <ChevronLeft className="w-3.5 h-3.5" />
                <span>Prev</span>
              </Button>
              <Button
                size="sm"
                variant="outline"
                disabled={page >= totalPages}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              >
                <span>Next</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
