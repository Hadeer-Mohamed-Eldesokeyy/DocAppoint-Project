"use client"

import { createContext, useState, useEffect, useContext } from "react"
import { authservice } from "../../apiservice"

// Create context
const AuthContext = createContext(null)

// Provider component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    // Check if user is logged in
    const checkAuthStatus = async () => {
      setLoading(true)
      try {
        // Get user profile from API
        const userProfile = await authservice.getUserProfile()

        if (userProfile) {
          setUser(userProfile)

          // Check if admin status is stored in localStorage
          const storedAdminStatus = localStorage.getItem("isAdmin") === "true"
          setIsAdmin(storedAdminStatus)
        } else {
          setUser(null)
          setIsAdmin(false)
        }
      } catch (error) {
        console.error("Auth check error:", error)
        setUser(null)
        setIsAdmin(false)
      } finally {
        setLoading(false)
      }
    }

    checkAuthStatus()
  }, [])

  // Login function
  const login = async (email, password) => {
    try {
      const response = await authservice.login(email, password)

      if (response && response.token) {
        // Get user profile after login
        const userProfile = await authservice.getUserProfile()
        setUser(userProfile)
        return { success: true }
      }

      return { success: false, error: "Invalid credentials" }
    } catch (error) {
      console.error("Login error:", error)
      return { success: false, error: error.message || "Login failed" }
    }
  }

  // Register function
  const register = async (userData) => {
    try {
      const response = await authservice.register(userData)
      return { success: true, data: response }
    } catch (error) {
      console.error("Register error:", error)
      return { success: false, error: error.message || "Registration failed" }
    }
  }

  // Logout function
  const logout = () => {
    authService.logout()
    setUser(null)
    setIsAdmin(false)
  }

  // Toggle admin mode
  const toggleAdminMode = () => {
    const newAdminStatus = !isAdmin
    setIsAdmin(newAdminStatus)
    localStorage.setItem("isAdmin", newAdminStatus.toString())
  }

  // Context value
  const value = {
    user,
    isAdmin,
    loading,
    login,
    register,
    logout,
    toggleAdminMode,
    isAuthenticated: !!user,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
