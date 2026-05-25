import Hero from '@/components/hero/Hero';
import About from '@/components/sections/About';
import Projects from '@/components/sections/Projects';
import LiveProjects from '@/components/sections/LiveProjects';
import Experience from '@/components/sections/Experience';
import SkillsGrid from '@/components/sections/SkillsGrid';
import Achievements from '@/components/sections/Achievements';
import GitHubStats from '@/components/sections/GitHubStats';
import ContactCTA from '@/components/sections/ContactCTA';

export default function Home() {
  return (
    <main>
      <Hero />
      <About />
      <Projects />
      <LiveProjects />
      <Experience />
      <SkillsGrid />
      <Achievements />
      <GitHubStats />
      <ContactCTA />
    </main>
  );
}
