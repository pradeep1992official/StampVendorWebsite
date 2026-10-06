import type { Metadata } from 'next';
import { 
  ShieldCheck, 
  HelpCircle
} from 'lucide-react';
import { PriceBreakdownCard } from '@/components/PriceBreakdownCard';
import { DisclaimerBanner } from '@/components/DisclaimerBanner';
import { VENDOR_CONFIG } from '@/src/config/vendor';

export const metadata: Metadata = {
  title: 'Pricing & Fee Breakdown | Stamp Duty, Drafting & Courier Charges',
  description: 'Itemized pricing breakdown for rental agreements: government stamp duty (calculated per agreement), vendor drafting fee, and courier charges shown separately.',
  openGraph: {
    title: 'Pricing & Fee Breakdown | Stamp Duty, Drafting & Courier Charges',
    description: 'Itemized pricing breakdown for rental agreements: government stamp duty (calculated per agreement), vendor drafting fee, and courier charges shown separately.',
  },
};

export default function PricingPage() {
  const { fees } = VENDOR_CONFIG;

  return (
    <div className="space-y-14 py-8 pb-16">
      {/* Header Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-stone-900 text-white rounded-3xl p-8 sm:p-12 border border-stone-800 shadow-sm relative overflow-hidden">
          <div className="max-w-3xl space-y-4">
            <span className="text-xs uppercase tracking-wider font-bold text-amber-400 bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/30">
              Itemized Fee Schedule
            </span>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight">
              Pricing & Fee Breakdown
            </h1>

            <p className="text-stone-300 text-base sm:text-lg leading-relaxed">
              We separate government stamp duty, vendor drafting fee, and courier charges so you have complete visibility over each component.
            </p>
          </div>
        </div>
      </section>

      {/* Main Pricing Breakdown */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto space-y-6">
          <PriceBreakdownCard showCta={true} />

          <div className="bg-amber-50 border border-amber-200/80 rounded-2xl p-5 text-xs text-amber-900 space-y-2">
            <div className="flex items-center gap-2 font-bold">
              <ShieldCheck className="w-4 h-4 text-amber-700" />
              <span>Government Stamp Duty Notice</span>
            </div>
            <p className="leading-relaxed text-amber-800">
              Stamp duty is <strong>calculated per agreement</strong> based on tenancy duration and rent parameters in accordance with the Tamil Nadu Stamp Act. Government stamp duty goes directly towards the physical non-judicial stamp paper purchased from the Registration Department.
            </p>
          </div>
        </div>
      </section>

      {/* Pricing FAQs */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto bg-stone-100 rounded-3xl p-6 sm:p-8 border border-stone-200 space-y-4">
          <h3 className="font-bold text-stone-900 text-lg flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-amber-700" />
            <span>Pricing & Payment Frequently Asked Questions</span>
          </h3>

          <div className="space-y-3 text-xs sm:text-sm text-stone-700">
            <div className="bg-white p-4 rounded-xl border border-stone-200">
              <h4 className="font-bold text-stone-900">How is the stamp duty calculated?</h4>
              <p className="text-stone-600 mt-1">
                The stamp duty is calculated per agreement based on the tenancy period and monthly rental amount as mandated under the Tamil Nadu Stamp Act.
              </p>
            </div>

            <div className="bg-white p-4 rounded-xl border border-stone-200">
              <h4 className="font-bold text-stone-900">Which payment modes are accepted?</h4>
              <p className="text-stone-600 mt-1">
                We accept UPI (Google Pay, PhonePe, Paytm, BHIM), debit/credit cards, and net banking via Razorpay. All payment credentials and secrets remain strictly server-side.
              </p>
            </div>

            <div className="bg-white p-4 rounded-xl border border-stone-200">
              <h4 className="font-bold text-stone-900">What is the cancellation and refund policy?</h4>
              <p className="text-stone-600 mt-1">
                You can cancel for a full refund prior to physical stamp paper procurement and drafting. Once non-judicial stamp paper has been serialized with party details, the government stamp duty component cannot be refunded under government regulations.
              </p>
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
