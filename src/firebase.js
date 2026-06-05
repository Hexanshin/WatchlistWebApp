import { initializeApp } from 'firebase/app'
import { getAuth, GoogleAuthProvider } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
}

const firebaseEnabled = Object.values(firebaseConfig).every(Boolean)
let app = null
let auth = null
let provider = null
let db = null

if (firebaseEnabled) {
  app = initializeApp(firebaseConfig)
  auth = getAuth(app)
  provider = new GoogleAuthProvider()
  db = getFirestore(app)
} else {
  console.warn('Firebase is not configured. Set the VITE_FIREBASE_* env vars to enable auth and Firestore.')
}

export { auth, provider, db, firebaseEnabled }
