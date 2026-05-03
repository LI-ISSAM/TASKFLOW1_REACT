import { prisma } from '@/lib/prisma';
import AddProjectForm from './AddProjectForm';
import { deleteProject } from '../actions/projects';

export default async function DashboardPage() {
  const projects = await prisma.project.findMany({
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div style={{ padding: '2rem' }}>
      <h1 style={{ marginBottom: '1rem', color: '#1B8C3E' }}>Dashboard</h1>
      <p style={{ marginBottom: '1rem', color: '#555' }}>{projects.length} projet(s)</p>
      <AddProjectForm />
      <ul style={{ listStyle: 'none', marginTop: '1rem' }}>
        {projects.map(p => (
          <li key={p.id} style={{
            display: 'flex', gap: 10, alignItems: 'center',
            marginBottom: 10, background: 'white',
            padding: '0.75rem 1rem', borderRadius: 8,
            boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
          }}>
            <span style={{
              width: 14, height: 14, borderRadius: '50%',
              background: p.color, display: 'inline-block', flexShrink: 0,
            }} />
            <a href={`/projects/${p.id}`} style={{
              flex: 1, textDecoration: 'none',
              color: '#333', fontWeight: 500,
            }}>
              {p.name}
            </a>
            <span style={{ fontSize: '0.75rem', color: '#aaa' }}>
              {new Date(p.createdAt).toLocaleDateString('fr-FR')}
            </span>
            <form action={deleteProject} style={{ display: 'inline' }}>
              <input type="hidden" name="id" value={p.id} />
              <button type="submit" style={{
                background: 'none', border: 'none',
                cursor: 'pointer', fontSize: '1rem',
              }}>🗑</button>
            </form>
          </li>
        ))}
      </ul>
    </div>
  );
}