import MovieCard from "../components/MovieCard"
import Modal from "../components/Modal"
import { useEffect, useState } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { searchMovies, getPopularMovies } from "../services/api";
import "../css/Home.css"

function Home ({ favorites, onToggleFavorite, appError }) {
  const navigate = useNavigate()
  const location = useLocation()

    const [
        searchQuery, setSearchQuery
    ] =useState ("");

    const [
        movies, setMovies
    ] =useState ([]);

    const [
        selectedMovie, setSelectedMovie
    ] = useState(null);

    const [
        error, setError
    ] =useState(null);

    const [
        loading, setLoading
    ] = useState(true)

    const [
        loadingMore, setLoadingMore
    ] = useState(false)

    const [
        page, setPage
    ] = useState(1)

    const [
        totalPages, setTotalPages
    ] = useState(1)

    const loadTrendingMovies = async () => {
        try {
            setLoading(true)
            const data = await getPopularMovies(1)
            setMovies(data.results || [])
            setPage(1)
            setTotalPages(data.total_pages || 1)
            setSearchQuery("")
            setError(null)
        }
        catch(err){
            console.log(err)
            setError("Failed to Load Movies...")
        }
        finally{
            setLoading(false)
        }
    }

    useEffect(() => {
        loadTrendingMovies()
    }, [])

    useEffect(() => {
      if (location.pathname === "/" && location.state?.reset) {
        loadTrendingMovies()
        setSelectedMovie(null)
        navigate(location.pathname, { replace: true, state: null })
      }
    }, [location, navigate])

    const handleSearch = async (e) => {
        e.preventDefault()
        if(!searchQuery.trim()) return;
        if(loading) return;
        setLoading(true)

        try {
            const data = await searchMovies(searchQuery, 1)
            setMovies(data.results || [])
            setPage(1)
            setTotalPages(data.total_pages || 1)
            setError(null)
        }

        catch(err){
            console.log(err)
            setError("Failed to search movies...")
        }

        finally{
            setLoading(false)
        }

    }

    const handleSeeMore = async () => {
        if (loadingMore) return;
        if (page >= totalPages) return;
        setLoadingMore(true)
        try {
            const nextPage = page + 1
            let data
            if (searchQuery && searchQuery.trim()) {
                data = await searchMovies(searchQuery, nextPage)
            } else {
                data = await getPopularMovies(nextPage)
            }
            const newResults = data.results || []
            setMovies(prev => [...prev, ...newResults])
            setPage(nextPage)
            setTotalPages(data.total_pages || totalPages)
            setError(null)
        } catch (err) {
            console.error('Failed to load more movies', err)
            setError('Failed to load more movies')
        } finally {
            setLoadingMore(false)
        }
    }

    const handleFavoriteClick = async (movie) => {
      try {
        await onToggleFavorite(movie)
        setError(null)
      } catch (err) {
        console.error('Unable to toggle favorite', err)
        setError(err.message || 'Failed to update favorite')
      }
    }

    const handleMovieClick = (movie) => {
      setSelectedMovie(movie)
    }

    const closeModal = () => {
      setSelectedMovie(null)
    }

    const noSearchResults = !loading && searchQuery.trim() && movies.length === 0

    return (
    <div className="home">
        <form onSubmit={handleSearch} className="search-form">
            <input 
            type="text" 
            placeholder="Search For Movies..." 
            className="search-input"
            value={searchQuery} 
            onChange={(e) => setSearchQuery(e.target.value)}/>

            <button type="submit" className="search-button">Search</button>
        </form>
        
        {(error || appError) && <div className="error-message">{error || appError}</div>}

                {loading ? <div className="loading"><span className="spinner" />Loading...</div> : <>
                    {noSearchResults ? (
                      <div className="no-results">No movies matched your search.</div>
                    ) : (
                      <>
                        <div className="movies-grid">
                            {movies.map(
                                    (movie) => 
                             (<MovieCard
                                    movie={movie}
                                    key={movie.id}
                                    onFavoriteClick={handleFavoriteClick}
                                    onCardClick={handleMovieClick}
                                    isFavorite={favorites.some((item) => item.id === movie.id)}
                             />))}
                        </div>

                        <div className="see-more-container">
                            {page < totalPages && movies.length > 0 && (
                                <button className="see-more-button" onClick={handleSeeMore} disabled={loadingMore}>
                                    {loadingMore ? 'Loading...' : 'See more'}
                                </button>
                            )}
                        </div>
                      </>
                    )}

                    {selectedMovie && (
                      <Modal title="Movie Details" onClose={closeModal}>
                        <div className="movie-detail">
                          <img
                            className="movie-detail-thumb"
                            src={`https://image.tmdb.org/t/p/w500${selectedMovie.poster_path}`}
                            alt={selectedMovie.title}
                          />
                          <div className="movie-detail-info">
                            <h4 className="movie-detail-title">{selectedMovie.title}</h4>
                            <div className="movie-detail-meta">
                              <p className="movie-detail-rating">
                                {selectedMovie.vote_average?.toFixed(1) || 'N/A'} / 10
                              </p>
                              <button
                                className={`movie-detail-favorite-btn ${favorites.some((item) => item.id === selectedMovie.id) ? 'favorited' : ''}`}
                                onClick={(e) => {
                                  e.stopPropagation()
                                  handleFavoriteClick(selectedMovie)
                                }}
                                aria-label={favorites.some((item) => item.id === selectedMovie.id) ? 'Remove favorite' : 'Add favorite'}
                              >
                                {favorites.some((item) => item.id === selectedMovie.id) ? '♥' : '♡'}
                              </button>
                            </div>
                            <p className="movie-detail-synopsis">
                              {selectedMovie.overview || 'Synopsis not available.'}
                            </p>
                          </div>
                        </div>
                      </Modal>
                    )}
                </>}
        
    </div>
    )
}

export default Home