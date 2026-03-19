import { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);

  return (
    <nav className="navbar navbar-expand-lg custom-navbar">
      <div className="container">
        {/* Brand */}
        <Link className="navbar-brand brand-logo" to="/dashboard">
          AI<span>Learn</span>
        </Link>
      
        {/* Toggle */}
        <button
          className="navbar-toggler bg-white text-dark"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navMenu"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navMenu">
          <ul className="navbar-nav ms-auto align-items-center gap-3">
            {user ? (
              <>
                <li className="nav-item">
                  <Link className="nav-link nav-hover" to="/dashboard">
                    Dashboard
                  </Link>
                </li>

                <li className="nav-item">
                  <span className="user-greeting">👋 {user.name}</span>
                </li>

                <li className="nav-item">
                  <Link className="nav-link nav-hover" to="/profile">
                    Profile
                  </Link>
                </li>

                <li className="nav-item">
                  <button className="logout-btn" onClick={logout}>
                    Logout
                  </button>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item">
                  <Link className="nav-link nav-hover" to="/">
                    Login
                  </Link>
                </li>

                <li className="nav-item">
                  <Link className="register-btn" to="/register">
                    Register
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
