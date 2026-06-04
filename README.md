# WatchlistWebApp

## Firebase Firestore Rules

This project includes `firebase.rules` for per-user favorites security.

To deploy the Firestore rules, run:

```bash
firebase deploy --only firestore:rules --project <YOUR_FIREBASE_PROJECT_ID>
```

If you do not deploy the rules, Firestore may return `Missing or insufficient permissions` even when the client code is correct.

