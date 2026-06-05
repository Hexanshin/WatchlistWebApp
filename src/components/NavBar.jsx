import { Link } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"
import logo from "../assets/MovieTrackerLogo.png"
import "../css/Navbar.css"

function NavBar() {
  const { user, signInWithGoogle, signOutUser } = useAuth()

    return <nav className="navbar">
        <div className="navbar-brand">
            <Link to = "/" state={{ reset: true }} className="navbar-logo-link">
              <img src={logo} alt="Movie Tracker logo" className="navbar-logo" />
              <span>Movie Tracker</span>
            </Link>
        </div>

        <div className="navbar-links">
            <Link to="/" state={{ reset: true }} className="nav-link">Home</Link>
            <Link to="/favorites" className="nav-link">Favorites</Link>
            {user ? (
              <>
                <span className="nav-user">{user.displayName || user.email}</span>
                <button className="nav-button" onClick={signOutUser}>Sign out</button>
              </>
            ) : (
              <button className="nav-button" onClick={signInWithGoogle}>Sign in</button>
            )}
        </div>
    </nav>
}

export default NavBar