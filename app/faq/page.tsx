import type { Metadata } from 'next';
import { FaqClient } from './FaqClient';

export const metadata: Metadata = {
  title: 'Frequently Asked Questions | Rental Agreements & Stamp Duty Tamil Nadu',
  description: 'Find answers on 11-month rental agreements, stamp duty rates in Tamil Nadu, Aadhaar data security, courier delivery, and notarization.',
  openGraph: {
    title: 'Frequently Asked Questions | Rental Agreements & Stamp Duty Tamil Nadu',
    description: 'Find answers on 11-month rental agreements, stamp duty rates in Tamil Nadu, Aadhaar data security, courier delivery, and notarization.',
  },
};

export default function FaqPage() {
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'Is an online-drafted rental agreement legally valid in Tamil Nadu?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes. An agreement drafted on genuine non-judicial stamp paper purchased from an authorized Tamil Nadu stamp vendor (Licence #V/MDU/2014/0488) and signed by both landlord and tenant with two witnesses is completely valid under the Indian Contract Act and the Tamil Nadu tenancy framework.',
        },
      },
      {
        '@type': 'Question',
        name: 'Why are rent agreements in Tamil Nadu drafted for 11 months?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Under Section 17 of the Registration Act, 1908, leases of immovable property exceeding 11 months require compulsory sub-registrar registration. An 11-month agreement drafted on ₹100 stamp paper is legally valid and exempt from mandatory sub-registrar appearances.',
        },
      },
      {
        '@type': 'Question',
        name: 'How is my Aadhaar card protected on this platform?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'We strictly adhere to UIDAI data privacy standards. We NEVER store full 12-digit Aadhaar numbers in our database. Customers submit only the last 4 digits (e.g. XXXX-XXXX-8921). Uploaded proof documents are kept strictly confidential.',
        },
      },
      {
        '@type': 'Question',
        name: 'Why is the price split into stamp duty, service fee, and courier charge?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'As a certified vendor under the Tamil Nadu Registration Department, transparency is our foremost priority. ₹100 goes directly to the Tamil Nadu Government towards official non-judicial stamp duty, ₹299 covers custom clause drafting, printing, and document auditing, and ₹99 covers express courier.',
        },
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <FaqClient />
    </>
  );
}
