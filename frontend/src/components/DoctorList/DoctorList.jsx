"use client"

import { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Search, MapPin, Stethoscope, Star, Calendar, Clock, Filter } from "lucide-react"
import { API_BASE_URL } from "../../../apiservice" // Import API_BASE_URL directly

function DoctorsList() {
  const navigate = useNavigate()
  const [doctors, setDoctors] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [rawResponse, setRawResponse] = useState(null) // Store raw response for debugging
  const [filters, setFilters] = useState({
    city: "",
    speciality: "",
  })
  const [showFilters, setShowFilters] = useState(false)

  useEffect(() => {
    fetchDoctors()
  }, [])

  // Modified to only use API data, no mock data
  const fetchDoctors = async () => {
    setLoading(true)
    setRawResponse(null)
    try {
      // Build query string from filters
      const queryParams = new URLSearchParams()
      if (filters.city) queryParams.append("city", filters.city)
      if (filters.speciality) queryParams.append("speciality", filters.speciality)

      const queryString = queryParams.toString()
      const url = `${API_BASE_URL}/doctors${queryString ? `?${queryString}` : ""}`

      console.log("Fetching doctors from:", url)

      const response = await fetch(url, {
        // Add CORS mode explicitly
        mode: "cors",
        headers: {
          "ngrok-skip-browser-warning": "true",
        },
      })

      // Log response details for debugging
      console.log("Response status:", response.status)
      console.log("Response headers:", response.headers)

      // Get the raw text first to see what's being returned
      const responseText = await response.text()
      console.log("Raw response:", responseText)
      setRawResponse(responseText)

      // If it's not JSON, this will throw an error
      let doctorsData
      try {
        doctorsData = JSON.parse(responseText)
      } catch (parseError) {
        console.error("Failed to parse response as JSON:", parseError)
        throw new Error("The API returned an invalid response format. Expected JSON, got HTML or text.")
      }

      if (!doctorsData || !Array.isArray(doctorsData)) {
        console.error("Invalid data format:", doctorsData)
        throw new Error("Invalid data format received from API")
      }

      setDoctors(doctorsData)
      setError(null)
    } catch (err) {
      console.error("Error fetching doctors:", err)
      setError(`Failed to load doctors list: ${err.message}`)
      setDoctors([]) // Set empty array instead of mock data
    } finally {
      setLoading(false)
    }
  }

  const handleFilterChange = (e) => {
    const { name, value } = e.target
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const applyFilters = (e) => {
    e.preventDefault()
    fetchDoctors()
    setShowFilters(false)
  }

  const resetFilters = () => {
    setFilters({ city: "", speciality: "" })
    fetchDoctors()
  }

  const toggleFilters = () => {
    setShowFilters(!showFilters)
  }

  const handleBookNow = (doctorId) => {
    navigate(`/book-appointment/${doctorId}`)
  }

  return (
    <div className="w-100">
      {/* Hero Section */}
      <div
        className="bg-primary text-white py-5 text-center w-100"
        style={{
          backgroundImage:
            'linear-gradient(rgba(13, 110, 253, 0.65), rgba(13, 110, 253, 0.65)), url("https://www.newtimes.co.rw/uploads/imported_images/files/main/articles/2018/10/10/digital.jpg")',
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        <div className="container py-3">
          <h1 className="display-4 fw-bold mb-3">Find the Right Doctor for Your Health</h1>
          <p className="lead mb-4">Search from our network of qualified healthcare professionals</p>
          <button className="btn btn-light d-flex align-items-center mx-auto" onClick={toggleFilters}>
            <Filter size={18} className="me-2" />
            Filter Doctors
          </button>
          <div className={`mt-4 bg-white rounded p-4 shadow ${showFilters ? "d-block" : "d-none"}`}>
            <form onSubmit={applyFilters}>
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label htmlFor="city" className="form-label d-flex align-items-center">
                    <MapPin size={16} className="me-2" />
                    City
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="city"
                    name="city"
                    value={filters.city}
                    onChange={handleFilterChange}
                    placeholder="Filter by city"
                  />
                </div>

                <div className="col-md-6 mb-3">
                  <label htmlFor="speciality" className="form-label d-flex align-items-center">
                    <Stethoscope size={16} className="me-2" />
                    Speciality
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="speciality"
                    name="speciality"
                    value={filters.speciality}
                    onChange={handleFilterChange}
                    placeholder="Filter by speciality"
                  />
                </div>
              </div>

              <div className="d-flex justify-content-center gap-2 mt-3">
                <button type="submit" className="btn btn-primary d-flex align-items-center">
                  <Search size={16} className="me-2" />
                  Search Doctors
                </button>
                <button type="button" className="btn btn-outline-secondary" onClick={resetFilters}>
                  Reset
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Doctors Section */}
      <div className="container py-5 w-100">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="mb-0">Available Doctors</h2>
          {!loading && !error && doctors.length > 0 && (
            <p className="mb-0 text-muted">{doctors.length} doctors found</p>
          )}
        </div>

        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-primary mb-3" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p>Loading doctors...</p>
          </div>
        ) : error ? (
          <div className="text-center py-5 bg-white rounded shadow-sm">
            <div
              className="bg-danger text-white rounded-circle d-flex align-items-center justify-content-center mx-auto mb-3"
              style={{ width: "60px", height: "60px", fontSize: "1.5rem" }}
            >
              !
            </div>
            <p>{error}</p>

            {/* Display API diagnostic information */}
            <div className="alert alert-warning mt-3 text-start">
              <h5>API Diagnostic Information:</h5>
              <p>The API returned HTML instead of JSON. This usually indicates one of these issues:</p>
              <ul className="mb-3">
                <li>The API URL is incorrect</li>
                <li>The API server is returning an error page</li>
                <li>There's a CORS (Cross-Origin Resource Sharing) issue</li>
              </ul>
              <p>
                Current API URL: <code>{API_BASE_URL}/doctors</code>
              </p>

              {rawResponse && (
                <div className="mt-3">
                  <p>First 200 characters of response:</p>
                  <pre className="bg-light p-2 rounded" style={{ maxHeight: "150px", overflow: "auto" }}>
                    {rawResponse.substring(0, 200)}...
                  </pre>
                </div>
              )}
            </div>

            <button onClick={fetchDoctors} className="btn btn-primary">
              Try Again
            </button>
          </div>
        ) : doctors.length === 0 ? (
          <div className="text-center py-5 bg-white rounded shadow-sm">
            <div className="mb-3">🔍</div>
            <h3>No doctors found</h3>
            <p>Try adjusting your filters or search criteria</p>
          </div>
        ) : (
          <div className="row g-4">
            {doctors.map((doctor, index) => {
              // Check if doctor has a valid ID
              const hasValidId = doctor.D_ID && doctor.D_ID !== 0

              return (
                <div key={doctor.D_ID || index} className="col-md-6 col-lg-4">
                  <div className="card h-100 shadow-sm hover-card">
                    <div className="card-header bg-light d-flex justify-content-between align-items-center">
                      {doctor.photoURL ? (
                        <img
                          src={doctor.photoURL || "/placeholder.svg"}
                          alt={doctor.name}
                          className="rounded-circle"
                          style={{ width: "60px", height: "60px", objectFit: "cover" }}
                        />
                      ) : (
                        <div
                          className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center"
                          style={{ width: "60px", height: "60px", fontSize: "1.5rem", fontWeight: "bold" }}
                        >
                          {doctor.name ? doctor.name.charAt(0).toUpperCase() : "D"}
                        </div>
                      )}
                      <div className="d-flex align-items-center">
                        <Star size={16} fill="#FFD700" color="#FFD700" />
                        <span className="ms-1 fw-bold">{doctor.rating}</span>
                      </div>
                    </div>

                    <div className="card-body">
                      <h5 className="card-title">{doctor.name}</h5>
                      <p className="card-text d-flex align-items-center text-muted mb-2">
                        <Stethoscope size={16} className="me-2" />
                        {doctor.speciality}
                      </p>
                      <p className="card-text d-flex align-items-center text-muted mb-2">
                        <MapPin size={16} className="me-2" />
                        {doctor.city}
                      </p>

                      {doctor.working_days && (
                        <p className="card-text d-flex align-items-center text-muted mb-2">
                          <Calendar size={16} className="me-2" />
                          {doctor.working_days}
                        </p>
                      )}

                      {doctor.working_hours && (
                        <p className="card-text d-flex align-items-center text-muted mb-2">
                          <Clock size={16} className="me-2" />
                          {doctor.working_hours}
                        </p>
                      )}
                    </div>

                    <div className="card-footer bg-white d-flex gap-2">
                      {hasValidId ? (
                        <Link
                          to={`/doctor/${doctor.D_ID}`}
                          className="btn btn-outline-primary flex-grow-1"
                          onClick={() => console.log("Navigating to doctor ID:", doctor.D_ID)}
                        >
                          View Profile
                        </Link>
                      ) : (
                        <button
                          className="btn btn-outline-secondary flex-grow-1"
                          disabled
                          title="Profile not available"
                        >
                          Profile Unavailable
                        </button>
                      )}
                      <button
                        className="btn btn-success flex-grow-1"
                        onClick={() => handleBookNow(doctor.D_ID)}
                        disabled={!hasValidId}
                      >
                        Book Now
                      </button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

export default DoctorsList
