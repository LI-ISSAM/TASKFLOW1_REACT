------------------------------------------------------------
Q1 : Comparez la structure React (Vite) vs Next.js
------------------------------------------------------------
 
React (Vite)                    Next.js (App Router)
─────────────────────────────   ────────────────────────────
src/                            app/
  main.tsx          →             layout.tsx   (point d'entrée)
  App.tsx           →             page.tsx     (route /)
  index.css         →             globals.css
  components/                     login/
  pages/                            page.tsx   (route /login)
  features/                       dashboard/
index.html                          page.tsx   (route /dashboard)
vite.config.ts                    projects/[id]/
                                    page.tsx   (route dynamique)
                                next.config.ts
 
DIFFÉRENCES CLÉS :
- React/Vite : routing défini dans le CODE (App.tsx + react-router-dom)
- Next.js : routing = STRUCTURE DES DOSSIERS (file-system routing)
- React : point d'entrée = index.html + main.tsx
- Next.js : point d'entrée = layout.tsx (qui enveloppe toutes les pages)
- React : components séparés du routing
- Next.js : chaque dossier avec page.tsx EST une route
 
------------------------------------------------------------
Q2 : Combien de fichiers pour créer la route /login ?
------------------------------------------------------------
 
Next.js : 1 SEUL fichier → app/login/page.tsx
→ Le dossier "login" + le fichier "page.tsx" = route /login automatiquement.
 
React Router nécessitait :
1. Le composant LoginPage.tsx (dans src/pages/ ou src/components/)
2. L'import dans App.tsx : import LoginPage from './pages/LoginPage'
3. La Route dans App.tsx : <Route path="/login" element={<LoginPage />} />
 
Soit 3 opérations (création + import + déclaration de route) vs 1 seule en Next.js.
 
------------------------------------------------------------
Q3 : Récupération de l'id dans la route dynamique
------------------------------------------------------------
 
React (CSR) :
  import { useParams } from 'react-router-dom';
  const { id } = useParams();
  → Hook exécuté dans le NAVIGATEUR, après le chargement du JS
 
Next.js (SSR) :
  export default async function ProjectPage({ params }: Props) {
    const { id } = await params;
  }
  → params est une PROP injectée par le SERVEUR avant le rendu
 
DIFFÉRENCE FONDAMENTALE :
- React : useParams() est un hook côté CLIENT (besoin de react-router dans le bundle)
- Next.js : params vient du SERVEUR sous forme de prop, le composant est async,
  l'URL est parsée avant que la page soit envoyée au navigateur.
  Pas de hook, pas de dépendance client, pas de JS pour router.
 
------------------------------------------------------------
Q4 : (Question sur layout.tsx — voir Q11)
------------------------------------------------------------
 
(La question Q4 du TP porte sur le layout — réponse intégrée en Q11)
 
------------------------------------------------------------
Q5 : Nombre de lignes pour charger des données
------------------------------------------------------------
 
React SPA (environ 10-12 lignes) :
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
 
  useEffect(() => {
    fetch('http://localhost:4000/projects')
      .then(r => r.json())
      .then(data => {
        setProjects(data);
        setLoading(false);
      })
      .catch(err => setError(err));
  }, []);
 
  if (loading) return <div>Chargement...</div>;
 
Next.js Server Component (2 lignes) :
  const res = await fetch('http://localhost:4000/projects', { cache: 'no-store' });
  const projects = await res.json();
 
→ Pas de useState, pas de useEffect, pas de loading state, pas de .then().
  Le composant est async, le fetch bloque jusqu'à la réponse côté serveur,
  et le HTML final est envoyé avec les données déjà intégrées.
 
------------------------------------------------------------
Q6 : Requête GET /projects dans F12 > Network ?
------------------------------------------------------------
 
NON, la requête GET /projects n'apparaît PAS dans le Network du navigateur.
 
Pourquoi ? Parce que le fetch est exécuté par le SERVEUR Node.js de Next.js,
pas par le navigateur. Le navigateur envoie une requête à Next.js (localhost:3000),
Next.js fait lui-même la requête à json-server (localhost:4000), assemble le HTML,
et envoie au navigateur une page HTML déjà remplie avec les noms des projets.
 
→ Ce que le navigateur voit dans Network : GET /dashboard (vers Next.js)
→ Ce que le navigateur NE voit PAS : GET /projects (fait par le serveur)
 
------------------------------------------------------------
Q7 : Pourquoi 'use client' dans Login mais pas dans Dashboard ?
------------------------------------------------------------
 
DASHBOARD (Server Component, pas de 'use client') :
- Affichage pur de données
- Pas d'interaction utilisateur
- Pas de useState, pas de useEffect
- Le composant est async et fetch côté serveur
- Rendu HTML envoyé directement → SEO parfait, chargement instantané
 
LOGIN (Client Component, 'use client' obligatoire) :
- Utilise useState : email, password, error, loading
- Utilise onChange sur les inputs (événements du DOM)
- Utilise onSubmit sur le formulaire
- Tout cela nécessite un accès au NAVIGATEUR (DOM, événements)
- 'use client' indique à Next.js : ce composant s'exécute dans le navigateur
 
RÈGLE : Si un composant utilise des hooks React (useState, useEffect, useRef...)
ou des événements DOM (onClick, onChange, onSubmit...) → 'use client' obligatoire.
 
------------------------------------------------------------
Q8 : Équivalent de useNavigate() en Next.js
------------------------------------------------------------
 
React Router :
  import { useNavigate } from 'react-router-dom';
  const navigate = useNavigate();
  navigate('/dashboard');
 
Next.js :
  import { useRouter } from 'next/navigation';
  const router = useRouter();
  router.push('/dashboard');
 
Attention : importer depuis 'next/navigation' (pas 'next/router' qui est l'ancien
Pages Router). useRouter() ne fonctionne que dans un Client Component ('use client').
 
Autres méthodes disponibles :
  router.replace('/dashboard')  // sans historique (pas de retour arrière)
  router.back()                 // équivalent navigate(-1)
  router.refresh()              // recharger les données SSR de la page
 
------------------------------------------------------------
Q9 : View Source de React SPA (localhost:5173/dashboard)
------------------------------------------------------------
 
On voit dans le code source HTML :
 
  <!DOCTYPE html>
  <html>
    <head>...</head>
    <body>
      <div id="root"></div>
      <script type="module" src="/src/main.tsx"></script>
    </body>
  </html>
 
Les noms des projets NE SONT PAS dans le HTML.
Juste un <div id="root"> vide + des balises <script>.
Le contenu est généré par JavaScript APRÈS le chargement dans le navigateur.
 
→ Conséquence : les moteurs de recherche (Google) voient une page vide.
  L'utilisateur voit un écran blanc jusqu'à ce que le JS se charge.
 
------------------------------------------------------------
Q10 : View Source de Next.js (localhost:3000/dashboard)
------------------------------------------------------------
 
On voit dans le code source HTML :
 
  <html lang="fr">
    <body>
      <header>...</header>
      <main>
        <h1>Dashboard</h1>
        <p>3 projets</p>
        <a href="/projects/1">TaskFlow Web</a>
        <a href="/projects/2">Mobile App</a>
        <a href="/projects/3">API Backend</a>
      </main>
    </body>
  </html>
 
OUI, les noms des projets sont dans le HTML !
Le serveur Next.js a déjà fait le fetch et intégré les données dans le HTML.
 
→ C'est le SSR (Server-Side Rendering) : le serveur envoie du HTML complet.
  Google peut indexer tout le contenu immédiatement.
  L'utilisateur voit la page instantanément, sans attendre le JS.
 
------------------------------------------------------------
Q11 : Header persistant sans re-mount — comment en React ?
------------------------------------------------------------
 
En Next.js App Router : le Header dans layout.tsx ne se re-monte JAMAIS.
Next.js sait que le layout est commun à toutes les pages et ne le détruit pas
lors de la navigation. Seul le {children} (la partie variable) est remplacé.
 
En React Router, pour obtenir ce comportement, on plaçait le Header
HORS des Routes, dans le composant racine App.tsx :
 
  function App() {
    return (
      <>
        <Header />        {/* hors des Routes → persistant */}
        <Routes>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </>
    );
  }
 
Next.js rend cela automatique grâce à la hiérarchie des layouts.
Tout ce qui est dans layout.tsx est garanti persistant entre les navigations.
 
------------------------------------------------------------
Q12 : Layout spécifique au Dashboard (avec Sidebar) — où le créer ?
------------------------------------------------------------
 
Créer le fichier : app/dashboard/layout.tsx
 
  export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    return (
      <div style={{ display: 'flex' }}>
        <aside style={{ width: 240, background: '#F3F4F6', minHeight: '100vh' }}>
          {/* Sidebar ici */}
        </aside>
        <div style={{ flex: 1 }}>
          {children}
        </div>
      </div>
    );
  }
 
Next.js applique les layouts en cascade :
  app/layout.tsx          → s'applique à TOUTES les pages (Header global)
  app/dashboard/layout.tsx → s'applique seulement aux routes sous /dashboard
 
Ainsi /dashboard affiche : Header global + Sidebar + contenu
Et /login affiche seulement : Header global + contenu (pas de Sidebar)
 
------------------------------------------------------------
Q13 : Le Dashboard Server Component peut-il utiliser onClick ?
------------------------------------------------------------
 
NON. Un Server Component NE PEUT PAS utiliser onClick (ni aucun événement DOM).
 
Pourquoi ? onClick est un gestionnaire d'événements qui s'exécute dans le
NAVIGATEUR (quand l'utilisateur clique). Or un Server Component est rendu
entièrement sur le serveur → il n'y a pas de JavaScript côté client associé.
Next.js refusera de compiler si on utilise onClick dans un Server Component.
 
Si on ajoute onClick dans un Server Component → erreur de build :
  "Event handlers cannot be passed to Client Component props."
 
Solution : extraire le bouton interactif dans un sous-composant Client Component
(voir Q14).
 
------------------------------------------------------------
Q14 : Bouton "+ Nouveau projet" sans transformer TOUTE la page en Client ?
------------------------------------------------------------
 
NON, il ne faut PAS transformer toute la page en Client Component.
La bonne pratique Next.js = garder le maximum en Server Component,
et isoler l'interactivité dans de petits composants Client.
 
Solution — créer un composant séparé :
 
  // components/AddProjectButton.tsx
  'use client';
  export function AddProjectButton() {
    return (
      <button onClick={() => alert('TODO: modal de création')}>
        + Nouveau projet
      </button>
    );
  }
 
Puis l'importer dans la page Server Component :
 
  // app/dashboard/page.tsx  (reste Server Component, pas de 'use client')
  import { AddProjectButton } from '@/components/AddProjectButton';
 
  export default async function DashboardPage() {
    const res = await fetch(...);  // fetch côté serveur conservé
    const projects = await res.json();
    return (
      <div>
        <AddProjectButton />   {/* Client Component imbriqué */}
        {projects.map(p => ...)}
      </div>
    );
  }
 
→ La page reste SSR (fetch côté serveur, SEO préservé)
→ Seul le bouton est côté client (bundle JS minimal)
 
------------------------------------------------------------
Q15 : Avantage de sécurité du fetch côté serveur
------------------------------------------------------------
 
Avantages de sécurité quand le fetch est fait par le serveur Next.js :
 
1. L'URL de l'API (localhost:4000) n'est JAMAIS exposée au navigateur.
   Un utilisateur malveillant ne peut pas inspecter la console ou le Network
   pour découvrir l'adresse de votre API interne.
 
2. En production, l'API peut être sur un réseau PRIVÉ (VPC, Docker internal,
   kubernetes cluster) totalement inaccessible depuis internet, mais accessible
   par le serveur Next.js qui est dans le même réseau.
 
3. Les tokens d'authentification, API keys, credentials peuvent être placés
   dans les headers du fetch côté serveur (variables d'environnement .env.local)
   sans AUCUN risque d'exposition au client :
     fetch('https://api-privee.com/data', {
       headers: { 'Authorization': `Bearer ${process.env.SECRET_API_KEY}` }
     })
   → process.env.SECRET_API_KEY n'est jamais dans le bundle JS client.
 
4. Réduction de la surface d'attaque : moins d'endpoints visibles = moins
   de vecteurs d'attaque possibles depuis le navigateur.
 
============================================================
  RÉCAPITULATIF DES CONCEPTS CLÉS
============================================================
 
  Concept               React SPA (Vite)        Next.js (App Router)
  ──────────────────────────────────────────────────────────────────
  Routing               react-router-dom        Dossiers/fichiers
  Fetch données         useEffect + useState    async/await direct
  Paramètres URL        useParams() (client)    props params (serveur)
  Navigation            useNavigate()           useRouter().push()
  Interactivité         Tout en client          'use client' ciblé
  HTML initial          <div id="root"> vide    HTML complet (SSR)
  SEO                   ❌ Mauvais              ✅ Excellent
  Performance           Blanc pendant JS load   Instantané (HTML pré-rendu)
  Sécurité API          URL visible côté client URL cachée côté serveur
 
============================================================
