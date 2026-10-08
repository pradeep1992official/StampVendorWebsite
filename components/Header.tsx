'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  ShieldCheck, 
  Menu, 
  X, 
  FileText, 
  PhoneCall, 
  Globe,
  User,
  LogOut
} from 'lucide-react';
import { useI18n } from '@/lib/i18n/context';
import { useAuth } from '@/lib/auth-context';
import { VENDOR_CONFIG } from '@/src/config/vendor';

interface HeaderProps {
  onStartAgreement?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onStartAgreement }) => {
  const { lang, setLang, t } = useI18n();
  const { user, signOut } = useAuth();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { label: t.nav.home, href: '/' },
    { label: t.nav.rentAgreement, href: '/rent-agreement' },
    { label: t.nav.howItWorks, href: '/how-it-works' },
    { label: t.nav.pricing, href: '/pricing' },
    { label: t.nav.faq, href: '/faq' },
    { label: t.nav.about, href: '/about' },
    { label: t.nav.contact, href: '/contact' },
    { label: t.nav.trackOrder, href: '/track' },
  ];

  const toggleLanguage = () => {
    setLang(lang === 'en' ? 'ta' : 'en');
  };

  const rawPhone = VENDOR_CONFIG.phone.replace(/[^0-9+]/g, '');

  return (
    <header className="sticky top-0 z-50 bg-stone-900 text-stone-100 shadow-md">
      {/* Top certified license strip */}
      <div className="bg-stone-950 border-b border-stone-800 text-[11px] sm:text-xs py-1.5 px-4 text-stone-300">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 overflow-hidden text-ellipsis whitespace-nowrap">
            <ShieldCheck className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span className="font-semibold text-amber-300">Certified Stamp Vendor</span>
            <span className="text-stone-500 hidden sm:inline">•</span>
            <span className="font-mono text-stone-300 hidden sm:inline">{VENDOR_CONFIG.licenceNumber}</span>
          </div>

          <div className="flex items-center gap-4 shrink-0">
            {rawPhone && (
              <a
                href={`tel:${rawPhone}`}
                className="hidden md:flex items-center gap-1 text-stone-300 hover:text-white transition-colors"
              >
                <PhoneCall className="w-3 h-3 text-amber-400" />
                <span>{VENDOR_CONFIG.phone}</span>
              </a>
            )}

            {/* Language toggle */}
            <button
              onClick={toggleLanguage}
              className="flex items-center gap-1 px-2 py-0.5 rounded bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-medium transition-colors border border-stone-700 cursor-pointer"
              aria-label="Toggle language between English and Tamil"
            >
              <Globe className="w-3 h-3 text-amber-400" />
              <span>{lang === 'en' ? 'தமிழ்' : 'English'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo / Brand */}
          <Link
            href="/"
            className="flex items-center gap-3 text-left group focus:outline-none"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center text-white shadow-inner font-bold text-lg tracking-tighter">
              TN
            </div>
            <div>
              <div className="font-extrabold text-base sm:text-lg text-white tracking-tight group-hover:text-amber-400 transition-colors flex items-center gap-1.5">
                <span>{VENDOR_CONFIG.tradeName}</span>
                <span className="inline-block text-[10px] px-1.5 py-0.2 bg-emerald-950 text-emerald-400 border border-emerald-800 rounded font-medium">
                  Vendor
                </span>
              </div>
              <p className="text-[11px] text-stone-400 font-normal leading-tight hidden xs:block">
                Tamil Nadu Non-Judicial Stamp Paper Drafting Service
              </p>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-3 py-2 rounded-lg text-xs font-semibold tracking-wide transition-colors ${
                    isActive
                      ? 'bg-stone-800 text-amber-400'
                      : 'text-stone-300 hover:text-white hover:bg-stone-800/60'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Action CTAs */}
          <div className="hidden sm:flex items-center gap-3">
            {/* User Account / Sign In Status */}
            {user ? (
              <div className="flex items-center gap-2">
                <Link
                  href="/my-orders"
                  className="px-3 py-1.5 rounded-xl bg-stone-800 hover:bg-stone-700 border border-stone-700 text-xs text-stone-200 font-medium transition-colors"
                >
                  My Orders
                </Link>
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-stone-800 border border-stone-700 text-xs">
                  <User className="w-3.5 h-3.5 text-amber-400" />
                  <span className="text-stone-200 font-medium max-w-[110px] truncate">{user.displayName || user.email}</span>
                  <button
                    onClick={() => signOut()}
                    title="Sign Out"
                    className="text-stone-400 hover:text-rose-400 p-0.5 cursor-pointer ml-1"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ) : null}

            {onStartAgreement ? (
              <button
                onClick={onStartAgreement}
                className="bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold px-4 py-2.5 rounded-xl text-xs uppercase tracking-wider shadow-sm transition-all flex items-center gap-1.5 hover:shadow-amber-500/20 active:translate-y-0.5 cursor-pointer"
              >
                <FileText className="w-4 h-4 text-stone-950" />
                <span>Start Agreement</span>
              </button>
            ) : (
              <Link
                href="/order"
                className="bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold px-4 py-2.5 rounded-xl text-xs uppercase tracking-wider shadow-sm transition-all flex items-center gap-1.5 hover:shadow-amber-500/20 active:translate-y-0.5"
              >
                <FileText className="w-4 h-4 text-stone-950" />
                <span>Start Agreement</span>
              </Link>
            )}
          </div>

          {/* Mobile menu trigger */}
          <div className="flex lg:hidden items-center gap-2">
            <Link
              href="/order"
              className="sm:hidden bg-amber-500 text-stone-950 font-bold px-3 py-1.5 rounded-lg text-xs"
            >
              Start
            </Link>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-stone-300 hover:text-white hover:bg-stone-800 focus:outline-none cursor-pointer"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-stone-950 border-t border-stone-800 px-4 pt-3 pb-6 space-y-2">
          <div className="p-2 mb-2 bg-stone-900 rounded-lg text-xs text-stone-300 flex items-center justify-between">
            <span className="font-mono text-amber-400">{VENDOR_CONFIG.licenceNumber}</span>
            <span className="text-stone-400">{VENDOR_CONFIG.workingHours}</span>
          </div>

          {user && (
            <div className="p-3 mb-2 bg-stone-900 rounded-lg text-xs text-stone-200 flex items-center justify-between">
              <span className="truncate">{user.displayName || user.email}</span>
              <button onClick={() => signOut()} className="text-rose-400 font-semibold cursor-pointer">
                Sign Out
              </button>
            </div>
          )}

          <nav className="flex flex-col space-y-1">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`text-left px-3.5 py-2.5 rounded-lg text-sm font-semibold transition-colors ${
                    isActive
                      ? 'bg-stone-800 text-amber-400 font-bold'
                      : 'text-stone-200 hover:bg-stone-900'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          <div className="pt-3 border-t border-stone-800 flex flex-col gap-2">
            <Link
              href="/order"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold py-3 rounded-xl text-center text-sm flex items-center justify-center gap-2"
            >
              <FileText className="w-4 h-4" />
              <span>Start Your Agreement</span>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};
