# Mnemosyne — Your Content, Your Flow

Agrégateur RSS full-stack moderne permettant de centraliser et consommer ses sources d'information au sein d'une interface unifiée et sans distraction. Construit avec **Next.js 16**, **React 19**, **Tailwind CSS 4** et **NextAuth v5**.

## Fonctionnalités

| Fonctionnalité | État | Description |
|---|---|---|
| Authentification | ✅ | Connexion email/mot de passe & OAuth Google |
| Gestion de flux RSS | 🚧 | Ajout, suppression, rafraîchissement de flux RSS/Atom |
| Feed d'articles | 🚧 | Agrégation paginée, filtres, recherche full-text |
| Favoris & Collections | 🚧 | Marquer des articles, organiser en collections |
| Tags & Catégories | 🚧 | Classement par thème et couleur |
| Résumé IA | 🚧 | Résumé automatique via Claude API (Anthropic) |
| Alertes mots-clés | 📋 | Notifications par email sur termes spécifiques |
| Digest email | 📋 | Résumé quotidien/hebdomadaire via Resend |
| Import/Export OPML | 📋 | Interopérabilité avec Feedly, Inoreader… |

> Voir [Features.md](Features.md) pour la documentation technique complète.

## Stack technique

- **Framework** — Next.js 16 (App Router)
- **UI** — React 19, Tailwind CSS 4, Radix UI, shadcn/ui, Lucide Icons
- **Auth** — NextAuth v5 (Google OAuth + Credentials)
- **Validation** — Zod, Yup, React Hook Form
- **State** — TanStack React Query
- **i18n** — next-intl
- **Base de données** — PostgreSQL (via Docker)
- **ORM** — Prisma (prévu)
- **Conteneurisation** — Docker & Docker Compose

## Prérequis

- [Node.js](https://nodejs.org/) ≥ 20
- [Docker](https://www.docker.com/) & Docker Compose
- Un compte Google Cloud pour les identifiants OAuth (optionnel)

## Installation

```bash
# Cloner le dépôt
git clone <repo-url> && cd mnemosyne

# Installer les dépendances
npm install
```

### Variables d'environnement

Créer un fichier `.env.local` à la racine :

```env
AUTH_SECRET=<votre-secret>
AUTH_GOOGLE_ID=<google-client-id>
AUTH_GOOGLE_SECRET=<google-client-secret>
AUTH_DEMO_EMAIL=<email-demo>
AUTH_DEMO_PASSWORD=<mot-de-passe-demo>
AUTH_TRUST_HOST=true
AUTH_URL=http://localhost:3000
```

## Lancement

### Développement local

```bash
npm run dev
```

L'application est accessible sur [http://localhost:3000](http://localhost:3000).

### Via Docker

```bash
docker compose up
```

Cela démarre :
- **app** — l'application Next.js sur le port `3000`
- **db** — PostgreSQL sur le port `5432`
- **adminer** — interface d'administration DB sur le port `8080`

## Structure du projet

```
├── app/                  # App Router (pages, layouts, API routes)
│   ├── api/auth/         # Route handler NextAuth
│   ├── auth/             # Page d'authentification
│   └── globals.css       # Styles globaux
├── components/           # Composants React
│   ├── auth/             # Formulaires & OAuth
│   ├── home/             # Page d'accueil
│   └── ui/               # Composants UI (shadcn)
├── lib/                  # Utilitaires & validateurs
├── auth.ts               # Configuration NextAuth
├── routes.ts             # Définition des routes
├── proxy.ts              # Proxy configuration
├── docker-compose.yml    # Orchestration Docker
└── dockerfile            # Image Docker (Node 24 Alpine)
```

## Scripts

| Commande | Description |
|---|---|
| `npm run dev` | Serveur de développement |
| `npm run build` | Build de production |
| `npm run start` | Serveur de production |
| `npm run lint` | Linting ESLint |

## Licence

Projet privé.
