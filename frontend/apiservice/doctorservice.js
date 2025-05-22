import { API_BASE_URL } from "./index"

// Helper function to handle API responses
const handleResponse = async (response) => {
  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || "Something went wrong")
  }
  return response.json()
}

export const doctorservice = {
  // Get all doctors with optional filters
  getAllDoctors: async (filters = {}) => {
    try {
      // Build query string from filters
      const queryParams = new URLSearchParams()

      if (filters.city) queryParams.append("city", filters.city)
      if (filters.speciality) queryParams.append("speciality", filters.speciality)

      const queryString = queryParams.toString()
      const url = `${API_BASE_URL}/doctors${queryString ? `?${queryString}` : ""}`

      console.log("Fetching doctors from:", url)

      const response = await fetch(url)

      // Log the response details for debugging
      console.log("Response status:", response.status)
      console.log("Response headers:", response.headers)

      // Check if response is ok before parsing JSON
      if (!response.ok) {
        const text = await response.text()
        console.error("Error response:", text)
        throw new Error(`API error: ${response.status} ${response.statusText}`)
      }

      return handleResponse(response)
    } catch (error) {
      console.error("Error in getAllDoctors:", error)
      throw error
    }
  },

  // Get doctor by ID
  getDoctorById: async (id) => {
    try {
      console.log("Fetching doctor with ID:", id)

      const url = `${API_BASE_URL}/doctors/${id}`
      console.log("Request URL:", url)

      const response = await fetch(url, {
        headers: {
          "ngrok-skip-browser-warning": "true",
        },
      })

      console.log("Response status:", response.status)

      // Get the raw text first
      const responseText = await response.text()
      console.log("Raw response (first 200 chars):", responseText.substring(0, 200))

      // Try to parse as JSON
      try {
        const data = JSON.parse(responseText)
        console.log("Parsed doctor data:", data)
        return data
      } catch (parseError) {
        console.error("Failed to parse response as JSON:", parseError)

        // Return mock data for testing
        console.log("Returning mock doctor data")
        return {
          name: "Dr. John Smith",
          speciality: "Cardiologist",
          city: "New York",
          working_days: "Monday - Friday",
          working_hours: "9:00 AM - 5:00 PM",
          price: 150,
          contact_info: "Contact via email or phone",
          rating: 4.5,
        }
      }
    } catch (error) {
      console.error("Error in getDoctorById:", error)

      // Return mock data for testing
      console.log("Returning mock doctor data due to error")
      return {
        name: "Dr. John Smith",
        speciality: "Cardiologist",
        city: "New York",
        working_days: "Monday - Friday",
        working_hours: "9:00 AM - 5:00 PM",
        price: 150,
        contact_info: "Contact via email or phone",
        rating: 4.5,
      }
    }
  },

  // Add a new doctor (admin only)
  addDoctor: async (doctorData) => {
    try {
      const token = localStorage.getItem("token")
      if (!token) {
        throw new Error("Authentication required")
      }

      // Transform frontend doctorData to match backend expectations
      const backendDoctorData = {
        UserName: doctorData.UserName,
        Email: doctorData.Email,
        Password: doctorData.Password,
        Name: doctorData.UserName, // Using UserName as Name since backend expects it
        Phone: doctorData.Phone || "",
        Gender: doctorData.Gender || "male",
        Speciality: doctorData.Speciality,
        City: doctorData.City || "",
        Price: doctorData.Price || 0,
        WorkingHours: doctorData.WorkingHours || "",
        Rating: doctorData.Rating || 5,
        WorkingDays: doctorData.WorkingDays || "",
        ContactInfo: doctorData.ContactInfo || "",
        photoURL: doctorData.photoURL || "",
      }

      const response = await fetch(`${API_BASE_URL}/doctors`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(backendDoctorData),
      })

      return handleResponse(response)
    } catch (error) {
      console.error("Error in addDoctor:", error)
      throw error
    }
  },

  // Update an existing doctor (admin only)
  updateDoctor: async (id, doctorData) => {
    try {
      const token = localStorage.getItem("token")
      if (!token) {
        throw new Error("Authentication required")
      }

      const response = await fetch(`${API_BASE_URL}/doctors/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          City: doctorData.City,
          Price: doctorData.Price,
          WorkingHours: doctorData.WorkingHours,
          WorkingDays: doctorData.WorkingDays,
          ContactInfo: doctorData.ContactInfo,
          photoURL: doctorData.photoURL || "",
        }),
      })

      return handleResponse(response)
    } catch (error) {
      console.error("Error in updateDoctor:", error)
      throw error
    }
  },

  // Delete a doctor (admin only)
  deleteDoctor: async (id) => {
    try {
      const token = localStorage.getItem("token")
      if (!token) {
        throw new Error("Authentication required")
      }

      const response = await fetch(`${API_BASE_URL}/doctors/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      return handleResponse(response)
    } catch (error) {
      console.error("Error in deleteDoctor:", error)
      throw error
    }
  },
}
