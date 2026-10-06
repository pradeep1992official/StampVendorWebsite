'use client';

import React, { useState } from 'react';
import { 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  Send, 
  CheckCircle2, 
  ShieldCheck
} from 'lucide-react';
import { WhatsAppButton } from '@/components/WhatsAppButton';
import { DisclaimerBanner } from '@/components/DisclaimerBanner';
import { VENDOR_CONFIG } from '@/src/config/vendor';

export function ContactClient() {
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    district: '',
    message: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone) return;
    setFormSubmitted(true);
  };

  const rawPhone = VENDOR_CONFIG.phone.replace(/[^0-9+]/g, '');

  return (
    <div className="space-y-14 py-8 pb-16">
      {/* Header Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-stone-900 text-white rounded-3xl p-8 sm:p-12 border border-stone-800 shadow-sm relative overflow-hidden">
          <div className="max-w-3xl space-y-4">
            <span className="text-xs uppercase tracking-wider font-bold text-amber-400 bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/30">
              Vendor Help Desk
            </span>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight">
              Contact the Certified Stamp Vendor Desk
            </h1>

            <p className="text-stone-300 text-base sm:text-lg leading-relaxed">
              Have a question about rental agreement drafting, stamp duty calculations, or courier tracking? Contact our desk.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Left Column: Vendor Physical Address & Channels */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white border border-stone-200/90 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
              <div className="space-y-1">
                <span className="text-[11px] font-bold uppercase tracking-wider text-amber-700">Official Profile</span>
                <h2 className="text-xl font-bold text-stone-900">{VENDOR_CONFIG.tradeName}</h2>
                <p className="text-xs font-mono text-stone-500">Licence: {VENDOR_CONFIG.licenceNumber}</p>
              </div>

              <div className="space-y-4 text-xs sm:text-sm text-stone-700">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-amber-50 rounded-xl text-amber-700 shrink-0 mt-0.5">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-stone-900">Shop Address</h3>
                    <p className="text-stone-600 mt-0.5 leading-relaxed font-mono">
                      {VENDOR_CONFIG.addressLine1},<br />
                      {VENDOR_CONFIG.addressLine2},<br />
                      {VENDOR_CONFIG.city} - {VENDOR_CONFIG.pincode}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2 bg-sky-50 rounded-xl text-sky-700 shrink-0 mt-0.5">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-stone-900">Phone Support</h3>
                    {rawPhone ? (
                      <a href={`tel:${rawPhone}`} className="text-amber-800 font-bold block mt-0.5 hover:underline font-mono">
                        {VENDOR_CONFIG.phone}
                      </a>
                    ) : (
                      <span className="font-mono text-stone-500">{VENDOR_CONFIG.phone}</span>
                    )}
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2 bg-purple-50 rounded-xl text-purple-700 shrink-0 mt-0.5">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-stone-900">Email Enquiries</h3>
                    <span className="text-stone-700 block mt-0.5 font-mono">
                      {VENDOR_CONFIG.email}
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2 bg-emerald-50 rounded-xl text-emerald-700 shrink-0 mt-0.5">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-stone-900">Working Hours</h3>
                    <p className="text-stone-600 mt-0.5 font-mono">{VENDOR_CONFIG.workingHours}</p>
                  </div>
                </div>
              </div>

              {/* Instant WhatsApp Action */}
              <div className="pt-2 border-t border-stone-100">
                <WhatsAppButton variant="primary" className="w-full" />
              </div>
            </div>
          </div>

          {/* Right Column: Quick Enquiry Form */}
          <div className="lg:col-span-7">
            <div className="bg-white border border-stone-200/90 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
              <div className="space-y-1">
                <h2 className="text-xl font-bold text-stone-900">Send an Enquiry</h2>
                <p className="text-xs text-stone-600">Our stamp vendor desk will review your question and respond promptly.</p>
              </div>

              {formSubmitted ? (
                <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6 text-center space-y-3">
                  <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <h3 className="font-bold text-emerald-900 text-base">Enquiry Received</h3>
                  <p className="text-xs text-emerald-700 max-w-md mx-auto leading-relaxed">
                    Thank you, {formData.name}. Your note has been received and our desk will contact you at {formData.phone} shortly.
                  </p>
                  <button
                    onClick={() => {
                      setFormSubmitted(false);
                      setFormData({ name: '', phone: '', district: '', message: '' });
                    }}
                    className="text-xs font-semibold text-emerald-800 hover:underline pt-2 cursor-pointer"
                  >
                    Send another query
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-stone-700 mb-1">
                        Your Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="e.g. S. Ramanathan"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-stone-700 mb-1">
                        Phone / WhatsApp Number *
                      </label>
                      <input
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="10-digit mobile number"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      Rental Property District in Tamil Nadu
                    </label>
                    <input
                      type="text"
                      value={formData.district}
                      onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                      placeholder="e.g. Chennai, Madurai, Coimbatore, Salem..."
                      className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      Your Query or Tenancy Details
                    </label>
                    <textarea
                      rows={4}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Tell us about your rental agreement query..."
                      className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                    ></textarea>
                  </div>

                  <div className="p-3 bg-stone-50 rounded-xl border border-stone-200/80 text-[11px] text-stone-500 flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Your contact details are strictly confidential and will never be shared with third parties.</span>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-stone-900 hover:bg-stone-800 text-white font-semibold py-3 px-4 rounded-xl text-xs flex items-center justify-center gap-2 shadow-sm transition-colors cursor-pointer"
                  >
                    <Send className="w-4 h-4" />
                    <span>Send Query to Vendor Desk</span>
                  </button>
                </form>
              )}
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
