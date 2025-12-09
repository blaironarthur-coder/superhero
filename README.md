# 🌟 **README — SuperHero Manager**

### *Projet Full-Stack (Node.js + MongoDB + React + TypeScript)*

---

## 📌 **1. Présentation générale**

SuperHero Manager est une application complète permettant de :

* Consulter une base de plus de **560 super-héros** (Marvel, DC, etc.)
* Rechercher, filtrer et trier les personnages
* Visualiser des fiches détaillées (biographie, apparence, statistiques…)
* Administrer les héros (CRUD complet)
* Gérer l’authentification et les rôles utilisateurs

  * **Admin** → modification + suppression + ajout
  * **Editor** → lecture seule

Ce projet combine **un backend Node.js sécurisé** et **un frontend React responsive**, ainsi qu’une base de données **MongoDB**.

---

## 🏗️ **2. Architecture du projet**

```
superhero/
│
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   ├── routes/
│   │   ├── models/
│   │   ├── middleware/
│   │   ├── utils/
│   │   └── index.ts
│   ├── images/  ← images des super-héros
│   ├── SuperHerosComplet.json
│   ├── package.json
│   └── tsconfig.json
│
└── frontend/
    ├── src/
    │   ├── App.tsx
    │   ├── HeroDetails.tsx
    │   ├── Login.tsx
    │   ├── ProtectedRoute.tsx
    │   └── ...
    ├── public/
    ├── package.json
    └── tsconfig.json
```

---

## 🚀 **3. Installation & Lancement**

### 🟦 **Backend**

```bash
cd backend
npm install
```

Créer un fichier **.env** :

```
MONGO_URI=mongodb://localhost:27017/superheroes
JWT_SECRET=SUPER_SECRET_KEY
PORT=4000
```

### ▶️ **Démarrer l'API**

```bash
npm run dev
```

Le serveur démarre sur :
👉 [http://localhost:4000](http://localhost:4000)

### 📥 Importer les super-héros (560+)

```bash
npm run import-heroes
```

---

### 🟩 **Frontend**

```bash
cd ../frontend
npm install
npm start
```

Le frontend démarre sur :
👉 [http://localhost:3000](http://localhost:3000)

---

## 🔐 **4. Authentification & rôles**

### Comptes recommandés

| Rôle   | Username | Password |
| ------ | -------- | -------- |
| Admin  | admin    | admin    |
| Editor | editor   | editor   |

### Gestion des rôles

| Action               | Editor | Admin |
| -------------------- | ------ | ----- |
| Voir la liste        | ✔️     | ✔️    |
| Rechercher / filtrer | ✔️     | ✔️    |
| Voir détails         | ✔️     | ✔️    |
| Modifier un héros    | ❌      | ✔️    |
| Supprimer un héros   | ❌      | ✔️    |
| Ajouter un héros     | ❌      | ✔️    |

---

## 🧭 **5. Liste des routes API**

### 🔐 Auth

| Méthode | Route              | Description                    |
| ------- | ------------------ | ------------------------------ |
| POST    | /api/auth/register | Inscription (admin uniquement) |
| POST    | /api/auth/login    | Connexion + retour du JWT      |
| GET     | /api/auth/me       | Infos utilisateur (protégé)    |

### 🦸 Héros

| Méthode | Route           | Description                 |
| ------- | --------------- | --------------------------- |
| GET     | /api/heroes     | Liste + recherche + filtres |
| GET     | /api/heroes/:id | Détails d’un héros          |
| POST    | /api/heroes     | Ajout (admin)               |
| PUT     | /api/heroes/:id | Modification (admin)        |
| DELETE  | /api/heroes/:id | Suppression (admin)         |

---

## 🗄️ **6. Schéma MongoDB — Collection `heroes`**

```ts
{
  name: String,
  slug: String,
  powerstats: {
    intelligence: Number,
    strength: Number,
    speed: Number,
    durability: Number,
    power: Number,
    combat: Number
  },
  biography: {
    fullName: String,
    alterEgos: String,
    aliases: [String],
    placeOfBirth: String,
    firstAppearance: String,
    publisher: String,
    alignment: String
  },
  appearance: {
    gender: String,
    race: String,
    height: [String],
    weight: [String],
    eyeColor: String,
    hairColor: String
  },
  work: {
    occupation: String,
    base: String
  },
  connections: {
    groupAffiliation: String,
    relatives: String
  },
  images: {
    xs: String,
    sm: String,
    md: String,
    lg: String
  }
}
```


## 🧪 **7. Tests manuels conseillés**

* Connexion réussie / échouée
* Voir les pages en tant qu’éditeur
* Gestion des rôles (admin)
* Recherche par nom
* Filtres (force, intelligence…)
* Pagination (12, 24, 48 par page)
* Upload et affichage d’images
* Ajout / modification / suppression d’un héros

---

## 🚀 **8. Axes d’amélioration**

* Ajout des favoris
* Comparateur de héros
* Système de commentaires ou notes
* Dark mode
* API GraphQL
* Déploiement complet (Render + Vercel)

---

## 📎 **9. Lien GitHub**

`https://github.com/blaironarthur-coder/superhero`

---

## 🏁 **Conclusion**

Le projet SuperHero Manager démontre :

* La maîtrise d’un stack **MERN amélioré (Node + MongoDB + React + TypeScript)**
* Une API REST sécurisée avec **JWT**
* La gestion avancée des rôles utilisateurs
* Un frontend moderne, responsive et structuré
* L’intégration d’une base de données riche (~560 héros)

Je peux tout générer.
