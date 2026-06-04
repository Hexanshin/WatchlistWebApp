import MovieCard from "../components/MovieCard"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { searchMovies, getPopularMovies } from "../services/api";
import "../css/Home.css"

function Home ({ favorites, onToggleFavorite }) {
  const navigate = useNavigate()

    const [
        searchQuery, setSearchQuery
    ] =useState ("");

    const [
        movies, setMovies
    ] =useState ([]);

    const [
        error, setError
    ] =useState(null);

    const [
        loading, setLoading
    ] = useState(true)

    useEffect(() => {
        const loadPopularMovies = async () => {
            try {
                const popularMovies = await getPopularMovies()
                setMovies(popularMovies)
            }
            catch(err){
                console.log(err)
                setError("Failed to Load Movies...")
            }
            finally{
                setLoading(false)
            }
        }
        loadPopularMovies()
    }, [])

    const handleSearch = async (e) => {
        e.preventDefault()
        if(!searchQuery.trim()) return;
        if(loading) return;
        setLoading(true)

        try {
            const searchResults = await searchMovies(searchQuery)
            setMovies(searchResults)
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

    const handleFavoriteClick = (movie) => {
      onToggleFavorite(movie)
    }

    return (
    <div className="home">
        <form onSubmit={handleSearch} className="search-form">
            <input 
            type="text" 
            placeholder="Search for movies" 
            className="search-input"
            value={searchQuery} 
            onChange={(e) => setSearchQuery(e.target.value)}/>

            <button type="submit" className="search-button">Search</button>
        </form>
        
        {error && <div className="error-message">{error}</div>}

        {loading ? <div className="loading">Loading...</div> : <div className="movies-grid">
            {movies.map(
                (movie) => 
             (<MovieCard
                movie={movie}
                key={movie.id}
                onFavoriteClick={handleFavoriteClick}
                isFavorite={favorites.some((item) => item.id === movie.id)}
             />))}
        </div>}
        
    </div>
    )
}

export default Home