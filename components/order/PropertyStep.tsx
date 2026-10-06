'use client';

import React from 'react';
import { Home, Building2, Store } from 'lucide-react';
import { PropertyDetails } from '@/lib/types';

interface PropertyStepProps {
  data: Partial<PropertyDetails>;
  onChange: (fields: Partial<PropertyDetails>) => void;
  errors: Record<string, string>;
}

export const PropertyStep: React.FC<PropertyStepProps> = ({ data, onChange, errors }) => {
  const propertyTypes: Array<{ type: PropertyDetails['propertyType']; label: string; icon: React.ReactNode }> = [
    { type: 'House', label: 'Independent House / Villa', icon: <Home className="w-4 h-4" /> },
    { type: 'Flat', label: 'Apartment / Flat', icon: <Building2 className="w-4 h-4" /> },
    { type: 'Commercial Shop', label: 'Commercial Shop / Office', icon: <Store className="w-4 h-4" /> },
  ];

  const furnishingOptions: Array<PropertyDetails['furnishing']> = [
    'Unfurnished',
    'Semi-Furnished',
    'Fully Furnished',
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      <div className="border-b border-stone-200 pb-4">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-purple-100 text-purple-800">
            <Home className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-stone-900">Step 3: Rental Property Details</h2>
            <p className="text-xs text-stone-500">Provide the exact location and description of the rented premise in Tamil Nadu.</p>
          </div>
        </div>
      </div>

      {/* Property Type Selection */}
      <div className="space-y-2">
        <label className="block text-xs font-bold text-stone-700">
          Property Type *
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {propertyTypes.map((item) => {
            const isSelected = data.propertyType === item.type;
            return (
              <button
                key={item.type}
                type="button"
                onClick={() => onChange({ propertyType: item.type })}
                className={`p-3.5 rounded-xl border text-left flex items-center gap-3 transition-all cursor-pointer ${
                  isSelected
                    ? 'border-amber-600 bg-amber-50/70 text-amber-950 font-bold ring-2 ring-amber-500/20'
                    : 'border-stone-300 bg-white hover:bg-stone-50 text-stone-800'
                }`}
              >
                <div className={`p-2 rounded-lg ${isSelected ? 'bg-amber-600 text-white' : 'bg-stone-100 text-stone-600'}`}>
                  {item.icon}
                </div>
                <span className="text-xs">{item.label}</span>
              </button>
            );
          })}
        </div>
        {errors.propertyType && <p className="text-xs text-rose-600 mt-1">{errors.propertyType}</p>}
      </div>

      {/* Furnishing Status */}
      <div className="space-y-2">
        <label className="block text-xs font-bold text-stone-700">
          Furnishing Status *
        </label>
        <div className="grid grid-cols-3 gap-3">
          {furnishingOptions.map((opt) => {
            const isSelected = data.furnishing === opt;
            return (
              <button
                key={opt}
                type="button"
                onClick={() => onChange({ furnishing: opt })}
                className={`py-2.5 px-3 rounded-xl border text-center text-xs font-semibold transition-all cursor-pointer ${
                  isSelected
                    ? 'border-amber-600 bg-amber-50 text-amber-950 font-bold ring-2 ring-amber-500/20'
                    : 'border-stone-300 bg-white hover:bg-stone-50 text-stone-700'
                }`}
              >
                {opt}
              </button>
            );
          })}
        </div>
        {errors.furnishing && <p className="text-xs text-rose-600 mt-1">{errors.furnishing}</p>}
      </div>

      {/* Full Rental Premises Address */}
      <div className="space-y-4">
        <div>
          <label className="block text-xs font-bold text-stone-700 mb-1">
            Complete Rental Property Address *
          </label>
          <textarea
            rows={3}
            value={data.fullAddress || ''}
            onChange={(e) => onChange({ fullAddress: e.target.value })}
            placeholder="Door / Flat No., Floor, Building Name, Street / Cross Street, Locality / Area"
            className={`w-full px-3.5 py-2.5 rounded-xl border text-sm text-stone-900 focus:outline-none focus:ring-2 ${
              errors.fullAddress
                ? 'border-rose-400 bg-rose-50/50 focus:ring-rose-400'
                : 'border-stone-300 bg-white focus:ring-amber-500'
            }`}
          />
          {errors.fullAddress ? (
            <p className="text-xs text-rose-600 mt-1">{errors.fullAddress}</p>
          ) : (
            <p className="text-[11px] text-stone-400 mt-1">This will be printed verbatim as the rented scheduled premises on the agreement.</p>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* City / Taluk */}
          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1">
              City / Taluk (Tamil Nadu) *
            </label>
            <input
              type="text"
              value={data.city || ''}
              onChange={(e) => onChange({ city: e.target.value })}
              placeholder="e.g. Chennai, Madurai, Coimbatore, Salem..."
              className={`w-full px-3.5 py-2.5 rounded-xl border text-sm text-stone-900 focus:outline-none focus:ring-2 ${
                errors.city
                  ? 'border-rose-400 bg-rose-50/50 focus:ring-rose-400'
                  : 'border-stone-300 bg-white focus:ring-amber-500'
              }`}
            />
            {errors.city && <p className="text-xs text-rose-600 mt-1">{errors.city}</p>}
          </div>

          {/* Pincode */}
          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1">
              6-Digit Pincode *
            </label>
            <input
              type="text"
              inputMode="numeric"
              maxLength={6}
              value={data.pincode || ''}
              onChange={(e) => onChange({ pincode: e.target.value.replace(/[^0-9]/g, '') })}
              placeholder="e.g. 600028"
              className={`w-full px-3.5 py-2.5 rounded-xl border text-sm font-mono tracking-wider text-stone-900 focus:outline-none focus:ring-2 ${
                errors.pincode
                  ? 'border-rose-400 bg-rose-50/50 focus:ring-rose-400'
                  : 'border-stone-300 bg-white focus:ring-amber-500'
              }`}
            />
            {errors.pincode && <p className="text-xs text-rose-600 mt-1">{errors.pincode}</p>}
          </div>
        </div>
      </div>
    </div>
  );
};
