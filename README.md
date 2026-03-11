

## Q1 — Pourquoi le reducer ne doit pas avoir d'effets de bord ?

Le reducer fait partie du **cycle de render React**. React peut l'appeler plusieurs fois (notamment en StrictMode). Si le reducer contenait un `fetch`, un `console.log`, ou un accès à `localStorage`, ces effets seraient déclenchés à chaque appel inattendu.

Les effets de bord vont dans `useEffect`, jamais dans le reducer.

---

## Q2 — Pourquoi useAuth() lance une erreur si le context est null ?

Si `context` est `null`, ça veut dire que le composant est utilisé **en dehors du `AuthProvider`**. Sans ce check, l'erreur serait silencieuse et difficile à tracer :


C'est le pattern **"fail fast"** : on préfère une erreur claire et immédiate plutôt qu'un bug bizarre à l'intérieur d'un composant.

---

## Q3 — Sans Context, combien de props pour partager le user ?

Sans Context il faudrait faire du **prop drilling** : passer `user` et `dispatch` à travers chaque niveau de l'arbre.

```
App (user, dispatch)
  └── Layout (user, dispatch)      ← reçoit et retransmet sans s'en servir
        ├── Header (user, onLogout)
        ├── Sidebar (user)
        └── MainContent (user)
```

Minimum **6 à 10 props** à passer manuellement. Avec Context : **0 prop supplémentaire**, chaque composant fait juste `useAuth()`.

---

## Q4 — Pourquoi e.preventDefault() est indispensable ?

Sans `e.preventDefault()`, le comportement **natif du `<form>` HTML** se déclenche : la page se recharge complètement (requête GET ou POST vers l'URL courante), ce qui efface tout le state React.


**Règle absolue dans les SPA React :** toujours `e.preventDefault()` sur `onSubmit`.

---

## Q5 — Que fait la destructuration `{ password: _, ...user }` ?

Cette syntaxe extrait la propriété `password` dans la variable `_` (ignorée par convention) et regroupe **tout le reste** dans `user`.



**Pourquoi exclure le password ?**
- Ne jamais stocker un mot de passe en mémoire (state, Context) sans nécessité
- Le Context n'a besoin que de `id`, `email` et `name` pour afficher l'UI
- Bonne habitude à prendre même si ici les mots de passe sont en clair (TP simplifié)

---

## Q6 — Pourquoi Dashboard est un composant séparé et pas tout dans App ?

Si tout était dans `App`, les hooks (`useState`, `useEffect`) s'exécuteraient **même quand l'user n'est pas connecté**.



**3 raisons :**
1. Les `fetch` ne se lancent que quand l'user est connecté
2. Séparation des responsabilités : `App` = routeur auth, `Dashboard` = logique métier
3. Au logout, `Dashboard` est démonté → son state local est réinitialisé automatiquement

---

## Q7 — Flux complet login → Dashboard → Déconnexion → Login

1. Saisie `admin@taskflow.com` / `admin123` → clic "Se connecter"
2. `dispatch(LOGIN_START)` → bouton devient "Connexion..." et est désactivé
3. `fetch` vers `http://localhost:4000/users?email=admin@taskflow.com`
4. Vérification password → `dispatch(LOGIN_SUCCESS, { id, email, name })`
5. `authState.user` n'est plus `null` → `App` re-render → affiche `<Dashboard />`
6. `Dashboard` monte → `useEffect` → fetch projects et columns → Kanban affiché
7. Clic "Déconnexion" → `dispatch(LOGOUT)` → `authState.user = null`
8. `App` re-render → affiche `<Login />` à nouveau

---

## Q8 — Flux callback : Header → onLogout → dispatch → re-render

```
User clique "Déconnexion"
        │
        ▼
Header : onClick={() => onLogout()}
        │
        ▼  (onLogout est une prop passée depuis Dashboard)
Dashboard : onLogout={() => dispatch({ type: 'LOGOUT' })}
        │
        ▼
authReducer(state, { type: 'LOGOUT' })
        │
        ▼
retourne initialState → { user: null, loading: false, error: null }
        │
        ▼
AuthContext notifie tous les composants abonnés
        │
        ▼
App re-render : authState.user === null → return <Login />
        │
        ▼
Dashboard démonté, Login monté
```

C'est le flux **unidirectionnel React** : UI → Event → dispatch → Reducer → new State → Re-render.

---

## Q9 — Pourquoi le flash disparaît avec useLayoutEffect ?

La différence vient du **moment d'exécution** par rapport à la peinture du navigateur :

```
useEffect      : Render → Commit → PAINT → Effect → re-render → PAINT
useLayoutEffect: Render → Commit → Effect → re-render → PAINT
```

- Avec `useEffect` : React peint `position = (0,0)` → l'utilisateur **voit** le tooltip en haut à gauche → puis l'effet recalcule → re-paint. **Flash visible.**
- Avec `useLayoutEffect` : l'effet calcule la bonne position **avant** que le navigateur ne peigne → une seule peinture avec la bonne position. **Aucun flash.**

---

## Q10 — Pourquoi ne pas utiliser useLayoutEffect partout ?

Parce que `useLayoutEffect` est **synchrone et bloquant** : il empêche le navigateur de peindre tant qu'il n'est pas terminé.

```
useLayoutEffect lent → UI figée → mauvaise expérience utilisateur (jank)
```

**Autres problèmes :**
- Incompatible avec le **SSR** (Next.js) → warning `useLayoutEffect does nothing on the server`
- Inutile pour 99% des cas : fetch, timers, abonnements n'ont aucun impact visuel

**Règle simple :**

| Cas | Hook à utiliser |
|---|---|
| Lire/modifier le DOM avant l'affichage (position, scroll, mesures) | `useLayoutEffect` |
| Fetch de données, localStorage, event listeners, timers | `useEffect` |

React recommande `useEffect` par défaut. N'utiliser `useLayoutEffect` que si `useEffect` cause un flash visuel observable.

---

*TaskFlow Séance 2 — EMSI Front-End*
