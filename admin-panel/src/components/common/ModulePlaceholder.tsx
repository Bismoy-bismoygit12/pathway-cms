import React from 'react';
import { ShieldAlert, Layers } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';

export const ModulePlaceholder: React.FC<{ title: string; step: string; description: string }> = ({
  title,
  step,
  description,
}) => (
  <Card>
    <CardContent className="py-12 text-center space-y-3">
      <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-700 mx-auto flex items-center justify-center">
        <Layers className="w-5 h-5" />
      </div>
      <Badge variant="blue">{step}</Badge>
      <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
      <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto">{description}</p>
    </CardContent>
  </Card>
);

export const Unauthorized: React.FC = () => (
  <Card className="border-rose-200">
    <CardContent className="py-12 text-center space-y-3">
      <div className="w-11 h-11 rounded-xl bg-rose-50 text-rose-600 mx-auto flex items-center justify-center">
        <ShieldAlert className="w-5 h-5" />
      </div>
      <h2 className="text-lg font-semibold text-slate-900">Access Restricted</h2>
      <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto">
        Your current admin role does not include permission to view or modify this section. Switch roles in the top bar or contact a Super Admin.
      </p>
    </CardContent>
  </Card>
);
