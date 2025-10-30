import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Navbar.css";

export default function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <nav className="premium-navbar">
      <div className="navbar-container">
        <Link className="navbar-logo" to="/">
          <span className="logo-mark">V</span>
          <span className="logo-text">VIBE</span>
        </Link>
        <div className="navbar-actions">
          {token ? (
            <>
              <Link className="nav-link" to="/cart">
                <svg className="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
                  <line x1="3" y1="6" x2="21" y2="6"/>
                  <path d="M16 10a4 4 0 0 1-8 0"/>
                </svg>
                <span>Cart</span>
              </Link>
              <button className="nav-btn-logout" onClick={handleLogout}>
                Logout
              </button>
            </>
          ) : (
            <>
              <Link className="nav-link" to="/login">
                Sign In
              </Link>
              <Link className="nav-btn-register" to="/register">
                Join Us
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}