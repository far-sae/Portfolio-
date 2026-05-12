import { notFound } from 'next/navigation';
import projects from '@/data/projects.json';
import { ProjectDetail } from '@/components/ProjectDetail';

export function generateStaticParams() {
  return projects.featured.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const p = projects.featured.find((x) => x.slug === slug);
  if (!p) return { title: 'Project not found' };
  return {
    title: `${p.name} · Faraz Saeed`,
    description: p.summary
  };
}

export default async function ProjectPage({
  params
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = projects.featured.find((p) => p.slug === slug);
  if (!project) notFound();
  return <ProjectDetail project={project} />;
}
