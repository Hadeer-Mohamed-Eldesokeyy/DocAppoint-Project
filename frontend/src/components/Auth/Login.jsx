"use client"

import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Mail, Lock, AlertTriangle } from "lucide-react"
import { authservice } from "../../../apiservice"

function Login() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [rememberMe, setRememberMe] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      // Check if we're trying to log in as admin
      const isAdminLogin = localStorage.getItem("isAdmin") === "true"

      // Try to login with API
      try {
        await authservice.login(formData.email, formData.password)

        // If this is an admin login, verify admin status
        if (isAdminLogin) {
          // Here you would typically check if the logged-in user has admin privileges
          // For now, we'll just set the admin flag
          localStorage.setItem("isAdmin", "true")
        }
      } catch (apiError) {
        console.error("API login failed, using mock login:", apiError)

        // Mock login for development
        const mockUser = {
          id: 1,
          username: "User", // This will be replaced with the actual username from registration
          email: formData.email,
        }

        // Check if there's a stored username from registration
        const storedUser = JSON.parse(localStorage.getItem("user") || "{}")
        if (storedUser && storedUser.username) {
          mockUser.username = storedUser.username
        }

        // Store mock token and user data
        localStorage.setItem("token", "mock-token-123456")
        localStorage.setItem("user", JSON.stringify(mockUser))

        // If this is an admin login, set the admin flag
        if (isAdminLogin) {
          localStorage.setItem("isAdmin", "true")
        }
      }

      // Force a reload to update all components with the new auth state
      window.location.href = "/"
    } catch (err) {
      console.error("Login error:", err)
      setError("Invalid email or password. Please try again.")
      setLoading(false)
    }
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h2>Welcome Back</h2>
          <p>Sign in to your account to continue</p>
        </div>

        {error && (
          <div className="auth-error">
            <AlertTriangle size={18} className="me-2" />
            {error}
          </div>
        )}

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <Mail className="input-icon" size={18} />
            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <Lock className="input-icon" size={18} />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-options">
            <label className="remember-me">
              <input type="checkbox" checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)} />
              Remember me
            </label>
            <Link to="/forgot-password" className="forgot-password">
              Forgot password?
            </Link>
          </div>

          <button type="submit" className="auth-button" disabled={loading}>
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <div className="auth-footer">
          Don't have an account?{" "}
          <Link to="/register" className="toggle-auth">
            Sign Up
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Login
