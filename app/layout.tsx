import type { Metadata } from 'next';
import './globals.css';
import { I18nProvider } from '@/lib/i18n/context';
import { AuthProvider } from '@/lib/auth-context';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { DisclaimerBanner } from '@/components/DisclaimerBanner';
import { WhatsAppButton } from '@/components/WhatsAppButton';

export const metadata: Metadata = {
  title: 'TN Stamp Paper | Certified Rental Agreement & Non-Judicial Stamping in Tamil Nadu',
  description: 'Authorized stamp paper vendor service in Tamil Nadu. Order 11-month non-judicial stamp paper rent agreements online with doorstep courier delivery across Tamil Nadu.',
  openGraph: {
    title: 'TN Stamp Paper | Certified Rental Agreement & Non-Judicial Stamping in Tamil Nadu',
    description: 'Authorized stamp paper vendor service in Tamil Nadu. Order 11-month non-judicial stamp paper rent agreements online with doorstep courier delivery across Tamil Nadu.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'TN Stamp Paper | Certified Rental Agreement & Non-Judicial Stamping in Tamil Nadu',
    description: 'Authorized stamp paper vendor service in Tamil Nadu. Order 11-month non-judicial stamp paper rent agreements online with doorstep courier delivery across Tamil Nadu.',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth" suppressHydrationWarning>
      <body className="min-h-screen flex flex-col bg-stone-50 text-stone-900 font-sans selection:bg-amber-100 selection:text-amber-900 antialiased" suppressHydrationWarning>
        <AuthProvider>
          <I18nProvider>
            <DisclaimerBanner compact={true} />
            <Header />
            <main className="flex-1">
              {children}
            </main>
            <WhatsAppButton variant="floating" />
            <Footer />
          </I18nProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
