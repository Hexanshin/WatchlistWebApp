import { Routes, Route } from 'react-router-dom'
import { useState } from 'react'
import "./css/App.css"
import Home from './pages/Home'
import Favorites from './pages/Favorites'
import NavBar from './components/NavBar'

function App() {
  const [favorites, setFavorites] = useState([])

  const handleToggleFavorite = (movie) => {
    setFavorites((prev) => {
      if (prev.some((item) => item.id === movie.id)) {
        return prev.filter((item) => item.id !== movie.id)
      }
      // when adding a favorite, include watched and rating fields
      return [...prev, { ...movie, watched: false, rating: null }]
    })
  }

  const handleToggleWatched = (movieId) => {
    setFavorites((prev) => prev.map((item) => item.id === movieId ? { ...item, watched: !item.watched } : item))
  }

  const handleSetRating = (movieId, rating) => {
    setFavorites((prev) => prev.map((item) => item.id === movieId ? { ...item, rating, watched: rating ? true : item.watched } : item))
  }

  return (
      <div>
        <NavBar />
        <main className='main-content'>
          <Routes>
            <Route path='/' element={<Home favorites={favorites} onToggleFavorite={handleToggleFavorite} />} />
            <Route path='/favorites' element={<Favorites favorites={favorites} onToggleFavorite={handleToggleFavorite} onToggleWatched={handleToggleWatched} onSetRating={handleSetRating} />} />
          </Routes>
        </main>
      </div>
  )
}

export default App
