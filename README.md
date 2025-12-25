# Visionise - Project Management Platform

![React](https://img.shields.io/badge/React-18+-blue?style=flat-square&logo=react)
![Vite](https://img.shields.io/badge/Vite-5+-purple?style=flat-square&logo=vite)
![Node](https://img.shields.io/badge/Node-16+-green?style=flat-square&logo=node.js)
![Status](https://img.shields.io/badge/Status-Active-success?style=flat-square)

## 📋 À Propos du Projet

**Visionise** est une plateforme de gestion de projets moderne et intuitive permettant aux équipes de collaborer efficacement. Elle offre une vue complète des tâches, des membres de l'équipe, et de la progression des projets avec des visualisations avancées (Gantt, Kanban, Scrum).

### Fonctionnalités Clés

✅ **Authentification & Profil Utilisateur**
- Inscription et connexion sécurisées
- Gestion du profil personnel
- Persistance des données avec localStorage

✅ **Gestion des Projets**
- Créer, modifier, supprimer des projets
- Vue détaillée avec titre et description
- Barre de progression globale du projet
- Gestion des membres d'équipe

✅ **Gestion des Tâches**
- Créer et modifier des tâches
- Statuts multiples: Non démarré, En cours, Terminé, Annulé, Signalé
- Barres de progression individuelles
- Menu d'édition rapide avec 3 points (⋯)

✅ **Visualisations Avancées**
- 📊 **Diagramme de Gantt**: Timeline visuelle des tâches
- 🎯 **Tableau Kanban**: Organisation par colonnes de statut
- 🔄 **Vue Scrum**: Gestion des sprints et charges de travail

✅ **Design & Accessibilité**
- 🌙 Mode sombre/clair automatique
- 📱 Design responsive (mobile, tablette, desktop)
- ♿ Support de l'accessibilité (contraste élevé, réduction des animations)
- 🎨 Thème beige/vert élégant avec transitions fluides

---

## 🛠️ Stack Technologique

### Frontend

| Technologie | Version | Utilité |
|---|---|---|
| **React** | 18+ | Framework JavaScript pour l'UI componentisée |
| **React Router DOM** | 6+ | Routage côté client pour la navigation |
| **Context API** | Native | Gestion d'état globale (authentification) |
| **CSS3** | Native | Styling avec variables CSS et dark mode |
| **Vite** | 5+ | Bundler rapide et serveur de développement |
| **JavaScript ES6+** | Modern | Langage de programmation principal |

### Pourquoi Ces Technologies?

#### 🚀 React 18+
- **Composants réutilisables**: Architecture modulaire et maintenable
- **Hooks modernes**: useState, useContext, useEffect pour la logique déclarative
- **Performance**: Rendu efficace avec Virtual DOM
- **Écosystème riche**: Librairies et outils abondants

#### 🔀 React Router DOM 6+
- **Routage dynamique**: Gestion élégante des routes (ex: `/project/:id`)
- **Navigation sans rechargement**: SPA fluide
- **Gestion d'états de route**: useLocation() pour logique conditionnelle

#### 🎯 Context API
- **Pas de dépendance externe**: Redux trop lourd pour ce besoin
- **Parfait pour l'auth**: Gestion simple du statut connecté/déconnecté
- **localStorage**: Persistance automatique de l'état utilisateur
- **Performance suffisante**: Pas de re-render excessif

#### ⚡ Vite
- **Démarrage ultra-rapide**: HMR (Hot Module Replacement) en < 100ms
- **Build optimisé**: Génère du code produit minimal et performant
- **Développement moderne**: ES6 natif sans transpilation complexe
- **Temps de développement réduit**: Feedback immédiat des changements

#### 🎨 CSS3 Vanilla
- **Pas de dépendance CSS**: Réduction du bundle size
- **Variables CSS**: Thématisation facile (dark mode)
- **Flexbox & Grid**: Layout moderne et responsive
- **Transitions fluides**: Animations natives sans librairie

---

## 🏗️ Architecture du Projet

```
Visionise/
├── src/
│   ├── components/
│   │   ├── Header.jsx          # Navigation globale avec dropdown profil
│   │   ├── Header.css          # Styling avec dark mode
│   │   ├── Footer.jsx          # Pied de page
│   │   └── Footer.css
│   │
│   ├── pages/
│   │   ├── Home.jsx            # Page d'accueil avec hero section
│   │   ├── Home.css            # Styling beige/vert avec animations
│   │   ├── SignIn.jsx          # Formulaire de connexion
│   │   ├── SignIn.css
│   │   ├── SignUp.jsx          # Formulaire d'inscription
│   │   ├── SignUp.css
│   │   ├── Profile.jsx         # Tableau de bord utilisateur
│   │   ├── Profile.css         # Styling moderne avec transitions
│   │   ├── EditProfile.jsx     # Édition du profil
│   │   ├── EditProfile.css
│   │   ├── Project.jsx         # Détails d'un projet (Gantt, Kanban, Scrum)
│   │   └── Project.css         # Styling avec effects interactifs
│   │
│   ├── context/
│   │   └── AuthContext.jsx     # Provider d'authentification global
│   │
│   ├── App.jsx                 # Routes principales
│   ├── App.css
│   ├── main.jsx                # Point d'entrée React
│   └── index.css               # Styles globaux
│
├── public/
│   └── assets/
│       └── images/             # Images et icônes
│
├── package.json                # Dépendances et scripts
├── vite.config.js              # Configuration Vite
├── eslint.config.js            # Linting rules
└── README.md                   # Ce fichier
```

---

## 🔐 Gestion de l'État

### Context API - AuthContext

```javascript
{
  isSignedIn: boolean,
  user: {
    firstName: string,
    lastName: string,
    email: string,
    profession: string,
    birthDate: string
  },
  signUp(userData): Promise,
  signIn(email, password): Promise,
  logout(): void
}
```

**Persistance**: localStorage synchronisé automatiquement
**Initialisation**: Charge l'état au démarrage de l'app

---

## 🎨 Design & Styling

### Couleurs

- **Primaire**: #647859 (Vert-beige)
- **Secondaire**: #90a089 (Vert clair)
- **Texte Light**: #333333
- **Texte Dark**: #e0e0e0
- **Arrière-plan Light**: Gradient beige/vert
- **Arrière-plan Dark**: Gradient gris/vert foncé

### Responsive Design

| Breakpoint | Appareil | Padding |
|---|---|---|
| > 1440px | Desktop large | 24px |
| 1024px - 1440px | Desktop | 20px |
| 768px - 1024px | Tablette | 20px |
| 480px - 768px | Téléphone large | 16px |
| < 480px | Téléphone petit | 12px |

### Dark Mode

Activation automatique via `@media (prefers-color-scheme: dark)`
- Variables CSS pour chaque couleur
- Support natif sans JavaScript
- Transition fluide entre les modes

---

## 🚀 Installation & Démarrage

### Prérequis

- **Node.js** v16 ou supérieur
- **npm** ou **yarn**

### Installation

```bash
# Cloner le projet
git clone https://github.com/HARRABIInes/Visionise.git
cd Visionise

# Installer les dépendances
npm install
```

### Démarrage en Développement

```bash
npm run dev
```
- Serveur disponible à `http://localhost:5173`
- HMR activé pour rechargement instantané

### Build Production

```bash
npm run build
```
Génère un dossier `dist/` optimisé pour la production

### Prévisualisation Production

```bash
npm run preview
```

---

## 📊 Cas d'Usage

### 1️⃣ Créer un Projet
1. Se connecter
2. Cliquer sur "Nouveau Projet" sur le dashboard
3. Remplir titre et description
4. Voir immédiatement sur le dashboard

### 2️⃣ Ajouter des Tâches
1. Ouvrir un projet
2. Cliquer "Ajouter une tâche"
3. Définir titre, description, statut
4. La tâche apparaît dans la liste

### 3️⃣ Visualiser le Gantt
1. Dans un projet, cliquer l'onglet "Gantt"
2. Timeline visuelle des tâches
3. Voir les dépendances et progression

### 4️⃣ Gérer les Statuts
1. Cliquer le menu "⋯" d'une tâche
2. "Éditer"
3. Changer le statut dropdown
4. Modifications en temps réel

---

## 🔄 Flux de Données

```
[AuthContext] 
    ↓
User Action (Login/Signup)
    ↓
localStorage + state update
    ↓
Header renders conditional UI
    ↓
Navigate to Profile/Project
    ↓
Load data from state
    ↓
Modals render for add/edit
    ↓
Update state + localStorage
```

---

## 🎯 Fonctionnalités Futures

- [ ] Intégration avec backend API (Node.js/Express)
- [ ] Base de données (MongoDB/PostgreSQL)
- [ ] Notifications en temps réel (WebSocket)
- [ ] Collaboration live entre utilisateurs
- [ ] Export PDF des rapports
- [ ] Intégrations (Slack, Google Calendar, etc.)
- [ ] Analytics et dashboards avancés

---

## 📱 Optimisations

### Performance
- ✅ Code splitting automatique avec Vite
- ✅ Lazy loading des routes
- ✅ CSS variables pour transitions GPU
- ✅ Minification et compression

### Accessibilité
- ✅ Semantic HTML5
- ✅ ARIA labels sur éléments interactifs
- ✅ Focus visible sur tous les boutons
- ✅ Contraste WCAG AA respecté

### Compatibilité Navigateurs
- ✅ Chrome/Edge (Chromium)
- ✅ Firefox
- ✅ Safari (iOS 13+)
- ✅ Fallbacks CSS pour anciennes versions

---

## 📝 License

MIT License - Libre d'utilisation

---

## 👨‍💻 Auteur

**HARRABBI Ines**  
GitHub: [@HARRABIInes](https://github.com/HARRABIInes)

---

## 💬 Support

Pour les questions ou bugs, ouvre une **Issue** sur le repository GitHub.

---

## 🙏 Remerciements

- React team pour l'excellent framework
- Vite pour le bundler ultra-rapide
- Communauté open-source JavaScript
