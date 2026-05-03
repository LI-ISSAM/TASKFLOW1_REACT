export default function Home() {
  return (
    <div style={{ padding: '2rem', textAlign: 'center' }}>
      <h1 style={{ color: '#1B8C3E', fontSize: '2.5rem', marginBottom: '1rem' }}>
        Bienvenue sur TaskFlow
      </h1>
      <p style={{ color: '#555', marginBottom: '2rem' }}>
        Gestion de projets collaboratifs
      </p>
      <a href="/login" style={{
        background: '#1B8C3E', color: 'white',
        padding: '0.75rem 2rem', borderRadius: 8,
        textDecoration: 'none', fontSize: '1rem', fontWeight: 600,
      }}>
        Se connecter
      </a>
    </div>
  );
}