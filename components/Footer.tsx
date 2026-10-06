'use client';

import React from 'react';
import Link from 'next/link';
import { 
  ShieldCheck, 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  FileCheck2,
  ExternalLink
} from 'lucide-react';
import { VENDOR_CONFIG } from '@/src/config/vendor';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-stone-950 text-stone-300 border-t border-stone-800 text-sm">
      {/* Top Banner with Badges (no statistics) */}
      <div className="border-b border-stone-900 bg-stone-900/40 py-6 px-4">
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h5 className="font-bold text-white text-xs uppercase tracking-wider">Certified Vendor</h5>
              <p className="text-xs text-stone-400 font-mono">{VENDOR_CONFIG.licenceNumber}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <FileCheck2 className="w-5 h-5" />
            </div>
            <div>
              <h5 className="font-bold text-white text-xs uppercase tracking-wider">Non-Judicial Stamp Paper</h5>
              <p className="text-xs text-stone-400">Tamil Nadu Registration Dept</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h5 className="font-bold text-white text-xs uppercase tracking-wider">Aadhaar Privacy</h5>
              <p className="text-xs text-stone-400">Last 4 digits stored only</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Col 1 & 2: Vendor Identity & Physical Office */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-amber-600 flex items-center justify-center text-stone-950 font-black text-sm">
                TN
              </div>
              <h4 className="font-extrabold text-white text-base sm:text-lg">{VENDOR_CONFIG.tradeName}</h4>
            </div>

            <p className="text-xs text-stone-400 leading-relaxed">
              Authorized stamp paper vendor service. Providing non-judicial stamp paper drafting and courier delivery for 11-month rental agreements in Tamil Nadu.
            </p>

            <div className="space-y-2 pt-2 text-xs text-stone-400">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                <span className="font-mono">{VENDOR_CONFIG.addressLine1}, {VENDOR_CONFIG.addressLine2}, {VENDOR_CONFIG.city} - {VENDOR_CONFIG.pincode}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-amber-500 shrink-0" />
                <span className="font-mono">{VENDOR_CONFIG.phone}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-amber-500 shrink-0" />
                <span className="font-mono">{VENDOR_CONFIG.email}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Clock className="w-4 h-4 text-amber-500 shrink-0" />
                <span className="font-mono">{VENDOR_CONFIG.workingHours}</span>
              </div>
            </div>
          </div>

          {/* Col 3: Services & Information */}
          <div className="space-y-3">
            <h5 className="font-bold text-white text-xs uppercase tracking-wider text-amber-400">Services</h5>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/rent-agreement" className="text-stone-400 hover:text-white transition-colors">
                  11-Month Rental Agreement
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="text-stone-400 hover:text-white transition-colors">
                  Pricing & Stamp Duty Tariff
                </Link>
              </li>
              <li>
                <Link href="/how-it-works" className="text-stone-400 hover:text-white transition-colors">
                  How Online Stamping Works
                </Link>
              </li>
              <li>
                <Link href="/rent-agreement" className="text-stone-400 hover:text-white transition-colors">
                  Required Documents Checklist
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-stone-400 hover:text-white transition-colors">
                  Frequently Asked Questions
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Vendor & Support */}
          <div className="space-y-3">
            <h5 className="font-bold text-white text-xs uppercase tracking-wider text-amber-400">Vendor Desk</h5>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/about" className="text-stone-400 hover:text-white transition-colors">
                  About Certified Vendor
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-stone-400 hover:text-white transition-colors">
                  Physical Shop & Contact
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-amber-400 hover:text-amber-300 transition-colors">
                  Vendor Placeholders TODO List
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 5: Legal & Disclaimers */}
          <div className="space-y-3">
            <h5 className="font-bold text-white text-xs uppercase tracking-wider text-amber-400">Policies & Terms</h5>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/privacy-policy" className="text-stone-400 hover:text-white transition-colors">
                  Privacy & Aadhaar Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-stone-400 hover:text-white transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/refund-policy" className="text-stone-400 hover:text-white transition-colors">
                  Refund & Cancellation Policy
                </Link>
              </li>
              <li>
                <Link href="/disclaimer" className="text-stone-400 hover:text-white transition-colors">
                  Disclaimer
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Disclaimer Notice */}
        <div className="mt-10 pt-6 border-t border-stone-900 bg-stone-900/30 p-4 rounded-xl text-stone-400 text-xs leading-relaxed">
          <p>
            <strong className="text-stone-200">Disclaimer:</strong> This website is an independent document drafting and stamp paper vendor desk operated under licence {VENDOR_CONFIG.licenceNumber}. We are an authorized stamp vendor and drafting service; we are NOT a law firm and do NOT provide legal advice or dispute representation. For customized dispute provisions or title checks, please consult an enrolled advocate.
          </p>
        </div>

        {/* Copyright */}
        <div className="mt-8 pt-6 border-t border-stone-900 flex flex-col sm:flex-row items-center justify-between text-xs text-stone-500 gap-4">
          <p>© {new Date().getFullYear()} {VENDOR_CONFIG.tradeName}. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <span className="font-mono text-stone-400">{VENDOR_CONFIG.licenceNumber}</span>
            <span>•</span>
            <span>Tamil Nadu, India</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
