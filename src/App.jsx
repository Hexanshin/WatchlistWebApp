import { Routes, Route } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { collection, deleteDoc, doc, onSnapshot, setDoc } from 'firebase/firestore'
import { useAuth } from './contexts/AuthContext'
import { db } from './firebase'
import "./css/App.css"
import Home from './pages/Home'
import Favorites from './pages/Favorites'
import Profile from './pages/Profile'
import NavBar from './components/NavBar'

function App() {
  const { user, signInWithGoogle } = useAuth()
  const [favorites, setFavorites] = useState([])
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!user) {
      setFavorites([])
      return
    }

    const favoritesCollection = collection(db, 'users', user.uid, 'favorites')
    const unsubscribe = onSnapshot(favoritesCollection, (snapshot) => {
      setFavorites(snapshot.docs.map((docItem) => docItem.data()))
    })

    return unsubscribe
  }, [user])

  const handleToggleFavorite = async (movie) => {
    try {
      setError(null)
      if (!user) {
        await signInWithGoogle()
        return
      }

      const favoritesDoc = doc(db, 'users', user.uid, 'favorites', movie.id.toString())
      if (favorites.some((item) => item.id === movie.id)) {
        await deleteDoc(favoritesDoc)
        return
      }

      await setDoc(favoritesDoc, {
        id: movie.id,
        title: movie.title,
        poster_path: movie.poster_path,
        release_date: movie.release_date,
        watched: false,
        rating: null,
      })
    } catch (err) {
      console.error('Favorite action failed', err)
      setError(err.message || 'Failed to update favorites')
      throw err
    }
  }

  const handleToggleWatched = async (movieId) => {
    try {
      setError(null)
      if (!user) return
      const movie = favorites.find((item) => item.id === movieId)
      if (!movie) return

      const favoritesDoc = doc(db, 'users', user.uid, 'favorites', movieId.toString())
      await setDoc(favoritesDoc, {
        ...movie,
        watched: !movie.watched,
      }, { merge: true })
    } catch (err) {
      console.error('Watched toggle failed', err)
      setError(err.message || 'Failed to update watched status')
      throw err
    }
  }

  const handleSetRating = async (movieId, rating) => {
    try {
      setError(null)
      if (!user) return
      const movie = favorites.find((item) => item.id === movieId)
      if (!movie) return

      const favoritesDoc = doc(db, 'users', user.uid, 'favorites', movieId.toString())
      await setDoc(favoritesDoc, {
        ...movie,
        rating,
        watched: true,
      }, { merge: true })
    } catch (err) {
      console.error('Set rating failed', err)
      setError(err.message || 'Failed to save rating')
      throw err
    }
  }

  return (
      <div>
        <NavBar />
        <main className='main-content'>
          <Routes>
            <Route path='/' element={<Home favorites={favorites} onToggleFavorite={handleToggleFavorite} appError={error} />} />
            <Route path='/favorites' element={<Favorites favorites={favorites} onToggleFavorite={handleToggleFavorite} onToggleWatched={handleToggleWatched} onSetRating={handleSetRating} appError={error} />} />
            <Route path='/profile' element={<Profile favorites={favorites} onSetRating={handleSetRating} />} />
          </Routes>
        </main>
      </div>
  )
}

export default App
