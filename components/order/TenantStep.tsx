'use client';

import React from 'react';
import { UserCheck, Lock } from 'lucide-react';
import { PersonDetails } from '@/lib/types';

interface TenantStepProps {
  data: Partial<PersonDetails>;
  onChange: (fields: Partial<PersonDetails>) => void;
  errors: Record<string, string>;
}

export const TenantStep: React.FC<TenantStepProps> = ({ data, onChange, errors }) => {
  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      <div className="border-b border-stone-200 pb-4">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-sky-100 text-sky-800">
            <UserCheck className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-stone-900">Step 2: Tenant (Occupant) Details</h2>
            <p className="text-xs text-stone-500">Provide the tenant&apos;s details as shown on their official ID proof.</p>
          </div>
        </div>
      </div>

      {/* Aadhaar Privacy Shield Notice */}
      <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 text-xs text-emerald-950 flex items-start gap-3">
        <Lock className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
        <div className="leading-relaxed">
          <strong className="font-semibold text-emerald-900 block mb-0.5">UIDAI Data Protection Guarantee:</strong>
          We record <strong>only the last 4 digits</strong> of the tenant&apos;s Aadhaar card for tenancy identification on the non-judicial stamp paper. Full 12-digit Aadhaar numbers are never accepted.
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Full Name */}
        <div className="sm:col-span-2">
          <label className="block text-xs font-bold text-stone-700 mb-1">
            Tenant Full Legal Name *
          </label>
          <input
            type="text"
            value={data.fullName || ''}
            onChange={(e) => onChange({ fullName: e.target.value })}
            placeholder="e.g. M. Karthik"
            className={`w-full px-3.5 py-2.5 rounded-xl border text-sm text-stone-900 focus:outline-none focus:ring-2 ${
              errors.fullName
                ? 'border-rose-400 bg-rose-50/50 focus:ring-rose-400'
                : 'border-stone-300 bg-white focus:ring-amber-500'
            }`}
          />
          {errors.fullName && <p className="text-xs text-rose-600 mt-1">{errors.fullName}</p>}
        </div>

        {/* Father's or Spouse's Name */}
        <div>
          <label className="block text-xs font-bold text-stone-700 mb-1">
            Father&apos;s or Spouse&apos;s Name *
          </label>
          <input
            type="text"
            value={data.relativeName || ''}
            onChange={(e) => onChange({ relativeName: e.target.value })}
            placeholder="e.g. P. Murugan"
            className={`w-full px-3.5 py-2.5 rounded-xl border text-sm text-stone-900 focus:outline-none focus:ring-2 ${
              errors.relativeName
                ? 'border-rose-400 bg-rose-50/50 focus:ring-rose-400'
                : 'border-stone-300 bg-white focus:ring-amber-500'
            }`}
          />
          {errors.relativeName && <p className="text-xs text-rose-600 mt-1">{errors.relativeName}</p>}
        </div>

        {/* Age */}
        <div>
          <label className="block text-xs font-bold text-stone-700 mb-1">
            Age (Years) *
          </label>
          <input
            type="number"
            min="18"
            max="120"
            value={data.age || ''}
            onChange={(e) => onChange({ age: e.target.value ? Number(e.target.value) : '' })}
            placeholder="e.g. 32"
            className={`w-full px-3.5 py-2.5 rounded-xl border text-sm text-stone-900 focus:outline-none focus:ring-2 ${
              errors.age
                ? 'border-rose-400 bg-rose-50/50 focus:ring-rose-400'
                : 'border-stone-300 bg-white focus:ring-amber-500'
            }`}
          />
          {errors.age && <p className="text-xs text-rose-600 mt-1">{errors.age}</p>}
        </div>

        {/* Phone */}
        <div>
          <label className="block text-xs font-bold text-stone-700 mb-1">
            Primary Mobile Number *
          </label>
          <input
            type="tel"
            maxLength={10}
            value={data.phone || ''}
            onChange={(e) => onChange({ phone: e.target.value.replace(/[^0-9]/g, '') })}
            placeholder="10-digit mobile number"
            className={`w-full px-3.5 py-2.5 rounded-xl border text-sm text-stone-900 focus:outline-none focus:ring-2 ${
              errors.phone
                ? 'border-rose-400 bg-rose-50/50 focus:ring-rose-400'
                : 'border-stone-300 bg-white focus:ring-amber-500'
            }`}
          />
          {errors.phone && <p className="text-xs text-rose-600 mt-1">{errors.phone}</p>}
        </div>

        {/* Email */}
        <div>
          <label className="block text-xs font-bold text-stone-700 mb-1">
            Email Address *
          </label>
          <input
            type="email"
            value={data.email || ''}
            onChange={(e) => onChange({ email: e.target.value })}
            placeholder="tenant@example.com"
            className={`w-full px-3.5 py-2.5 rounded-xl border text-sm text-stone-900 focus:outline-none focus:ring-2 ${
              errors.email
                ? 'border-rose-400 bg-rose-50/50 focus:ring-rose-400'
                : 'border-stone-300 bg-white focus:ring-amber-500'
            }`}
          />
          {errors.email && <p className="text-xs text-rose-600 mt-1">{errors.email}</p>}
        </div>

        {/* Aadhaar Last 4 Digits */}
        <div>
          <label className="block text-xs font-bold text-stone-700 mb-1">
            Aadhaar Last 4 Digits Only *
          </label>
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs bg-stone-100 px-3 py-2.5 rounded-xl border border-stone-200 text-stone-500 select-none">
              XXXX - XXXX -
            </span>
            <input
              type="text"
              inputMode="numeric"
              maxLength={4}
              value={data.aadhaarLast4 || ''}
              onChange={(e) => onChange({ aadhaarLast4: e.target.value.replace(/[^0-9]/g, '') })}
              placeholder="5678"
              className={`w-28 px-3.5 py-2.5 rounded-xl border text-sm font-mono tracking-widest text-center text-stone-900 focus:outline-none focus:ring-2 ${
                errors.aadhaarLast4
                  ? 'border-rose-400 bg-rose-50/50 focus:ring-rose-400'
                  : 'border-stone-300 bg-white focus:ring-amber-500'
              }`}
            />
          </div>
          {errors.aadhaarLast4 ? (
            <p className="text-xs text-rose-600 mt-1">{errors.aadhaarLast4}</p>
          ) : (
            <p className="text-[11px] text-stone-400 mt-1">Strictly 4 digits only</p>
          )}
        </div>

        {/* PAN Number (Optional) */}
        <div>
          <label className="block text-xs font-bold text-stone-700 mb-1">
            PAN Number <span className="text-stone-400 font-normal">(Optional)</span>
          </label>
          <input
            type="text"
            maxLength={10}
            value={data.pan || ''}
            onChange={(e) => onChange({ pan: e.target.value.toUpperCase() })}
            placeholder="XYZAB5678G"
            className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 uppercase bg-white text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-500 font-mono"
          />
          {errors.pan && <p className="text-xs text-rose-600 mt-1">{errors.pan}</p>}
        </div>

        {/* Permanent Address */}
        <div className="sm:col-span-2">
          <label className="block text-xs font-bold text-stone-700 mb-1">
            Tenant Permanent Address (Home Town / Native Address) *
          </label>
          <textarea
            rows={3}
            value={data.address || ''}
            onChange={(e) => onChange({ address: e.target.value })}
            placeholder="Complete permanent address as per ID proof (Door/Flat No., Street, Locality, City, Pincode)"
            className={`w-full px-3.5 py-2.5 rounded-xl border text-sm text-stone-900 focus:outline-none focus:ring-2 ${
              errors.address
                ? 'border-rose-400 bg-rose-50/50 focus:ring-rose-400'
                : 'border-stone-300 bg-white focus:ring-amber-500'
            }`}
          />
          {errors.address && <p className="text-xs text-rose-600 mt-1">{errors.address}</p>}
        </div>
      </div>
    </div>
  );
};
