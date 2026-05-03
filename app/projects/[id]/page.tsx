import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateStaticParams() {
  const projects = await prisma.project.findMany();
  return projects.map(p => ({ id: String(p.id) }));
}

export default async function ProjectPage({ params }: Props) {
  const { id } = await params;

  const project = await prisma.project.findUnique({
    where: { id: Number(id) },
  });

  if (!project) notFound();

  return (
    <div style={{ padding: '2rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: '1rem' }}>
        <span style={{
          width: 20, height: 20, borderRadius: '50%',
          background: project.color, display: 'inline-block',
        }} />
        <h1 style={{ color: '#1B8C3E' }}>{project.name}</h1>
      </div>
      <p style={{ color: '#888', marginBottom: '0.5rem' }}>ID : {project.id}</p>
      <p style={{ color: '#888', marginBottom: '1.5rem' }}>
        Créé le : {new Date(project.createdAt).toLocaleDateString('fr-FR')}
      </p>
      <a href="/dashboard" style={{ color: '#1B8C3E', fontWeight: 600 }}>
        ← Retour au Dashboard
      </a>
    </div>
  );
}