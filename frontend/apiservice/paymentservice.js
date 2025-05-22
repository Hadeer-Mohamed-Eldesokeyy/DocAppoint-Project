import { API_BASE_URL } from "./index"

// Helper function to handle API responses
const handleResponse = async (response) => {
  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || "Something went wrong")
  }
  return response.json()
}

export const paymentservice = {
  // Process a payment checkout
  checkout: async (paymentData) => {
    try {
      const token = localStorage.getItem("token")
      if (!token) {
        throw new Error("Authentication required")
      }

      const response = await fetch(`${API_BASE_URL}/payments/checkout/${paymentData.d_id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          method: paymentData.method,
          amount: paymentData.amount,
        }),
      })

      return handleResponse(response)
    } catch (error) {
      console.error("Error in payment checkout:", error)
      throw error
    }
  },

  // Get invoice details
  getInvoice: async (paymentId) => {
    try {
      const token = localStorage.getItem("token")
      if (!token) {
        throw new Error("Authentication required")
      }

      const response = await fetch(`${API_BASE_URL}/payments/invoice/${paymentId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      return handleResponse(response)
    } catch (error) {
      console.error("Error in getInvoice:", error)
      throw error
    }
  },
}
