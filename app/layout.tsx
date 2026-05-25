import './globals.css';
import type { Metadata } from 'next';
import { Geist, Geist_Mono, Instrument_Serif } from 'next/font/google';
import SmoothScroll from '@/components/motion/SmoothScroll';

const sans = Geist({ subsets: ['latin'], variable: '--font-sans', display: 'swap' });
const mono = Geist_Mono({ subsets: ['latin'], variable: '--font-mono', display: 'swap' });
const display = Instrument_Serif({
  subsets: ['latin'],
  weight: '400',
  style: ['normal', 'italic'],
  variable: '--font-display',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Faraz Saeed Khwaja — Cybersecurity · AI · Creator',
  description: 'Building cinematic digital experiences, intelligent AI systems, and next-generation cybersecurity platforms.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${sans.variable} ${mono.variable} ${display.variable}`}>
      <body className="font-sans bg-black text-white antialiased">
        <SmoothScroll />
        {children}
      </body>
    </html>
  );
}
