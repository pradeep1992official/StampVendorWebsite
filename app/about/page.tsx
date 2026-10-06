import type { Metadata } from 'next';
import Link from 'next/link';
import { 
  Award, 
  CheckCircle2, 
  ArrowRight,
  MapPin,
  Clock,
  Phone,
  Mail
} from 'lucide-react';
import { DisclaimerBanner } from '@/components/DisclaimerBanner';
import { VendorPlaceholderNotice } from '@/components/VendorPlaceholderNotice';
import { VENDOR_CONFIG } from '@/src/config/vendor';

export const metadata: Metadata = {
  title: 'About Certified Stamp Vendor | Tamil Nadu Rental Agreement Service',
  description: 'Certified stamp vendor credentials, shop location, and non-judicial stamp paper issuance in Tamil Nadu.',
  openGraph: {
    title: 'About Certified Stamp Vendor | Tamil Nadu Rental Agreement Service',
    description: 'Certified stamp vendor credentials, shop location, and non-judicial stamp paper issuance in Tamil Nadu.',
  },
};

export default function AboutPage() {
  return (
    <div className="space-y-14 py-8 pb-16">
      {/* Header Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-stone-900 text-white rounded-3xl p-8 sm:p-12 border border-stone-800 shadow-sm relative overflow-hidden">
          <div className="max-w-3xl space-y-4">
            <span className="text-xs uppercase tracking-wider font-bold text-amber-400 bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/30">
              Certified Stamp Vendor Profile
            </span>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight">
              About the Certified Stamp Vendor Desk
            </h1>

            <p className="text-stone-300 text-base sm:text-lg leading-relaxed">
              Authorized document stamping and drafting desk for rental agreements across Tamil Nadu.
            </p>
          </div>
        </div>
      </section>

      {/* Visible Placeholder Notice & TODO List */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <VendorPlaceholderNotice compact={false} />
      </section>

      {/* Official Credentials Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Main Story & Purpose */}
          <div className="lg:col-span-7 space-y-6">
            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-700">Vendor Desk Information</span>
              <h2 className="text-2xl font-bold text-stone-900">
                {VENDOR_CONFIG.tradeName}
              </h2>
            </div>

            <p className="text-stone-700 text-sm sm:text-base leading-relaxed">
              {VENDOR_CONFIG.tradeName} ({VENDOR_CONFIG.name}) operates under a government stamp vendor licence issued by the Registration Department, Government of Tamil Nadu (Licence Number: <span className="font-mono font-bold text-amber-800">{VENDOR_CONFIG.licenceNumber}</span>).
            </p>

            <p className="text-stone-700 text-sm sm:text-base leading-relaxed">
              We provide online intake and doorstep delivery for rental agreements drafted directly onto genuine non-judicial stamp papers, eliminating the need to physically visit crowded counters or deal with unregulated middlemen.
            </p>

            {/* Principles */}
            <div className="bg-white border border-stone-200/90 rounded-2xl p-6 shadow-sm space-y-4">
              <h3 className="font-bold text-stone-900 text-sm uppercase tracking-wider text-amber-800">
                Vendor Principles
              </h3>
              <div className="space-y-3 text-xs sm:text-sm text-stone-700">
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-stone-900">Genuine Serial Numbers:</strong> Every stamp paper supplied carries an official government serial number recorded in the vendor issuance register.
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-stone-900">Separation of Fees:</strong> Government stamp duty, vendor drafting fee, and courier charges are shown separately.
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-stone-900">Aadhaar Privacy Commitment:</strong> We record only the last 4 digits of Aadhaar numbers and maintain private, encrypted document storage.
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Credentials Sidebar Card */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-stone-50 border border-stone-200 rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm">
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5 text-amber-600" />
                <h3 className="font-bold text-stone-900 text-base">Official Credentials & Location</h3>
              </div>

              <div className="space-y-3 text-xs sm:text-sm text-stone-700 divide-y divide-stone-200/60">
                <div className="pt-2 first:pt-0">
                  <span className="block text-[11px] uppercase tracking-wider text-stone-400 font-semibold">Vendor License Number</span>
                  <span className="font-mono font-bold text-stone-900 text-base">{VENDOR_CONFIG.licenceNumber}</span>
                </div>

                <div className="pt-3">
                  <span className="block text-[11px] uppercase tracking-wider text-stone-400 font-semibold">Issuing Jurisdiction</span>
                  <span className="font-mono font-medium text-stone-900">{VENDOR_CONFIG.issuingAuthority}</span>
                </div>

                <div className="pt-3">
                  <span className="block text-[11px] uppercase tracking-wider text-stone-400 font-semibold">Shop Counter Address</span>
                  <span className="font-mono font-medium text-stone-900 leading-snug">
                    {VENDOR_CONFIG.addressLine1}, {VENDOR_CONFIG.addressLine2}, {VENDOR_CONFIG.city} - {VENDOR_CONFIG.pincode}
                  </span>
                </div>

                <div className="pt-3">
                  <span className="block text-[11px] uppercase tracking-wider text-stone-400 font-semibold">Working Hours</span>
                  <span className="font-mono font-medium text-stone-900">{VENDOR_CONFIG.workingHours}</span>
                </div>

                <div className="pt-3">
                  <span className="block text-[11px] uppercase tracking-wider text-stone-400 font-semibold">Contact Phone</span>
                  <span className="font-mono font-bold text-amber-800 text-base">{VENDOR_CONFIG.phone}</span>
                </div>
              </div>

              <div className="pt-2">
                <Link
                  href="/rent-agreement"
                  className="w-full bg-amber-600 hover:bg-amber-500 text-white font-bold py-3 rounded-xl text-center text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-sm"
                >
                  <span>Start Rental Agreement</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Disclaimer */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <DisclaimerBanner />
      </section>
    </div>
  );
}
