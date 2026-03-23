## Q1 — Lignes de CSS Header MUI
Avec HeaderMUI on écrit **0 lignes de CSS**. Tout le style est dans `sx={{}}`.
Avec `Header.module.css` de la séance 3, on avait environ 15-20 lignes de CSS séparées.

---

## Q2 — Header MUI vs Bootstrap

| Critère | Header MUI | Header Bootstrap |
|---|---|---|
| Nombre de lignes | ~25 lignes | ~18 lignes |
| Lisibilité | Moyenne | Bonne |
| Verbosité | Élevée | Faible |
| Fichier CSS | 0 | 0 |

Bootstrap est plus court et lisible car il utilise des classes CSS connues (`px-3`, `fw-bold`).
MUI est plus verbeux mais plus cohérent dans un projet 100% React.

---

## Q3 — sx={{}} vs className

| Critère | MUI `sx={{}}` | Bootstrap `className` |
|---|---|---|
| Où est le style | Dans le JSX | Dans le JSX via classes |
| Familiarité | Nouveau à apprendre | Connu des devs web |
| Flexibilité | Très élevée | Moyenne |
| Fichier CSS séparé | Non | Non |

**Préférence : Bootstrap** pour projets rapides. **MUI** pour grandes applications.

---

## Q4 — Choix pour production

**Choix : Material UI** car :
- Système de thème centralisé avec `createTheme`
- Composants avancés (DataGrid, DatePicker)
- Meilleure accessibilité intégrée
- Documentation excellente

---

## Q5 — Pourquoi React ne peut pas se connecter à MySQL

React tourne dans le navigateur. Les identifiants MySQL seraient visibles dans les DevTools.
Il faut un **backend Express** comme intermédiaire sécurisé.

---

## Q6 — Pourquoi pas json-server en production

| Raison | Explication |
|---|---|
| **Sécurité** | Données dans `db.json` sans protection |
| **Performance** | Ne gère pas des milliers d'utilisateurs |
| **Fiabilité** | Pas de transactions ni de sauvegarde |

---

## Q7 — Firebase vs MySQL connexion directe

Firebase expose une **API HTTPS sécurisée** avec des `Security Rules` côté serveur.
MySQL nécessite une connexion TCP directe avec des identifiants secrets — impossible à sécuriser côté client.

### Schéma architecture
```
Actuel :
React (5173) ── HTTP ── json-server (4000) ── db.json

Firebase :
React (5173) ── HTTPS ── Firebase API ── Firestore DB

Express + MongoDB :
React (5173) ── HTTP ── Express (4000) ── MongoDB (27017)
```

---

## Q8 — Étapes pour passer en production

| Étape | Action |
|---|---|
| **1. Backend** | Remplacer json-server par Express.js |
| **2. Base de données** | Utiliser PostgreSQL ou MongoDB |
| **3. Mots de passe** | Hasher avec bcrypt |
| **4. Authentification** | Implémenter JWT |
| **5. Sécurité** | Ajouter HTTPS |
| **6. Secrets** | Variables d'environnement |
| **7. Déploiement** | Vercel (front) + Railway (back) |
| **8. Validation** | Validation des données côté serveur |

---

## Q9 — Risques des libraries externes

| Risque | Explication |
|---|---|
| **Bundle lourd** | MUI ajoute ~300kb |
| **Breaking changes** | MUI v4→v5 a tout changé |
| **Abandon** | Failles de sécurité non corrigées |

---

## Q10 — Chat temps réel

| Option | Verdict | Raison |
|---|---|---|
| **json-server** | ❌ | Pas de temps réel |
| **Firebase** | ✅ | `onSnapshot` natif, pas de backend |
| **Backend custom** | ⚠️ | Socket.io possible mais complexe |

**Choix : Firebase** — temps réel natif avec `onSnapshot`, auth intégrée, pas de backend à maintenir.

---

## Tableau comparatif MUI vs Bootstrap

| Critère | Material UI | React-Bootstrap |
|---|---|---|
| **Installation** | 4 packages | 2 packages |
| **Composants utilisés** | AppBar, Toolbar, Typography, TextField... | Navbar, Form, Card, Button... |
| **Lignes de CSS écrites** | 0 | 0 |
| **Système de style** | `sx={{}}` + `createTheme` | `className` + `style={{}}` |
| **Personnalisation couleurs** | `sx={{ bgcolor }}` ou thème | `style={{}}` ou CSS |
| **Responsive** | Grid + breakpoints MUI | Grille Bootstrap |
| **Lisibilité** | Moyenne | Bonne |
| **Documentation** | Excellente | Bonne |
| **Taille bundle** | ~300kb | ~90kb |
| **Courbe apprentissage** | Élevée | Faible |
| **Composants avancés** | DataGrid, DatePicker... | Peu |
| **Thème global** | Oui `createTheme` | Non |
| **Préférence** | Grandes applications | Projets rapides |
