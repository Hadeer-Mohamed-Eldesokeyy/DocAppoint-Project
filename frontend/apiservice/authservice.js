import { API_BASE_URL } from "./index"

// Helper function to handle API responses
const handleResponse = async (response) => {
  const data = await response.json()

  if (!response.ok) {
    if (response.status === 401) {
      // Auto logout if 401 response returned from api
      localStorage.removeItem("token")
      localStorage.removeItem("user")
    }

    const error = data.message || response.statusText
    return Promise.reject(error)
  }

  return data
}

export const authservice = {
  // Login user
  login: async (email, password) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      })

      const data = await handleResponse(response)

      // Store user details and token in local storage
      if (data.token) {
        localStorage.setItem("token", data.token.token)
        localStorage.setItem(
          "user",
          JSON.stringify({
            id: data.token.id,
            username: data.token.username,
            email: data.token.email,
          }),
        )
      }

      return data
    } catch (error) {
      console.error("Error in login:", error)
      throw error
    }
  },

  // Register new user
  register: async (userData) => {
    try {
      // Transform frontend userData to match backend expectations
      const backendUserData = {
        username: userData.username,
        email: userData.email,
        password: userData.password,
        phone: userData.phone || "",
        gender: userData.gender || "male",
      }

      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(backendUserData),
      })

      return handleResponse(response)
    } catch (error) {
      console.error("Error in register:", error)
      throw error
    }
  },

  // Logout user
  logout: () => {
    // Remove user from local storage
    localStorage.removeItem("token")
    localStorage.removeItem("user")
  },

  // Get user profile
  getUserProfile: async () => {
    try {
      const token = localStorage.getItem("token")

      if (!token) {
        return null
      }

      const response = await fetch(`${API_BASE_URL}/auth/profile`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        // If token is invalid, clear storage
        if (response.status === 401) {
          localStorage.removeItem("token")
          localStorage.removeItem("user")
        }
        return null
      }

      return handleResponse(response)
    } catch (error) {
      console.error("Error in getUserProfile:", error)
      return null
    }
  },

  // Update user profile
  updateUserProfile: async (userData) => {
    try {
      const token = localStorage.getItem("token")
      if (!token) {
        throw new Error("Authentication required")
      }

      const response = await fetch(`${API_BASE_URL}/auth/profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          username: userData.username,
          email: userData.email,
          phone: userData.phone,
        }),
      })

      return handleResponse(response)
    } catch (error) {
      console.error("Error in updateUserProfile:", error)
      throw error
    }
  },

  // Change password
  changePassword: async (oldPassword, newPassword) => {
    try {
      const token = localStorage.getItem("token")
      if (!token) {
        throw new Error("Authentication required")
      }

      const response = await fetch(`${API_BASE_URL}/auth/change_password`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          old_password: oldPassword,
          new_password: newPassword,
        }),
      })

      return handleResponse(response)
    } catch (error) {
      console.error("Error in changePassword:", error)
      throw error
    }
  },

  // Check if user is authenticated
  isAuthenticated: () => {
    return !!localStorage.getItem("token")
  },
}
