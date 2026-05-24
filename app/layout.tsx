import './globals.css';
import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import SmoothScroll from '@/components/motion/SmoothScroll';

const sans = Geist({ subsets: ['latin'], variable: '--font-sans', display: 'swap' });
const mono = Geist_Mono({ subsets: ['latin'], variable: '--font-mono', display: 'swap' });

export const metadata: Metadata = {
  title: 'Faraz Saeed Khwaja — Cybersecurity · AI · Creator',
  description: 'Building cinematic digital experiences, intelligent AI systems, and next-generation cybersecurity platforms.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${sans.variable} ${mono.variable}`}>
      <body className="font-sans bg-black text-white antialiased">
        <SmoothScroll />
        {children}
      </body>
    </html>
  );
}
