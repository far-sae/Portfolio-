import type { Metadata } from 'next';
import './globals.css';
import profile from '@/data/profile.json';
import { CustomCursor } from '@/components/CustomCursor';

export const metadata: Metadata = {
  title: `${profile.name} · ${profile.title}`,
  description: profile.summary,
  openGraph: {
    title: `${profile.name} · Portfolio`,
    description: profile.tagline,
    url: profile.links.personal,
    siteName: profile.name,
    type: 'website'
  },
  metadataBase: new URL('https://example.com')
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="noise font-sans">
        <CustomCursor />
        {children}
      </body>
    </html>
  );
}
