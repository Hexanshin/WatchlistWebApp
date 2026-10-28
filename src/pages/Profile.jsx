import { useEffect, useState } from 'react'
import { updateProfile } from 'firebase/auth'
import { auth } from '../firebase'
import { useAuth } from '../contexts/AuthContext'
import { searchMovies } from '../services/api'
import '../css/Profile.css'

function readFileAsDataURL(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result)
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

function Profile() {
  const { user, loading, signInWithGoogle, reloadUser } = useAuth()
  const [displayName, setDisplayName] = useState('')
  const [photoFile, setPhotoFile] = useState(null)
  const [photoPreview, setPhotoPreview] = useState('')
  const [top10Movies, setTop10Movies] = useState(Array(10).fill(null))
  const [activeSlot, setActiveSlot] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [searchLoading, setSearchLoading] = useState(false)
  const [searchError, setSearchError] = useState(null)
  const [statusMessage, setStatusMessage] = useState('')
  const [error, setError] = useState(null)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (user) {
      const defaultName = user.displayName || user.email?.split('@')[0] || ''
      setDisplayName(defaultName)
      setPhotoPreview(user.photoURL || '')

      const savedMovies = localStorage.getItem(`top10Movies_${user.uid}`)
      if (savedMovies) {
        try {
          const parsed = JSON.parse(savedMovies)
          if (Array.isArray(parsed) && parsed.length === 10) {
            setTop10Movies(parsed.map((item) => item || null))
          }
        } catch {
          setTop10Movies(Array(10).fill(null))
        }
      }
    }
  }, [user])

  const handleFileChange = (event) => {
    const file = event.target.files[0]
    if (!file) return
    setPhotoFile(file)
    setPhotoPreview(URL.createObjectURL(file))
    setError(null)
    setStatusMessage('')
  }

  const handleOpenSearch = (index) => {
    setActiveSlot(index)
    setSearchQuery('')
    setSearchResults([])
    setSearchError(null)
    setStatusMessage('')
    setError(null)
  }

  useEffect(() => {
    if (activeSlot === null) {
      return
    }

    if (!searchQuery.trim()) {
      setSearchResults([])
      setSearchError(null)
      return
    }

    const timer = setTimeout(async () => {
      setSearchLoading(true)
      setSearchError(null)
      setSearchResults([])

      try {
        const data = await searchMovies(searchQuery.trim())
        setSearchResults(data.results || [])
      } catch (searchErr) {
        console.error(searchErr)
        setSearchError('Failed to search movies. Try again.')
      } finally {
        setSearchLoading(false)
      }
    }, 400)

    return () => clearTimeout(timer)
  }, [searchQuery, activeSlot])

  const handleSearchSubmit = async (event) => {
    event.preventDefault()
    if (!searchQuery.trim()) return

    setSearchLoading(true)
    setSearchError(null)
    setSearchResults([])

    try {
      const data = await searchMovies(searchQuery.trim())
      setSearchResults(data.results || [])
    } catch (searchErr) {
      console.error(searchErr)
      setSearchError('Failed to search movies. Try again.')
    } finally {
      setSearchLoading(false)
    }
  }

  const handleSelectMovie = (index, movie) => {
    const nextMovies = [...top10Movies]
    nextMovies[index] = {
      id: movie.id,
      title: movie.title,
      poster_path: movie.poster_path,
    }
    setTop10Movies(nextMovies)

    if (user) {
      localStorage.setItem(`top10Movies_${user.uid}`, JSON.stringify(nextMovies))
    }

    setActiveSlot(null)
    setSearchQuery('')
    setSearchResults([])
    setSearchError(null)
  }

  const handleRemoveMovie = (index) => {
    const nextMovies = [...top10Movies]
    nextMovies[index] = null
    setTop10Movies(nextMovies)

    if (user) {
      localStorage.setItem(`top10Movies_${user.uid}`, JSON.stringify(nextMovies))
    }
  }

  const handleSaveProfile = async (event) => {
    event.preventDefault()
    if (!user) {
      setError('Please sign in before updating your profile.')
      return
    }

    setSaving(true)
    setError(null)
    setStatusMessage('')

    try {
      let photoURL = user.photoURL || ''
      if (photoFile) {
        photoURL = await readFileAsDataURL(photoFile)
      }

      const updates = {}
      if (displayName.trim() && displayName !== (user.displayName || user.email?.split('@')[0] || '')) {
        updates.displayName = displayName.trim()
      }
      if (photoURL && photoURL !== user.photoURL) {
        updates.photoURL = photoURL
      }

      if (Object.keys(updates).length > 0) {
        await updateProfile(auth.currentUser, updates)
        if (photoURL) {
          setPhotoPreview(photoURL)
          setPhotoFile(null)
        }
      }

      localStorage.setItem(`top10Movies_${user.uid}`, JSON.stringify(top10Movies))
      if (reloadUser) {
        await reloadUser()
      }
      setStatusMessage('Profile updated successfully.')
    } catch (uploadError) {
      console.error(uploadError)
      setError(uploadError.message || 'Failed to update profile.')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return <div className="profile-page">Loading profile...</div>
  }

  if (!user) {
    return (
      <div className="profile-page">
        <div className="profile-card">
          <h2>Profile</h2>
          <p>You must be signed in to update your profile.</p>
          <button className="profile-button" onClick={signInWithGoogle}>Sign in with Google</button>
        </div>
      </div>
    )
  }

  return (
    <div className="profile-page">
      <div className="profile-card">
        <h2>Profile</h2>
        <div className="profile-grid">
          <div className="profile-panel">
            <div className="panel-header">
              <h3>Profile</h3>
            </div>
            <div className="profile-summary">
              <div className="profile-avatar-wrapper">
                {photoPreview ? (
                  <img className="profile-avatar" src={photoPreview} alt="Profile preview" />
                ) : (
                  <div className="profile-avatar placeholder">{(user.displayName || user.email?.split('@')[0] || 'U').charAt(0).toUpperCase()}</div>
                )}
              </div>
              <div>
                <p className="profile-label">Display name</p>
                <p className="profile-value">{user.displayName || user.email?.split('@')[0]}</p>
                <p className="profile-label">Signed in as</p>
                <p className="profile-value">{user.email}</p>
                <p className="profile-label">Provider</p>
                <p className="profile-value">Google</p>
              </div>
            </div>
            <div className="panel-header">
              <h3>Customization</h3>
            </div>
            <form className="profile-form" onSubmit={handleSaveProfile}>
              <label>
                Display name
                <input
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="Enter display name"
                />
              </label>

              <label>
                Profile picture
                <input type="file" accept="image/*" onChange={handleFileChange} />
              </label>

              <p className="profile-help">Upload a profile photo directly in the browser; it is saved as a data URL in your profile.</p>

              {error && <div className="profile-error">{error}</div>}
              {statusMessage && <div className="profile-success">{statusMessage}</div>}

              <button type="submit" className="profile-button" disabled={saving}>
                {saving ? 'Saving...' : 'Save changes'}
              </button>
            </form>
          </div>

          <aside className="profile-top10-column top10-panel">
            <div className="top10-section">
              <h3>Your Top 10 Movies</h3>
          <div className="top10-box">
            {top10Movies.map((movie, index) => (
              <button
                type="button"
                key={index}
                className={`top10-card ${movie ? 'filled' : 'empty'}`}
                onClick={() => handleOpenSearch(index)}
              >
                <div className="top10-card-label">#{index + 1}</div>
                {movie ? (
                  <>
                    {movie.poster_path ? (
                      <img
                        className="top10-card-thumb"
                        src={`https://image.tmdb.org/t/p/w154${movie.poster_path}`}
                        alt={movie.title}
                      />
                    ) : (
                      <div className="top10-card-thumb placeholder">No image</div>
                    )}
                    <div className="top10-card-title">{movie.title}</div>
                    <button
                      type="button"
                      className="top10-remove"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleRemoveMovie(index)
                      }}
                    >
                    </button>
                  </>
                ) : (
                  <div className="top10-card-empty">
                    <span className="top10-plus">+</span>
                    <p>Add movie</p>
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>
      </aside>
    </div>

    {activeSlot !== null && (
      <div className="top10-popup-overlay" onClick={() => setActiveSlot(null)}>
        <div className="top10-popup" onClick={(e) => e.stopPropagation()}>
          <div className="top10-search-header">
            <div>
              <h4>Pick a movie for rank #{activeSlot + 1}</h4>
              <p>Search and choose a movie to add to your list.</p>
            </div>
            <button type="button" className="top10-close" onClick={() => setActiveSlot(null)}>
              Close
            </button>
          </div>
          <form className="top10-search-form" onSubmit={handleSearchSubmit}>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for a movie"
              autoFocus
            />
            <button type="submit">Search</button>
          </form>
          {searchLoading && <p className="profile-help">Searching movies…</p>}
          {searchError && <div className="profile-error">{searchError}</div>}
          <div className="top10-search-results">
            {searchResults.length > 0 ? (
              searchResults.slice(0, 8).map((result) => (
                <button
                  type="button"
                  key={result.id}
                  className="search-result-item"
                  onClick={() => handleSelectMovie(activeSlot, result)}
                >
                  {result.poster_path ? (
                    <img
                      src={`https://image.tmdb.org/t/p/w154${result.poster_path}`}
                      alt={result.title}
                    />
                  ) : (
                    <div className="search-result-thumb placeholder">No image</div>
                  )}
                  <div>
                    <strong>{result.title}</strong>
                    <p>{result.release_date?.slice(0, 4)}</p>
                  </div>
                </button>
              ))
            ) : (
              <p className="profile-help">Search a movie to add it to your top 10.</p>
            )}
          </div>
        </div>
      </div>
    )}
  </div>
</div>
  )
}

export default Profile
