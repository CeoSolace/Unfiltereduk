import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Unfiltered UK',
  description: 'Decentralised, encrypted, community-owned communication platform',
  keywords: 'discord alternative, encrypted chat, self-hosted servers, privacy-first',
  authors: [{ name: 'Unfiltered UK Team' }],
  creator: 'Unfiltered UK',
  openGraph: {
    title: 'Unfiltered UK',
    description: 'Decentralised, encrypted, community-owned communication platform',
    url: process.env.RENDER_PUBLIC_URL || 'https://unfiltereduk.onrender.com',
    siteName: 'Unfiltered UK',
    locale: 'en_GB',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Unfiltered UK',
    description: 'Decentralised, encrypted communities',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
      </body>
    </html>
  );
}
