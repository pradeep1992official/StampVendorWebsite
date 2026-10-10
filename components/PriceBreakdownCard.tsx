'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { ShieldCheck, Truck, FileText, CheckCircle2, Award } from 'lucide-react';
import { DEFAULT_PRICING, PricingConfig, calculateOrderPrice } from '@/src/config/pricing';
import { getPricingConfig } from '@/lib/pricing-service';

interface PriceBreakdownCardProps {
  onStartOrder?: () => void;
  showCta?: boolean;
}

export const PriceBreakdownCard: React.FC<PriceBreakdownCardProps> = ({
  onStartOrder,
  showCta = true,
}) => {
  const [pricing, setPricing] = useState<PricingConfig>(DEFAULT_PRICING);
  const [stampPaper, setStampPaper] = useState<100 | 200>(100);
  const [location, setLocation] = useState<'Within Chennai' | 'Within Tamil Nadu'>('Within Chennai');
  const [includeNotary, setIncludeNotary] = useState<boolean>(false);

  useEffect(() => {
    let isMounted = true;
    getPricingConfig()
      .then((cfg) => {
        if (isMounted) setPricing(cfg);
      })
      .catch(() => {});
    return () => {
      isMounted = false;
    };
  }, []);

  const breakdown = calculateOrderPrice(pricing, stampPaper, location, includeNotary);
  const stampFaceValue = stampPaper;
  const estimatedCourier = location === 'Within Chennai' ? 50 : 100;
  const draftingFee = Math.max(0, breakdown.basePackagePrice - stampFaceValue - estimatedCourier);

  return (
    <div className="bg-white border border-stone-200/90 rounded-3xl shadow-sm overflow-hidden">
      {/* Header Badge */}
      <div className="bg-stone-900 text-stone-100 px-6 py-5 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-black text-white">Rental Agreement Drafting & Stamping</h3>
        </div>
        <div className="text-right">
          <span className="text-xl sm:text-2xl font-black text-amber-400">₹{breakdown.totalPayable}/-</span>
          <span className="block text-xs text-stone-400">All inclusive with courier</span>
        </div>
      </div>

      {/* Interactive package options */}
      <div className="p-6 bg-amber-50/40 border-b border-amber-100/80">
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-xs font-bold text-stone-900 uppercase tracking-wider">
            Select Your Package Options
          </h4>
          <span className="text-[11px] text-amber-800 font-semibold bg-amber-100 px-2 py-0.5 rounded-full">
            Live Pricing
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {/* Dropbox 1: Stamp Paper Denomination */}
          <div>
            <label htmlFor="card-stampPaper" className="block text-xs font-bold text-stone-700 mb-1">
              1. Stamp Paper
            </label>
            <select
              id="card-stampPaper"
              value={stampPaper}
              onChange={(e) => setStampPaper(Number(e.target.value) as 100 | 200)}
              className="w-full px-3 py-2 rounded-xl border border-stone-300 bg-white text-xs font-semibold text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-500 cursor-pointer"
            >
              <option value={100}>In Rs.100 Stamp Paper</option>
              <option value={200}>In Rs.200 Stamp Paper</option>
            </select>
            
          </div>

          {/* Dropbox 2: Courier Region */}
          <div>
            <label htmlFor="card-deliveryLocation" className="block text-xs font-bold text-stone-700 mb-1">
              2. Courier Destination
            </label>
            <select
              id="card-deliveryLocation"
              value={location}
              onChange={(e) => setLocation(e.target.value as 'Within Chennai' | 'Within Tamil Nadu')}
              className="w-full px-3 py-2 rounded-xl border border-stone-300 bg-white text-xs font-semibold text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-500 cursor-pointer"
            >
              <option value="Within Chennai">
                Within Chennai (₹{stampPaper === 100 ? pricing.stamp100Chennai : pricing.stamp200Chennai}/-)
              </option>
              <option value="Within Tamil Nadu">
                Within Tamilnadu (₹{stampPaper === 100 ? pricing.stamp100TamilNadu : pricing.stamp200TamilNadu}/-)
              </option>
            </select>
          
          </div>

          {/* Option 3: Notary Signature */}
          <div>
            <label htmlFor="card-notary" className="flex items-center gap-2 text-xs font-bold text-stone-700 mb-1 cursor-pointer">
              <input
                id="card-notary"
                type="checkbox"
                checked={includeNotary}
                onChange={(e) => setIncludeNotary(e.target.checked)}
                className="h-4 w-4 shrink-0 rounded border-stone-300 accent-amber-600 focus:ring-2 focus:ring-amber-500"
              />
              <span>3. Include Notary Signature (+₹{pricing.notaryExtraFee})</span>
            </label>
            <p className="text-[10px] text-stone-500 mt-1 pl-6">
              {includeNotary ? 'Advocate Notary attestation and seal' :  ' '}
            </p>
          </div>
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
              <h4 className="font-bold text-stone-900 text-sm">Government Non-Judicial Stamp Paper</h4>
              <p className="text-xs text-stone-500 mt-0.5">
                Physical non-judicial stamp paper face value (₹{stampPaper})
              </p>
            </div>
          </div>
          <span className="font-bold text-amber-800 text-xs sm:text-sm shrink-0 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200/80">
            ₹{stampFaceValue}
          </span>
        </div>

        {/* 2. Service Fee */}
        <div className="py-3.5 flex items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-sky-50 text-sky-800 rounded-xl shrink-0 mt-0.5">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-stone-900 text-sm">Drafting & Printing Service</h4>
              <p className="text-xs text-stone-500 mt-0.5">
                Tamil Nadu standard legal format drafting and physical printing on stamp paper
              </p>
            </div>
          </div>
          <span className="font-semibold text-stone-800 text-xs sm:text-sm shrink-0">
            ₹{draftingFee}
          </span>
        </div>

        {/* 3. Courier Charge */}
        <div className="py-3.5 flex items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-emerald-50 text-emerald-800 rounded-xl shrink-0 mt-0.5">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-stone-900 text-sm">Courier Charges ({location})</h4>
              <p className="text-xs text-stone-500 mt-0.5">
                Courier delivery with dispatch tracking
              </p>
            </div>
          </div>
          <span className="font-semibold text-stone-800 text-xs sm:text-sm shrink-0">
            ₹{estimatedCourier}
          </span>
        </div>

        {/* 4. Notary Fee if selected */}
        {includeNotary && (
          <div className="py-3.5 flex items-start justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-purple-50 text-purple-800 rounded-xl shrink-0 mt-0.5">
                <Award className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-stone-900 text-sm">Notary Public Signature & Seal</h4>
                <p className="text-xs text-stone-500 mt-0.5">
                  Official verification, signing, and red seal endorsement by practicing Advocate Notary Public
                </p>
              </div>
            </div>
            <span className="font-bold text-purple-800 text-xs sm:text-sm shrink-0 bg-purple-50 px-2.5 py-1 rounded-lg border border-purple-200">
              ₹{breakdown.notaryFee}
            </span>
          </div>
        )}

        {/* Total Summary */}
        <div className="pt-4 flex items-center justify-between">
          <div>
            <span className="text-sm font-extrabold text-stone-900">Total Payable Package</span>
            <span className="block text-xs text-stone-500">
              In Rs.{stampPaper} stamp paper ({location} with courier){includeNotary ? ' + Notary signature' : ''}
            </span>
          </div>
          <div className="text-right">
            <span className="text-xl sm:text-2xl font-black text-emerald-700">₹{breakdown.totalPayable}/-</span>
          </div>
        </div>
      </div>

      {/* Feature bullets */}
      <div className="bg-stone-50 px-6 py-5 border-t border-stone-200/80 space-y-2.5">
        <div className="flex items-center gap-2 text-xs text-stone-700 font-medium">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Tamil Nadu non-judicial stamp paper</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-stone-700 font-medium">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>1 physical original copy printed on genuine stamp paper</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-stone-700 font-medium">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Courier dispatch with tracking ID</span>
        </div>

        {showCta && (
          <div className="pt-3">
            {onStartOrder ? (
              <button
                onClick={onStartOrder}
                className="w-full bg-amber-600 hover:bg-amber-500 text-stone-950 font-bold py-3.5 px-4 rounded-xl shadow-md transition-all flex items-center justify-center gap-2 text-xs uppercase tracking-wider cursor-pointer"
              >
                <FileText className="w-4 h-4 text-stone-950" />
                <span>Start Your Agreement (₹{breakdown.totalPayable}/-)</span>
              </button>
            ) : (
              <Link
                href="/order"
                className="w-full bg-amber-600 hover:bg-amber-500 text-stone-950 font-bold py-3.5 px-4 rounded-xl shadow-md transition-all flex items-center justify-center gap-2 text-xs uppercase tracking-wider text-center"
              >
                <FileText className="w-4 h-4 text-stone-950" />
                <span>Start Your Agreement (₹{breakdown.totalPayable}/-)</span>
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
