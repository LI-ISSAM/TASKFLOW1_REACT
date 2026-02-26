Partie 1 — index.html et le <body>
Le <body> contient uniquement <div id="root"></div>. C'est le point d'entrée du CSR (Client-Side Rendering) : React injecte toute l'application dans ce seul div via JavaScript. Le navigateur reçoit une page quasi-vide, et c'est le JS qui construit le DOM côté client.

Partie 2 — Données en dur vs API REST
Les données en dur sont statiques, figées dans le code source : pour les modifier il faut recompiler. Une API REST permet de lire et modifier les données dynamiquement, sans toucher au code front-end. C'est aussi ce qui permet à plusieurs clients (web, mobile…) de partager les mêmes données.

Partie 3.1 — className au lieu de class
class est un mot réservé en JavaScript (pour les classes ES6). Comme JSX est du JavaScript, React utilise className pour éviter le conflit. Le compilateur le transforme en class dans le HTML final.

Partie 3.2 — key={p.id} obligatoire dans .map()
React utilise la key pour identifier chaque élément de liste et optimiser le re-rendu : il sait exactement quel élément a changé, été ajouté ou supprimé. Utiliser l'index comme clé est problématique car si la liste est réordonnée, les index changent sans que les données aient bougé, ce qui peut provoquer des bugs visuels ou d'état (par exemple un champ de saisie qui garde la valeur du mauvais élément).

Partie 4 — Questions sur useEffect et fetch
Q1 — Combien de fois le useEffect s'exécute-t-il ?
Une seule fois, au montage du composant. Le tableau de dépendances vide [] indique à React de ne pas réexécuter l'effet lors des re-renders suivants.
Q2 — Que se passe-t-il si on arrête json-server ?
Le fetch échoue, le bloc catch intercepte l'erreur et la log dans la console. Le finally passe quand même loading à false, donc la page s'affiche mais vide (tableaux vides), sans message d'erreur visible à l'utilisateur (sauf si vous en ajoutez un avec un state error).
Q3 — Onglet Network (F12)
Oui, deux requêtes apparaissent vers localhost:4000/projects et localhost:4000/columns. Si tout va bien, le code HTTP est 200 OK. Si json-server est arrêté, les requêtes échouent avec une erreur réseau (Failed to fetch).
Q4 — Les nouvelles données s'affichent-elles après modification de db.json ?
Oui, après un rechargement de la page React. Le cycle est : modification de db.json → json-server sert les nouvelles données → React recharge la page → useEffect se déclenche → fetch interroge l'API → setProjects/setColumns mettent à jour le state → React re-rend les composants avec les nouvelles props.

Q5 — Flux complet
json-server (db.json)
       ↓  HTTP GET
    fetch()         ← déclenché dans useEffect au montage
       ↓
  setProjects / setColumns   ← mise à jour du state dans App
       ↓
  useState → re-render de App
       ↓
  props transmises aux composants
  (Sidebar, MainContent)
       ↓
  Affichage dans le navigateur
