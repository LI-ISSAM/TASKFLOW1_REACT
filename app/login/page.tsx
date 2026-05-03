'use client';
import { useActionState } from 'react';
import {login} from '../actions/auth';
export default function LoginPage() {
  const [state, formAction, pending] = useActionState(login, null);

  return (
    <div style={{ padding: '2rem', maxWidth: 400, margin: '4rem auto' }}>
      <h1 style={{ color: '#1B8C3E', marginBottom: '0.5rem' }}>TaskFlow</h1>
      <p style={{ color: '#888', marginBottom: '1.5rem' }}>Connectez-vous pour continuer</p>

      {state?.error && (
        <p style={{
          color: '#d32f2f', background: '#ffeef0',
          padding: '0.75rem', borderRadius: 8, marginBottom: '1rem',
        }}>
          {state.error}
        </p>
      )}

      <form action={formAction} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <input
          name="email"
          type="email"
          placeholder="Email"
          required
          style={{ padding: 10, borderRadius: 6, border: '1px solid #ddd', fontSize: '1rem' }}
        />
        <input
          name="password"
          type="password"
          placeholder="Mot de passe"
          required
          style={{ padding: 10, borderRadius: 6, border: '1px solid #ddd', fontSize: '1rem' }}
        />
        <button
          type="submit"
          disabled={pending}
          style={{
            padding: 12, background: pending ? '#ccc' : '#1B8C3E',
            color: 'white', border: 'none', borderRadius: 6,
            fontSize: '1rem', fontWeight: 600, cursor: pending ? 'not-allowed' : 'pointer',
          }}
        >
          {pending ? 'Connexion...' : 'Se connecter'}
        </button>
      </form>
    </div>
  );
}