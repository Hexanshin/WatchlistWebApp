import { Link } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"
import logo from "../assets/MovieTrackerLogo.png"
import "../css/Navbar.css"

function NavBar() {
  const { user, signInWithGoogle, signOutUser } = useAuth()

  const getDisplayName = () => {
    if (!user) return ''
    return user.displayName || user.email?.split('@')[0] || 'User'
  }

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
                <Link to="/profile" className="nav-user-link">
                  <span className="nav-user-avatar">
                    {user.photoURL ? <img src={user.photoURL} alt="Profile" /> : getDisplayName().charAt(0).toUpperCase()}
                  </span>
                  <span className="nav-user-name">{getDisplayName()}</span>
                </Link>
                <button className="nav-button" onClick={signOutUser}>Sign out</button>
              </>
            ) : (
              <button className="nav-button" onClick={signInWithGoogle}>Sign in</button>
            )}
        </div>
    </nav>
}

export default NavBar