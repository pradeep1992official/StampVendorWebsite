import React from 'react';
import { AlertCircle, ListTodo } from 'lucide-react';
import { VENDOR_CONFIG } from '@/src/config/vendor';

export const VendorPlaceholderNotice: React.FC<{ compact?: boolean }> = ({ compact = false }) => {
  const items = VENDOR_CONFIG.placeholdersTodoList;

  if (compact) {
    return (
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-xs text-amber-900 flex items-start gap-2.5">
        <AlertCircle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
        <div>
          <span className="font-bold">Pending Vendor Configuration:</span> Some details are marked with placeholders (Licence number, address, contact, and fee schedules) and will be updated once provided by the vendor.
        </div>
      </div>
    );
  }

  return (
    <div className="bg-stone-50 border-2 border-dashed border-amber-300 rounded-2xl p-6 space-y-4">
      <div className="flex items-center gap-2.5 text-amber-900 font-bold text-sm">
        <ListTodo className="w-5 h-5 text-amber-700" />
        <span>Vendor Configuration: Pending Placeholders TODO List</span>
      </div>
      <p className="text-xs text-stone-600 leading-relaxed">
        The following vendor profile items are currently marked as placeholders in <code className="font-mono bg-stone-200 px-1 py-0.5 rounded text-stone-800">src/config/vendor.ts</code> awaiting vendor details. No artificial facts or figures have been invented.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
        {items.map((item, idx) => (
          <div key={idx} className="bg-white p-3 rounded-xl border border-stone-200 text-xs space-y-1">
            <div className="font-bold text-stone-800">{item.description}</div>
            <div className="font-mono text-[11px] text-amber-800 bg-amber-50/80 px-2 py-0.5 rounded border border-amber-200/60 inline-block">
              {item.currentValue}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
