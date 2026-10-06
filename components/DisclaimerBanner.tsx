'use client';

import React from 'react';
import { AlertTriangle, ShieldCheck } from 'lucide-react';
import { VENDOR_CONFIG } from '@/src/config/vendor';

interface DisclaimerBannerProps {
  compact?: boolean;
}

export const DisclaimerBanner: React.FC<DisclaimerBannerProps> = ({ compact = false }) => {
  if (compact) {
    return (
      <div className="bg-amber-50 border-b border-amber-200/80 px-4 py-2 text-xs text-amber-900 flex items-center justify-center gap-2 text-center">
        <AlertTriangle className="w-3.5 h-3.5 text-amber-700 shrink-0" />
        <span>
          <strong className="font-semibold">Disclaimer:</strong> Certified stamp paper vendor & drafting desk ({VENDOR_CONFIG.licenceNumber}). Not a law firm; no legal advice or litigation guarantees provided.
        </span>
      </div>
    );
  }

  return (
    <div className="bg-stone-100 border border-stone-200 rounded-2xl p-6 text-sm text-stone-700 space-y-2.5">
      <div className="flex items-center gap-2 font-bold text-stone-900 text-sm">
        <ShieldCheck className="w-5 h-5 text-emerald-700" />
        <span>Disclaimer</span>
      </div>
      <p className="text-xs text-stone-600 leading-relaxed">
        {VENDOR_CONFIG.tradeName} ({VENDOR_CONFIG.name}) operates as an authorized non-judicial stamp paper vendor under Registration Department Licence <span className="font-mono font-medium text-stone-900">{VENDOR_CONFIG.licenceNumber}</span>.
      </p>
      <p className="text-xs text-stone-600 leading-relaxed">
        <strong>Important Notice:</strong> We provide standard legal templates drafted onto genuine stamp papers according to customary tenancy practices in Tamil Nadu. We do not provide individualized legal counsel, advocate opinions, nor do we guarantee legal outcomes in judicial disputes. For specialized legal disputes, please consult an enrolled advocate or legal practitioner.
      </p>
    </div>
  );
};
