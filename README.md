
## Partie 1 — Initialisation

**Q : Que contient le `<body>` dans index.html ? Lien avec le CSR ?**
Le `<body>` contient uniquement un `<div id="root">` vide et le script React.
C'est le principe du **CSR (Client Side Rendering)** — le navigateur reçoit une page HTML vide, puis JavaScript génère tout le contenu côté client dans ce `div#root`.
Contrairement au SSR (Server Side Rendering), le serveur n'envoie pas de HTML prêt — c'est React qui construit l'interface dans le navigateur.

---

## Partie 2 — Backend json-server

**Q : Quelle différence entre des données en dur dans le code et une API REST ?**

| Critère | Données en dur | API REST (json-server) |
|---|---|---|
| **Emplacement** | Dans le code source | Dans un fichier séparé `db.json` |
| **Modification** | Nécessite de modifier le code | Modifier `db.json` suffit |
| **Rechargement** | Recompiler l'app | Juste recharger la page |
| **Réalisme** | Non — pas comme en production | Oui — simule un vrai backend |
| **Partage** | Impossible sans modifier le code | Accessible via HTTP par n'importe qui |
| **CRUD** | Impossible | GET, POST, PUT, DELETE disponibles |

En production, les données viennent toujours d'une API — jamais codées en dur dans le frontend.

---

## Partie 3 — Composants avec Props

**Q : Pourquoi `className` au lieu de `class` en JSX ?**

`class` est un **mot réservé en JavaScript** (il sert pour les classes ES6 comme `class Animal {}`).
JSX est du JavaScript — utiliser `class` créerait un conflit avec la syntaxe JS.
React utilise donc `className` pour éviter cette ambiguïté.
```jsx
//  Incorrect — class est réservé JS


//  Correct en JSX

```

---

**Q : Pourquoi `key={p.id}` est obligatoire dans `.map()` ? Que se passe-t-il avec l'index ?**

React utilise la `key` pour identifier chaque élément dans une liste et savoir **lequel a changé, été ajouté ou supprimé** lors d'un re-render. Sans `key`, React re-render toute la liste entière même si un seul élément change — mauvaises performances.

| Situation | Problème |
|---|---|
| **Sans key** | Warning React + re-render inutile de toute la liste |
| **key={index}** | Dangereux si la liste est triée ou filtrée — l'index change mais pas l'élément |
| **key={p.id}** |  Stable et unique — React identifie précisément chaque élément |
```jsx
//  Avec index — dangereux si liste triée
{projects.map((p, i) => {p.name})}

//  Avec id unique — stable
{projects.map(p => {p.name})}
```

---

## Partie 4 — State, useEffect & Fetch

**Q1 : Combien de fois le useEffect s'exécute-t-il ? Pourquoi ?**

Le `useEffect` s'exécute **une seule fois** — au montage initial du composant.
C'est grâce au tableau de dépendances vide `[]` passé en second argument.
```jsx
useEffect(() => {
  fetchData(); // exécuté UNE seule fois
}, []); // [] = pas de dépendances = seulement au montage
```

| Tableau de dépendances | Comportement |
|---|---|
| `[]` vide | Une seule fois au montage |
| `[variable]` | À chaque fois que `variable` change |
| Absent | À chaque re-render |

---

**Q2 : Arrêtez json-server (Ctrl+C) et rechargez. Que se passe-t-il ?**

Le `fetch` échoue car `localhost:4000` ne répond plus.
Le bloc `catch` intercepte l'erreur et `console.error('Erreur:', error)` s'affiche.
`setLoading(false)` est quand même appelé dans le `finally` donc le spinner disparaît.
Les tableaux `projects` et `columns` restent vides `[]` — rien ne s'affiche dans l'interface.
```
Résultat visuel : page blanche ou vide (pas de projets, pas de colonnes)
Console : "Erreur: TypeError: Failed to fetch"
```

---

**Q3 : Ouvrez Network (F12). Voyez-vous les requêtes vers localhost:4000 ? Code HTTP ?**

| Requête | URL | Code HTTP | Signification |
|---|---|---|---|
| GET projets | `http://localhost:4000/projects` | **200 OK** | Succès |
| GET colonnes | `http://localhost:4000/columns` | **200 OK** | Succès |
| Si json-server arrêté | `http://localhost:4000/projects` | **ERR_CONNECTION_REFUSED** | Serveur inaccessible |

Dans l'onglet **Network** de F12 on voit les deux requêtes GET lancées simultanément grâce à `Promise.all()` — elles partent en parallèle et non l'une après l'autre.

---

**Q4 : Les nouvelles données s'affichent après modification de db.json ? Décrivez le cycle complet.**

Oui, les nouvelles données s'affichent après rechargement de la page.

Cycle complet :
```
1. On modifie db.json (ajout projet ou tâche)
2. On recharge la page React (F5)
3. App.tsx monte → useEffect se déclenche
4. fetch('localhost:4000/projects') → json-server lit db.json
5. json-server retourne le JSON mis à jour
6. setProjects(data) → state mis à jour
7. React re-render → Sidebar affiche les nouveaux projets
8. setColumns(data) → state mis à jour
9. React re-render → MainContent affiche les nouvelles tâches
```

---

**Q5 : Dessinez le flux json-server → fetch → useState → useEffect → composants → props**
```
┌─────────────┐     HTTP GET      ┌──────────────┐     lit      ┌─────────┐
│  React App  │ ──────────────▶   │  json-server │ ──────────▶  │ db.json │
│  (port 5173)│ ◀──────────────   │  (port 4000) │              └─────────┘
└─────────────┘   JSON response   └──────────────┘

Dans React :

useEffect([])          ← déclenché au montage
    │
    ▼
fetch('/projects')     ← requête HTTP GET
fetch('/columns')      ← requête HTTP GET (en parallèle)
    │
    ▼
setProjects(data)      ← met à jour le state
setColumns(data)       ← met à jour le state
    │
    ▼
Re-render App.tsx      ← React re-render car state changé
    │
    ├──▶ <Sidebar projects={projects} />    ← reçoit les projets via props
    │         └──▶ affiche la liste .map()
    │
    └──▶ <MainContent columns={columns} />  ← reçoit les colonnes via props
              └──▶ affiche le board kanban .map()
```

---

## Résumé des concepts clés

| Concept | Rôle |
|---|---|
| `useState` | Stocker les données (projets, colonnes, loading) |
| `useEffect([])` | Déclencher le fetch une seule fois au montage |
| `fetch` | Appel HTTP vers json-server |
| `Promise.all` | Lancer plusieurs fetch en parallèle |
| `props` | Passer les données aux composants enfants |
| `key` | Identifier les éléments dans les listes |
| `className` | Remplace `class` en JSX (mot réservé JS) |
| `json-server` | Simule une API REST depuis un fichier JSON |





##TP5
## Partie 1 — Sécurité XSS

**Q1 : Le script s'exécute-t-il ? Pourquoi ? Que fait React avec les strings dans le JSX ?**

Non, le script ne s'exécute pas.
React échappe automatiquement toutes les strings affichées dans le JSX.
`<img src=x onerror=alert("HACK")>` est affiché comme du texte brut visible à l'écran,
pas interprété comme du HTML. C'est la protection anti-XSS intégrée de React.

---

**Q2 : Que se passe-t-il avec dangerouslySetInnerHTML ?**

Cette fois le script S'EXÉCUTE — une alerte "HACK" apparaît dans le navigateur.
`dangerouslySetInnerHTML` désactive complètement la protection XSS de React.
Le HTML est injecté et interprété directement dans le DOM.
Ne jamais utiliser avec des données venant d'un utilisateur ou d'une API.

---

## Partie 2 — JWT simulé

**Q3 : Voyez-vous le header Authorization: Bearer ... dans Network ?**

Oui. Dans F12 → Network → cliquer sur la requête GET /projects →
onglet Headers → Request Headers → on voit :
`Authorization: Bearer eyJ1c2VySWQi...`
C'est l'intercepteur Axios qui ajoute automatiquement ce header à chaque requête
après que setAuthToken() a été appelé.

---

**Q4 : Pourquoi stocker le token en mémoire (state React) et PAS dans localStorage ?**

| Critère | localStorage | State React (mémoire) |
|---|---|---|
| **Accès XSS** | Accessible par tout script JS | Isolé, inaccessible depuis l'extérieur |
| **Persistance** | Survit au rechargement | Perdu au rechargement (voulu) |
| **Sécurité** | Vulnérable si XSS | Protégé |
| **Recommandation** | Jamais pour les tokens | Oui pour les tokens sensibles |

localStorage est accessible par TOUT script JavaScript de la page.
Si un attaquant injecte du JS (XSS), il peut faire `localStorage.getItem('token')`
et voler le token. Le state React est isolé dans la mémoire du composant.

---

## Partie 3 — Redux Toolkit

**Q5 : Comparez authSlice.ts avec authReducer.ts. Qu'est-ce qui a changé ?**

| Critère | authReducer.ts (ancien) | authSlice.ts (Redux Toolkit) |
|---|---|---|
| **Syntaxe** | `switch/case` manuel | Fonctions dans `reducers: {}` |
| **Action types** | Strings manuels `'LOGIN_START'` | Auto-générés par RTK |
| **Immutabilité** | Spread manuel `{ ...state, loading: true }` | Mutation directe `state.loading = true` (Immer) |
| **Action creators** | Créés manuellement | Auto-exportés `authSlice.actions` |
| **Boilerplate** | Beaucoup | Très peu |

RTK utilise **Immer** en coulisse : écrire `state.user = action.payload`
semble mutable mais Immer crée un nouvel objet immutable automatiquement.
Plus besoin de spread `{ ...state }`.

---

## Partie 4 — React.memo & useCallback

**Q6 : Combien de composants se re-rendent quand on toggle la sidebar ?**

Sans optimisation, TOUS les composants se re-rendent :
- Header ✅ (normal — reçoit onMenuClick qui change)
- Sidebar ✅ (normal — isOpen change)
- MainContent ❌ (inutile — ses props columns n'ont pas changé)

MainContent ne DEVRAIT PAS se re-rendre car ses données (columns)
n'ont pas changé lors du toggle de la sidebar.

---

**Q7 : Pourquoi MainContent ne se re-rend plus avec React.memo ?**

`React.memo` compare les props actuelles avec les props précédentes
(shallow comparison — comparaison superficielle).
Si les props sont identiques, React saute le re-render entièrement.
`columns` n'a pas changé lors du toggle sidebar → MainContent ignoré → pas de re-render.

---

**Q8 : Quelle différence entre useMemo et useCallback ?**

| Hook | Mémoïse | Utilisation |
|---|---|---|
| `useCallback` | Une **fonction** | Éviter de recréer une fonction à chaque render |
| `useMemo` | Une **valeur calculée** | Éviter de recalculer une valeur coûteuse |

```tsx
// useCallback — mémoïse la fonction elle-même
const handleRename = useCallback((project) => {
  renameProject(project);
}, [renameProject]);

// useMemo — mémoïse le résultat d'un calcul
const sortedProjects = useMemo(() => {
  return projects.sort((a, b) => a.name.localeCompare(b.name));
}, [projects]);
```

Le piège dans le TP : `onRename={(p) => renameProject(p)}` crée une
NOUVELLE fonction à chaque render même si renameProject n'a pas changé.
`memo(Sidebar)` détecte que la prop onRename a changé (nouvelle référence)
et re-rend quand même. Solution : `useCallback` pour stabiliser la référence.

---

## Partie 5 — Custom Hook

**Q9 (implicite) : Pourquoi extraire la logique dans un custom hook ?**

| Sans hook | Avec useProjects |
|---|---|
| Dashboard a 100+ lignes | Dashboard simplifié ~50 lignes |
| Logique mélangée avec UI | Logique séparée de l'affichage |
| Impossible à réutiliser | Utilisable dans n'importe quel composant |
| Difficile à tester | Testable indépendamment |

Un custom hook est juste une fonction qui commence par `use` et peut
appeler d'autres hooks. Il permet de séparer la logique métier de l'UI.

---

## Partie 6 — React Profiler

**Q10 : Pour chaque action, quels composants se re-rendent ?**

| Action | Composants re-rendus | Re-renders inutiles après memo |
|---|---|---|
| Toggle sidebar | Header, Sidebar | MainContent ❌ (éliminé par memo) |
| Ajouter un projet | Dashboard, Sidebar | MainContent ❌ (éliminé par memo) |
| Naviguer ProjectDetail | App, ProtectedRoute, ProjectDetail | Aucun |
| Se déconnecter | App → Login | Aucun |

Après React.memo sur MainContent et useCallback sur handleRename :
- Toggle sidebar → MainContent ne re-render plus ✅
- Ajout projet → MainContent ne re-render plus ✅ (columns n'a pas changé)

---

## Résumé des concepts clés

| Concept | Rôle |
|---|---|
| `React.memo` | Évite re-render si props inchangées |
| `useCallback` | Stabilise la référence d'une fonction |
| `useMemo` | Mémoïse une valeur calculée coûteuse |
| `Redux Toolkit` | Remplace useReducer + Context pour état global |
| `authSlice` | Gère auth avec moins de boilerplate qu'un reducer manuel |
| `useProjects` | Custom hook qui sépare logique CRUD de l'UI |
| `setAuthToken` | Intercepteur Axios qui ajoute Bearer token automatiquement |
| `dangerouslySetInnerHTML` | Désactive protection XSS — jamais avec données utilisateur |


