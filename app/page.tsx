import { Nav } from '@/components/Nav';
import { Hero } from '@/components/Hero';
import { About } from '@/components/About';
import { Skills } from '@/components/Skills';
import { Achievements } from '@/components/Achievements';
import { Experience } from '@/components/Experience';
import { Projects } from '@/components/Projects';
import { Contact, Footer } from '@/components/Contact';

export default function HomePage() {
  return (
    <main className="relative">
      <Nav />
      <Hero />
      <About />
      <Skills />
      <Achievements />
      <Experience />
      <Projects />
      <Contact />
      <Footer />
    </main>
  );
}
