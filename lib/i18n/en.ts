import { VENDOR_CONFIG } from '@/src/config/vendor';

export const en = {
  brand: {
    name: 'TN Stamp Paper',
    tagline: 'Certified Non-Judicial Stamp Paper & Rental Agreement Service',
    vendorTitle: 'Licensed Stamp Vendor',
    licenceNumber: VENDOR_CONFIG.licenceNumber,
    subRegistrarOffice: VENDOR_CONFIG.issuingAuthority,
    shopName: VENDOR_CONFIG.tradeName,
    addressLine1: VENDOR_CONFIG.addressLine1,
    addressLine2: VENDOR_CONFIG.addressLine2,
    phone: VENDOR_CONFIG.phone,
    whatsapp: VENDOR_CONFIG.whatsappNumber,
    whatsappMessage: VENDOR_CONFIG.whatsappPrefilledMessage,
    email: VENDOR_CONFIG.email,
    workingHours: VENDOR_CONFIG.workingHours,
    disclaimerShort: 'Authorized stamp paper vendor and drafting service. We do not provide legal advice.',
  },

  nav: {
    home: 'Home',
    rentAgreement: 'Rent Agreement',
    howItWorks: 'How It Works',
    pricing: 'Pricing',
    faq: 'FAQ',
    about: 'About Vendor',
    contact: 'Contact',
    startAgreement: 'Start Your Agreement',
    trackOrder: 'Track Order',
    language: 'Language',
  },

  common: {
    startNow: 'Start Rental Agreement',
    chatWhatsApp: 'Chat on WhatsApp',
    callNow: 'Call Stamp Vendor',
    viewPricing: 'View Pricing Breakdown',
    learnMore: 'Learn More',
    readPolicy: 'Read Full Policy',
    verifiedVendor: 'Certified Tamil Nadu Stamp Vendor',
    doorstepDelivery: 'Courier Delivery across Tamil Nadu',
    satisfaction: 'Genuine Stamp Papers with Serial Numbers',
    allTamilNaduDistricts: 'Serving Tamil Nadu',
    lastUpdated: 'Last Updated',
    needHelp: 'Need help drafting your agreement?',
    supportPrompt: 'Our stamp vendor desk is available during working hours.',
  },

  pricingData: {
    stampDutyLabel: VENDOR_CONFIG.fees.stampDuty.displayLabel,
    serviceFeeLabel: VENDOR_CONFIG.fees.serviceFee.displayLabel,
    courierChargeLabel: VENDOR_CONFIG.fees.courierFee.displayLabel,
    stampDutyNote: VENDOR_CONFIG.fees.stampDuty.description,
    serviceFeeNote: VENDOR_CONFIG.fees.serviceFee.description,
    courierNote: VENDOR_CONFIG.fees.courierFee.description,
  },

  disclaimer: {
    metaTitle: 'Disclaimer | Rental Agreement & Stamp Vendor Services Tamil Nadu',
    metaDescription: 'Disclaimer: Authorized stamp vendor and drafting service, not a law firm. We do not provide legal advice.',
    h1: 'Disclaimer',
  },
};

export type TranslationDictionary = typeof en;
