"use client"

import { useState, useEffect } from "react"
import { Link, useNavigate, useLocation } from "react-router-dom"
import { User, LogOut, Settings, Menu, X, Heart, Calendar, Plus, Home } from "lucide-react"
import { authservice } from "../../../apiservice"

function Navbar({ isAdmin, setIsAdmin }) {
  const navigate = useNavigate()
  const location = useLocation()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [showMobileMenu, setShowMobileMenu] = useState(false)

  // Check auth status whenever the location changes or component mounts
  useEffect(() => {
    checkAuthStatus()
  }, [location])

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Close user menu if clicking outside
      if (showUserMenu && !event.target.closest(".user-menu-container")) {
        setShowUserMenu(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [showUserMenu])

  const checkAuthStatus = () => {
    const token = localStorage.getItem("token")
    const user = JSON.parse(localStorage.getItem("user") || "{}")

    const isLoggedIn = !!token
    console.log("Auth status check - Logged in:", isLoggedIn)

    setIsAuthenticated(isLoggedIn)
    setUsername(user.username || "User")
    setEmail(user.email || "")
  }

  const handleLogout = () => {
    authservice.logout()
    setIsAuthenticated(false)
    setShowUserMenu(false)
    navigate("/")
  }

  // Modify the toggleAdminMode function to log out and redirect to login
  const toggleAdminMode = () => {
    // If switching to admin mode, log out current user and redirect to login
    if (!isAdmin) {
      // First set the admin flag in localStorage so login page knows we're trying to access admin mode
      localStorage.setItem("isAdmin", "true")

      // Log out the current user
      authservice.logout()
      setIsAuthenticated(false)
      setShowUserMenu(false)

      // Redirect to login page
      navigate("/login")
    } else {
      // If switching from admin mode to regular mode, just update the state
      localStorage.setItem("isAdmin", "false")
      setIsAdmin(false)
      setShowUserMenu(false)
    }
  }

  const toggleUserMenu = () => {
    setShowUserMenu(!showUserMenu)
  }

  const toggleMobileMenu = () => {
    setShowMobileMenu(!showMobileMenu)
  }

  // Check if a link is active
  const isActive = (path) => {
    return location.pathname === path
  }

  return (
    <nav className="navbar sticky-top bg-white shadow-sm py-2">
      <div className="container">
        <div className="d-flex justify-content-between align-items-center w-100">
          {/* Logo */}
          <Link to="/" className="navbar-brand d-flex align-items-center">
            <div
              className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center me-2 logo-icon"
              style={{ width: "38px", height: "38px" }}
            >
              <span className="fw-bold">+</span>
            </div>
            <span className="fw-bold fs-4">HealthCare</span>
          </Link>

          {/* Mobile Menu Button */}
          <button className="mobile-menu-button d-lg-none" onClick={toggleMobileMenu} aria-label="Toggle navigation">
            {showMobileMenu ? <X size={24} /> : <Menu size={24} />}
          </button>

          {/* Navigation Links */}
          <div className={`navbar-collapse ${showMobileMenu ? "show" : ""}`}>
            <ul className="navbar-nav d-flex flex-column flex-lg-row align-items-start align-items-lg-center gap-3 ms-0 ms-lg-4 mt-3 mt-lg-0">
              <li className="nav-item">
                <Link
                  to="/"
                  className={`nav-link ${isActive("/") ? "active" : ""}`}
                  onClick={() => setShowMobileMenu(false)}
                >
                  <Home size={18} className="me-2 d-lg-none" />
                  Home
                </Link>
              </li>

              {isAuthenticated && (
                <>
                  <li className="nav-item">
                    <Link
                      to="/appointments"
                      className={`nav-link ${isActive("/appointments") ? "active" : ""}`}
                      onClick={() => setShowMobileMenu(false)}
                    >
                      <Calendar size={18} className="me-2 d-lg-none" />
                      Appointments
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link
                      to="/favorites"
                      className={`nav-link ${isActive("/favorites") ? "active" : ""}`}
                      onClick={() => setShowMobileMenu(false)}
                    >
                      <Heart size={18} className="me-2 d-lg-none" />
                      Favorites
                    </Link>
                  </li>
                </>
              )}

              {isAdmin && (
                <li className="nav-item">
                  <Link
                    to="/add-doctor"
                    className={`nav-link ${isActive("/add-doctor") ? "active" : ""} text-primary`}
                    onClick={() => setShowMobileMenu(false)}
                  >
                    <Plus size={18} className="me-2" />
                    Add Doctor
                  </Link>
                </li>
              )}
            </ul>
          </div>

          {/* User Menu */}
          <div className={`${showMobileMenu ? "d-block mt-3" : "d-none"} d-lg-block`}>
            {isAuthenticated ? (
              <div className="position-relative user-menu-container">
                <button className="user-button" onClick={toggleUserMenu} aria-label="User menu">
                  <User size={20} />
                </button>

                {showUserMenu && (
                  <div className="user-dropdown">
                    <div className="user-info">
                      <div className="username">{username}</div>
                      {email && <div className="email">{email}</div>}
                    </div>

                    <Link to="/profile" className="dropdown-item" onClick={() => setShowUserMenu(false)}>
                      <Settings size={18} />
                      <span>Profile Settings</span>
                    </Link>

                    <button className="dropdown-item" onClick={toggleAdminMode}>
                      {isAdmin ? (
                        <>
                          <span>Exit Admin Mode</span>
                        </>
                      ) : (
                        <>
                          <span>Enter Admin Mode</span>
                        </>
                      )}
                    </button>

                    <button className="dropdown-item danger" onClick={handleLogout}>
                      <LogOut size={18} />
                      <span>Logout</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="d-flex gap-2">
                <Link to="/login" className="btn btn-outline-primary">
                  Login
                </Link>
                <Link to="/register" className="btn btn-primary">
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
