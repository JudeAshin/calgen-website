import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Navbar from '@/components/site/navbar';
import Footer from '@/components/site/footer';
import FloatingDownloadButton from '@/components/site/floating-download-button';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap' });

export const metadata: Metadata = {
  metadataBase: new URL('https://calgen.example.com'),
  title: {
    default: 'Calgen — Talk to Real People, Any Time',
    template: '%s | Calgen',
  },
  description:
    'Calgen is a live social calling platform. Have real voice conversations with verified hosts, paying per minute with a coin wallet. Browse online hosts, buy coins, and start talking.',
  keywords: ['social calling', 'voice calls', 'verified hosts', 'coin wallet', 'Calgen'],
  openGraph: {
    type: 'website',
    title: 'Calgen — Talk to Real People, Any Time',
    description:
      'A live social calling platform where you can have real voice conversations with verified hosts, paying per minute using a coin wallet.',
    siteName: 'Calgen',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'Calgen' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Calgen — Talk to Real People, Any Time',
    description:
      'A live social calling platform where you can have real voice conversations with verified hosts, paying per minute using a coin wallet.',
    images: ['/og-image.png'],
  },
  icons: { icon: '/favicon.ico' },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="min-h-screen bg-background font-sans text-foreground">
        <Navbar />
        <main className="pt-16">{children}</main>
        <Footer />
        <FloatingDownloadButton />
      </body>
    </html>
  );
}
