# WatchlistWebApp

A React + Firebase movie tracker app that lets users browse trending movies, search by title, favorite films, and view movie details.

## Features

- Trending movie discovery
- Search with no-result feedback
- Favorite movies with Firestore persistence
- Movie detail popup with rating and synopsis
- Google sign-in authentication

## Prerequisites

- Node.js 18+ installed
- npm available
- Firebase CLI installed if you want to deploy rules

## Setup

1. Clone the repository:

```bash
git clone <REPO_URL>
cd WatchlistWebApp
```

2. Copy the example environment file:

```bash
cp .env.example .env
```

3. Open `.env` and add your values:

```env
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
VITE_TMDB_API_KEY=
```

4. Install dependencies:

```bash
npm install
```

5. Start the dev server:

```bash
npm run dev
```

Then open the local Vite URL shown in the terminal.

## TMDB API Key

This app uses `VITE_TMDB_API_KEY` to call The Movie Database API from the frontend. Keep this key out of version control by storing it in `.env` only.

> Important: Vite environment variables prefixed with `VITE_` are still bundled into the client app. For a fully private API key, route TMDB requests through a backend service.

## Firebase Configuration

Firebase config is read from `.env` using `VITE_FIREBASE_*` variables. The Firebase frontend config is safe for public use, but sensitive access rules should be enforced with Firestore security rules.

## Deploy Firestore Rules

This repository includes `firebase.rules` for per-user favorites access control.

```bash
firebase deploy --only firestore:rules --project <YOUR_FIREBASE_PROJECT_ID>
```

If you do not deploy the rules, Firestore may return `Missing or insufficient permissions` even when the client code is correct.

## Build for Production

```bash
npm run build
```

## Notes

- Do not commit `.env`.
- Use `.env.example` as the template for other developers.
- If the app cannot load movies, verify that `VITE_TMDB_API_KEY` is set correctly.

