export default function ProjectNotFound() {
  return (
    <div style={{ padding: '2rem', textAlign: 'center' }}>
      <h2 style={{ color: '#d32f2f', marginBottom: '0.75rem' }}>Projet introuvable</h2>
      <p style={{ color: '#888', marginBottom: '1.5rem' }}>
        Ce projet n'existe pas ou a été supprimé.
      </p>
      <a href="/dashboard" style={{ color: '#1B8C3E', fontWeight: 600 }}>
        ← Retour au Dashboard
      </a>
    </div>
  );
}