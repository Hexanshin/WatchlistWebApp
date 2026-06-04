import "../css/Favorites.css"
import StarRating from "../components/StarRating"
import Modal from "../components/Modal"
import { useState } from 'react'

function Favorites ({ favorites, onToggleFavorite, onToggleWatched, onSetRating }) {
  const [ratingMovie, setRatingMovie] = useState(null)
  if (!favorites?.length) {
    return <div className="favorites-empty">
      <h2>There's nothing in your watchlist.</h2>
      <p>Start adding movies to your favorites and they will appear here.</p>
    </div>
  }

  return (
    <div className="favorites">
      <h2>Your Favorite Movies</h2>
      <div className="movies-grid">
        {favorites.map((movie) => (
          <div key={movie.id} className="favorite-card">
            <img src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} alt={movie.title} />
            <div className="favorite-info">
              <h3>{movie.title}</h3>
              <p>{movie.release_date?.split("-")[0]}</p>
              {movie.rating ? (
                <div className="rating-display">
                  <StarRating value={movie.rating} max={10} editable={false} />
                </div>
              ) : null}

              {!movie.watched ? (
                <div style={{ marginTop: '0.5rem' }}>
                  <button
                    className="mark-watched-btn"
                    onClick={() => {
                      onToggleWatched(movie.id)
                      setRatingMovie(movie)
                    }}
                  >
                    Mark watched
                  </button>
                </div>
              ) : (
                <div style={{ marginTop: '0.5rem', display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                  <button className="watched-btn" disabled>Watched</button>
                  {!movie.rating && (
                    <button className="remove-favorite-btn" onClick={() => setRatingMovie(movie)}>Rate</button>
                  )}
                </div>
              )}

              <div style={{ marginTop: '0.75rem' }}>
                <button className="remove-favorite-btn" onClick={() => onToggleFavorite(movie)}>
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
            <StarRating value={ratingMovie.rating || 0} max={10} editable={true} onRate={(r) => { onSetRating(ratingMovie.id, r); setRatingMovie(null) }} />
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