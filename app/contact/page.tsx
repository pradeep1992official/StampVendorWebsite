import type { Metadata } from 'next';
import { ContactClient } from './ContactClient';

export const metadata: Metadata = {
  title: 'Contact Certified Stamp Paper Vendor | Madurai & Chennai Tamil Nadu',
  description: 'Get in touch with our certified stamp vendor team. Call +91 94421 88420 or WhatsApp. Visit our vendor office opposite Sub-Registrar Office Complex, Madurai, TN.',
  openGraph: {
    title: 'Contact Certified Stamp Paper Vendor | Madurai & Chennai Tamil Nadu',
    description: 'Get in touch with our certified stamp vendor team. Call +91 94421 88420 or WhatsApp. Visit our vendor office opposite Sub-Registrar Office Complex, Madurai, TN.',
  },
};

export default function ContactPage() {
  return <ContactClient />;
}
