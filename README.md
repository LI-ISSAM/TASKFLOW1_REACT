
## Partie 1 — Initialisation

**Q : Que contient le `<body>` dans index.html ? Lien avec le CSR ?**
```html

  
  

```

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
