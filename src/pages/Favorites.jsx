import "../css/Favorites.css"
import StarRating from "../components/StarRating"
import Modal from "../components/Modal"
import { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'

function Favorites ({ favorites, onToggleFavorite, onToggleWatched, onSetRating, appError }) {
  const [ratingMovie, setRatingMovie] = useState(null)
  const [localError, setLocalError] = useState(null)
  const { user, signInWithGoogle } = useAuth()

  if (!user) {
    return <div className="favorites-empty">
      <h2>Please sign in to see your favorites.</h2>
      <p>Favorites are saved to your Google account so only you can access them.</p>
      <button className="mark-watched-btn" onClick={signInWithGoogle}>Sign in with Google</button>
    </div>
  }

  if (!favorites?.length) {
    return <div className="favorites-empty">
      <h2>There's nothing in your watchlist.</h2>
      <p>Start adding movies to your favorites and they will appear here.</p>
    </div>
  }

  return (
    <div className="favorites">
      <h2>Your Favorite Movies</h2>
      {(appError || localError) && <div className="error-message">{localError || appError}</div>}
      <div className="movies-grid">
        {favorites.map((movie) => (
          <div key={movie.id} className="favorite-card">
            <img src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} alt={movie.title} />
            <div className="favorite-info">
              <div className="favorite-text">
                <h3>{movie.title}</h3>
                <p>{movie.release_date?.split("-")[0]}</p>
              </div>

              {movie.rating ? (
                <div className="favorite-rating">
                  <StarRating value={movie.rating} max={10} editable={false} />
                </div>
              ) : null}

              <div className="favorite-actions">
                {!movie.watched ? (
                  <button
                    className="mark-watched-btn"
                    onClick={async () => {
                      try {
                        setLocalError(null)
                        await onToggleWatched(movie.id)
                        setRatingMovie(movie)
                      } catch (err) {
                        console.error('Unable to mark watched', err)
                        setLocalError(err.message || 'Failed to update movie')
                      }
                    }}
                  >
                    Mark watched
                  </button>
                ) : (
                  <>
                    <button className="watched-btn" disabled>Watched</button>
                    {!movie.rating && (
                      <button className="remove-favorite-btn" onClick={() => setRatingMovie(movie)}>Rate</button>
                    )}
                  </>
                )}

                <button className="remove-favorite-btn" onClick={async () => {
                  try {
                    setLocalError(null)
                    await onToggleFavorite(movie)
                  } catch (err) {
                    console.error('Unable to remove favorite', err)
                    setLocalError(err.message || 'Failed to remove favorite')
                  }
                }}>
                  Remove
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      {ratingMovie ? (
        <Modal title={`Rate ${ratingMovie.title}`} onClose={() => setRatingMovie(null)}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <StarRating
              value={ratingMovie.rating || 0}
              max={10}
              editable={true}
              onRate={async (r) => {
                try {
                  setLocalError(null)
                  await onSetRating(ratingMovie.id, r)
                  setRatingMovie(null)
                } catch (err) {
                  console.error('Unable to save rating', err)
                  setLocalError(err.message || 'Failed to save rating')
                }
              }}
            />
            <div className="modal-actions">
              <button className="btn-secondary" onClick={() => setRatingMovie(null)}>Cancel</button>
            </div>
          </div>
        </Modal>
      ) : null}
    </div>
  )
}

export default Favorites