import Hero from '@/components/hero/Hero';
import About from '@/components/sections/About';
import Projects from '@/components/sections/Projects';
import Experience from '@/components/sections/Experience';
import SkillsGrid from '@/components/sections/SkillsGrid';

export default function Home() {
  return (
    <main>
      <Hero />
      <About />
      <Projects />
      <Experience />
      <SkillsGrid />
    </main>
  );
}
