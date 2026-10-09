import type { Metadata } from 'next';
import Link from 'next/link';
import { 
  FileText, 
  CreditCard, 
  Printer, 
  Truck, 
  ShieldCheck, 
  ArrowRight,
  PackageCheck
} from 'lucide-react';
import { PriceBreakdownCard } from '@/components/PriceBreakdownCard';

export const metadata: Metadata = {
  title: 'How It Works | Step-by-Step Rental Agreement Delivery in Tamil Nadu',
  description: 'Discover how our 4-step process delivers authentic rental agreements to your doorstep across Tamil Nadu via Professional Courier.',
  openGraph: {
    title: 'How It Works | Step-by-Step Rental Agreement Delivery in Tamil Nadu',
    description: 'Discover how our 4-step process delivers authentic rental agreements to your doorstep across Tamil Nadu via Professional Courier.',
  },
};

export default function HowItWorksPage() {
  const steps = [
    {
      num: '01',
      icon: <FileText className="w-6 h-6 text-amber-700" />,
      title: 'Submit Agreement & Proof Details Online',
      desc: 'Fill our clean, mobile-first form with Owner, Tenant, and Property details. Upload ID proofs and property address proof (EB Bill or Property Tax). Providing an Aadhaar number is optional.',
      details: [
        'Owner & Tenant full name, father/spouse name, age, phone & email',
        'Government ID proof (Aadhaar optional, Voter ID, PAN, or Passport)',
        'Monthly rent, security deposit, notice period & tenure',
        'Clear JPG, PNG, or PDF proof uploads up to 5 MB',
      ],
    },
    {
      num: '02',
      icon: <CreditCard className="w-6 h-6 text-sky-700" />,
      title: 'Review & Pay via Secure Online Gateway',
      desc: 'Review every detail on an editable summary screen. Pay securely online. Government Stamp Duty, Drafting & Stamping, and Professional Courier charges are transparently itemized with zero hidden charges.',
      details: [
        'Instant digital order receipt & unique Order ID',
        'Server-side payment verification',
        'SMS & email confirmation with order status tracking link',
      ],
    },
    {
      num: '03',
      icon: <Printer className="w-6 h-6 text-purple-700" />,
      title: 'Non-Judicial Stamp Paper Procured & Drafted',
      desc: 'Our drafting team formats the agreement according to standard tenancy guidelines. We print the custom rental contract onto authentic non-judicial stamp paper bearing the physical serial number.',
      details: [
        'Authentic serial numbered Tamil Nadu non-judicial stamp paper',
        'Standard clauses formulated for Tamil Nadu tenancy laws',
        'Quality inspection to ensure all spelling and party names match ID proofs',
      ],
    },
    {
      num: '04',
      icon: <Truck className="w-6 h-6 text-emerald-700" />,
      title: 'Professional Courier Dispatched to Your Doorstep',
      desc: 'The stamped agreement is safely packaged inside a secure, tear-resistant envelope and dispatched strictly via Professional Courier with consignment tracking.',
      details: [
        'Dispatched promptly upon draft verification',
        'Professional Courier consignment number sent via SMS and order portal',
        'Simply sign along with tenant and two witnesses upon delivery',
      ],
    },
  ];

  return (
    <div className="space-y-14 py-8 pb-16">
      {/* Hero Header */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-stone-900 text-white rounded-3xl p-8 sm:p-12 border border-stone-800 shadow-sm relative overflow-hidden">
          <div className="max-w-3xl space-y-4">
            <span className="text-xs uppercase tracking-wider font-bold text-amber-400 bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/30">
              Verified Procedure
            </span>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight">
              How Our Rental Agreement Service Works
            </h1>

            <p className="text-stone-300 text-base sm:text-lg leading-relaxed">
              A transparent, reliable 4-step workflow designed to save your time while providing authentic non-judicial stamp paper agreements across Tamil Nadu.
            </p>

            <div className="pt-2">
              <Link
                href="/order"
                className="bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold px-6 py-3 rounded-xl text-xs uppercase tracking-wider transition-all shadow-md active:translate-y-0.5 inline-flex items-center gap-2"
              >
                <span>Start Rental Agreement</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Step by step cards */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="space-y-8">
          {steps.map((st, idx) => (
            <div
              key={idx}
              className="bg-white border border-stone-200/90 rounded-2xl p-6 sm:p-8 shadow-sm hover:shadow-md transition-shadow grid grid-cols-1 lg:grid-cols-12 gap-6 items-center"
            >
              <div className="lg:col-span-1 flex items-center justify-start lg:justify-center">
                <div className="w-14 h-14 rounded-2xl bg-stone-100 border border-stone-200 flex items-center justify-center font-black text-2xl text-stone-800">
                  {st.num}
                </div>
              </div>

              <div className="lg:col-span-7 space-y-3">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 bg-stone-50 rounded-lg border border-stone-200/60">
                    {st.icon}
                  </div>
                  <h2 className="text-xl sm:text-2xl font-bold text-stone-900">{st.title}</h2>
                </div>

                <p className="text-stone-600 text-sm leading-relaxed">{st.desc}</p>

                <div className="space-y-1.5 pt-2">
                  {st.details.map((item, dIdx) => (
                    <div key={dIdx} className="flex items-start gap-2 text-xs text-stone-700">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 shrink-0 mt-1.5"></span>
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="lg:col-span-4 bg-stone-50 rounded-xl p-4 border border-stone-200/60 text-xs text-stone-600 space-y-2">
                <div className="flex items-center gap-1.5 font-bold text-stone-900">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Authentic Quality Check</span>
                </div>
                <p>
                  Every document is drafted on genuine non-judicial stamp paper bearing an authentic serial number.
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Transparent Pricing Callout */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-6 space-y-4">
            <span className="text-xs uppercase tracking-wider font-bold text-amber-700">Fair Pricing</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900">
              Clear & Transparent Cost Structure
            </h2>
            <p className="text-stone-600 text-sm leading-relaxed">
              No convenience surcharges, no hidden paperwork fees. We disclose the exact breakdown between the government stamp duty, drafting & stamping fee, and Professional Courier dispatch.
            </p>
            <div className="space-y-2 pt-2 text-xs text-stone-700 font-medium">
              <div className="flex items-center gap-2">
                <PackageCheck className="w-4 h-4 text-emerald-600" />
                <span>Professional Courier with tracking number</span>
              </div>
              <div className="flex items-center gap-2">
                <PackageCheck className="w-4 h-4 text-emerald-600" />
                <span>Waterproof, tamper-evident courier packaging</span>
              </div>
              <div className="flex items-center gap-2">
                <PackageCheck className="w-4 h-4 text-emerald-600" />
                <span>1 physical original copy printed on authentic stamp paper and couriered</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6">
            <PriceBreakdownCard showCta={true} />
          </div>
        </div>
      </section>
    </div>
  );
}
