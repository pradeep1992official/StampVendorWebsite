import type { Metadata } from 'next';
import { ContactClient } from './ContactClient';

export const metadata: Metadata = {
  title: 'Contact Support | Tamil Nadu Rental Agreement Service',
  description: 'Get in touch for rental agreement drafting, stamp paper, and courier queries. Submit your enquiry online.',
  openGraph: {
    title: 'Contact Support | Tamil Nadu Rental Agreement Service',
    description: 'Get in touch for rental agreement drafting, stamp paper, and courier queries. Submit your enquiry online.',
  },
};

export default function ContactPage() {
  return <ContactClient />;
}
