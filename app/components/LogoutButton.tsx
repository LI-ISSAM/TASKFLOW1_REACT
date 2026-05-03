'use client';
import { logoutAction } from '../actions/auth';

export default function LogoutButton() {
  return (
    <form action={logoutAction}>
      <button
        type="submit"
        style={{
          background: 'none',
          border: '1px solid rgba(255,255,255,0.5)',
          color: 'white',
          padding: '4px 14px',
          borderRadius: 6,
          cursor: 'pointer',
          fontSize: '0.85rem',
        }}
      >
        Déconnexion
      </button>
    </form>
  );
}