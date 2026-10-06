/**
 * Single source of truth for vendor identity, credentials, contact, and fees.
 * No real-looking facts or numbers are invented.
 * Placeholders are marked clearly with bracket notation [PLACEHOLDER - DESCRIPTION].
 */

export interface VendorFees {
  stampDuty: {
    amount: number | null; // null until formula/rule is provided
    displayLabel: string;
    description: string;
  };
  serviceFee: {
    amount: number | null;
    displayLabel: string;
    description: string;
  };
  courierFee: {
    amount: number | null;
    displayLabel: string;
    description: string;
  };
}

export interface VendorConfig {
  name: string;
  tradeName: string;
  licenceNumber: string;
  issuingAuthority: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  pincode: string;
  state: string;
  phone: string;
  whatsappNumber: string;
  whatsappPrefilledMessage: string;
  email: string;
  workingHours: string;
  fees: VendorFees;
  placeholdersTodoList: Array<{
    field: string;
    currentValue: string;
    description: string;
  }>;
}

export const VENDOR_CONFIG: VendorConfig = {
  name: '[VENDOR NAME - TO BE PROVIDED BY VENDOR]',
  tradeName: '[SHOP / FIRM NAME - TO BE PROVIDED BY VENDOR]',
  licenceNumber: '[LICENCE NUMBER - TO BE PROVIDED BY VENDOR]',
  issuingAuthority: '[REGISTRATION DEPARTMENT JURISDICTION - TO BE PROVIDED BY VENDOR]',
  addressLine1: '[SHOP ADDRESS LINE 1 - TO BE PROVIDED BY VENDOR]',
  addressLine2: '[SHOP ADDRESS LINE 2 - TO BE PROVIDED BY VENDOR]',
  city: '[CITY - TO BE PROVIDED BY VENDOR]',
  pincode: '[PINCODE - TO BE PROVIDED BY VENDOR]',
  state: 'Tamil Nadu, India',
  phone: '[PHONE NUMBER - TO BE PROVIDED BY VENDOR]',
  whatsappNumber: '[WHATSAPP NUMBER - TO BE PROVIDED BY VENDOR]',
  whatsappPrefilledMessage: 'Hello, I would like to inquire about rental agreement drafting on stamp paper.',
  email: '[EMAIL ADDRESS - TO BE PROVIDED BY VENDOR]',
  workingHours: '[WORKING HOURS - TO BE PROVIDED BY VENDOR]',
  fees: {
    stampDuty: {
      amount: null, // "calculated per agreement" until rule is provided
      displayLabel: 'Stamp Duty',
      description: 'Calculated per agreement (based on tenure and monthly rent as per Tamil Nadu Stamp Act)',
    },
    serviceFee: {
      amount: null,
      displayLabel: 'Vendor Drafting & Stamping Fee',
      description: 'Document formatting, customized drafting, and non-judicial stamp paper printing fee',
    },
    courierFee: {
      amount: null,
      displayLabel: 'Courier Charges',
      description: 'Physical document packaging and courier delivery fee',
    },
  },
  placeholdersTodoList: [
    {
      field: 'vendorName',
      currentValue: '[VENDOR NAME - TO BE PROVIDED BY VENDOR]',
      description: 'Official legal name of the certified stamp vendor',
    },
    {
      field: 'tradeName',
      currentValue: '[SHOP / FIRM NAME - TO BE PROVIDED BY VENDOR]',
      description: 'Shop or agency trading name',
    },
    {
      field: 'licenceNumber',
      currentValue: '[LICENCE NUMBER - TO BE PROVIDED BY VENDOR]',
      description: 'Registration Department stamp vendor licence number',
    },
    {
      field: 'issuingAuthority',
      currentValue: '[REGISTRATION DEPARTMENT JURISDICTION - TO BE PROVIDED BY VENDOR]',
      description: 'Sub-Registrar jurisdiction or issuing office in Tamil Nadu',
    },
    {
      field: 'shopAddress',
      currentValue: '[SHOP ADDRESS - TO BE PROVIDED BY VENDOR]',
      description: 'Physical counter address and pincode',
    },
    {
      field: 'contactNumbers',
      currentValue: '[PHONE & WHATSAPP - TO BE PROVIDED BY VENDOR]',
      description: 'Customer contact phone and WhatsApp number',
    },
    {
      field: 'emailAddress',
      currentValue: '[EMAIL ADDRESS - TO BE PROVIDED BY VENDOR]',
      description: 'Official support and enquiry email address',
    },
    {
      field: 'workingHours',
      currentValue: '[WORKING HOURS - TO BE PROVIDED BY VENDOR]',
      description: 'Shop counter opening hours and operating days',
    },
    {
      field: 'feeStructure',
      currentValue: '[SERVICE & COURIER FEES - TO BE PROVIDED BY VENDOR]',
      description: 'Vendor drafting fee and courier fee amounts',
    },
    {
      field: 'stampDutyRule',
      currentValue: '[STAMP DUTY CALCULATION RULE - TO BE PROVIDED BY VENDOR]',
      description: 'Formula or slab for calculating stamp duty across tenure and rent',
    },
  ],
};
