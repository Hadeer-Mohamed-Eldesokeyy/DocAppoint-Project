"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { Star, MapPin, Stethoscope, Calendar, Clock, Heart, AlertTriangle } from "lucide-react"
import { API_BASE_URL } from "../../../apiservice" // Import API_BASE_URL directly

function Favorites() {
  const [favorites, setFavorites] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [rawResponse, setRawResponse] = useState(null) // Store raw response for debugging

  useEffect(() => {
    fetchFavorites()
  }, [])

  async function fetchFavorites() {
    try {
      setLoading(true)
      setRawResponse(null)

      // Get favorite doctor IDs from localStorage
      const favoriteIds = JSON.parse(localStorage.getItem("favoriteDoctors") || "[]")

      if (favoriteIds.length === 0) {
        setFavorites([])
        setLoading(false)
        return
      }

      // Fetch all doctors from API
      const url = `${API_BASE_URL}/doctors`
      console.log("Fetching doctors from API:", url)

      const response = await fetch(url, {
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
      let allDoctors
      try {
        allDoctors = JSON.parse(responseText)
      } catch (parseError) {
        console.error("Failed to parse response as JSON:", parseError)
        throw new Error("The API returned an invalid response format. Expected JSON, got HTML or text.")
      }

      if (!allDoctors || !Array.isArray(allDoctors)) {
        console.error("Invalid data format:", allDoctors)
        throw new Error("Invalid data format received from API")
      }

      console.log("All doctors fetched:", allDoctors.length)

      // Filter to only include favorited doctors
      const favoriteDoctors = allDoctors.filter((doctor) => favoriteIds.includes(doctor.D_ID))
      console.log("Favorite doctors filtered:", favoriteDoctors.length)

      setFavorites(favoriteDoctors)
      setError(null)
    } catch (err) {
      console.error("Error fetching favorites:", err)
      setError(`Failed to load your favorite doctors: ${err.message}`)
    } finally {
      setLoading(false)
    }
  }

  const removeFavorite = (doctorId) => {
    // Get current favorites from localStorage
    const favoriteIds = JSON.parse(localStorage.getItem("favoriteDoctors") || "[]")

    // Remove the doctor ID
    const updatedFavorites = favoriteIds.filter((id) => id !== doctorId)

    // Save back to localStorage
    localStorage.setItem("favoriteDoctors", JSON.stringify(updatedFavorites))

    // Update state to remove the doctor from the list
    setFavorites(favorites.filter((doctor) => doctor.D_ID !== doctorId))
  }

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-primary mb-3" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p>Loading your favorites...</p>
      </div>
    )
  }

  return (
    <div className="container py-5">
      <h1 className="mb-4">My Favorite Doctors</h1>

      {error && (
        <div className="alert alert-danger d-flex align-items-center mb-4" role="alert">
          <AlertTriangle size={20} className="me-2" />
          <div>{error}</div>

          {/* Display API diagnostic information */}
          {rawResponse && (
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

              <div className="mt-3">
                <p>First 200 characters of response:</p>
                <pre className="bg-light p-2 rounded" style={{ maxHeight: "150px", overflow: "auto" }}>
                  {rawResponse.substring(0, 200)}...
                </pre>
              </div>
            </div>
          )}

          <button onClick={fetchFavorites} className="btn btn-primary ms-3">
            Try Again
          </button>
        </div>
      )}

      {favorites.length === 0 ? (
        <div className="text-center py-5 bg-light rounded">
          <Heart size={48} className="text-muted mb-3" />
          <h3>No Favorites Found</h3>
          <p className="text-muted">You haven't added any doctors to your favorites yet.</p>
          <Link to="/" className="btn btn-primary mt-3">
            Browse Doctors
          </Link>
        </div>
      ) : (
        <div className="row g-4">
          {favorites.map((doctor) => (
            <div key={doctor.D_ID} className="col-md-6 col-lg-4">
              <div className="card h-100 shadow-sm hover-card">
                <div className="card-header bg-light d-flex justify-content-between align-items-center">
                  {doctor.photoURL ? (
                    <img
                      src={doctor.photoURL || "/placeholder.svg"}
                      alt={doctor.name}
                      className="rounded-circle"
                      style={{ width: "60px", height: "60px", objectFit: "cover" }}
                      onError={(e) => {
                        e.target.onerror = null
                        e.target.src = "/placeholder.svg?height=60&width=60"
                      }}
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
                  <Link to={`/doctor/${doctor.D_ID}`} className="btn btn-outline-primary flex-grow-1">
                    View Profile
                  </Link>
                  <button
                    className="btn btn-danger d-flex align-items-center justify-content-center"
                    onClick={() => removeFavorite(doctor.D_ID)}
                    title="Remove from favorites"
                  >
                    <Heart size={16} fill="currentColor" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Favorites
