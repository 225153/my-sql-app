# 🎓 Application de Gestion de Formations

Bienvenue dans le projet **Gestion de Formations**. Ce projet est une application full-stack pédagogique permettant de gérer des formations, des formateurs, des participants et des structures d'accueil.

Le code a été soigneusement documenté et commenté de manière éducative tout au long des fichiers pour faciliter la compréhension des différents concepts théoriques et techniques mis en œuvre. C'est le projet idéal pour comprendre les liens entre un backend robuste et un frontend asynchrone moderne.

---

## 🏗️ Architecture du Projet

Ce projet est organisé sous forme de "monorepo" contenant deux parties distinctes :

1. **Backend (`/gestion-formatio`)** : Une API REST développée avec **Spring Boot 3** et **Java**.
2. **Frontend (`/gestion_formation_angular`)** : Une interface utilisateur dynamique développée avec **Angular 21** (Mode Standalone).

---

## 🚀 Technologies Utilisées

### ☕ Backend (Spring Boot)

- **Java 21**
- **Spring Boot 3** (Spring Web, Spring Data JPA)
- **Hibernate** (Moteur ORM standard pour la persistance des données)
- **Maven** (Gestionnaire de dépendances)
- **Architecture 3 Tiers** : Controllers (REST) -> Services (Logique métier) -> Repositories (Accès Base de données)

### 🅰️ Frontend (Angular)

- **Angular 21** (Standalone Components sans NgModule)
- **TypeScript** (Pour un typage strict et sécurisé du code)
- **RxJS** (Gestion des flux de données asynchrones via les Observables HTTP)
- **Bootstrap 5 & Bootstrap Icons** (Design rapide et responsif)
- **SweetAlert2** (Pour de jolies notifications à l'utilisateur)

---

## 🛠️ Instructions d'Installation et de Lancement

### 1. Démarrer le Backend (Spring Boot)

Assurez-vous d'avoir Java (JDK 17 ou supérieur) installé. Vous n'avez pas besoin d'installer Maven, un "wrapper" est inclus.

**Option Rapide (Windows) :** Double-cliquez sur `run-backend.bat` à la racine pour lancer le serveur immédiatement.

**Option Manuelle :**

```bash
cd gestion-formatio
./mvnw spring-boot:run
```

_Le serveur démarrera sur **http://localhost:8080**._

### 2. Démarrer le Frontend (Angular)

Assurez-vous d'avoir [Node.js](https://nodejs.org/) installé sur votre machine.

```bash
cd gestion_formation_angular
npm install
npm start  # ou 'ng serve'
```

_L'application sera accessible depuis votre navigateur à l'adresse **http://localhost:4200**._

---

## 📁 Structure globale des dossiers

```text
gestion_formation/
├── gestion-formatio/              # Le code source du Backend Spring Boot
│   ├── src/main/java...           # Les Entités, Contrôleurs, Services et Repositories
│   ├── src/main/resources/...     # Configuration (application.properties, base de données)
│   └── pom.xml                    # Fichier Maven
│
├── gestion_formation_angular/     # Le code source du Frontend Angular
│   ├── src/app/...                # Composants, Services RxJS et Modèles TypeScript
│   ├── package.json               # Dépendances NPM
│   └── angular.json               # Configuration du projet externe
│
├── .gitignore                     # Ignore les fichiers de l'éditeur de l'espace de travail
└── README.md                      # Documentation principale
```

---

## 📚 Objectif Pédagogique

Ce projet a été construit avec une approche fortement axée sur l'apprentissage. **Chaque fichier, chaque classe, et chaque méthode** (que ce soit côté Java ou côté TypeScript/HTML) a été expressément commenté pour expliquer le _pourquoi_ des choix techniques :

- Explications du rôle des annotations Spring (`@RestController`, `@Entity`, `@Repository`, etc.).
- Fonctionnement du framework Angular (injection de dépendances, cycles de vie, `HttpClient`).
- Flux des données de la base de données jusqu'à l'écran de l'utilisateur final.
