import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, Lock, Mail, ArrowRight } from 'lucide-react';
import { useAdminAuth, DEMO_ADMIN_ACCOUNTS, ROLE_DEFINITIONS } from '@/context/AdminAuthContext';
import { AdminRole } from '@/types/admin';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

export const Login: React.FC = () => {
  const { login } = useAdminAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState(DEMO_ADMIN_ACCOUNTS.super_admin.email);
  const [password, setPassword] = useState('Admin@Pathway2026');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const res = await login(email, password);
    setLoading(false);
    if (!res.success) {
      setError(res.error || 'Authentication failed.');
      return;
    }
    navigate('/');
  };

  const handleQuickRoleLogin = async (role: AdminRole) => {
    const account = DEMO_ADMIN_ACCOUNTS[role];
    setEmail(account.email);
    await login(account.email, 'DemoPassword123', role);
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl border border-slate-200 shadow-lg p-6 sm:p-8 space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-700 to-teal-600 flex items-center justify-center shadow-xs">
            <ShieldCheck className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-slate-900">Pathway Admin CMS</h1>
            <p className="text-xs text-slate-500">Secure Platform & Website Management</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-xs text-rose-700">
              {error}
            </div>
          )}

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1.5">Admin Email</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-9"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1.5">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-9"
                required
              />
            </div>
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            <span>{loading ? 'Signing in...' : 'Sign In to Admin CMS'}</span>
            <ArrowRight className="w-4 h-4" />
          </Button>
        </form>

        <div className="pt-4 border-t border-slate-100 space-y-2.5">
          <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
            Quick Demo Role Sign-In
          </div>
          <div className="grid grid-cols-2 gap-2">
            {(Object.keys(ROLE_DEFINITIONS) as AdminRole[]).map((role) => (
              <button
                key={role}
                type="button"
                onClick={() => handleQuickRoleLogin(role)}
                className="text-left p-2.5 rounded-lg border border-slate-200 hover:border-blue-400 hover:bg-blue-50/40 transition cursor-pointer"
              >
                <div className="text-xs font-semibold text-slate-900">{ROLE_DEFINITIONS[role].label}</div>
                <div className="text-[10px] text-slate-500 truncate">{DEMO_ADMIN_ACCOUNTS[role].email}</div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
