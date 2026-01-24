import React from 'react';
import Card from '@/components/ui/Card';

export default function DeprecatedBanner({ title = 'Deprecated warning', children }) {
  return (
    <Card className="border-l-4 border-yellow-500 bg-yellow-50">
      <div className="space-y-2">
        <div className="text-sm text-yellow-900 font-medium">{title}</div>
        <div className="text-sm text-yellow-800">
          This AutoAna area is a legacy demo. Outputs are simulated and may be stale, inconsistent, or misleading.
        </div>
        {children && <div className="text-sm text-yellow-800">{children}</div>}
      </div>
    </Card>
  );
}

