'use client';

import React from 'react';
import { MessageCircle } from 'lucide-react';
import { VENDOR_CONFIG } from '@/src/config/vendor';

interface WhatsAppButtonProps {
  className?: string;
  variant?: 'primary' | 'secondary' | 'floating' | 'outline';
  customText?: string;
}

export const WhatsAppButton: React.FC<WhatsAppButtonProps> = ({
  className = '',
  variant = 'primary',
  customText,
}) => {
  // If whatsappNumber is still a placeholder, use clean fallback link or tel
  const rawNumber = VENDOR_CONFIG.whatsappNumber.replace(/[^0-9]/g, '');
  const message = encodeURIComponent(VENDOR_CONFIG.whatsappPrefilledMessage);
  const waUrl = rawNumber ? `https://wa.me/${rawNumber}?text=${message}` : `https://wa.me/?text=${message}`;

  if (variant === 'floating') {
    return (
      <a
        href={waUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat with Certified Stamp Vendor on WhatsApp"
        className="fixed bottom-6 right-6 z-40 bg-emerald-600 hover:bg-emerald-700 text-white p-3.5 rounded-full shadow-lg shadow-emerald-900/20 flex items-center gap-2.5 transition-all transform hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:ring-offset-2"
      >
        <MessageCircle className="w-6 h-6 fill-white" />
        <span className="hidden md:inline font-medium text-xs pr-1">WhatsApp Vendor Desk</span>
      </a>
    );
  }

  if (variant === 'outline') {
    return (
      <a
        href={waUrl}
        target="_blank"
        rel="noopener noreferrer"
        className={`inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-emerald-600 text-emerald-700 hover:bg-emerald-50 font-semibold text-xs transition-colors ${className}`}
      >
        <MessageCircle className="w-4 h-4 text-emerald-600" />
        <span>{customText || 'Chat on WhatsApp'}</span>
      </a>
    );
  }

  return (
    <a
      href={waUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs sm:text-sm transition-all shadow-sm hover:shadow active:translate-y-0.5 ${className}`}
    >
      <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5 fill-white" />
      <span>{customText || 'Chat on WhatsApp'}</span>
    </a>
  );
};
