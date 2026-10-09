'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Search, 
  ChevronDown, 
  ChevronUp, 
  HelpCircle 
} from 'lucide-react';
import { WhatsAppButton } from '@/components/WhatsAppButton';
import { DisclaimerBanner } from '@/components/DisclaimerBanner';

export function FaqClient() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<'all' | 'legality' | 'privacy' | 'delivery' | 'pricing'>('all');
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqData = [
    {
      category: 'legality',
      q: 'Is an online-drafted rental agreement legally valid in Tamil Nadu?',
      a: 'Yes. An agreement drafted on genuine non-judicial stamp paper purchased from an authorized Tamil Nadu stamp vendor (Licence #V/MDU/2014/0488) and signed by both the landlord and tenant in the presence of two witnesses is completely valid under the Indian Contract Act and the Tamil Nadu tenancy framework. It serves as valid proof of residence for banks, passport authorities, and gas agencies.',
    },
    {
      category: 'legality',
      q: 'Why are rent agreements in Tamil Nadu drafted for 11 months?',
      a: 'Under Section 17 of the Registration Act, 1908, leases of immovable property for any term exceeding 11 months require compulsory registration at the Sub-Registrar office, attracting higher stamp duty and registration fees. An 11-month agreement drafted on ₹100 stamp paper is legally binding, flexible, and exempt from mandatory sub-registrar appearances.',
    },
    {
      category: 'privacy',
      q: 'How is my Aadhaar card protected on this platform?',
      a: 'We strictly adhere to UIDAI data privacy standards. We NEVER store full 12-digit Aadhaar numbers in our database. Customers are asked to submit only the last 4 digits of their Aadhaar number (e.g. XXXX-XXXX-8921). Uploaded proof documents are stored in secure, private storage accessible only by the order owner and our authorized vendor.',
    },
    {
      category: 'privacy',
      q: 'Can third parties or other customers see my property or ID proofs?',
      a: 'No. Security rules ensure that proof files are strictly private to the specific customer order and our certified admin desk. We never sell, display, or monetize your contact details or proof documents.',
    },
    {
      category: 'pricing',
      q: 'Why is the price split into stamp duty, service fee, and courier charge?',
      a: 'As a certified vendor under the Tamil Nadu Registration Department, transparency is our foremost priority. ₹100 goes directly to the Tamil Nadu Government towards official non-judicial stamp duty, ₹299 covers custom clause drafting, printing, and document auditing, and ₹99 covers India Post Speed Post / Blue Dart express courier in tamper-proof packaging.',
    },
    {
      category: 'pricing',
      q: 'Can I cancel my agreement order and receive a refund?',
      a: 'Yes, full cancellation is available if requested before our vendor physically prints the document on non-judicial stamp paper. Once an authentic non-judicial stamp paper is printed with owner/tenant details, government stamp duty cannot be refunded because each stamp paper is serialized and non-reusable.',
    },
    {
      category: 'delivery',
      q: 'How fast will my printed stamp paper be delivered?',
      a: 'Orders placed before 3:00 PM on business days are drafted, printed, and dispatched on the very same day. Deliveries within Chennai, Madurai, Coimbatore, and Trichy typically arrive within 24 to 48 hours. Other Tamil Nadu district locations arrive in 2 to 3 business days via India Post Speed Post or Blue Dart.',
    },
    {
      category: 'delivery',
      q: 'How do I track my dispatched agreement courier?',
      a: 'Once dispatched, you will receive an SMS and email notification with your official Speed Post / Blue Dart consignment number. You can also view real-time status directly on our Track Order portal using your Order ID and verified phone number.',
    },
    {
      category: 'legality',
      q: 'Do we need a Notary Public stamp on the agreement?',
      a: 'For standard residential rental occupancy in Tamil Nadu, an agreement executed on non-judicial stamp paper signed by both parties and two witnesses is standard. However, if your employer, bank, or visa authority explicitly requires a Notary Public seal, you can simply take the physically signed stamp paper to any local notary in your locality for quick endorsement.',
    },
    {
      category: 'legality',
      q: 'Do you give legal counsel or resolve landlord-tenant disputes?',
      a: 'No. As stated in our statutory disclaimer, we are a licensed stamp paper vendor and legal drafting service. We do not provide personalized legal representation or legal advocacy in civil courts. For tenancy litigation or complex disputed titles, consult an enrolled advocate.',
    },
  ];

  const filteredFaqs = faqData.filter((item) => {
    const matchesCategory = activeCategory === 'all' || item.category === activeCategory;
    const matchesSearch =
      item.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.a.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-14 py-8 pb-16">
      {/* Header Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-stone-900 text-white rounded-3xl p-8 sm:p-12 border border-stone-800 shadow-sm relative overflow-hidden">
          <div className="max-w-3xl space-y-4">
            <span className="text-xs uppercase tracking-wider font-bold text-amber-400 bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/30">
              Clear Answers
            </span>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight">
              Frequently Asked Questions (FAQ)
            </h1>

            <p className="text-stone-300 text-base sm:text-lg leading-relaxed">
              Everything you need to know about non-judicial stamp paper, rental agreements, and our certified vendor delivery.
            </p>
          </div>
        </div>
      </section>

      {/* Search and Category Filters */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="relative">
          <Search className="w-5 h-5 text-stone-400 absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search questions (e.g., 11-month, Aadhaar, delivery, notary, stamp duty)..."
            className="w-full pl-12 pr-4 py-3.5 bg-white border border-stone-200 rounded-2xl text-sm text-stone-800 placeholder-stone-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
        </div>

        {/* Category Filter Pills */}
        <div className="flex flex-wrap items-center gap-2 text-xs font-semibold">
          <button
            onClick={() => setActiveCategory('all')}
            className={`px-3.5 py-1.5 rounded-full transition-colors ${
              activeCategory === 'all'
                ? 'bg-amber-600 text-white shadow-sm'
                : 'bg-stone-200 text-stone-700 hover:bg-stone-300'
            }`}
          >
            All Questions ({faqData.length})
          </button>
          <button
            onClick={() => setActiveCategory('legality')}
            className={`px-3.5 py-1.5 rounded-full transition-colors ${
              activeCategory === 'legality'
                ? 'bg-amber-600 text-white shadow-sm'
                : 'bg-stone-200 text-stone-700 hover:bg-stone-300'
            }`}
          >
            Legality & Tenancy
          </button>
          <button
            onClick={() => setActiveCategory('privacy')}
            className={`px-3.5 py-1.5 rounded-full transition-colors ${
              activeCategory === 'privacy'
                ? 'bg-amber-600 text-white shadow-sm'
                : 'bg-stone-200 text-stone-700 hover:bg-stone-300'
            }`}
          >
            Aadhaar & Privacy
          </button>
          <button
            onClick={() => setActiveCategory('pricing')}
            className={`px-3.5 py-1.5 rounded-full transition-colors ${
              activeCategory === 'pricing'
                ? 'bg-amber-600 text-white shadow-sm'
                : 'bg-stone-200 text-stone-700 hover:bg-stone-300'
            }`}
          >
            Pricing & Refunds
          </button>
          <button
            onClick={() => setActiveCategory('delivery')}
            className={`px-3.5 py-1.5 rounded-full transition-colors ${
              activeCategory === 'delivery'
                ? 'bg-amber-600 text-white shadow-sm'
                : 'bg-stone-200 text-stone-700 hover:bg-stone-300'
            }`}
          >
            Courier & Tracking
          </button>
        </div>

        {/* Accordions */}
        <div className="space-y-3 pt-2">
          {filteredFaqs.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-2xl border border-stone-200 p-8 space-y-2">
              <p className="text-sm font-semibold text-stone-700">No questions matched your search query.</p>
              <div className="pt-2">
                <WhatsAppButton variant="outline" />
              </div>
            </div>
          ) : (
            filteredFaqs.map((faq, idx) => {
              const isOpen = openIndex === idx;
              return (
                <div
                  key={idx}
                  className="bg-white border border-stone-200 rounded-2xl overflow-hidden shadow-sm transition-shadow hover:shadow-md"
                >
                  <button
                    onClick={() => setOpenIndex(isOpen ? null : idx)}
                    className="w-full p-5 text-left flex items-start justify-between gap-4 focus:outline-none"
                  >
                    <span className="font-bold text-stone-900 text-sm sm:text-base leading-snug">
                      {faq.q}
                    </span>
                    <span className="p-1 rounded-lg bg-stone-100 text-stone-600 shrink-0 mt-0.5">
                      {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </span>
                  </button>

                  {isOpen && (
                    <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-stone-600 leading-relaxed border-t border-stone-100">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Action card */}
        <div className="bg-stone-100 rounded-2xl p-6 border border-stone-200 flex flex-col sm:flex-row items-center justify-between gap-4 mt-8">
          <div>
            <h4 className="font-bold text-stone-900 text-sm">Still have questions?</h4>
            <p className="text-xs text-stone-600 mt-0.5">Our certified stamp vendor desk is available Monday through Saturday.</p>
          </div>
          <div className="flex items-center gap-3">
            <WhatsAppButton variant="primary" />
            <Link
              href="/order"
              className="bg-stone-900 hover:bg-stone-800 text-white font-semibold px-4 py-2.5 rounded-xl text-xs uppercase tracking-wider"
            >
              Start Order
            </Link>
          </div>
        </div>
      </section>

      {/* Statutory Disclaimer */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <DisclaimerBanner />
      </section>
    </div>
  );
}
