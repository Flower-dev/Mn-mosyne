# 📰 RSS Aggregator — Documentation Technique Complète


## Table des Matières

1. [Présentation du Projet](#1-présentation-du-projet)
2. [Architecture Technique](#2-architecture-technique)
3. [Base de Données — Schéma Prisma](#3-base-de-données--schéma-prisma)
4. [API Routes](#4-api-routes)
5. [Authentification — NextAuth.js](#5-authentification--nextauthjs)
6. [Services Métier](#6-services-métier)
7. [Structure du Projet](#7-structure-du-projet)
8. [Variables d'Environnement](#8-variables-denvironnement)
9. [Déploiement](#9-déploiement)
10. [Sécurité & Bonnes Pratiques](#10-sécurité--bonnes-pratiques)
11. [Plan de Développement](#11-plan-de-développement)
12. [Dépendances npm](#12-dépendances-npm)
13. [Glossaire](#13-glossaire)

---

## 1. Présentation du Projet

### 1.1 Vision

RSS Aggregator est une application web full-stack permettant à chaque utilisateur de centraliser et consommer ses sources d'information préférées au sein d'une interface unifiée. L'objectif est de proposer une expérience de lecture personnalisée, enrichie par l'IA, avec des fonctionnalités sociales légères.

### 1.2 Fonctionnalités

| # | Feature | Priorité | Description |
|---|---------|----------|-------------|
| F-01 | Authentification | 🔴 Critique | Inscription, login email/password, OAuth Google/GitHub |
| F-02 | Gestion flux RSS | 🔴 Critique | Ajout, suppression, rafraîchissement de flux RSS/Atom |
| F-03 | Feed d'articles | 🔴 Critique | Agrégation paginée, filtres, recherche full-text |
| F-04 | Favoris | 🟠 Haute | Marquer des articles, organiser en collections |
| F-05 | Tags & Catégories | 🟠 Haute | Classer ses flux par thème et couleur |
| F-06 | Marquer comme lu | 🟠 Haute | Suivi de progression par article |
| F-07 | Résumé IA | 🟠 Haute | Résumé automatique via Claude API (Anthropic) |
| F-08 | Alertes mots-clés | 🟡 Moyenne | Notification email sur termes spécifiques |
| F-09 | Digest email | 🟡 Moyenne | Résumé quotidien/hebdomadaire par email (Resend) |
| F-10 | Collections publiques | 🟡 Moyenne | Partager une sélection de favoris via URL slug |
| F-11 | Import/Export OPML | 🟡 Moyenne | Interopérabilité avec Feedly, Inoreader… |
| F-12 | Analytics personnels | 🟢 Basse | Stats lectures, flux actifs, habitudes |
| F-13 | Mode hors-ligne PWA | 🟢 Basse | Cache des derniers articles via Service Worker |

---

## 2. Architecture Technique

### 2.1 Schéma d'Architecture Globale

```
┌─────────────────────────────────────────────────────────────────┐
│                  FRONTEND — Next.js 14 App Router               │
│                                                                 │
│  ┌──────────┐ ┌──────────┐ ┌────────────┐ ┌──────────────────┐  │
│  │  /feed   │ │  /feeds  │ │ /favorites │ │    /analytics    │  │
│  │ Articles │ │ Flux RSS │ │  Favoris   │ │      Stats       │  │
│  └──────────┘ └──────────┘ └────────────┘ └──────────────────┘  │
│  ┌──────────────────────┐  ┌────────────────────────────────┐   │
│  │       /alerts        │  │           /settings            │   │
│  │   Alertes mots-clés  │  │     Profil, digest, thème      │   │
│  └──────────────────────┘  └────────────────────────────────┘   │
└─────────────────────────────────┬───────────────────────────────┘
                                  │ API Routes / Server Components
                                  ▼
┌─────────────────────────────────────────────────────────────────┐
│               BACKEND — Services & Route Handlers               │
│                                                                 │
│  ┌────────────┐ ┌────────────┐ ┌──────────┐ ┌───────────────┐   │
│  │ RSS Parser │ │ Claude AI  │ │  Resend  │ │  FTS Postgres │   │
│  │ rss-parser │ │  Résumés   │ │  Emails  │ │   tsvector    │   │
│  └────────────┘ └────────────┘ └──────────┘ └───────────────┘   │
│  ┌────────────────────────┐  ┌──────────────────────────────┐   │
│  │     Readability        │  │      Vercel Cron Jobs        │   │
│  │  Extraction contenu    │  │   Refresh RSS · Digest       │   │
│  └────────────────────────┘  └──────────────────────────────┘   │
└─────────────────────────────────┬───────────────────────────────┘
                                  │ Prisma ORM
                                  ▼
┌─────────────────────────────────────────────────────────────────┐
│                        INFRASTRUCTURE                           │
│                                                                 │
│  ┌────────────────┐ ┌──────────────┐ ┌───────┐ ┌───────────┐    │
│  │   PostgreSQL   │ │    Redis     │ │Vercel │ │  R2 / S3  │    │
│  │  Neon/Supabase │ │   Upstash    │ │Hosting│ │  Storage  │    │
│  └────────────────┘ └──────────────┘ └───────┘ └───────────┘    │
└─────────────────────────────────────────────────────────────────┘

         ▲                                    ▲
         │ RSS/Atom XML                       │ OAuth
┌────────┴────────┐                  ┌────────┴────────┐
│  Sources RSS    │                  │  Google / GitHub│
│ Blogs · News    │                  │    OAuth 2.0    │
└─────────────────┘                  └─────────────────┘
```

### 2.2 Couches Applicatives

#### Frontend — Pages Next.js

| Route | Description | Composants clés |
|-------|-------------|-----------------|
| `/feed` | Feed principal agrégé | ArticleCard, SearchBar, FeedFilter, ReadToggle |
| `/feeds` | Gestion des flux RSS | FeedList, AddFeedModal, TagPicker, OPMLButtons |
| `/favorites` | Favoris et collections | FavoriteList, CollectionCard, ShareButton |
| `/analytics` | Dashboard statistiques | ReadingChart, TopFeeds, HeatMap |
| `/alerts` | Alertes mots-clés | KeywordList, AlertToggle |
| `/settings` | Profil et préférences | DigestPrefs, ThemeToggle, AccountSection |

#### Services Backend

| Service | Rôle | Technologie |
|---------|------|-------------|
| RSS Parser | Fetch et normalisation des flux XML/Atom | `rss-parser` (npm) |
| Cron Job | Rafraîchissement automatique des flux | Vercel Cron + QStash |
| AI Summary | Résumé et extraction de mots-clés | Claude API (`claude-sonnet-4`) |
| Email | Digest + alertes notifications | Resend |
| Full-Text Search | Recherche dans les articles | PostgreSQL `tsvector` + GIN |
| Readability | Extraction du contenu propre | `@mozilla/readability` |
| Cache | Performance et rate limiting | Upstash Redis |

#### Infrastructure

| Composant | Service recommandé | Alternative |
|-----------|--------------------|-------------|
| Hosting | Vercel | Railway, Render |
| Base de données | Neon (PostgreSQL serverless) | Supabase |
| Cache / Redis | Upstash | Redis Cloud |
| Email | Resend | SendGrid, Postmark |
| Stockage fichiers | Cloudflare R2 | AWS S3 |

---

## 3. Base de Données — Schéma Prisma

### 3.1 Schéma Visuel des Tables

```
┌──────────────────────┐         ┌──────────────────────┐
│         User         │         │       Account        │
│──────────────────────│         │──────────────────────│
│ 🔑 id        cuid    │◄────────│ 🔑 id        cuid    |
│    name      String? │  1..N   │ 🔗 userId    FK→User │
│    email     UNIQUE  │         │    provider  String  │
│    password  String? │         │    providerAccountId │
│    theme     Enum    │         └──────────────────────┘
│    digestFreq Enum   │
│    createdAt DateTime│
└──────────┬───────────┘
           │ 1
           │
     ┌─────┴──────┬────────────────────┬──────────────────┐
     │ N          │ N                  │ N                │ N
     ▼            ▼                    ▼                  ▼
┌──────────┐ ┌──────────┐       ┌──────────┐      ┌──────────────┐
│   Feed   │ │   Tag    │       │ Favorite │      │   Keyword    │
│──────────│ │──────────│       │──────────│      │──────────────│
│🔑 id     │ │🔑 id     │       │🔑 id     │      │🔑 id         │
│🔗 userId │ │🔗 userId │       │🔗 userId │      │🔗 userId     │
│   url    │ │   name   │       │🔗 articleId     │   term       │
│   title  │ │   color  │       │🔗 collectionId? │   notifyEmail│
│  isPublic│ └────┬─────┘       │  createdAt      └──────────────┘
│lastFetched     │              └────┬─────┘
└────┬─────┘     │                   │ N
     │ 1         │ N                 │
     │      ┌────▼──────┐            ▼
     │      │  FeedTag  │     ┌─────────────┐
     │      │───────────│     │  Collection │
     │      │🔗 feedId  │     │─────────────│
     │      │🔗 tagId   │     │🔑 id        │
     │      │@@unique   │     │🔗 userId    │
     │      └───────────┘     │   name      │
     │ N         ▲            │  isPublic   │
     ▼           │            │  shareSlug  │
┌───────────┐    │            └─────────────┘
│  Article  │    │ N (FeedTag)
│───────────│
│🔑 id      │
│🔗 feedId  │
│   title   │
│   url UNIQUE
│  aiSummary│
│ publishedAt
└─────┬─────┘
      │ 1
  ┌───┴──────────────────────┐
  │ N                        │ N
  ▼                          ▼
┌─────────────┐        ┌─────────────┐
│  ReadStatus │        │  (Favorite) │
│─────────────│        │  (see above)│
│🔑 id        │        └─────────────┘
│🔗 userId    │
│🔗 articleId │
│@@unique     │
└─────────────┘
```

### 3.2 Vue d'Ensemble des Relations

| Table | Rôle | Relations principales |
|-------|------|-----------------------|
| `User` | Compte utilisateur | → Feed, Account, Favorite, Tag, Keyword, ReadStatus |
| `Account` | Comptes OAuth (NextAuth) | → User (N:1) |
| `Feed` | Flux RSS de l'utilisateur | → User (N:1), Article (1:N), FeedTag (1:N) |
| `Article` | Article parsé d'un flux | → Feed (N:1), Favorite (1:N), ReadStatus (1:N) |
| `Favorite` | Article favori | → User, Article, Collection (optionnel) |
| `Collection` | Groupe de favoris partageable | → User (N:1), Favorite (1:N) |
| `Tag` | Étiquette pour classer les flux | → User (N:1), FeedTag (1:N) |
| `FeedTag` | Jointure Feed ↔ Tag | `@@unique([feedId, tagId])` |
| `ReadStatus` | Marquage lu/non-lu | `@@unique([userId, articleId])` |
| `Keyword` | Alerte mot-clé | → User (N:1) |

### 3.3 Modèles Prisma Complets

```prisma
// prisma/schema.prisma

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

// ─── Enums ────────────────────────────────────────────────────────
enum Theme      { LIGHT DARK SYSTEM }
enum DigestFreq { DAILY WEEKLY NONE }

// ─── User ─────────────────────────────────────────────────────────
model User {
  id            String     @id @default(cuid())
  name          String?
  email         String     @unique
  emailVerified DateTime?
  password      String?    // hash bcrypt
  image         String?
  theme         Theme      @default(SYSTEM)
  digestFreq    DigestFreq @default(NONE)
  createdAt     DateTime   @default(now())

  feeds        Feed[]
  accounts     Account[]
  favorites    Favorite[]
  tags         Tag[]
  keywords     Keyword[]
  readStatuses ReadStatus[]
  collections  Collection[]
}

// ─── Account (NextAuth OAuth) ─────────────────────────────────────
model Account {
  id                String  @id @default(cuid())
  userId            String
  type              String
  provider          String
  providerAccountId String
  access_token      String? @db.Text
  refresh_token     String? @db.Text
  expires_at        Int?
  token_type        String?
  scope             String?
  id_token          String? @db.Text

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([provider, providerAccountId])
}

// ─── Feed ─────────────────────────────────────────────────────────
model Feed {
  id            String    @id @default(cuid())
  userId        String
  url           String
  title         String?
  description   String?
  faviconUrl    String?
  isPublic      Boolean   @default(false)
  lastFetchedAt DateTime?
  createdAt     DateTime  @default(now())

  user     User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  articles Article[]
  feedTags FeedTag[]
}

// ─── Article ──────────────────────────────────────────────────────
model Article {
  id          String    @id @default(cuid())
  feedId      String
  title       String
  url         String    @unique
  summary     String?   @db.Text
  aiSummary   String?   @db.Text
  content     String?   @db.Text
  imageUrl    String?
  author      String?
  publishedAt DateTime?
  fetchedAt   DateTime  @default(now())

  feed         Feed         @relation(fields: [feedId], references: [id], onDelete: Cascade)
  favorites    Favorite[]
  readStatuses ReadStatus[]

  @@index([feedId])
  @@index([publishedAt])
}

// ─── Favorite ─────────────────────────────────────────────────────
model Favorite {
  id           String      @id @default(cuid())
  userId       String
  articleId    String
  collectionId String?
  createdAt    DateTime    @default(now())

  user       User        @relation(fields: [userId], references: [id])
  article    Article     @relation(fields: [articleId], references: [id])
  collection Collection? @relation(fields: [collectionId], references: [id])

  @@unique([userId, articleId])
}

// ─── Collection ───────────────────────────────────────────────────
model Collection {
  id          String    @id @default(cuid())
  userId      String
  name        String
  description String?
  isPublic    Boolean   @default(false)
  shareSlug   String?   @unique
  createdAt   DateTime  @default(now())

  user      User       @relation(fields: [userId], references: [id])
  favorites Favorite[]
}

// ─── Tag ──────────────────────────────────────────────────────────
model Tag {
  id       String    @id @default(cuid())
  userId   String
  name     String
  color    String?

  user     User      @relation(fields: [userId], references: [id])
  feedTags FeedTag[]

  @@unique([userId, name])
}

// ─── FeedTag (jointure Feed ↔ Tag) ────────────────────────────────
model FeedTag {
  id     String @id @default(cuid())
  feedId String
  tagId  String

  feed Feed @relation(fields: [feedId], references: [id], onDelete: Cascade)
  tag  Tag  @relation(fields: [tagId], references: [id], onDelete: Cascade)

  @@unique([feedId, tagId])
}

// ─── ReadStatus ───────────────────────────────────────────────────
model ReadStatus {
  id        String   @id @default(cuid())
  userId    String
  articleId String
  readAt    DateTime @default(now())

  user    User    @relation(fields: [userId], references: [id])
  article Article @relation(fields: [articleId], references: [id])

  @@unique([userId, articleId])
}

// ─── Keyword (alertes) ────────────────────────────────────────────
model Keyword {
  id          String   @id @default(cuid())
  userId      String
  term        String
  notifyEmail Boolean  @default(true)
  createdAt   DateTime @default(now())

  user User @relation(fields: [userId], references: [id])
}
```

---

## 4. API Routes

### 4.1 Schéma des Endpoints

```
                        /api/*
                           │
          ┌────────────────┼─────────────────────┐
          │                │                     │
          ▼                ▼                     ▼
    ┌──────────┐    ┌──────────────┐     ┌──────────────-┐
    │   AUTH   │    │    FEEDS     │     │   ARTICLES    │
    │──────────│    │──────────────│     │──────────────-│
    │ POST     │    │ GET   /feeds │     │ GET  /articles│
    │ register │    │ POST  /feeds │     │ GET  /search  │
    │──────────│    │ DEL   /[id]  │     │POST /ai-sum   │
    │ ALL      │    │ POST  refresh│     └──────────────-┘
    │ nextauth │    │ GET   discover
    └──────────┘    │ POST  import │
                    │ GET   export │
          ┌─────────┴──────────────┴──────────────────┐
          │                                            │
          ▼                  ▼              ▼          ▼
    ┌──────────┐    ┌──────────────┐ ┌──────────┐ ┌────────┐
    │FAVORITES │    │ COLLECTIONS  │ │   TAGS   │ │  READ  │
    │──────────│    │──────────────│ │──────────│ │────────│
    │ GET      │    │ GET / POST   │ │ GET/POST │ │ POST   │
    │ POST     │    │ PATCH / DEL  │ │ DELETE   │ │ DELETE │
    │ DELETE   │    │ share/[slug] │ │ /[id]/   │ │ /all   │
    └──────────┘    └──────────────┘ │ feeds    │ └────────┘
                                     └──────────┘
          ┌──────────────────────────────────────────┐
          │                │                         │
          ▼                ▼                         ▼
    ┌──────────┐   ┌─────────────────┐     ┌──────────────┐
    │ KEYWORDS │   │   ANALYTICS     │     │    DIGEST    │
    │──────────│   │─────────────────│     │──────────────│
    │ GET      │   │ GET /reading    │     │ POST /send   │
    │ POST     │   │ GET /feeds      │     │ PATCH /user/ │
    │ DELETE   │   │ GET /keywords   │     │ preferences  │
    └──────────┘   └─────────────────┘     └──────────────┘
```

### 4.2 Conventions

- Toutes les routes utilisent les Next.js **Route Handlers** (`app/api/*/route.ts`)
- Authentification vérifiée via `getServerSession(authOptions)` côté serveur
- Validation des inputs via **Zod** sur tous les endpoints POST/PATCH/PUT
- Réponses JSON normalisées : `{ data, error, meta }`
- Codes HTTP standards : 200, 201, 400, 401, 403, 404, 500

### 4.3 Référence Complète

| Méthode | Route | Auth | Description |
|---------|-------|------|-------------|
| `POST` | `/api/auth/register` | Non | Créer un compte (email + password) |
| `ALL` | `/api/auth/[...nextauth]` | Non | NextAuth — login, logout, OAuth |
| `GET` | `/api/feeds` | ✅ | Flux de l'utilisateur avec stats |
| `POST` | `/api/feeds` | ✅ | Ajouter un flux RSS (url requis) |
| `DELETE` | `/api/feeds/[id]` | ✅ | Supprimer un flux et ses articles |
| `POST` | `/api/feeds/[id]/refresh` | ✅ | Rafraîchir manuellement |
| `GET` | `/api/feeds/discover` | ✅ | Suggestions de flux par catégorie |
| `POST` | `/api/feeds/import` | ✅ | Import d'un fichier OPML |
| `GET` | `/api/feeds/export` | ✅ | Export OPML de tous les flux |
| `GET` | `/api/articles` | ✅ | Feed paginé (page, limit, feedId, tag, unread) |
| `GET` | `/api/articles/[id]` | ✅ | Détail + contenu Readability |
| `GET` | `/api/articles/search` | ✅ | Recherche full-text PostgreSQL (param: `q`) |
| `POST` | `/api/articles/[id]/ai-summary` | ✅ | Générer résumé IA via Claude API |
| `GET` | `/api/favorites` | ✅ | Lister les favoris |
| `POST` | `/api/favorites` | ✅ | Ajouter aux favoris |
| `DELETE` | `/api/favorites/[articleId]` | ✅ | Retirer des favoris |
| `POST` | `/api/read/[articleId]` | ✅ | Marquer comme lu |
| `DELETE` | `/api/read/[articleId]` | ✅ | Marquer comme non-lu |
| `POST` | `/api/read/all` | ✅ | Tout marquer comme lu |
| `GET/POST` | `/api/collections` | ✅ | Lister / créer une collection |
| `PATCH/DELETE` | `/api/collections/[id]` | ✅ | Modifier / supprimer |
| `GET` | `/api/collections/share/[slug]` | Non | Collection publique partagée |
| `GET/POST/DELETE` | `/api/tags` | ✅ | CRUD tags |
| `POST` | `/api/tags/[id]/feeds` | ✅ | Attacher un flux à un tag |
| `GET/POST/DELETE` | `/api/keywords` | ✅ | CRUD alertes mots-clés |
| `GET` | `/api/analytics/reading` | ✅ | Articles lus par période |
| `GET` | `/api/analytics/feeds` | ✅ | Flux les plus actifs |
| `POST` | `/api/digest/send` | Cron | Déclencher digest (appelé par cron) |
| `PATCH` | `/api/user/preferences` | ✅ | Thème, fréquence digest |

---

## 5. Authentification — NextAuth.js

### 5.1 Schéma du Flux d'Authentification

```
INSCRIPTION                              CONNEXION (Credentials)
─────────────────────────────────        ──────────────────────────────────
1. POST /api/auth/register               1. POST /api/auth/callback/credentials
         │                                        │
         ▼                                        ▼
2. Validation Zod                        2. authorize() callback
   email format                             prisma.user.findUnique
   password >= 8 chars                      par email
         │                                        │
         ▼                                        ▼
3. prisma.user.findUnique                3. bcrypt.compare(password, hash)
   vérifier unicité email                         │
         │                                   ┌────┴─────┐
         ▼                                   │          │
4. bcrypt.hash(password, 12)              match?     no match
         │                                   │          │
         ▼                                   ▼          ▼
5. prisma.user.create()               4. return User  return null
         │                                   │          │
         ▼                                   ▼          ▼
6. signIn() — auto login             5. JWT signé   401 Unauthorized
         │                               cookie
         ▼                               httpOnly
   Redirect /feed                             │
                                              ▼
                                     6. useSession() client
                                        → accès session

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🛡  Middleware: matcher → routes protégées · getServerSession() API
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### 5.2 Configuration NextAuth

```typescript
// app/api/auth/[...nextauth]/route.ts
import NextAuth from 'next-auth'
import { PrismaAdapter } from '@auth/prisma-adapter'
import CredentialsProvider from 'next-auth/providers/credentials'
import GoogleProvider from 'next-auth/providers/google'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/prisma'

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: { strategy: 'jwt' },
  pages: {
    signIn: '/auth/login',
    error: '/auth/error',
  },
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null
        const user = await prisma.user.findUnique({
          where: { email: credentials.email as string },
        })
        if (!user || !user.password) return null
        const isValid = await bcrypt.compare(
          credentials.password as string,
          user.password
        )
        if (!isValid) return null
        return user
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    jwt({ token, user }) {
      if (user) token.id = user.id
      return token
    },
    session({ session, token }) {
      if (token) session.user.id = token.id as string
      return session
    },
  },
})
```

### 5.3 Protection des Routes (middleware.ts)

```typescript
// middleware.ts
export { auth as middleware } from '@/auth'

export const config = {
  matcher: [
    '/feed',
    '/feeds',
    '/favorites',
    '/analytics',
    '/alerts',
    '/settings',
    '/api/((?!auth|collections/share).*)',
  ],
}
```

> ⚠️ Toutes les routes `/api/*` (hors `/api/auth/*` et `/api/collections/share/*`) sont automatiquement protégées par le middleware.

### 5.4 Inscription (route handler)

```typescript
// app/api/auth/register/route.ts
import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'

const schema = z.object({
  name: z.string().min(2).max(50).optional(),
  email: z.string().email(),
  password: z.string().min(8).max(100),
})

export async function POST(req: NextRequest) {
  const body = await req.json()
  const parsed = schema.safeParse(body)

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
  }

  const { name, email, password } = parsed.data

  const existing = await prisma.user.findUnique({ where: { email } })
  if (existing) {
    return NextResponse.json({ error: 'Email déjà utilisé' }, { status: 409 })
  }

  const hashed = await bcrypt.hash(password, 12)
  const user = await prisma.user.create({
    data: { name, email, password: hashed },
  })

  return NextResponse.json({ data: { id: user.id } }, { status: 201 })
}
```

---

## 6. Services Métier

### 6.1 RSS Parser Service

```typescript
// lib/rss/parser.ts
import Parser from 'rss-parser'
import { prisma } from '@/lib/prisma'
import type { Feed } from '@prisma/client'

const parser = new Parser({
  timeout: 10000,
  headers: { 'User-Agent': 'RSSAggregator/1.0' },
})

export async function fetchAndStoreFeed(feed: Feed) {
  const parsed = await parser.parseURL(feed.url)

  const articles = parsed.items
    .filter(item => item.link)
    .map(item => ({
      feedId: feed.id,
      title: item.title ?? 'Sans titre',
      url: item.link!,
      summary: item.contentSnippet ?? null,
      content: item.content ?? null,
      author: item.creator ?? null,
      imageUrl: item.enclosure?.url ?? null,
      publishedAt: item.pubDate ? new Date(item.pubDate) : null,
    }))

  // Upsert pour éviter les doublons (url unique)
  await prisma.article.createMany({
    data: articles,
    skipDuplicates: true,
  })

  await prisma.feed.update({
    where: { id: feed.id },
    data: {
      title: parsed.title ?? feed.title,
      lastFetchedAt: new Date(),
    },
  })

  return articles.length
}

export async function refreshAllFeeds(userId: string) {
  const feeds = await prisma.feed.findMany({ where: { userId } })
  const results = await Promise.allSettled(feeds.map(fetchAndStoreFeed))
  return results
}
```

### 6.2 Service IA — Claude API

```typescript
// lib/ai/summarize.ts
import Anthropic from '@anthropic-ai/sdk'
import { prisma } from '@/lib/prisma'

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

export async function summarizeArticle(articleId: string): Promise<string> {
  const article = await prisma.article.findUniqueOrThrow({
    where: { id: articleId },
  })

  // Retourner le cache si déjà généré
  if (article.aiSummary) return article.aiSummary

  const content = article.content ?? article.summary ?? article.title

  const msg = await client.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 300,
    messages: [
      {
        role: 'user',
        content: `Résume cet article en 3 phrases claires, neutres et informatives.\n\nTitre: ${article.title}\n\n${content}`,
      },
    ],
  })

  const summary = msg.content[0].type === 'text' ? msg.content[0].text : ''

  // Mettre en cache en base
  await prisma.article.update({
    where: { id: articleId },
    data: { aiSummary: summary },
  })

  return summary
}
```

### 6.3 Service Email — Digest

```typescript
// lib/email/digest.ts
import { Resend } from 'resend'
import { prisma } from '@/lib/prisma'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function sendDigestToUser(userId: string) {
  const user = await prisma.user.findUniqueOrThrow({ where: { id: userId } })

  // Articles non lus des 24h ou 7 jours selon préférence
  const since = user.digestFreq === 'DAILY'
    ? new Date(Date.now() - 24 * 60 * 60 * 1000)
    : new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)

  const articles = await prisma.article.findMany({
    where: {
      feed: { userId },
      publishedAt: { gte: since },
      readStatuses: { none: { userId } },
    },
    orderBy: { publishedAt: 'desc' },
    take: 15,
    include: { feed: true },
  })

  if (articles.length === 0) return

  await resend.emails.send({
    from: 'digest@rss-aggregator.com',
    to: user.email,
    subject: `📰 Votre digest du ${new Date().toLocaleDateString('fr-FR')}`,
    react: DigestEmailTemplate({ user, articles }),
  })
}

export async function sendAllDigests() {
  const users = await prisma.user.findMany({
    where: { digestFreq: { not: 'NONE' } },
  })
  await Promise.allSettled(users.map(u => sendDigestToUser(u.id)))
}
```

### 6.4 Recherche Full-Text (PostgreSQL)

```sql
-- Migration Prisma (SQL brut via migration manuelle)
-- prisma/migrations/XXXX_add_fts/migration.sql

ALTER TABLE "Article"
  ADD COLUMN IF NOT EXISTS search_vector tsvector
  GENERATED ALWAYS AS (
    to_tsvector(
      'french',
      coalesce(title, '') || ' ' || coalesce(summary, '') || ' ' || coalesce(author, '')
    )
  ) STORED;

CREATE INDEX IF NOT EXISTS article_search_idx
  ON "Article" USING GIN(search_vector);
```

```typescript
// app/api/articles/search/route.ts
import { prisma } from '@/lib/prisma'
import { auth } from '@/auth'

export async function GET(req: Request) {
  const session = await auth()
  const { searchParams } = new URL(req.url)
  const q = searchParams.get('q')?.trim()

  if (!q || q.length < 2) {
    return Response.json({ error: 'Requête trop courte' }, { status: 400 })
  }

  const articles = await prisma.$queryRaw`
    SELECT a.*, f.title as "feedTitle"
    FROM "Article" a
    JOIN "Feed" f ON a."feedId" = f.id
    WHERE f."userId" = ${session!.user.id}
      AND a.search_vector @@ plainto_tsquery('french', ${q})
    ORDER BY ts_rank(a.search_vector, plainto_tsquery('french', ${q})) DESC
    LIMIT 20
  `

  return Response.json({ data: articles })
}
```

### 6.5 Mode Lecture — Readability

```typescript
// lib/readability.ts
import { Readability } from '@mozilla/readability'
import { JSDOM } from 'jsdom'

export async function extractReadableContent(url: string) {
  const response = await fetch(url, {
    headers: { 'User-Agent': 'RSSAggregator/1.0' },
  })
  const html = await response.text()

  const dom = new JSDOM(html, { url })
  const reader = new Readability(dom.window.document)
  const article = reader.parse()

  return {
    title: article?.title ?? '',
    content: article?.content ?? '',
    textContent: article?.textContent ?? '',
    excerpt: article?.excerpt ?? '',
    byline: article?.byline ?? '',
    readingTime: Math.ceil((article?.textContent?.split(' ').length ?? 0) / 200),
  }
}
```

### 6.6 Cron Jobs — Vercel

```typescript
// app/api/feeds/cron-refresh/route.ts
import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { fetchAndStoreFeed } from '@/lib/rss/parser'
import { checkKeywordAlerts } from '@/lib/alerts'

export async function POST(req: NextRequest) {
  // Vérifier le secret Vercel Cron
  const authHeader = req.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Récupérer les flux à rafraîchir (dernière MAJ > 2h)
  const feeds = await prisma.feed.findMany({
    where: {
      OR: [
        { lastFetchedAt: null },
        { lastFetchedAt: { lt: new Date(Date.now() - 2 * 60 * 60 * 1000) } },
      ],
    },
    take: 50, // Traiter par batch
  })

  const results = await Promise.allSettled(feeds.map(fetchAndStoreFeed))

  // Vérifier les alertes mots-clés
  await checkKeywordAlerts()

  const success = results.filter(r => r.status === 'fulfilled').length
  return Response.json({ refreshed: success, total: feeds.length })
}
```

---

## 7. Structure du Projet

```
rss-aggregator/
├── app/                              # App Router Next.js 14
│   ├── (auth)/                       # Groupe de routes publiques
│   │   ├── login/
│   │   │   └── page.tsx
│   │   └── register/
│   │       └── page.tsx
│   │
│   ├── (app)/                        # Groupe de routes protégées
│   │   ├── layout.tsx                # Layout avec sidebar auth
│   │   ├── feed/
│   │   │   └── page.tsx
│   │   ├── feeds/
│   │   │   └── page.tsx
│   │   ├── favorites/
│   │   │   └── page.tsx
│   │   ├── analytics/
│   │   │   └── page.tsx
│   │   ├── alerts/
│   │   │   └── page.tsx
│   │   └── settings/
│   │       └── page.tsx
│   │
│   ├── api/
│   │   ├── auth/
│   │   │   ├── [...nextauth]/route.ts
│   │   │   └── register/route.ts
│   │   ├── feeds/
│   │   │   ├── route.ts              # GET / POST
│   │   │   ├── [id]/route.ts         # DELETE
│   │   │   ├── [id]/refresh/route.ts # POST
│   │   │   ├── discover/route.ts     # GET
│   │   │   ├── import/route.ts       # POST
│   │   │   ├── export/route.ts       # GET
│   │   │   └── cron-refresh/route.ts # POST (cron)
│   │   ├── articles/
│   │   │   ├── route.ts              # GET
│   │   │   ├── [id]/route.ts         # GET
│   │   │   ├── [id]/ai-summary/route.ts
│   │   │   └── search/route.ts       # GET
│   │   ├── favorites/
│   │   │   ├── route.ts              # GET / POST
│   │   │   └── [articleId]/route.ts  # DELETE
│   │   ├── collections/
│   │   │   ├── route.ts
│   │   │   ├── [id]/route.ts
│   │   │   └── share/[slug]/route.ts # Public
│   │   ├── tags/
│   │   │   ├── route.ts
│   │   │   ├── [id]/route.ts
│   │   │   └── [id]/feeds/route.ts
│   │   ├── keywords/
│   │   │   ├── route.ts
│   │   │   └── [id]/route.ts
│   │   ├── read/
│   │   │   ├── [articleId]/route.ts
│   │   │   └── all/route.ts
│   │   ├── analytics/
│   │   │   ├── reading/route.ts
│   │   │   └── feeds/route.ts
│   │   ├── digest/
│   │   │   └── send/route.ts
│   │   └── user/
│   │       └── preferences/route.ts
│   │
│   ├── layout.tsx                    # Root layout
│   └── globals.css
│
├── components/
│   ├── ui/                           # shadcn/ui components
│   │   ├── button.tsx
│   │   ├── dialog.tsx
│   │   └── ...
│   ├── articles/
│   │   ├── ArticleCard.tsx
│   │   ├── ArticleList.tsx
│   │   ├── ReadButton.tsx
│   │   └── AISummaryButton.tsx
│   ├── feeds/
│   │   ├── FeedCard.tsx
│   │   ├── AddFeedModal.tsx
│   │   ├── TagPicker.tsx
│   │   └── OPMLButtons.tsx
│   ├── favorites/
│   │   ├── FavoriteButton.tsx
│   │   └── CollectionCard.tsx
│   └── layout/
│       ├── Sidebar.tsx
│       ├── Header.tsx
│       └── SearchBar.tsx
│
├── lib/
│   ├── prisma.ts                     # Singleton Prisma client
│   ├── auth.ts                       # NextAuth config + export
│   ├── rss/
│   │   └── parser.ts                 # RSS fetch & parse service
│   ├── ai/
│   │   └── summarize.ts              # Claude API integration
│   ├── email/
│   │   ├── digest.ts                 # Digest email service
│   │   └── templates/
│   │       └── DigestEmail.tsx       # React Email template
│   ├── readability.ts                # Article extraction
│   ├── alerts.ts                     # Keyword alert checks
│   ├── opml.ts                       # Import/export OPML
│   ├── cache.ts                      # Upstash Redis helpers
│   └── validations/
│       ├── feed.ts                   # Zod schemas
│       ├── article.ts
│       └── user.ts
│
├── prisma/
│   ├── schema.prisma
│   ├── seed.ts
│   └── migrations/
│
├── public/
│   ├── manifest.json                 # PWA manifest
│   └── sw.js                         # Service Worker
│
├── middleware.ts                     # Auth middleware
├── auth.ts                           # NextAuth config export
├── next.config.ts
├── tailwind.config.ts
├── tsconfig.json
├── vercel.json
└── package.json
```

---

## 8. Variables d'Environnement

> ⚠️ Ne jamais committer le fichier `.env` en production. Utiliser les secrets Vercel pour le déploiement.

```bash
# .env.local

# ─── Base de données (PostgreSQL) ────────────────────────────────
DATABASE_URL="postgresql://user:pass@host.neon.tech/rss_aggregator?sslmode=require"

# ─── NextAuth ────────────────────────────────────────────────────
NEXTAUTH_URL="http://localhost:3000"
# Générer avec : openssl rand -base64 32
NEXTAUTH_SECRET="your-super-secret-key-here"

# ─── OAuth (optionnel) ───────────────────────────────────────────
GOOGLE_CLIENT_ID="xxx.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="GOCSPX-xxx"
GITHUB_CLIENT_ID="Iv1.xxx"
GITHUB_CLIENT_SECRET="xxx"

# ─── Anthropic Claude AI ─────────────────────────────────────────
ANTHROPIC_API_KEY="sk-ant-api03-xxx"

# ─── Email (Resend) ───────────────────────────────────────────────
RESEND_API_KEY="re_xxx"
FROM_EMAIL="digest@rss-aggregator.com"

# ─── Cache / Rate limiting (Upstash Redis) ────────────────────────
UPSTASH_REDIS_REST_URL="https://xxx.upstash.io"
UPSTASH_REDIS_REST_TOKEN="xxx"

# ─── Cron security ───────────────────────────────────────────────
CRON_SECRET="your-cron-secret"
```

---

## 9. Déploiement

### 9.1 Installation & Développement Local

```bash
# 1. Cloner et installer
git clone https://github.com/votre-repo/rss-aggregator
cd rss-aggregator
npm install

# 2. Configurer les variables d'environnement
cp .env.example .env.local
# → Remplir les variables dans .env.local

# 3. Initialiser la base de données
npx prisma migrate dev --name init
npx prisma generate

# 4. (Optionnel) Seeder des données de test
npx prisma db seed

# 5. Lancer le serveur de développement
npm run dev
# → http://localhost:3000
```

### 9.2 Déploiement Vercel

1. Connecter le repo GitHub à Vercel (Import Project)
2. Configurer les variables d'environnement dans le dashboard Vercel
3. Activer les Cron Jobs via `vercel.json`
4. Lancer `npx prisma migrate deploy` en post-build hook

```json
// vercel.json
{
  "crons": [
    {
      "path": "/api/feeds/cron-refresh",
      "schedule": "0 */2 * * *"
    },
    {
      "path": "/api/digest/send",
      "schedule": "0 7 * * *"
    }
  ]
}
```

```json
// package.json — script post-build
{
  "scripts": {
    "build": "prisma generate && next build",
    "postinstall": "prisma generate"
  }
}
```

### 9.3 Commandes Prisma Utiles

| Commande | Description |
|----------|-------------|
| `npx prisma migrate dev` | Créer et appliquer une nouvelle migration |
| `npx prisma migrate deploy` | Appliquer les migrations en production |
| `npx prisma studio` | Interface graphique d'exploration de la BDD |
| `npx prisma generate` | Régénérer le client TypeScript |
| `npx prisma db seed` | Exécuter le fichier `prisma/seed.ts` |
| `npx prisma db push` | Pousser le schéma sans migration (dev rapide) |
| `npx prisma migrate reset` | Reset BDD en développement |

---

## 10. Sécurité & Bonnes Pratiques

### 10.1 Checklist

| Point | Statut | Détail |
|-------|--------|--------|
| Hash passwords | ✅ Obligatoire | `bcrypt` avec salt factor >= 10 |
| JWT httpOnly | ✅ NextAuth | Cookies `httpOnly` + `Secure` + `SameSite=Lax` |
| Validation inputs | ✅ Zod | Tous les endpoints POST/PATCH |
| Auth sur API routes | ✅ Middleware | `getServerSession()` vérifié côté serveur |
| Rate limiting | ✅ Upstash | 100 req/min par IP sur `/api/*` |
| CSRF | ✅ NextAuth | Tokens CSRF inclus automatiquement |
| Injection SQL | ✅ Prisma | Requêtes paramétrées par défaut |
| Headers sécurité | 🔧 À configurer | `next.config.ts` : CSP, X-Frame-Options… |
| Variables secrètes | ⚠️ Attention | Ne jamais exposer côté client (`NEXT_PUBLIC_`) |
| OPML validation | 🔧 À implémenter | Parser le XML avec validation stricte |

### 10.2 Headers de Sécurité

```typescript
// next.config.ts
const securityHeaders = [
  { key: 'X-DNS-Prefetch-Control', value: 'on' },
  { key: 'X-XSS-Protection', value: '1; mode=block' },
  { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'origin-when-cross-origin' },
  {
    key: 'Content-Security-Policy',
    value: [
      "default-src 'self'",
      "img-src 'self' data: https:",
      "script-src 'self' 'unsafe-eval' 'unsafe-inline'",
      "style-src 'self' 'unsafe-inline'",
    ].join('; '),
  },
]

const nextConfig = {
  async headers() {
    return [{ source: '/(.*)', headers: securityHeaders }]
  },
}

export default nextConfig
```

### 10.3 Rate Limiting (Upstash)

```typescript
// lib/rate-limit.ts
import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'

export const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(100, '1 m'),
  analytics: true,
})

// Usage dans un Route Handler
export async function POST(req: Request) {
  const ip = req.headers.get('x-forwarded-for') ?? '127.0.0.1'
  const { success } = await ratelimit.limit(ip)
  if (!success) {
    return Response.json({ error: 'Too many requests' }, { status: 429 })
  }
  // ... suite du handler
}
```

---

## 11. Plan de Développement

### 11.1 Phases

#### 🟢 Phase 1 — MVP (3-4 semaines)

> Objectif : application fonctionnelle avec les features critiques

- [ ] Setup projet : Next.js 14, Prisma, PostgreSQL, NextAuth
- [ ] Authentification : inscription, login, OAuth Google/GitHub
- [ ] Gestion flux : ajout, suppression, refresh manuel
- [ ] Feed d'articles : liste paginée, filtres de base
- [ ] Favoris : ajout/suppression simple
- [ ] Déploiement Vercel + Neon

#### 🔵 Phase 2 — Features Core (2-3 semaines)

- [ ] Tags & catégories sur les flux
- [ ] Marquer comme lu/non-lu
- [ ] Recherche full-text (index PostgreSQL `tsvector`)
- [ ] Cron job de rafraîchissement automatique
- [ ] Import/Export OPML

#### 🟡 Phase 3 — Features Avancées (3-4 semaines)

- [ ] Résumé IA via Claude API (Anthropic)
- [ ] Alertes mots-clés + notifications email Resend
- [ ] Digest email quotidien/hebdomadaire
- [ ] Collections partageables (slug public)
- [ ] Mode lecture Readability (`@mozilla/readability`)
- [ ] Dashboard analytics avec graphiques Recharts

#### 🟣 Phase 4 — Polish & PWA (1-2 semaines)

- [ ] PWA + mode hors-ligne (`next-pwa` + Service Worker)
- [ ] Raccourcis clavier (j/k navigation, f favori)
- [ ] Dark/light mode (`Tailwind dark:`)
- [ ] Optimisations performances (ISR, Redis cache)
- [ ] Tests E2E (Playwright)
- [ ] Documentation API (OpenAPI/Swagger)

### 11.2 Estimations

| Phase | Durée | Features clés |
|-------|-------|---------------|
| Phase 1 — MVP | 3-4 semaines | Auth, flux, feed, favoris, déploiement |
| Phase 2 — Core | 2-3 semaines | Tags, read status, search, cron, OPML |
| Phase 3 — Avancé | 3-4 semaines | IA, alertes, digest, collections, analytics |
| Phase 4 — Polish | 1-2 semaines | PWA, UX, performance, tests |
| **TOTAL** | **9-13 semaines** | Application complète production-ready |

---

## 12. Dépendances npm

### Production

| Package | Version | Usage |
|---------|---------|-------|
| `next` | 14.x | Framework full-stack App Router |
| `react` / `react-dom` | 18.x | UI Library |
| `typescript` | 5.x | Typage statique |
| `@prisma/client` | 5.x | ORM PostgreSQL |
| `next-auth` | 5.x (beta) | Authentification JWT + OAuth |
| `@auth/prisma-adapter` | latest | Adapter NextAuth ↔ Prisma |
| `bcryptjs` | latest | Hash des mots de passe |
| `rss-parser` | 3.x | Parsing flux RSS/Atom XML |
| `@mozilla/readability` | latest | Extraction contenu article |
| `jsdom` | latest | DOM virtuel pour Readability |
| `opml-to-json` | latest | Import/export OPML |
| `@anthropic-ai/sdk` | latest | Claude API — résumés IA |
| `resend` | latest | Envoi emails digest + alertes |
| `@react-email/components` | latest | Templates emails React |
| `zod` | 3.x | Validation schémas runtime |
| `@upstash/redis` | latest | Cache Redis |
| `@upstash/ratelimit` | latest | Rate limiting |
| `tailwindcss` | 3.x | CSS utility-first |
| `recharts` | latest | Graphiques analytics |

### Développement

| Package | Usage |
|---------|-------|
| `prisma` | CLI migrations et studio |
| `@types/node`, `@types/react` | Types TypeScript |
| `@types/bcryptjs` | Types bcrypt |
| `eslint` | Linter |
| `prettier` | Formatage du code |
| `playwright` | Tests End-to-End |
| `next-pwa` | Service Worker PWA |
| `@testing-library/react` | Tests unitaires composants |

### Installation initiale

```bash
npm install next@14 react react-dom typescript @prisma/client \
  next-auth@beta @auth/prisma-adapter bcryptjs rss-parser \
  @mozilla/readability jsdom @anthropic-ai/sdk resend \
  @react-email/components zod @upstash/redis @upstash/ratelimit \
  tailwindcss recharts

npm install -D prisma @types/node @types/react @types/bcryptjs \
  @types/jsdom eslint prettier playwright next-pwa
```

---

## 13. Glossaire

| Terme | Définition |
|-------|-----------|
| **RSS / Atom** | Formats XML standardisés pour la syndication de contenu web |
| **OPML** | Outline Processor Markup Language — format d'échange de listes de flux RSS |
| **App Router** | Système de routage Next.js 14 basé sur le système de fichiers (`app/`) |
| **Route Handler** | Équivalent Next.js 14 des API Routes — `app/api/*/route.ts` |
| **Server Component** | Composant React rendu côté serveur, sans JavaScript client |
| **ISR** | Incremental Static Regeneration — revalidation partielle des pages statiques |
| **cuid** | Collision-resistant Unique ID — identifiant utilisé par Prisma |
| **tsvector** | Type PostgreSQL pour la recherche full-text optimisée |
| **GIN Index** | Generalized Inverted Index — index PostgreSQL pour les recherches texte |
| **JWT** | JSON Web Token — format de session utilisé par NextAuth |
| **PWA** | Progressive Web App — application web installable avec mode hors-ligne |
| **Digest** | Email récapitulatif périodique des articles non lus |
| **Prisma Adapter** | Connecteur NextAuth permettant de stocker sessions en base Prisma |
| **bcrypt** | Algorithme de hachage de mots de passe résistant aux attaques brute force |
| **Readability** | Algorithme de Mozilla extrayant le contenu principal d'une page web |
| **Upsert** | Opération DB : insérer si inexistant, mettre à jour si présent |
| **Rate Limiting** | Limitation du nombre de requêtes par IP sur une période donnée |

---
