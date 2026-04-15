interface Project {
  id: string;
  name: string;
  color: string;
}

export default async function DashboardPage() {
  const res = await fetch('http://localhost:4000/projects', {
    cache: 'no-store', // SSR : toujours frais
  });
  const projects: Project[] = await res.json();

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Dashboard</h1>
      <p>{projects.length} projet(s)</p>
      <ul>
        {projects.map((p) => (
          <li key={p.id} style={{ marginBottom: 8 }}>
            <span
              style={{
                display: 'inline-block',
                width: 12,
                height: 12,
                borderRadius: '50%',
                background: p.color,
                marginRight: 8,
              }}
            />
            <a href={`/projects/${p.id}`}>{p.name}</a>
          </li>
        ))}
      </ul>
    </div>
  );
}