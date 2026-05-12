'use client';

import { motion } from 'framer-motion';
import { Section, SectionHeader } from './Section';
import { LiveSiteCard } from './LiveSiteCard';

const SITES = [
  {
    url: 'https://www.securovix.com',
    title: 'Securovix',
    subtitle: 'AI driven cyber security agency. The startup I co founded.',
    accent: '#7c5cff',
    stack: ['Next.js', 'TypeScript', 'AI']
  },
  {
    url: 'https://cyber-hub.uk',
    title: 'Cyber Hub',
    subtitle: 'Personal cyber security writing and resources.',
    accent: '#22d3ee',
    stack: ['Web', 'Content']
  },
  {
    url: 'https://power-share-pro.vercel.app',
    title: 'Power Share Pro',
    subtitle: 'Power sharing dashboard prototype.',
    accent: '#f59e0b',
    stack: ['TypeScript', 'Vercel']
  },
  {
    url: 'https://project-management-nu-beige.vercel.app',
    title: 'Project Management',
    subtitle: 'Lightweight project management workspace.',
    accent: '#34d399',
    stack: ['TypeScript', 'Vercel']
  }
];

export function LiveSites() {
  return (
    <Section id="live" className="!py-28">
      <SectionHeader
        index="N° 04.5"
        eyebrow="Live / Deployed"
        title={
          <>
            Live deployments.{' '}
            <span className="text-muted">Real screenshots, real URLs.</span>
          </>
        }
        description="These are the projects currently running on the public web. The screenshots below are pulled live from each site. Click any card to open it."
      />

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {SITES.map((s, i) => (
          <motion.div
            key={s.url}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{
              duration: 0.7,
              delay: i * 0.08,
              ease: [0.16, 1, 0.3, 1]
            }}
          >
            <LiveSiteCard {...s} />
          </motion.div>
        ))}
      </div>
    </Section>
  );
}
