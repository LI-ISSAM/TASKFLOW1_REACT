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



SÉANCE 2 — Server Actions, API Routes & Auth
Partie 1 : Server Actions
➤ Q1 : En React SPA, que fallait-il faire après un POST pour voir le nouveau projet ?
En React SPA, après un POST réussi, il fallait manuellement mettre à jour le state local avec setProjects(prev => [...prev, data]) pour que le nouveau projet apparaisse sans recharger la page. Il fallait donc gérer soi-même la synchronisation entre le serveur et l'interface.
En Next.js avec les Server Actions, il suffit d'appeler revalidatePath('/dashboard') : Next.js invalide le cache de la page et la re-génère automatiquement côté serveur avec les données fraîches. Zéro useState, zéro fetch manuel.
Partie 2 : Renommer et Supprimer
➤ Q3 : Le bouton supprimer est un <form> avec un <input type='hidden'>. Pourquoi pas un onClick ?
Le Dashboard est un Server Component. Les Server Components ne s'exécutent QUE sur le serveur : ils ne sont jamais envoyés au navigateur. Donc les gestionnaires d'événements React comme onClick ne peuvent pas y être attachés.
Le formulaire HTML natif avec action={serverAction} est la solution : il envoie une requête POST au serveur sans JavaScript côté client. Cela fonctionne même si JavaScript est désactivé dans le navigateur (progressive enhancement).
Partie 3 : API Routes
➤ Q4 : Testez http://localhost:3000/api/projects dans le navigateur. Que voyez-vous ?
On voit le tableau JSON de tous les projets, exactement comme avec json-server sur :4000. Next.js expose l'endpoint GET directement, lu depuis la base de données SQLite via Prisma (ou db.json en version FS). C'est un vrai endpoint REST consommable par n'importe quel client.
➤ Q5 : Quelle est la différence entre une API Route et une Server Action ?
API Route : endpoint HTTP standard accessible via une URL (/api/projects). Peut être appelée par n'importe quel client (navigateur, mobile, Postman, autre service). Retourne du JSON.
Server Action : fonction serveur appelée DIRECTEMENT depuis un composant React via l'attribut action={} d'un formulaire. Pas d'URL visible, pas de JSON, réservée aux formulaires Next.js. Plus simple pour les mutations liées à l'UI.
Règle : Server Action pour les formulaires Next.js, API Route pour une API partagée avec d'autres clients (app mobile, etc.).
Partie 4 : Auth avec cookies
➤ Q6 : Comparez ce Login avec celui de React SPA. Combien de useState en moins ?
React SPA Login utilisait 4 useState : email, password, error, loading.
Next.js Login avec useActionState : 0 useState ! L'état du formulaire (pending, error) est géré par useActionState(login, null). Seuls state et pending sont nécessaires, fournis automatiquement par le hook. Le formulaire est entièrement géré par le serveur.
➤ Q7 : Après le login, ouvrez F12 > Application > Cookies. Voyez-vous le cookie 'session' ? Pouvez-vous le lire avec document.cookie ?
Oui, le cookie 'session' est visible dans F12 > Application > Cookies.
Non, document.cookie dans la console JavaScript NE retourne PAS le cookie 'session'. C'est l'effet de httpOnly: true : le cookie est envoyé automatiquement par le navigateur dans chaque requête HTTP, mais il est INVISIBLE pour tout script JavaScript (protection XSS ultime).
Partie 5 : Middleware
➤ Q8 : En React SPA, ProtectedRoute affichait brièvement le Dashboard avant de rediriger. Ici, que se passe-t-il ?
Avec le Middleware Next.js, la page ne se charge MÊME PAS. Le middleware s'exécute sur le Edge Network (entre le client et le serveur), AVANT que Next.js génère le HTML. Si pas de cookie session → redirection immédiate vers /login, sans jamais envoyer une seule ligne de HTML du Dashboard.
En React SPA, ProtectedRoute vérifiait l'état APRÈS que le composant se soit monté dans le DOM, causant un flash (FOUC). Ici : zéro flash, zéro fuite de contenu protégé.
➤ Q9 : Le middleware.ts est à la racine, pas dans app/. Pourquoi ?
Le middleware Next.js s'exécute dans un environnement Edge différent de l'App Router. Il doit être découvert par Next.js au niveau du projet entier, pas dans le système de fichiers de l'App Router. Placer middleware.ts dans app/ l'interpréterait comme un composant ou une page, pas comme un middleware.
Partie 6 : Logout + User
➤ Q10 : Le layout est un Server Component. Il lit le cookie DIRECTEMENT avec cookies(). En React SPA, comment faisait-on ?
En React SPA, il fallait : (1) un AuthContext global, (2) un useReducer/useState pour stocker le user, (3) un useAuth() hook dans chaque composant consommateur, (4) PropDrilling ou Context Provider enveloppant l'app entière.
En Next.js, le Server Component lit le cookie directement avec cookies() de next/headers, sans aucun Context, sans aucun hook, sans aucun état côté client. Le user est lu côté serveur à chaque requête, directement dans la fonction async du composant.
Partie 7 : Questions de réflexion
➤ Q11 : Server Actions vs API Routes — formulaire de création ? App mobile ?
Formulaire de création de projet dans Next.js → Server Action. C'est plus simple, pas d'URL à gérer, intégration native avec les formulaires React, revalidatePath fonctionne automatiquement.
App mobile qui consomme la même API → API Route. Une app mobile (React Native, Flutter) ne peut pas appeler une Server Action directement, elle a besoin d'un endpoint HTTP standard (/api/projects) retournant du JSON.
➤ Q12 : React SPA : Context + useReducer + JWT mémoire + ProtectedRoute vs Next.js : cookies + middleware. Quel avantage ?
Avantage Next.js : le cookie httpOnly est invisible pour JavaScript → résistant aux attaques XSS. Le middleware protège les routes AVANT que le HTML soit envoyé → zéro flash de contenu. L'état d'auth est lu côté serveur → pas besoin d'hydrater le client.
En React SPA, le JWT en mémoire (state React) est perdu au refresh de page. Un attaquant avec XSS peut accéder à window.__REACT_STATE__. ProtectedRoute peut flasher brièvement le contenu protégé.
➤ Q13 : Si vous arrêtez json-server, les API Routes fonctionnent-elles toujours ?
Oui ! En Séance 3, les API Routes utilisent Prisma + SQLite, pas json-server. Next.js EST le serveur. La base de données SQLite est lue directement par Prisma. json-server n'est plus nécessaire du tout.
➤ Q14 : Le cookie est HttpOnly. Un script XSS injecté dans la page peut-il le voler ?
NON. C'est précisément l'intérêt de httpOnly: true. Le cookie n'est JAMAIS accessible via document.cookie ou l'API JavaScript. Il est géré exclusivement par le navigateur qui l'envoie automatiquement dans les en-têtes HTTP. Un script malveillant injecté via XSS ne peut pas le lire, le copier ou l'exfiltrer.

SÉANCE 3 — Full-Stack (Prisma + Performance + Déploiement)
Partie 1 : Prisma + SQLite
➤ Q1 : Run npx prisma studio. Voyez-vous les données dans les tables Project et User ?
Oui ! npx prisma studio ouvre une interface web sur http://localhost:5555 qui affiche les tables Project et User avec toutes leurs colonnes (id, name, color, createdAt, email, password, name). Après npx tsx prisma/seed.ts, les données insérées par le seed sont visibles directement dans l'interface Prisma Studio.
Partie 2 : API Routes avec Prisma
➤ Q2 : Comparez ce code avec l'ancien (fs.readFileSync + JSON.parse + push + writeFileSync). Combien de lignes en moins ?
Ancien code avec fs (environ 12-15 lignes) : readFileSync, JSON.parse, .push(), JSON.stringify, writeFileSync, gestion des ID manuels (Date.now()), risque de corruption si deux requêtes simultanées.
Avec Prisma (3-4 lignes) : prisma.project.create({ data: { name, color } }). Prisma gère l'ID auto-incrémenté, les transactions, la sécurité des types TypeScript, et la concurrence. Environ 75% de code en moins et infiniment plus fiable.
➤ Q3 : Supprimez db.json. L'app fonctionne-t-elle toujours ? Pourquoi ?
Oui, l'app fonctionne parfaitement sans db.json ! En Séance 3, tout est migré vers Prisma + SQLite (fichier dev.db dans le dossier prisma/). Les API Routes, les Server Actions et les Server Components lisent directement la base SQLite via Prisma. db.json n'est plus utilisé nulle part.
Partie 3 : Prisma direct dans les Server Components
➤ Q4 : Pourquoi le Server Component peut appeler prisma.project.findMany() directement mais un Client Component ne peut PAS ?
Les Server Components s'exécutent UNIQUEMENT sur le serveur Node.js, dans le même processus que Prisma. Ils ont accès au système de fichiers, aux variables d'environnement, aux connexions base de données.
Les Client Components ('use client') s'exécutent dans le NAVIGATEUR. Le navigateur n'a pas accès à Node.js, ni à Prisma, ni au fichier dev.db, ni aux variables d'environnement serveur. Appeler prisma.project.findMany() dans un Client Component exposerait les credentials de la BDD au navigateur — une faille de sécurité critique.
Partie 4 : Performance
➤ Q5 : Ouvrez F12 > Network > Font. Combien de requêtes externes voyez-vous pour la police ?
Zéro requête externe ! next/font télécharge la police Google Fonts au moment du BUILD (npm run build), la stocke localement dans le projet, et la sert comme une ressource statique locale. Avantages : pas de requête externe au runtime (meilleure performance), pas de dépendance à Google Fonts (RGPD/confidentialité), pas de cumulative layout shift (CLS).
Partie 5 : generateStaticParams
➤ Q6 : Avec generateStaticParams, les pages /projects/1 et /projects/2 sont générées quand ? Au build ou à chaque requête ?
Au BUILD (npm run build). Next.js exécute generateStaticParams, récupère tous les IDs de projets existants, et génère les pages HTML statiques correspondantes. Ces pages HTML sont ensuite servies directement depuis le CDN/cache, sans exécuter de code serveur à chaque requête. C'est le comportement SSG (Static Site Generation).
➤ Q7 : Si un nouveau projet est créé après le build, la page /projects/3 existe-t-elle ?
Oui, par défaut avec Next.js App Router. Les pages non générées au build sont générées à la première requête (ISR on-demand). La page /projects/3 sera rendue dynamiquement lors du premier accès, puis mise en cache pour les requêtes suivantes. Elle sera moins rapide que les pages pré-générées mais fonctionnera.
Partie 7 : Comparaison finale
➤ Q9 : Tableau comparatif React SPA vs Next.js Full-Stack

Critère	React SPA (Vite)	Next.js Full-Stack
Routing	react-router-dom dans le code (App.tsx)	Dossiers app/ (file-system routing)
Data fetching	useEffect + fetch + useState + loading	async/await direct dans le composant
Mutations (CRUD)	fetch POST/PUT/DELETE + setProjects()	Server Actions + revalidatePath()
Auth	Context + useReducer + JWT mémoire	Cookies httpOnly + Middleware Edge
Base de données	Pas d'accès direct (via json-server)	Prisma direct dans les Server Components
Déploiement	Build statique + serveur séparé (Express)	Vercel / tout hébergeur Node.js
SEO	Mauvais (HTML vide, JS-only)	Excellent (HTML pré-rendu par le serveur)
Performance	Bundle JS lourd, premier affichage lent	HTML instantané, hydratation partielle
Nb de projets	1 (front) + 1 (back) minimum	1 seul projet full-stack

➤ Q10 : Si vous deviez créer une startup demain, choisiriez-vous React SPA + Express ou Next.js full-stack ?
Next.js full-stack, pour ces raisons :
•	Un seul projet, un seul déploiement, une seule équipe.
•	Meilleur SEO dès le départ (SSR/SSG) → crucial pour acquérir des utilisateurs.
•	Auth plus sécurisée avec cookies httpOnly (résistante XSS).
•	Prisma + Server Components : accès direct BDD sans couche API superflue.
•	Déploiement Vercel en quelques clics, CDN mondial inclus.
React SPA + Express reste pertinent pour : applications très interactives (dashboard temps réel), équipes front/back séparées, ou quand on a besoin d'une API publique consommée par plusieurs clients (web, mobile, tiers).

