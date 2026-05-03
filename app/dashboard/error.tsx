'use client';

export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div style={{ padding: '2rem', textAlign: 'center' }}>
      <h2 style={{ color: '#d32f2f', marginBottom: '0.75rem' }}>Une erreur est survenue</h2>
      <p style={{ color: '#555', marginBottom: '1.5rem' }}>{error.message}</p>
      <button
        onClick={() => reset()}
        style={{
          padding: '0.6rem 1.5rem', background: '#1B8C3E',
          color: 'white', border: 'none', borderRadius: 6, cursor: 'pointer',
        }}
      >
        Réessayer
      </button>
    </div>
  );
}