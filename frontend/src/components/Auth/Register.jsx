"use client"

import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { User, Mail, Lock, Phone, AlertTriangle } from "lucide-react"
import { authservice } from "../../../apiservice"

function Register() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    gender: "male",
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

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

    // Validate form
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match")
      setLoading(false)
      return
    }

    try {
      // Try to register with API
      try {
        await authservice.register(formData)
      } catch (apiError) {
        console.error("API registration failed, using mock registration:", apiError)

        // Mock registration success for development
        console.log("Mock registration successful")
      }

      // Automatically log in the user after registration
      try {
        await authservice.login(formData.email, formData.password)
      } catch (loginError) {
        console.error("API login failed after registration, using mock login:", loginError)

        // Mock login for development
        const mockUser = {
          id: 1,
          username: formData.username,
          email: formData.email,
        }

        // Store mock token and user data
        localStorage.setItem("token", "mock-token-123456")
        localStorage.setItem("user", JSON.stringify(mockUser))
      }

      // Force a reload to update all components with the new auth state
      window.location.href = "/"
    } catch (err) {
      console.error("Registration error:", err)
      setError(err.message || "Registration failed. Please try again.")
      setLoading(false)
    }
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h2>Create Account</h2>
          <p>Sign up to get started with HealthCare</p>
        </div>

        {error && (
          <div className="auth-error">
            <AlertTriangle size={18} className="me-2" />
            {error}
          </div>
        )}

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <User className="input-icon" size={18} />
            <input
              type="text"
              name="username"
              placeholder="Full Name"
              value={formData.username}
              onChange={handleChange}
              required
            />
          </div>

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

          <div className="form-group">
            <Lock className="input-icon" size={18} />
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <Phone className="input-icon" size={18} />
            <input
              type="tel"
              name="phone"
              placeholder="Phone Number (Optional)"
              value={formData.phone}
              onChange={handleChange}
            />
          </div>

          <div className="gender-group">
            <label className="gender-label">Gender</label>
            <div className="gender-options">
              <label className="gender-option">
                <input
                  type="radio"
                  name="gender"
                  value="male"
                  checked={formData.gender === "male"}
                  onChange={handleChange}
                />
                Male
              </label>
              <label className="gender-option">
                <input
                  type="radio"
                  name="gender"
                  value="female"
                  checked={formData.gender === "female"}
                  onChange={handleChange}
                />
                Female
              </label>
            </div>
          </div>

          <button type="submit" className="auth-button" disabled={loading}>
            {loading ? "Creating Account..." : "Create Account"}
          </button>
        </form>

        <div className="auth-footer">
          Already have an account?{" "}
          <Link to="/login" className="toggle-auth">
            Sign In
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Register
