import "../css/MovieCard.css"

function MovieCard({ movie, onFavoriteClick, isFavorite, onCardClick }) {
    return(
        <div className="movie-card" onClick={() => onCardClick?.(movie)}>
            <div className="movie-poster">
                <img src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} alt={movie.title}/>
                <div className="movie-overlay">
                    <button
                      className={`favorite-btn ${isFavorite ? 'favorited' : ''}`}
                      onClick={(e) => {
                        e.stopPropagation()
                        onFavoriteClick?.(movie)
                      }}
                    >
                        {isFavorite ? '♥' : '♡'}
                    </button>
                </div>
            </div>
            <div className="movie-info">
                <h3>{movie.title}</h3>
                <p>{movie.release_date?.split("-")[0]}</p>
            </div>
        </div>
    )
}

export default MovieCard