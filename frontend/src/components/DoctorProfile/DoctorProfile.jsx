"use client"

import { useState, useEffect } from "react"
import { useParams, Link, useNavigate } from "react-router-dom"
import {
  Star,
  MapPin,
  Calendar,
  Clock,
  Phone,
  Mail,
  Edit,
  Trash2,
  ArrowLeft,
  Heart,
  Award,
  DollarSign,
} from "lucide-react"
import { API_BASE_URL } from "../../../apiservice" // Import API_BASE_URL directly
import ReviewList from "../Reviews/ReviewList"
import AddReview from "../Reviews/AddReview"

function DoctorProfile() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [doctor, setDoctor] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [rawResponse, setRawResponse] = useState(null) // Store raw response for debugging
  const [isAdmin, setIsAdmin] = useState(false)
  const [isFavorite, setIsFavorite] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    // Debug the ID parameter
    console.log("Doctor ID from URL params:", id, typeof id)

    // Ensure ID is a valid number
    const numericId = Number.parseInt(id, 10)

    if (isNaN(numericId) || numericId <= 0) {
      setError(`Invalid doctor ID: ${id}. Please go back and try again.`)
      setLoading(false)
      return
    }

    fetchDoctorDetails(numericId)

    // In a real app, you would check admin status from auth context
    const checkAdminStatus = () => {
      const adminStatus = localStorage.getItem("isAdmin") === "true"
      setIsAdmin(adminStatus)
    }

    checkAdminStatus()

    // Check if doctor is in favorites
    const checkFavoriteStatus = () => {
      const favorites = JSON.parse(localStorage.getItem("favoriteDoctors") || "[]")
      setIsFavorite(favorites.includes(numericId))
    }

    checkFavoriteStatus()

    // Check if user is authenticated
    const token = localStorage.getItem("token")
    setIsAuthenticated(!!token)
  }, [id])

  // Modified to only use API data, no mock data
  const fetchDoctorDetails = async (numericId) => {
    setLoading(true)
    setRawResponse(null)
    try {
      const url = `${API_BASE_URL}/doctors/${numericId}`
      console.log("Fetching doctor details from:", url)

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
      let doctorData
      try {
        doctorData = JSON.parse(responseText)
      } catch (parseError) {
        console.error("Failed to parse response as JSON:", parseError)
        throw new Error("The API returned an invalid response format. Expected JSON, got HTML or text.")
      }

      if (!doctorData) {
        throw new Error("No data returned from API")
      }

      console.log("Doctor details received:", doctorData)
      setDoctor(doctorData)
      setError(null)
    } catch (err) {
      console.error("Error fetching doctor details:", err)
      // setError(`Failed to load doctor details: ${err.message}`)
      // No mock data fallback
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this doctor?")) {
      return
    }

    try {
      const url = `${API_BASE_URL}/doctors/${id}`
      console.log("Deleting doctor from:", url)

      const token = localStorage.getItem("token")
      if (!token) {
        throw new Error("Authentication required")
      }

      const response = await fetch(url, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        throw new Error(`Failed to delete doctor: ${response.status} ${response.statusText}`)
      }

      navigate("/")
    } catch (err) {
      console.error("Error deleting doctor:", err)
      alert("Failed to delete doctor. Please try again.")
    }
  }

  const toggleFavorite = () => {
    const favorites = JSON.parse(localStorage.getItem("favoriteDoctors") || "[]")
    const doctorId = Number.parseInt(id, 10)

    if (isFavorite) {
      const updatedFavorites = favorites.filter((favId) => favId !== doctorId)
      localStorage.setItem("favoriteDoctors", JSON.stringify(updatedFavorites))
    } else {
      favorites.push(doctorId)
      localStorage.setItem("favoriteDoctors", JSON.stringify(favorites))
    }

    setIsFavorite(!isFavorite)
  }

  const handleBookAppointment = () => {
    navigate(`/book-appointment/${id}`)
  }

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-primary mb-3" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p>Loading doctor details...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container py-5">
        <div className="alert alert-danger text-center">
          <div className="mb-3">
            <span className="badge bg-danger rounded-circle p-3">!</span>
          </div>
          {/* <p>{error}</p> */}

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
                Current API URL:{" "}
                <code>
                  {API_BASE_URL}/doctors/{id}
                </code>
              </p>

              <div className="mt-3">
                <p>First 200 characters of response:</p>
                <pre className="bg-light p-2 rounded" style={{ maxHeight: "150px", overflow: "auto" }}>
                  {rawResponse.substring(0, 200)}...
                </pre>
              </div>
            </div>
          )}

          <Link to="/" className="btn btn-outline-secondary mt-3">
            <ArrowLeft size={16} className="me-2" />
            Back to Doctors List
          </Link>
        </div>
      </div>
    )
  }

  if (!doctor) {
    return (
      <div className="container py-5 text-center">
        <h2>Doctor Not Found</h2>
        <p>The doctor you're looking for doesn't exist or has been removed.</p>
        <Link to="/" className="btn btn-outline-primary">
          <ArrowLeft size={16} className="me-2" />
          Back to Doctors List
        </Link>
      </div>
    )
  }

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <Link to="/" className="btn btn-outline-secondary d-inline-flex align-items-center">
          <ArrowLeft size={16} className="me-2" />
          Back to Doctors List
        </Link>

        <div className="d-flex gap-2">
          <button
            className={`btn ${isFavorite ? "btn-danger" : "btn-outline-danger"} d-flex align-items-center`}
            onClick={toggleFavorite}
          >
            <Heart size={20} className="me-2" fill={isFavorite ? "currentColor" : "none"} />
            {isFavorite ? "Favorited" : "Add to Favorites"}
          </button>

          {isAdmin && (
            <div className="d-flex gap-2">
              <Link to={`/edit-doctor/${id}`} className="btn btn-outline-primary d-flex align-items-center">
                <Edit size={16} className="me-2" />
                Edit
              </Link>
              <button onClick={handleDelete} className="btn btn-outline-danger d-flex align-items-center">
                <Trash2 size={16} className="me-2" />
                Delete
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="row g-4">
        <div className="col-lg-8">
          <div className="card shadow-sm mb-4">
            <div className="card-header bg-light py-4">
              <div className="d-flex gap-4 align-items-center">
                {doctor.photoURL ? (
                  <img
                    src={doctor.photoURL || "/placeholder.svg"}
                    alt={doctor.name}
                    className="rounded-circle"
                    style={{ width: "100px", height: "100px", objectFit: "cover" }}
                  />
                ) : (
                  <div
                    className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center"
                    style={{ width: "100px", height: "100px", fontSize: "2.5rem", fontWeight: "bold" }}
                  >
                    {doctor.name ? doctor.name.charAt(0).toUpperCase() : "D"}
                  </div>
                )}
                <div>
                  <h1 className="h2 mb-2">{doctor.name}</h1>
                  <p className="mb-2">{doctor.speciality}</p>
                  <div className="d-flex align-items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={18}
                        fill={i < Math.floor(doctor.rating || 0) ? "#FFD700" : "#e4e5e9"}
                        color={i < Math.floor(doctor.rating || 0) ? "#FFD700" : "#e4e5e9"}
                      />
                    ))}
                    <span className="ms-2">{doctor.rating || "N/A"}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="card-body">
              <div className="row mb-4">
                <div className="col-md-6 mb-3 mb-md-0">
                  <div className="d-flex align-items-center text-muted mb-2">
                    <MapPin size={18} className="me-2" />
                    <span>{doctor.city}</span>
                  </div>

                  {doctor.working_days && (
                    <div className="d-flex align-items-center text-muted mb-2">
                      <Calendar size={18} className="me-2" />
                      <span>{doctor.working_days}</span>
                    </div>
                  )}
                </div>

                <div className="col-md-6">
                  {doctor.working_hours && (
                    <div className="d-flex align-items-center text-muted mb-2">
                      <Clock size={18} className="me-2" />
                      <span>{doctor.working_hours}</span>
                    </div>
                  )}

                  {doctor.price && (
                    <div className="d-flex align-items-center text-muted mb-2">
                      <DollarSign size={18} className="me-2" />
                      <span>${doctor.price} per consultation</span>
                    </div>
                  )}
                </div>
              </div>

              {doctor.contact_info && (
                <div className="mb-4">
                  <h3 className="h5 mb-3">Contact Information</h3>
                  <p>{doctor.contact_info}</p>
                </div>
              )}

              <div className="mb-4">
                <h3 className="h5 mb-3">About Doctor</h3>
                <p>
                  {doctor.bio ||
                    `${doctor.name} is a highly qualified ${doctor.speciality} with extensive experience in the field. They are committed to providing excellent patient care and staying updated with the latest medical advancements.`}
                </p>
              </div>

              <div>
                <h3 className="h5 mb-3">Qualifications</h3>
                <div className="d-flex align-items-start mb-3">
                  <Award size={18} className="me-3 mt-1" />
                  <div>
                    <h4 className="h6 mb-1">Medical Degree</h4>
                    <p className="text-muted">University Medical School</p>
                  </div>
                </div>
                <div className="d-flex align-items-start">
                  <Award size={18} className="me-3 mt-1" />
                  <div>
                    <h4 className="h6 mb-1">Specialization</h4>
                    <p className="text-muted">{doctor.speciality}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="card shadow-sm mt-4">
            <div className="card-header bg-white py-3">
              <h3 className="h5 mb-0">Patient Reviews</h3>
            </div>
            <div className="card-body">
              <ReviewList doctorId={id} />
              {isAuthenticated && (
                <AddReview doctorId={id} onReviewAdded={() => fetchDoctorDetails(Number.parseInt(id, 10))} />
              )}
            </div>
          </div>
        </div>

        <div className="col-lg-4">
          <div className="card shadow-sm mb-4">
            <div className="card-header bg-success text-white py-3">
              <h2 className="h5 mb-0">Book an Appointment</h2>
            </div>
            <div className="card-body">
              <p className="mb-4">
                Book an appointment with {doctor.name} to get the best healthcare service for your needs.
              </p>
              <button onClick={handleBookAppointment} className="btn btn-success w-100">
                Book Appointment
              </button>
            </div>
          </div>

          <div className="card shadow-sm">
            <div className="card-body">
              <h3 className="h5 mb-3">Need Help?</h3>
              <div className="d-flex align-items-center mb-3 text-muted">
                <Phone size={18} className="me-3" />
                <span>+1 (555) 123-4567</span>
              </div>
              <div className="d-flex align-items-center text-muted">
                <Mail size={18} className="me-3" />
                <span>support@healthapp.com</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DoctorProfile
