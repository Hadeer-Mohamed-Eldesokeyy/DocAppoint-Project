import { API_BASE_URL } from "./index"

// Helper function to handle API responses
const handleResponse = async (response) => {
  // Check if response is empty
  const text = await response.text()

  // If the response is empty, return an empty array
  if (!text.trim()) {
    return []
  }

  // Try to parse the response
  try {
    const data = JSON.parse(text)

    // If we have a "No appointments found" message, return an empty array
    if (data.error && data.error.includes("No appointments found")) {
      console.log("API returned: No appointments found")
      return []
    }

    // If we have an error message and the response is not OK
    if (!response.ok && (data.error || data.message)) {
      throw new Error(data.error || data.message)
    }

    // If we have an array, return it
    if (Array.isArray(data)) {
      return data
    }

    // Otherwise, return an empty array
    return []
  } catch (e) {
    console.error("Failed to parse JSON:", e)

    // If the response is not OK, throw an error
    if (!response.ok) {
      throw new Error(`Error: ${response.status} ${response.statusText}`)
    }

    // Otherwise, throw an error
    throw new Error("Invalid JSON response from API")
  }
}

export const appointmentservice = {
  // Get all appointments (admin only)
  getAllAppointments: async () => {
    try {
      const token = localStorage.getItem("token")
      if (!token) throw new Error("Authentication required")

      const response = await fetch(`${API_BASE_URL}/appointments`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "ngrok-skip-browser-warning": "true",
        },
      })

      return handleResponse(response)
    } catch (error) {
      console.error("Error in getAllAppointments:", error)
      throw error
    }
  },

  // Get appointments for a specific user
  getUserAppointments: async (userId) => {
    try {
      const token = localStorage.getItem("token")
      if (!token) throw new Error("Authentication required")

      const user = userId || JSON.parse(localStorage.getItem("user"))?.id

      if (!user) {
        throw new Error("User ID not found")
      }

      console.log(`Fetching appointments for user ${user}`)

      const response = await fetch(`${API_BASE_URL}/appointments/user/${user}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "ngrok-skip-browser-warning": "true",
        },
      })

      console.log("Response status:", response.status)
      console.log("Response headers:", Object.fromEntries(response.headers.entries()))

      // Special handling for 404 with "No appointments found" message
      if (response.status === 404) {
        const text = await response.text()
        if (text.includes("No appointments found")) {
          console.log("No appointments found - returning empty array")
          return []
        }
      }

      return handleResponse(response)
    } catch (error) {
      console.error("Error in getUserAppointments:", error)
      throw error
    }
  },

  // Book a new appointment
  bookAppointment: async (appointmentData) => {
    try {
      const token = localStorage.getItem("token")
      if (!token) throw new Error("Authentication required")

      const user = JSON.parse(localStorage.getItem("user"))
      const P_ID = user.id
      const D_ID = appointmentData.D_ID

      if (!P_ID || !D_ID) {
        throw new Error("Missing user ID or doctor ID")
      }

      // Format the date properly for SQL Server
      const formattedDate = new Date(appointmentData.date).toISOString().split("T")[0]

      const response = await fetch(`${API_BASE_URL}/appointments/user/${P_ID}/${D_ID}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          "ngrok-skip-browser-warning": "true",
        },
        body: JSON.stringify({
          date: formattedDate, // Use the formatted date
          consultant_type: appointmentData.consultant_type,
        }),
      })

      return handleResponse(response)
    } catch (error) {
      console.error("Error in bookAppointment:", error)
      throw error
    }
  },

  // Delete all appointments for a user
  deleteAppointmentsByUser: async (userId, doctorId) => {
    try {
      const token = localStorage.getItem("token")
      if (!token) throw new Error("Authentication required")

      const user = userId || JSON.parse(localStorage.getItem("user"))?.id

      if (!user) {
        throw new Error("User ID not found")
      }

      if (!doctorId) {
        // Try to get doctor ID from localStorage
        const selectedDoctor = JSON.parse(localStorage.getItem("selectedDoctor") || "{}")
        doctorId = selectedDoctor.D_ID

        if (!doctorId) {
          throw new Error("Doctor ID not found")
        }
      }

      const response = await fetch(`${API_BASE_URL}/appointments/user/${user}/${doctorId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "ngrok-skip-browser-warning": "true",
        },
      })

      return handleResponse(response)
    } catch (error) {
      console.error("Error in deleteAppointmentsByUser:", error)
      throw error
    }
  },
}
