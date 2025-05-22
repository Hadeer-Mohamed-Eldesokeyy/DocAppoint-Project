import { API_BASE_URL } from "./index"

// Helper function to handle API responses
const handleResponse = async (response) => {
  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || "Something went wrong")
  }
  return response.json()
}

export const reviewservice = {
  // Get reviews for a specific doctor
  getDoctorReviews: async (doctorId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/reviews/${doctorId}`)
      return handleResponse(response)
    } catch (error) {
      console.error("Error in getDoctorReviews:", error)
      throw error
    }
  },

  // Add a new review
  addReview: async (reviewData) => {
    try {
      const token = localStorage.getItem("token")
      if (!token) {
        throw new Error("Authentication required")
      }

      const response = await fetch(`${API_BASE_URL}/reviews`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(reviewData),
      })

      return handleResponse(response)
    } catch (error) {
      console.error("Error in addReview:", error)
      throw error
    }
  },

  // Delete a review
  deleteReview: async (reviewId) => {
    try {
      const token = localStorage.getItem("token")
      if (!token) {
        throw new Error("Authentication required")
      }

      const response = await fetch(`${API_BASE_URL}/reviews/${reviewId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      return handleResponse(response)
    } catch (error) {
      console.error("Error in deleteReview:", error)
      throw error
    }
  },
}
