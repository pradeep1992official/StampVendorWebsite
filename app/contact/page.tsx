import type { Metadata } from 'next';
import { ContactClient } from './ContactClient';

export const metadata: Metadata = {
  title: 'Contact Certified Stamp Paper Vendor Desk | Tamil Nadu',
  description: 'Get in touch with our certified stamp vendor desk for rental agreement stamping and courier queries. Submit your enquiry online or connect via WhatsApp.',
  openGraph: {
    title: 'Contact Certified Stamp Paper Vendor Desk | Tamil Nadu',
    description: 'Get in touch with our certified stamp vendor desk for rental agreement stamping and courier queries. Submit your enquiry online or connect via WhatsApp.',
  },
};

export default function ContactPage() {
  return <ContactClient />;
}
