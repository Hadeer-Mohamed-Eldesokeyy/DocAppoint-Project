"use client"

import { useState, useEffect } from "react"
import { Calendar, User, MapPin, X, Check, AlertTriangle, RefreshCw, Clock, Stethoscope, Heart } from 'lucide-react'
import { API_BASE_URL } from "../../../apiservice" // Import API_BASE_URL directly

const AppointmentList = () => {
  const [appointments, setAppointments] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [cancelLoading, setCancelLoading] = useState(false)
  const [refreshing, setRefreshing] = useState(false)

  // Fetch appointments on component mount
  useEffect(() => {
    fetchAppointments()
  }, [])

  // Improved function to fetch appointments - no mock data
  const fetchAppointments = async () => {
    try {
      setLoading(true)
      setError(null)
      setRefreshing(true)

      const token = localStorage.getItem("token")
      const user = JSON.parse(localStorage.getItem("user") || "{}")

      if (!user.id || !token) {
        throw new Error("User not authenticated")
      }

      console.log("Fetching appointments for user ID:", user.id)

      // Define the API URL
      const url = `${API_BASE_URL}/appointments/user/${user.id}`
      console.log("Fetching appointments from:", url)

      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
          "ngrok-skip-browser-warning": "true",
          "Content-Type": "application/json",
        },
      })

      console.log("Response status:", response.status)

      // Get the response text
      const responseText = await response.text()
      console.log("Raw response:", responseText)

      // Special handling for "No appointments found" message
      if (responseText.includes("No appointments found")) {
        console.log("No appointments found for this user - this is normal")
        setAppointments([])
        setError(null)
        setLoading(false)
        setRefreshing(false)
        return
      }

      // Check if response is ok (for other errors)
      if (!response.ok) {
        throw new Error(`API error: ${response.status} ${response.statusText}`)
      }

      // Try to parse as JSON
      let data = []
      if (responseText.trim()) {
        try {
          const parsedData = JSON.parse(responseText)
          console.log("Parsed response:", parsedData)

          // If we have an array, use it
          if (Array.isArray(parsedData)) {
            data = parsedData
          } else {
            // If we have an error message but not the "No appointments found" message
            if (parsedData.error) {
              throw new Error(parsedData.error)
            }
            // Otherwise, use an empty array
            data = []
          }

          console.log("Appointments data:", data)
        } catch (parseError) {
          console.error("Failed to parse response as JSON:", parseError)
          throw new Error("Invalid JSON response from API")
        }
      }

      // For each appointment, try to fetch the doctor's name
      const appointmentsWithDoctorNames = await Promise.all(
        data.map(async (appointment) => {
          try {
            // Try to get doctor name if we have D_ID
            if (appointment.D_ID) {
              const doctorName = await fetchDoctorName(appointment.D_ID)
              return { ...appointment, doctor_name: doctorName }
            }
            return appointment
          } catch (error) {
            console.error("Error fetching doctor name:", error)
            return appointment
          }
        }),
      )

      setAppointments(appointmentsWithDoctorNames)
    } catch (err) {
      console.error("❌ Fetch error:", err)
      setError(`Error: ${err.message}. Please check the console for more details.`)
      setAppointments([]) // Empty array instead of mock data
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  // Helper function to fetch doctor name
  const fetchDoctorName = async (doctorId) => {
    try {
      const url = `${API_BASE_URL}/doctors/${doctorId}`
      console.log("Fetching doctor details from:", url)

      const response = await fetch(url, {
        headers: {
          "ngrok-skip-browser-warning": "true",
        },
      })

      if (!response.ok) {
        throw new Error(`Failed to fetch doctor: ${response.status}`)
      }

      const doctorData = await response.json()
      return doctorData.name || "Unknown Doctor"
    } catch (error) {
      console.error("Error fetching doctor name:", error)
      return "Unknown Doctor"
    }
  }

  // Fixed handleCancelAppointment function
  const handleCancelAppointment = async (appointmentId) => {
    if (!window.confirm("Are you sure you want to cancel this appointment?")) {
      return
    }

    try {
      setCancelLoading(true)
      const userData = JSON.parse(localStorage.getItem("user") || "{}")
      const token = localStorage.getItem("token")

      if (!userData.id || !token) {
        throw new Error("Authentication required")
      }

      // Get the selected doctor from localStorage or use the appointment's doctor ID
      let doctorId
      try {
        const selectedDoctor = JSON.parse(localStorage.getItem("selectedDoctor") || "{}")
        doctorId = selectedDoctor.D_ID
      } catch (e) {
        // If we can't get the doctor ID from localStorage, try to get it from the appointment
        const appointment = appointments.find((app) => app.A_ID === appointmentId || app.id === appointmentId)
        doctorId = appointment?.D_ID || appointment?.doctor_id

        if (!doctorId) {
          throw new Error("Doctor ID not found. Cannot cancel appointment.")
        }
      }

      console.log("Cancelling appointment:", appointmentId, "for user:", userData.id, "and doctor:", doctorId)

      const url = `${API_BASE_URL}/appointments/user/${userData.id}/${doctorId}`
      console.log("DELETE request to:", url)

      const response = await fetch(url, {
        method: "DELETE",
        headers: {
          "ngrok-skip-browser-warning": "true",
          Authorization: `Bearer ${token}`,
        },
      })

      console.log("Cancel response status:", response.status)

      if (!response.ok) {
        const text = await response.text()
        console.error("Error response:", text)
        throw new Error(`API error: ${response.status} ${response.statusText}`)
      }

      console.log("Appointment cancelled successfully via API")

      // Update the UI
      setAppointments(appointments.filter((app) => app.id !== appointmentId && app.A_ID !== appointmentId))
      alert("Appointment cancelled successfully!")
    } catch (err) {
      console.error("Error cancelling appointment:", err)
      alert(`Failed to cancel appointment: ${err.message}`)
    } finally {
      setCancelLoading(false)
    }
  }

  // Helper function to format date
  const formatDate = (dateString) => {
    try {
      const options = { weekday: "long", year: "numeric", month: "long", day: "numeric" }
      return new Date(dateString).toLocaleDateString(undefined, options)
    } catch (error) {
      console.error("Error formatting date:", error)
      return dateString || "Unknown date"
    }
  }

  // Helper function to get status badge
  const getStatusBadge = (status) => {
    switch (status?.toLowerCase()) {
      case "confirmed":
        return <span className="badge bg-success">Confirmed</span>
      case "pending":
        return <span className="badge bg-warning text-dark">Pending</span>
      case "cancelled":
        return <span className="badge bg-danger">Cancelled</span>
      case "completed":
        return <span className="badge bg-info">Completed</span>
      case "scheduled":
        return <span className="badge bg-primary">Scheduled</span>
      default:
        return <span className="badge bg-secondary">{status || "Unknown"}</span>
    }
  }

  if (loading && !refreshing) {
    return (
      <div className="container py-5">
        <div className="card shadow-sm border-0 mb-4">
          <div className="card-body text-center py-5">
            <div className="spinner-border text-primary mb-3" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <h3 className="h4 mb-2">Loading Your Appointments</h3>
            <p className="text-muted">Please wait while we retrieve your appointment information...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container py-5">
      {/* Header with medical-themed styling */}
      <div className="card shadow-sm border-0 mb-4 bg-primary bg-gradient text-white">
        <div className="card-body p-4">
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h1 className="h3 mb-1">My Appointments</h1>
              <p className="mb-0">Manage your scheduled medical appointments</p>
            </div>
            <button 
              onClick={fetchAppointments} 
              className="btn btn-light d-flex align-items-center"
              disabled={refreshing}
            >
              {refreshing ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                  Refreshing...
                </>
              ) : (
                <>
                  <RefreshCw size={16} className="me-2" />
                  Refresh
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {error && (
        <div className="card shadow-sm border-0 border-start border-danger border-4 mb-4">
          <div className="card-body p-4">
            <div className="d-flex align-items-center mb-2">
              <AlertTriangle size={24} className="text-danger me-3" />
              <h4 className="mb-0 text-danger">Error Loading Appointments</h4>
            </div>
            <p className="mb-2">{error}</p>
            <div>
              <strong>Troubleshooting:</strong>
              <ul className="mb-0">
                <li>Check your internet connection</li>
                <li>Verify that the API server is running</li>
                <li>Try logging out and logging back in</li>
                <li>Check the browser console for more details</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {appointments.length === 0 ? (
        <div className="card shadow-sm border-0 mb-4">
          <div className="card-body text-center py-5">
            <div className="mb-3">
              <Calendar size={64} className="text-primary" />
            </div>
            <h3 className="h4 mb-2">No Appointments Found</h3>
            <p className="text-muted mb-4">You don't have any appointments scheduled at this time.</p>
            <a href="/" className="btn btn-primary">
              Find a Doctor
            </a>
          </div>
        </div>
      ) : (
        <div className="row">
          {appointments.map((appointment, index) => (
            <div key={appointment.id || appointment.A_ID || index} className="col-md-6 col-lg-4 mb-4">
              <div className="card h-100 shadow-sm border-0 hover-card">
                <div className="card-header bg-white d-flex justify-content-between align-items-center py-3 border-bottom">
                  <div className="d-flex align-items-center">
                    <Stethoscope size={18} className="text-primary me-2" />
                    <h5 className="mb-0">Medical Appointment</h5>
                  </div>
                  {getStatusBadge(appointment.status || appointment.statuses)}
                </div>
                <div className="card-body">
                  <div className="d-flex align-items-center mb-4">
                    <div
                      className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center me-3"
                      style={{ width: "60px", height: "60px", fontSize: "1.5rem", fontWeight: "bold" }}
                    >
                      {appointment.doctor_name ? appointment.doctor_name.charAt(0).toUpperCase() : "D"}
                    </div>
                    <div>
                      <h5 className="mb-1">{appointment.doctor_name || "Doctor"}</h5>
                      <p className="text-muted mb-0">{appointment.speciality || "Medical Specialist"}</p>
                    </div>
                  </div>

                  <div className="mb-3 p-3 bg-light rounded">
                    <div className="mb-2 d-flex align-items-center">
                      <Calendar size={18} className="text-primary me-2" />
                      <span className="fw-medium">Date:</span>
                      <span className="ms-2">{formatDate(appointment.date)}</span>
                    </div>

                    <div className="mb-2 d-flex align-items-center">
                      <Clock size={18} className="text-primary me-2" />
                      <span className="fw-medium">Time:</span>
                      <span className="ms-2">{appointment.time || "Scheduled Time"}</span>
                    </div>

                    {appointment.consultant_type && (
                      <div className="mb-0 d-flex align-items-center">
                        <User size={18} className="text-primary me-2" />
                        <span className="fw-medium">Type:</span>
                        <span className="ms-2 text-capitalize">{appointment.consultant_type}</span>
                      </div>
                    )}
                  </div>

                  {appointment.location && (
                    <div className="mb-2 d-flex align-items-center">
                      <MapPin size={18} className="text-primary me-2" />
                      <span>{appointment.location}</span>
                    </div>
                  )}
                </div>

                <div className="card-footer bg-white border-top py-3">
                  {appointment.statuses !== "cancelled" && appointment.statuses !== "completed" && (
                    <button
                      onClick={() => handleCancelAppointment(appointment.id || appointment.A_ID)}
                      className="btn btn-outline-danger d-flex align-items-center mx-auto"
                      disabled={cancelLoading}
                    >
                      {cancelLoading ? (
                        <>
                          <span
                            className="spinner-border spinner-border-sm me-2"
                            role="status"
                            aria-hidden="true"
                          ></span>
                          Cancelling...
                        </>
                      ) : (
                        <>
                          <X size={16} className="me-2" />
                          Cancel Appointment
                        </>
                      )}
                    </button>
                  )}

                  {appointment.statuses === "completed" && (
                    <div className="d-flex align-items-center justify-content-center text-success">
                      <Check size={18} className="me-2" />
                      <span>Appointment Completed</span>
                    </div>
                  )}

                  {(appointment.status || appointment.statuses) !== "cancelled" && (
                    <div className="d-flex align-items-center justify-content-center text-danger">
                      <X size={18} className="me-2" />
                      <span>Appointment Cancelled</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Quick Tips Section */}
      <div className="card shadow-sm border-0 mt-4 bg-light">
        <div className="card-body p-4">
          <h4 className="mb-3 d-flex align-items-center">
            <Heart size={20} className="text-danger me-2" />
            Health Tips
          </h4>
          <div className="row">
            <div className="col-md-4 mb-3 mb-md-0">
              <div className="d-flex">
                <div className="bg-primary text-white rounded-circle p-2 me-3" style={{ height: "40px", width: "40px" }}>
                  <div className="text-center fw-bold">1</div>
                </div>
                <div>
                  <h5 className="h6 mb-1">Arrive 15 Minutes Early</h5>
                  <p className="small text-muted mb-0">Allow time for check-in and paperwork</p>
                </div>
              </div>
            </div>
            <div className="col-md-4 mb-3 mb-md-0">
              <div className="d-flex">
                <div className="bg-primary text-white rounded-circle p-2 me-3" style={{ height: "40px", width: "40px" }}>
                  <div className="text-center fw-bold">2</div>
                </div>
                <div>
                  <h5 className="h6 mb-1">Bring Your ID & Insurance</h5>
                  <p className="small text-muted mb-0">Have your documents ready</p>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="d-flex">
                <div className="bg-primary text-white rounded-circle p-2 me-3" style={{ height: "40px", width: "40px" }}>
                  <div className="text-center fw-bold">3</div>
                </div>
                <div>
                  <h5 className="h6 mb-1">List Your Medications</h5>
                  <p className="small text-muted mb-0">Prepare a list of current medications</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AppointmentList
