import { createContext, useContext, useEffect, useState } from 'react'
import { onAuthStateChanged, signInWithPopup, signOut } from 'firebase/auth'
import { auth, provider, firebaseEnabled } from '../firebase'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!firebaseEnabled) {
      setLoading(false)
      return
    }

    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser)
      setLoading(false)
    })
    return unsubscribe
  }, [])

  const signInWithGoogle = async () => {
    if (!firebaseEnabled) {
      throw new Error('Firebase is not configured.')
    }
    await signInWithPopup(auth, provider)
  }

  const signOutUser = async () => {
    if (!firebaseEnabled) {
      return
    }
    await signOut(auth)
  }

  const reloadUser = async () => {
    if (!firebaseEnabled || !auth.currentUser) {
      return
    }
    await auth.currentUser.reload()
    setUser(auth.currentUser)
  }

  return (
    <AuthContext.Provider value={{ user, loading, signInWithGoogle, signOutUser, reloadUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
