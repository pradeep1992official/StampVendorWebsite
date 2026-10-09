import type { Metadata } from 'next';
import Link from 'next/link';
import { 
  CheckCircle2, 
  ArrowRight,
  Truck,
  FileText,
  ShieldCheck,
  Mail
} from 'lucide-react';
import { VENDOR_CONFIG } from '@/src/config/vendor';

export const metadata: Metadata = {
  title: 'About Our Service | Tamil Nadu Rental Agreement Drafting',
  description: 'Online rental agreement drafting on non-judicial stamp paper with Professional Courier dispatch across Tamil Nadu.',
  openGraph: {
    title: 'About Our Service | Tamil Nadu Rental Agreement Drafting',
    description: 'Online rental agreement drafting on non-judicial stamp paper with Professional Courier dispatch across Tamil Nadu.',
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
              Online Stamping & Drafting
            </span>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight">
              About Our Rental Agreement Service
            </h1>

            <p className="text-stone-300 text-base sm:text-lg leading-relaxed">
              Fast, reliable online document drafting for 11-month residential and commercial rental agreements in Tamil Nadu.
            </p>
          </div>
        </div>
      </section>

      {/* Main Content Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Main Story & Purpose */}
          <div className="lg:col-span-7 space-y-6">
            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-700">How We Serve You</span>
              <h2 className="text-2xl font-bold text-stone-900">
                {VENDOR_CONFIG.tradeName}
              </h2>
            </div>

            <p className="text-stone-700 text-sm sm:text-base leading-relaxed">
              We provide online intake and doorstep courier delivery for rental agreements drafted onto authentic non-judicial stamp paper, eliminating the need to physically visit crowded counters or deal with unregulated middlemen.
            </p>

            <p className="text-stone-700 text-sm sm:text-base leading-relaxed">
              Landlords and tenants can submit their tenancy terms, premises information, and identification online. We generate a standardized 11-month agreement format, print the original agreement directly onto authentic non-judicial stamp paper, and courier it directly to your doorstep.
            </p>

            {/* Principles */}
            <div className="bg-white border border-stone-200/90 rounded-2xl p-6 shadow-sm space-y-4">
              <h3 className="font-bold text-stone-900 text-sm uppercase tracking-wider text-amber-800">
                Our Commitments
              </h3>
              <div className="space-y-3 text-xs sm:text-sm text-stone-700">
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-stone-900">Authentic Non-Judicial Stamp Paper:</strong> Every agreement is printed on genuine government non-judicial stamp paper with authentic serial numbers.
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-stone-900">Transparent Fee Structure:</strong> Government stamp duty, drafting charges, and courier dispatch fees are presented with full itemization.
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-stone-900">Professional Courier Dispatch:</strong> We use strictly Professional Courier for dispatching your physical original agreement across Tamil Nadu, with tracking details shared upon dispatch.
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-stone-900">Customer Data Privacy:</strong> Aadhaar numbers are optional. All submitted information and identification proofs are kept strictly confidential.
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Delivery & Dispatch Summary Card */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-stone-50 border border-stone-200 rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm">
              <div className="flex items-center gap-2">
                <Truck className="w-5 h-5 text-amber-600" />
                <h3 className="font-bold text-stone-900 text-base">Doorstep Courier Delivery</h3>
              </div>

              <div className="space-y-3 text-xs sm:text-sm text-stone-700 divide-y divide-stone-200/60">
                <div className="pt-2 first:pt-0">
                  <span className="block text-[11px] uppercase tracking-wider text-stone-400 font-semibold">Courier Partner</span>
                  <span className="font-medium text-stone-900 text-base">The Professional Couriers</span>
                </div>

                <div className="pt-3">
                  <span className="block text-[11px] uppercase tracking-wider text-stone-400 font-semibold">Deliverable</span>
                  <span className="text-stone-800">1 original physical agreement printed on non-judicial stamp paper</span>
                </div>

                <div className="pt-3">
                  <span className="block text-[11px] uppercase tracking-wider text-stone-400 font-semibold">Coverage Area</span>
                  <span className="text-stone-800">All districts and PIN codes across Tamil Nadu</span>
                </div>

                <div className="pt-3">
                  <span className="block text-[11px] uppercase tracking-wider text-stone-400 font-semibold">Support Email</span>
                  <a href={`mailto:${VENDOR_CONFIG.email}`} className="font-mono font-bold text-amber-800 text-sm hover:underline">
                    {VENDOR_CONFIG.email}
                  </a>
                </div>
              </div>

              <div className="pt-2">
                <Link
                  href="/rent-agreement"
                  className="w-full bg-amber-600 hover:bg-amber-500 text-white font-bold py-3 rounded-xl text-center text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-sm"
                >
                  <FileText className="w-4 h-4" />
                  <span>Start Rental Agreement</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
