import type { Metadata } from 'next';
import Link from 'next/link';
import { 
  FileCheck2, 
  Clock, 
  HelpCircle, 
  ChevronRight, 
  FileText, 
  Lock 
} from 'lucide-react';
import { PriceBreakdownCard } from '@/components/PriceBreakdownCard';
import { WhatsAppButton } from '@/components/WhatsAppButton';
import { DisclaimerBanner } from '@/components/DisclaimerBanner';
import { VENDOR_CONFIG } from '@/src/config/vendor';

export const metadata: Metadata = {
  title: 'Online Rental Agreement in Tamil Nadu | 11-Month Non-Judicial Stamp Paper Service',
  description: 'Draft your 11-month rent agreement on non-judicial stamp paper in Tamil Nadu. Documents required, fee breakdown, and vendor delivery procedure.',
  openGraph: {
    title: 'Online Rental Agreement in Tamil Nadu | 11-Month Non-Judicial Stamp Paper Service',
    description: 'Draft your 11-month rent agreement on non-judicial stamp paper in Tamil Nadu. Documents required, fee breakdown, and vendor delivery procedure.',
  },
};

export default function RentAgreementServicePage() {
  const faqs = [
    {
      q: 'Why is an 11-month rent agreement standard in Tamil Nadu?',
      a: 'Under Section 17 of the Registration Act, leases of immovable property exceeding 11 months require mandatory sub-registrar registration and higher stamp duty. An 11-month agreement drafted on non-judicial stamp paper is standard customary practice and accepted for address verification by banks and authorities.',
    },
    {
      q: 'Do I need to visit the Sub-Registrar office in person?',
      a: 'No. For an 11-month non-judicial stamp paper agreement, physical presence at the Sub-Registrar office is not mandated. The certified vendor procures the stamp paper, prints the verified draft, and couriers it to your address. You and your tenant sign in the presence of two witnesses.',
    },
    {
      q: 'How do you safeguard my Aadhaar data?',
      a: 'We strictly adhere to UIDAI privacy rules and do NOT store full 12-digit Aadhaar numbers. Our platform records only the last 4 digits (e.g., XXXX-XXXX-4921). All uploaded proofs are kept private to your order and authenticated vendor staff.',
    },
    {
      q: 'Can this agreement be notarized?',
      a: 'Yes. Once you receive the printed agreement on authentic non-judicial stamp paper and sign it with your tenant, you may optionally get it signed by any local Notary Public in your locality if your bank or corporate employer requires a notary seal.',
    },
  ];

  return (
    <div className="space-y-14 py-8 pb-16">
      {/* Header Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-stone-900 text-white rounded-3xl p-8 sm:p-12 border border-stone-800 shadow-sm relative overflow-hidden">
          <div className="max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold">
              <FileCheck2 className="w-4 h-4 text-amber-400" />
              <span>Non-Judicial Stamp Paper Service</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight">
              Online Rent Agreement Drafting & Stamping in Tamil Nadu
            </h1>

            <p className="text-stone-300 text-base sm:text-lg leading-relaxed">
              Drafting of 11-month residential and commercial rental agreements on non-judicial stamp paper with courier delivery.
            </p>

            <div className="pt-4 flex flex-wrap items-center gap-3">
              <WhatsAppButton variant="outline" className="border-stone-700 text-white hover:bg-stone-800" />
            </div>
          </div>
        </div>
      </section>

      {/* Service Overview & Documents Required */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          <div className="lg:col-span-7 space-y-6">
            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-700">Service Details</span>
              <h2 className="text-2xl font-bold text-stone-900">About Our Tamil Nadu Rent Agreement Service</h2>
            </div>

            <p className="text-stone-700 text-sm sm:text-base leading-relaxed">
              Under standard tenancy practices in Tamil Nadu, rental agreements executed for 11 months do not mandate compulsory sub-registrar registration, making an agreement drafted on authentic non-judicial stamp paper the standard legal proof for landlords, tenants, bank account openings, passport address updates, and police verification.
            </p>

            {/* Standard clauses */}
            <div className="bg-white p-6 rounded-2xl border border-stone-200/90 shadow-sm space-y-4">
              <h3 className="font-bold text-stone-900 text-sm uppercase tracking-wider text-amber-800">
                Standard Clauses Drafted in Agreement
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm text-stone-700">
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-600"></span>
                  <span>Monthly Rent & Due Date</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-600"></span>
                  <span>Security Deposit & Refund Terms</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-600"></span>
                  <span>Maintenance & Electricity / EB terms</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-600"></span>
                  <span>Notice Period Clauses</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-600"></span>
                  <span>Annual Rent Escalation %</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-600"></span>
                  <span>Property Inspection & Repair Terms</span>
                </div>
              </div>
            </div>

            {/* Documents Required */}
            <div className="space-y-4 pt-4">
              <div className="space-y-1">
                <h3 className="text-xl font-bold text-stone-900">Documents Required to Order</h3>
                <p className="text-xs text-stone-600">Keep clear photos or PDF scans of the following documents ready:</p>
              </div>

              <div className="space-y-3">
                <div className="bg-stone-50 border border-stone-200 rounded-xl p-4 flex items-start gap-3">
                  <div className="p-2 bg-amber-100 text-amber-800 rounded-lg shrink-0 mt-0.5">
                    <FileText className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-stone-900 text-sm">Owner Identification Proof</h4>
                    <p className="text-xs text-stone-600 mt-0.5">
                      Aadhaar Card (we only record the last 4 digits), Voter ID, PAN Card, or Passport.
                    </p>
                  </div>
                </div>

                <div className="bg-stone-50 border border-stone-200 rounded-xl p-4 flex items-start gap-3">
                  <div className="p-2 bg-amber-100 text-amber-800 rounded-lg shrink-0 mt-0.5">
                    <FileText className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-stone-900 text-sm">Tenant Identification Proof</h4>
                    <p className="text-xs text-stone-600 mt-0.5">
                      Aadhaar Card (last 4 digits only), Voter ID, Passport, or Driving Licence.
                    </p>
                  </div>
                </div>

                <div className="bg-stone-50 border border-stone-200 rounded-xl p-4 flex items-start gap-3">
                  <div className="p-2 bg-amber-100 text-amber-800 rounded-lg shrink-0 mt-0.5">
                    <FileText className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-stone-900 text-sm">Property Ownership / Address Proof</h4>
                    <p className="text-xs text-stone-600 mt-0.5">
                      Recent Electricity Bill (EB Bill), Property Tax receipt, or Sale Deed copy showing the premises address.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-amber-50 border border-amber-200/80 rounded-xl p-4 text-xs text-amber-900 space-y-1">
                <div className="flex items-center gap-1.5 font-bold">
                  <Lock className="w-4 h-4 text-amber-700" />
                  <span>Document Upload Security</span>
                </div>
                <p className="leading-relaxed">
                  Only JPG, PNG, and PDF formats accepted up to 5 MB per document. Never enter or upload unmasked full Aadhaar numbers; our platform specifically restricts input to the last 4 digits only. Uploaded files are strictly private to your order.
                </p>
              </div>
            </div>
          </div>

          {/* Right column: Fee Breakdown & Courier Dispatch */}
          <div className="lg:col-span-5 space-y-6">
            <PriceBreakdownCard showCta={true} />

            {/* Courier Dispatch Card (without invented district hours) */}
            <div className="bg-white border border-stone-200 rounded-2xl p-6 shadow-sm space-y-3">
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-amber-600" />
                <h3 className="font-bold text-stone-900 text-base">Courier Dispatch</h3>
              </div>
              <p className="text-xs text-stone-600 leading-relaxed">
                Once customer details and uploaded proofs are verified, the agreement is printed on non-judicial stamp paper and handed over to courier (India Post Speed Post / Blue Dart). Consignment tracking numbers are sent via SMS and reflected in your order tracking portal.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQs Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-stone-50 rounded-3xl p-8 sm:p-12 border border-stone-200 space-y-6">
          <div className="text-center max-w-2xl mx-auto space-y-2 mb-8">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-700 bg-amber-100 px-3 py-1 rounded-full">
              Common Questions
            </span>
            <h2 className="text-2xl font-bold text-stone-900">Rent Agreement Questions & Answers</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {faqs.map((faq, idx) => (
              <div key={idx} className="bg-white p-5 rounded-2xl border border-stone-200/90 shadow-sm space-y-2">
                <h3 className="font-bold text-stone-900 text-sm flex items-start gap-2">
                  <HelpCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <span>{faq.q}</span>
                </h3>
                <p className="text-xs text-stone-600 leading-relaxed pl-6">{faq.a}</p>
              </div>
            ))}
          </div>

          <div className="text-center pt-4">
            <Link
              href="/faq"
              className="inline-flex items-center gap-1 text-xs font-semibold text-amber-800 hover:text-amber-900"
            >
              <span>View full list of frequently asked questions</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
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
