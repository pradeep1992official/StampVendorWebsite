'use client';

import React from 'react';
import Link from 'next/link';
import { 
  Mail, 
  Truck,
  FileCheck2,
  FileText
} from 'lucide-react';
import { VENDOR_CONFIG } from '@/src/config/vendor';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-stone-950 text-stone-300 border-t border-stone-800 text-sm">
      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Col 1: Brand & Service Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-amber-600 flex items-center justify-center text-stone-950 font-black text-sm">
                TN
              </div>
              <h4 className="font-extrabold text-white text-base sm:text-lg">{VENDOR_CONFIG.tradeName}</h4>
            </div>

            <p className="text-xs text-stone-400 leading-relaxed">
              Online rental agreement drafting on non-judicial stamp paper with reliable doorstep delivery via Professional Courier across Tamil Nadu.
            </p>

            <div className="space-y-2 pt-2 text-xs text-stone-400">
              <div className="flex items-center gap-2.5">
                <Truck className="w-4 h-4 text-amber-500 shrink-0" />
                <span>Dispatched via Professional Courier</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-amber-500 shrink-0" />
                <a href={`mailto:${VENDOR_CONFIG.email}`} className="hover:text-amber-400 transition-colors">
                  {VENDOR_CONFIG.email}
                </a>
              </div>
            </div>
          </div>

          {/* Col 2: Services */}
          <div className="space-y-3">
            <h5 className="font-bold text-white text-xs uppercase tracking-wider text-amber-400">Services</h5>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/order" className="text-stone-400 hover:text-white transition-colors">
                  11-Month Rental Agreement
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="text-stone-400 hover:text-white transition-colors">
                  Pricing & Stamp Duty
                </Link>
              </li>
              <li>
                <Link href="/how-it-works" className="text-stone-400 hover:text-white transition-colors">
                  How Stamping Works
                </Link>
              </li>
              <li>
                <Link href="/track" className="text-stone-400 hover:text-white transition-colors">
                  Track Courier Dispatch
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Support */}
          <div className="space-y-3">
            <h5 className="font-bold text-white text-xs uppercase tracking-wider text-amber-400">Support</h5>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/faq" className="text-stone-400 hover:text-white transition-colors">
                  Frequently Asked Questions
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-stone-400 hover:text-white transition-colors">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Legal & Policies */}
          <div className="space-y-3">
            <h5 className="font-bold text-white text-xs uppercase tracking-wider text-amber-400">Policies & Terms</h5>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/privacy-policy" className="text-stone-400 hover:text-white transition-colors">
                  Privacy Policy
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
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-12 pt-6 border-t border-stone-900 flex flex-col sm:flex-row items-center justify-between text-xs text-stone-500 gap-4">
          <p>© {new Date().getFullYear()} {VENDOR_CONFIG.tradeName}. All rights reserved.</p>
          <div className="flex items-center gap-2">
            <span>Tamil Nadu, India</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
