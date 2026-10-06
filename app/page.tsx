import type { Metadata } from 'next';
import Link from 'next/link';
import { 
  Award, 
  CheckCircle2, 
  ArrowRight, 
  FileText, 
  ShieldCheck, 
  Clock, 
  Truck, 
  ChevronRight, 
  Lock, 
  MapPin 
} from 'lucide-react';
import { WhatsAppButton } from '@/components/WhatsAppButton';
import { PriceBreakdownCard } from '@/components/PriceBreakdownCard';
import { DisclaimerBanner } from '@/components/DisclaimerBanner';
import { VendorPlaceholderNotice } from '@/components/VendorPlaceholderNotice';
import { VENDOR_CONFIG } from '@/src/config/vendor';

export const metadata: Metadata = {
  title: 'Rental Agreement Drafting & Stamp Paper in Tamil Nadu | Certified Vendor',
  description: 'Online rental agreement drafting on non-judicial stamp paper by certified vendor in Tamil Nadu. Clear fees: stamp duty, service fee, and courier charges shown separately.',
  openGraph: {
    title: 'Rental Agreement Drafting & Stamp Paper in Tamil Nadu | Certified Vendor',
    description: 'Online rental agreement drafting on non-judicial stamp paper by certified vendor in Tamil Nadu. Clear fees: stamp duty, service fee, and courier charges shown separately.',
  },
};

export default function HomePage() {
  return (
    <div className="space-y-16 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-stone-900 via-stone-900 to-stone-950 text-white pt-10 sm:pt-16 pb-16 px-4 sm:px-6 lg:px-8 border-b border-stone-800">
        <div className="max-w-7xl mx-auto">
          {/* Trust badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold mb-6">
            <Award className="w-4 h-4 text-amber-400 shrink-0" />
            <span className="font-mono">Registration Dept Licence: {VENDOR_CONFIG.licenceNumber}</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Column: Heading and Value Props */}
            <div className="lg:col-span-7 space-y-6">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white leading-tight">
                Rental Agreements on Tamil Nadu Stamp Paper, Delivered to Your Doorstep
              </h1>

              <p className="text-stone-300 text-base sm:text-lg leading-relaxed max-w-2xl font-normal">
                Drafted by a certified Tamil Nadu stamp vendor. Submit your agreement details and proofs online, get your drafted agreement printed on authentic non-judicial stamp paper, and delivered via courier.
              </p>

              {/* Core Features */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="flex items-center gap-2 text-stone-200 text-xs sm:text-sm font-medium">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Non-Judicial Stamp Paper</span>
                </div>
                <div className="flex items-center gap-2 text-stone-200 text-xs sm:text-sm font-medium">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Doorstep Courier Delivery</span>
                </div>
                <div className="flex items-center gap-2 text-stone-200 text-xs sm:text-sm font-medium">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Aadhaar Masked (Last 4 Digits)</span>
                </div>
                <div className="flex items-center gap-2 text-stone-200 text-xs sm:text-sm font-medium">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Itemized Fee Transparency</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <Link
                  href="/rent-agreement"
                  className="bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold px-7 py-3.5 rounded-xl shadow-lg shadow-amber-500/20 text-xs sm:text-sm uppercase tracking-wider flex items-center justify-center gap-2 transition-transform active:scale-95"
                >
                  <FileText className="w-5 h-5 text-stone-950" />
                  <span>Start Your Agreement</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <WhatsAppButton variant="primary" />
              </div>

              {/* Disclaimer micro-copy */}
              <p className="text-xs text-stone-400 flex items-center gap-1.5 pt-1">
                <Lock className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                <span>Authorized stamp paper drafting desk. Not a law firm; no legal advice given.</span>
              </p>
            </div>

            {/* Right Column: Pricing Breakdown Card (reads from config) */}
            <div className="lg:col-span-5">
              <PriceBreakdownCard showCta={true} />
            </div>
          </div>
        </div>
      </section>

      {/* Visible Vendor Configuration Placeholder Notice */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <VendorPlaceholderNotice compact={true} />
      </section>

      {/* What We Do Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-12">
          <span className="text-xs uppercase tracking-wider font-bold text-amber-800 bg-amber-100 px-3 py-1 rounded-full">
            Certified Vendor Service
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">
            What We Do For Landlords & Tenants in Tamil Nadu
          </h2>
          <p className="text-stone-600 text-sm sm:text-base leading-relaxed">
            Convenient, transparent agreement drafting on authentic stamp paper without waiting at counter queues.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-800 flex items-center justify-center font-bold text-base">
              01
            </div>
            <h3 className="font-bold text-stone-900 text-base">Official Non-Judicial Stamp Paper</h3>
            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
              Procured through licensed vendor channel ({VENDOR_CONFIG.licenceNumber}) under Tamil Nadu Registration Department rules.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-800 flex items-center justify-center font-bold text-base">
              02
            </div>
            <h3 className="font-bold text-stone-900 text-base">Standard Tenancy Clauses</h3>
            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
              Customized 11-month agreement format with rent, maintenance, deposit, notice period, and escalation terms.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-800 flex items-center justify-center font-bold text-base">
              03
            </div>
            <h3 className="font-bold text-stone-900 text-base">Strict Identity Privacy</h3>
            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
              In accordance with UIDAI guidelines: we record only the last 4 digits of Aadhaar numbers and keep proof documents strictly private.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-800 flex items-center justify-center font-bold text-base">
              04
            </div>
            <h3 className="font-bold text-stone-900 text-base">Doorstep Courier Delivery</h3>
            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
              Printed stamp paper documents packaged securely and dispatched with live postal consignment tracking numbers.
            </p>
          </div>
        </div>
      </section>

      {/* 4-Step "How It Works" Section */}
      <section className="bg-stone-100 py-16 px-4 sm:px-6 lg:px-8 border-y border-stone-200">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto space-y-3 mb-14">
            <span className="text-xs uppercase tracking-wider font-bold text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full">
              4-Step Workflow
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">
              How It Works
            </h2>
            <p className="text-stone-600 text-sm sm:text-base">
              From form submission to doorstep courier delivery.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-stone-200/90 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-3xl font-black text-amber-600">01</span>
                <div className="p-2 bg-amber-50 rounded-lg text-amber-800">
                  <FileText className="w-5 h-5" />
                </div>
              </div>
              <h3 className="font-bold text-stone-900 text-base">Enter Agreement Details</h3>
              <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                Submit owner, tenant, property details, rent amount, security deposit, and duration online.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-stone-200/90 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-3xl font-black text-amber-600">02</span>
                <div className="p-2 bg-sky-50 rounded-lg text-sky-800">
                  <ShieldCheck className="w-5 h-5" />
                </div>
              </div>
              <h3 className="font-bold text-stone-900 text-base">Pay Online via Razorpay</h3>
              <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                Review terms and pay securely. Government stamp duty, service fee, and courier charges are shown separately.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-stone-200/90 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-3xl font-black text-amber-600">03</span>
                <div className="p-2 bg-purple-50 rounded-lg text-purple-800">
                  <Clock className="w-5 h-5" />
                </div>
              </div>
              <h3 className="font-bold text-stone-900 text-base">Verification & Stamping</h3>
              <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                The certified vendor verifies details, drafts the text, and prints the agreement onto non-judicial stamp paper.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-stone-200/90 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-3xl font-black text-amber-600">04</span>
                <div className="p-2 bg-emerald-50 rounded-lg text-emerald-800">
                  <Truck className="w-5 h-5" />
                </div>
              </div>
              <h3 className="font-bold text-stone-900 text-base">Courier Delivery</h3>
              <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                The physical stamped document is couriered to your address with a consignment tracking number.
              </p>
            </div>
          </div>

          <div className="mt-10 text-center">
            <Link
              href="/how-it-works"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-stone-800 hover:text-amber-700 transition-colors"
            >
              <span>Explore detailed step-by-step workflow</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Pricing Summary Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-12">
          <span className="text-xs uppercase tracking-wider font-bold text-stone-800 bg-stone-200 px-3 py-1 rounded-full">
            Transparent Pricing
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">
            Itemized Pricing Summary
          </h2>
          <p className="text-stone-600 text-sm sm:text-base">
            Stamp duty, vendor service fee, and courier charges are shown separately.
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          <PriceBreakdownCard showCta={true} />
        </div>
      </section>

      {/* Vendor Profile Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-br from-stone-900 to-stone-800 text-white rounded-3xl p-8 sm:p-12 border border-stone-700 shadow-lg">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8 space-y-4">
              <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider">
                <MapPin className="w-4 h-4" />
                <span>Certified Stamp Vendor Profile</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-black text-white">
                {VENDOR_CONFIG.tradeName}
              </h3>
              <p className="text-stone-300 text-sm leading-relaxed font-mono">
                {VENDOR_CONFIG.addressLine1}, {VENDOR_CONFIG.addressLine2}, {VENDOR_CONFIG.city} - {VENDOR_CONFIG.pincode}
              </p>
              <div className="pt-2 flex flex-wrap gap-4 text-xs text-stone-300">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span className="font-mono">Licence: {VENDOR_CONFIG.licenceNumber}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Tamil Nadu Registration Dept</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col gap-3">
              <Link
                href="/rent-agreement"
                className="w-full bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold py-3.5 px-6 rounded-xl text-center text-xs uppercase tracking-wider transition-all"
              >
                Start Rental Agreement
              </Link>

              <WhatsAppButton variant="outline" className="w-full bg-stone-900/60 border-stone-600 text-white hover:bg-stone-800" />
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
