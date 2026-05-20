# TP Vue.js — Mini Todo App
## Réponses complètes + Guide de dépannage

---

## Structure du projet

```
todo-vue/
├── db.json                  ← Base de données json-server (à la racine)
├── package.json
├── src/
│   ├── App.vue              ← Layout + RouterView
│   ├── main.ts              ← createApp + router + pinia
│   ├── views/
│   │   ├── HomeView.vue     ← useTaskStore + TodoItem
│   │   ├── TaskView.vue     ← useRoute + onMounted
│   │   └── AboutView.vue
│   ├── components/
│   │   └── TodoItem.vue     ← defineProps + defineEmits
│   ├── stores/
│   │   └── tasks.ts         ← Pinia store CRUD
│   └── router/
│       └── index.ts         ← 3 routes
```

---

## Lancer le projet

```bash
# Terminal 1 — App Vue
npm run dev

# Terminal 2 — API json-server (OBLIGATOIRE)
npx json-server --watch db.json --port 4000
```

Vérifier que json-server tourne : ouvrir http://localhost:4000/tasks dans le navigateur.

---

## db.json — Explication

`db.json` est la **base de données** du projet. json-server lit ce fichier et crée automatiquement une API REST complète :

| Requête HTTP       | Action dans db.json              |
|--------------------|----------------------------------|
| GET /tasks         | Lit toutes les tâches            |
| POST /tasks        | Ajoute une tâche                 |
| PUT /tasks/:id     | Modifie une tâche                |
| DELETE /tasks/:id  | Supprime une tâche               |

C'est une fausse API backend pour le développement front-end. Pas besoin de Node.js, Express ou MongoDB. Les données sont **persistantes** : si on ajoute une tâche et recharge la page, elle est toujours là.

Contenu minimal du db.json :

```json
{
  "tasks": []
}
```

---

## Dépannage — Rien ne s'ajoute

1. Vérifier que json-server est lancé dans un 2ème terminal
2. Vérifier que db.json est à la racine du projet (même niveau que package.json)
3. Ouvrir http://localhost:4000/tasks — si erreur de connexion, json-server n'est pas lancé
4. Si CORS bloqué : `npx json-server --watch db.json --port 4000 --host localhost`

---

## Tableau de comparaison React ↔ Vue 3

| Concept           | React                                      | Vue 3                              |
|-------------------|--------------------------------------------|------------------------------------|
| State local       | `const [x, setX] = useState(0)`           | `const x = ref(0)`                |
| Two-way binding   | `value={x} onChange={e => set(e.target.value)}` | `v-model="x"`              |
| Fetch au montage  | `useEffect(() => { fetch()... }, [])`      | `onMounted(async () => { ... })`  |
| Ajouter au state  | `setItems(prev => [...prev, data])`        | `items.value.push(data)`          |
| Boucle template   | `items.map(i => <li key={i.id}>)`          | `<li v-for="i in items" :key="i.id">` |
| Conditionnel      | `{condition && <div>}`                     | `<div v-if="condition">`          |
| Event             | `onClick={handler}`                        | `@click="handler"`                |
| Props enfant      | `<Child name={x} />`                       | `<Child :name="x" />`             |
| Callback parent   | `<Child onDelete={handler} />`             | `<Child @delete="handler" />`     |
| Router lien       | `<Link to='/x'>Lien</Link>`                | `<RouterLink to='/x'>Lien</RouterLink>` |
| Params URL        | `const { id } = useParams()`               | `useRoute().params.id`            |
| Navigate          | `const nav = useNavigate(); nav('/')`      | `const router = useRouter(); router.push('/')` |
| State global      | `createSlice + useSelector + dispatch`     | `defineStore + useTaskStore()`    |
| Appeler action    | `dispatch(addTask(title))`                 | `store.addTask(title)`            |
| Style isolé       | `CSS Modules / .module.css`                | `<style scoped>`                  |

---

## Réponses aux questions

---

### Q1 — Fichier .vue (3 sections) vs .tsx (tout mélangé)

Le fichier `.vue` sépare `<script>`, `<template>` et `<style>` : chaque section a un rôle clair.
Un designer peut modifier le template sans toucher à la logique. C'est plus lisible pour des composants simples.

Inconvénient : plus de "magie" du compilateur, support TypeScript parfois moins précis qu'en `.tsx` pur.

Le fichier `.tsx` de React garde tout en JavaScript : plus cohérent conceptuellement, meilleur support
TypeScript natif, mais mélange logique et affichage dans le même flux.

---

### Q2 — Pourquoi React n'a pas de two-way binding natif ?

React suit le principe de **flux de données unidirectionnel** (one-way data flow) : les données descendent
des parents vers les enfants, jamais dans l'autre sens automatiquement. C'est un choix philosophique :
quand `value` et `onChange` sont explicites, on sait exactement qui modifie quoi — plus prévisible et
plus facile à déboguer.

Vue considère que `v-model` est un sucre syntaxique acceptable car il compile en `value + @input`
en interne — c'est la même chose, juste écrite en moins de code.

---

### Q3 — Pourquoi tasks.value.push(data) fonctionne en Vue mais pas en React ?

Vue 3 utilise les **Proxy** JavaScript pour envelopper les objets réactifs. Quand on fait `ref([])`,
Vue crée un Proxy autour du tableau. Ce Proxy intercepte toutes les opérations (`push`, `splice`, `pop`)
et déclenche automatiquement la mise à jour du DOM.

React n'a pas ce mécanisme : il compare l'ancienne référence à la nouvelle pour détecter les changements.
Si on fait `tasks.push(data)`, la référence du tableau reste identique, React ne voit aucune différence
et ne re-rend pas. Il faut créer un nouveau tableau avec `[...prev, data]` pour changer la référence.

---

### Q4 — useEffect(fn, []) vs onMounted(fn) — lequel est plus lisible ?

`onMounted` est plus lisible : le nom dit exactement ce qu'il fait.

`useEffect` avec `[]` est un compromis : React a voulu un seul hook pour gérer tous les effets de bord
(montage, mise à jour, démontage). Le tableau de dépendances permet de dire "re-exécute cet effet quand
ces valeurs changent", ce qui unifie plusieurs cas en un seul hook. C'est puissant mais déroutant.

Vue sépare `onMounted`, `onUpdated`, `onUnmounted` — plus verbeux mais immédiatement compréhensible.

---

### Q5 — Props fonctions (React) vs événements émis (Vue) — lequel est plus proche du HTML natif ?

L'approche Vue avec `emit` est plus proche du HTML natif. En HTML, les éléments émettent des événements
(`click`, `change`, `input`) et les parents les écoutent. Vue reproduit exactement ce modèle :
l'enfant émet, le parent écoute avec `@`.

React passe des fonctions comme n'importe quelle autre prop, cohérent avec "tout est JavaScript"
mais s'éloigne du modèle d'événements du DOM.

---

### Q6 — Que se passe-t-il si on oublie @delete en Vue ?

L'événement est **silencieusement ignoré**. L'enfant appelle `emit('delete', id)`, Vue cherche un
listener dans le parent, n'en trouve pas, et ne fait rien — pas d'erreur, pas de crash.

En React, si on oublie de passer `onDelete` et que l'enfant appelle `props.onDelete(id)`, on obtient
`TypeError: props.onDelete is not a function` et l'app crash. Vue est plus permissif, React est plus
strict — ce qui peut être préférable pour détecter les bugs tôt.

---

### Q7 — useParams + useNavigate (React) vs useRoute + useRouter (Vue) — vraiment différent ?

Non, la logique est **identiquement la même**. Les deux frameworks séparent la lecture des paramètres
(useParams / useRoute) de la navigation programmatique (useNavigate / useRouter). Seuls les noms changent.
`route.params.id` vs `params.id` — c'est la même API. Quelqu'un qui connaît l'un apprend l'autre
en quelques minutes.

---

### Q8 — Routes dans le JSX (React) vs fichier de config (Vue) — avantage de Vue ?

La séparation Vue offre plusieurs avantages :
- Configuration centralisée dans un seul fichier, facile à lire d'un coup d'œil
- Guards de navigation (`beforeEach`) ajoutés proprement
- Configuration générée dynamiquement si besoin
- Routes non mélangées avec la logique des composants

React Router v6+ le permet aussi, mais ce n'est pas la convention par défaut.

---

### Q9 — Redux Toolkit vs Pinia — combien de concepts ?

**Redux Toolkit :** `createSlice` + `configureStore` + `Provider` + `useSelector` + `useDispatch`
+ comprendre les `reducers` + comprendre les `actions` = **7 concepts minimum**.

**Pinia :** `defineStore` + `useTaskStore()` = **2 concepts**.

Le store Pinia expose directement state, getters et actions sans distinction artificielle.
Pinia gagne largement en courbe d'apprentissage.

---

### Q10 — dispatch(addTask(title)) vs store.addTask(title) — lequel est plus intuitif ?

`store.addTask(title)` est clairement plus intuitif — c'est un appel de méthode normal,
comme n'importe quel objet JavaScript. `dispatch(addTask(title))` nécessite de comprendre
le pattern Command/Action et pourquoi on ne peut pas appeler directement la fonction.

**Avantage de Redux que Pinia n'a pas :** les DevTools avec **time-travel debugging** — chaque action
est un objet sérialisable, on peut rejouer, annuler et inspecter chaque changement d'état dans le temps.
Pour les apps complexes avec beaucoup d'états interdépendants, cet avantage est réel.

---

### Q11 — Concepts identiques vs fondamentalement différents

**Identiques (juste le nom change) :**
- Routing : `useParams` ↔ `useRoute`, `useNavigate` ↔ `useRouter`
- Props parent→enfant
- Fetch au montage : `useEffect[]` ↔ `onMounted`
- Lien de navigation : `<Link>` ↔ `<RouterLink>`
- Gestion d'erreurs async

**Fondamentalement différents :**
- Réactivité : immutabilité + setState ↔ Proxy + mutation directe
- Two-way binding : inexistant natif ↔ `v-model`
- Communication enfant→parent : prop fonction ↔ `emit` d'événement
- State management : Redux multi-fichiers/concepts ↔ Pinia minimaliste
- Structure des fichiers : tout en JS ↔ Single File Component 3 sections

---

### Q12 — Vue est-il plus « magique » ? Avantage ou inconvénient ?

Oui, Vue est plus magique : `v-model`, mutations directes via Proxy, `<style scoped>` — tout ça
est de la magie du compilateur.

**Avantage :** productivité et lisibilité, surtout pour des apps de taille moyenne.

**Inconvénient :** quand quelque chose ne marche pas, comprendre pourquoi `ref` nécessite `.value`
dans le script mais pas dans le template, ou déboguer un Proxy peut être difficile. React avec
son immutabilité explicite est plus verbeux mais plus transparent.

---

### Q13 — App e-commerce, 50+ pages, équipe de 10, dashboard admin : React ou Vue ?

**React.**

- Écosystème plus large (plus de librairies, plus de devs disponibles)
- TypeScript plus naturellement intégré dans les fichiers `.tsx`
- Scalabilité prouvée par les grandes entreprises
- Next.js offre SSR/SSG robuste pour l'e-commerce (SEO, performance)
- L'immutabilité forcée réduit les bugs subtils quand 10 développeurs modifient le même état

Vue reste excellent mais son écosystème enterprise est moins mature que React/Next.js.

---

### Q14 — React ou Vue en premier pour un débutant ?

**Vue** en premier.

- `v-model` évite d'expliquer le flux unidirectionnel dès le départ
- Les templates HTML ressemblent à du HTML avec des attributs spéciaux — plus intuitif que JSX
- Pinia est infiniment plus simple que Redux
- La séparation script/template/style aide à comprendre la structure d'un composant

Une fois Vue maîtrisé, passer à React est naturel car les concepts fondamentaux (composants, props,
state, routing) sont les mêmes — seule la syntaxe et la philosophie de réactivité changent.

---

*TP réalisé dans le cadre du cours Développement Front-End — EMSI*
