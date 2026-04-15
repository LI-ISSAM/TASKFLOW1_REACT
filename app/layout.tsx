import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'TaskFlow',
  description: 'Gestion de projets collaboratifs',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body>
        <header
          style={{
            background: '#1B8C3E',
            color: 'white',
            padding: '1rem 2rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <h2 style={{ margin: 0, fontWeight: 700 }}>TaskFlow</h2>
          <nav style={{ display: 'flex', gap: '1rem' }}>
            <a href="/dashboard" style={{ color: 'white' }}>
              Dashboard
            </a>
            <a href="/login" style={{ color: 'white' }}>
              Login
            </a>
          </nav>
        </header>
        <main>{children}</main>
      </body>
    </html>
  );
}