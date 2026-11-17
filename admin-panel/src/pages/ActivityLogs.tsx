import React, { useEffect, useState, useCallback } from 'react';
import { Search, RefreshCw, Clock } from 'lucide-react';
import { activityService } from '@/services/activityService';
import { ActivityCategory, ActivityLogItem } from '@/types/admin';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Input, Select } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { ActivityCategoryBadge } from '@/components/common/StatusBadges';
import { formatDateTime } from '@/lib/utils';

export const ActivityLogs: React.FC = () => {
  const [category, setCategory] = useState<ActivityCategory | 'all'>('all');
  const [source, setSource] = useState<'all' | 'mock' | 'live'>('all');
  const [search, setSearch] = useState('');
  const [logs, setLogs] = useState<ActivityLogItem[]>([]);

  const loadLogs = useCallback(async () => {
    const items = await activityService.list({ category, source, search });
    setLogs(items);
  }, [category, source, search]);

  useEffect(() => {
    loadLogs();
  }, [loadLogs]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Activity & Audit Logs</h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Track user registrations, doctor approvals, appointments, sensitive record access, and CMS updates.
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={loadLogs}>
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Refresh Logs</span>
        </Button>
      </div>

      <Card>
        <CardHeader className="flex-col lg:flex-row lg:items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search actor, action, target, or details..."
              className="pl-9"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto">
            <Select
              aria-label="Filter by activity category"
              value={category}
              onChange={(e) => setCategory(e.target.value as ActivityCategory | 'all')}
              className="flex-1 sm:w-48"
            >
              <option value="all">All Categories</option>
              <option value="user_registration">User Registrations</option>
              <option value="doctor_registration">Doctor Registrations</option>
              <option value="doctor_review">Doctor Approvals/Rejections</option>
              <option value="appointment">Appointments</option>
              <option value="account_change">Account Changes</option>
              <option value="website_content">Website CMS Updates</option>
              <option value="admin_action">Administrative Actions</option>
            </Select>

            <Select
              aria-label="Filter by data source"
              value={source}
              onChange={(e) => setSource(e.target.value as 'all' | 'mock' | 'live')}
              className="flex-1 sm:w-36"
            >
              <option value="all">All Sources</option>
              <option value="mock">Mock / Demo</option>
              <option value="live">Live API</option>
            </Select>
          </div>
        </CardHeader>

        <CardContent className="p-0 divide-y divide-slate-100">
          {logs.map((log) => (
            <div key={log.id} className="p-4 sm:px-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50/70 transition-colors">
              <div className="space-y-1.5 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <ActivityCategoryBadge category={log.category} />
                  <span className="text-xs font-semibold text-slate-900">{log.action}</span>
                  <span className="text-xs font-medium text-blue-700 truncate">{log.target}</span>
                </div>
                <p className="text-xs text-slate-600">{log.details}</p>
                <div className="text-[11px] text-slate-400">
                  Actor: <span className="font-medium text-slate-600">{log.actorName}</span> ({log.actorRole})
                </div>
              </div>

              <div className="flex sm:flex-col items-center sm:items-end justify-between gap-1.5 shrink-0">
                <span className="inline-flex items-center gap-1 text-[11px] text-slate-500 whitespace-nowrap">
                  <Clock className="w-3 h-3" />
                  {formatDateTime(log.timestamp)}
                </span>
                <Badge variant={log.source === 'live' ? 'emerald' : 'slate'}>
                  {log.source === 'live' ? 'Live DB' : 'Demo Event'}
                </Badge>
              </div>
            </div>
          ))}

          {logs.length === 0 && (
            <div className="py-12 text-center text-xs text-slate-500">
              No activity log entries match your filter.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
