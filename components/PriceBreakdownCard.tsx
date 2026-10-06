'use client';

import React from 'react';
import Link from 'next/link';
import { ShieldCheck, Truck, FileText, CheckCircle2 } from 'lucide-react';
import { VENDOR_CONFIG } from '@/src/config/vendor';

interface PriceBreakdownCardProps {
  onStartOrder?: () => void;
  showCta?: boolean;
}

export const PriceBreakdownCard: React.FC<PriceBreakdownCardProps> = ({
  onStartOrder,
  showCta = true,
}) => {
  const { fees } = VENDOR_CONFIG;

  const stampDutyDisplay = fees.stampDuty.amount !== null
    ? `₹${fees.stampDuty.amount}`
    : 'Calculated per agreement';

  const serviceFeeDisplay = fees.serviceFee.amount !== null
    ? `₹${fees.serviceFee.amount}`
    : '[FEE - TO BE PROVIDED]';

  const courierFeeDisplay = fees.courierFee.amount !== null
    ? `₹${fees.courierFee.amount}`
    : '[FEE - TO BE PROVIDED]';

  const totalDisplay = (fees.stampDuty.amount !== null && fees.serviceFee.amount !== null && fees.courierFee.amount !== null)
    ? `₹${fees.stampDuty.amount + fees.serviceFee.amount + fees.courierFee.amount}`
    : 'Calculated at checkout';

  return (
    <div className="bg-white border border-stone-200/90 rounded-3xl shadow-sm overflow-hidden">
      {/* Header Badge */}
      <div className="bg-stone-900 text-stone-100 px-6 py-5 flex items-center justify-between">
        <div>
          <span className="text-xs uppercase tracking-wider text-amber-400 font-bold">Fee Breakdown</span>
          <h3 className="text-lg font-black text-white">Rental Agreement Drafting & Stamping</h3>
        </div>
        <div className="text-right">
          <span className="text-lg sm:text-xl font-black text-amber-400">{totalDisplay}</span>
          <span className="block text-xs text-stone-400">Stamp + Service + Courier</span>
        </div>
      </div>

      {/* Breakdown Items */}
      <div className="p-6 divide-y divide-stone-100">
        {/* 1. Stamp Duty */}
        <div className="py-3.5 flex items-start justify-between gap-4 first:pt-0">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-amber-50 text-amber-800 rounded-xl shrink-0 mt-0.5">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-stone-900 text-sm">{fees.stampDuty.displayLabel}</h4>
              <p className="text-xs text-stone-500 mt-0.5">
                {fees.stampDuty.description}
              </p>
            </div>
          </div>
          <span className="font-bold text-amber-800 text-xs sm:text-sm shrink-0 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200/80">
            {stampDutyDisplay}
          </span>
        </div>

        {/* 2. Service Fee */}
        <div className="py-3.5 flex items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-sky-50 text-sky-800 rounded-xl shrink-0 mt-0.5">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-stone-900 text-sm">{fees.serviceFee.displayLabel}</h4>
              <p className="text-xs text-stone-500 mt-0.5">
                {fees.serviceFee.description}
              </p>
            </div>
          </div>
          <span className="font-semibold text-stone-800 text-xs sm:text-sm shrink-0">
            {serviceFeeDisplay}
          </span>
        </div>

        {/* 3. Courier Charge */}
        <div className="py-3.5 flex items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-emerald-50 text-emerald-800 rounded-xl shrink-0 mt-0.5">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-stone-900 text-sm">{fees.courierFee.displayLabel}</h4>
              <p className="text-xs text-stone-500 mt-0.5">
                {fees.courierFee.description}
              </p>
            </div>
          </div>
          <span className="font-semibold text-stone-800 text-xs sm:text-sm shrink-0">
            {courierFeeDisplay}
          </span>
        </div>

        {/* Total Summary */}
        <div className="pt-4 flex items-center justify-between">
          <div>
            <span className="text-sm font-extrabold text-stone-900">Total Payable</span>
            <span className="block text-xs text-stone-500">Government stamp duty, service fee, and courier shown separately</span>
          </div>
          <div className="text-right">
            <span className="text-xl sm:text-2xl font-black text-stone-900">{totalDisplay}</span>
          </div>
        </div>
      </div>

      {/* Feature bullets */}
      <div className="bg-stone-50 px-6 py-5 border-t border-stone-200/80 space-y-2.5">
        <div className="flex items-center gap-2 text-xs text-stone-700 font-medium">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Non-judicial stamp paper procured from Registration Department vendor counter</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-stone-700 font-medium">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Two physical copies printed: 1 on stamp paper, 1 on accompanying ledger bond</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-stone-700 font-medium">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Postal tracking number provided upon dispatch</span>
        </div>

        {showCta && (
          <div className="pt-3">
            {onStartOrder ? (
              <button
                onClick={onStartOrder}
                className="w-full bg-amber-600 hover:bg-amber-500 text-stone-950 font-bold py-3.5 px-4 rounded-xl shadow-md transition-all flex items-center justify-center gap-2 text-xs uppercase tracking-wider cursor-pointer"
              >
                <FileText className="w-4 h-4 text-stone-950" />
                <span>Start Your Agreement</span>
              </button>
            ) : (
              <Link
                href="/order"
                className="w-full bg-amber-600 hover:bg-amber-500 text-stone-950 font-bold py-3.5 px-4 rounded-xl shadow-md transition-all flex items-center justify-center gap-2 text-xs uppercase tracking-wider text-center"
              >
                <FileText className="w-4 h-4 text-stone-950" />
                <span>Start Your Agreement</span>
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
