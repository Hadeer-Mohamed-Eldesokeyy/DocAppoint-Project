"use client"

import { useState, useEffect } from "react"
import { Star, User, Calendar, ThumbsUp, ThumbsDown, AlertTriangle } from "lucide-react"
import { reviewservice } from "../../../apiservice"

const ReviewList = ({ doctorId }) => {
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (doctorId) {
      fetchReviews()
    }
  }, [doctorId])

  const fetchReviews = async () => {
    try {
      setLoading(true)

      // Try to fetch from API first
      try {
        const data = await reviewservice.getDoctorReviews(doctorId)
        setReviews(data)
      } catch (apiError) {
        console.error("API fetch for reviews failed, using mock data:", apiError)

        // Get reviews from localStorage
        const allReviews = JSON.parse(localStorage.getItem("doctorReviews") || "{}")
        const doctorReviews = allReviews[doctorId] || []

        setReviews(doctorReviews)
      }

      setError(null)
    } catch (err) {
      console.error("Error fetching reviews:", err)
      setError("Failed to load reviews. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  // Format date
  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" }
    return new Date(dateString).toLocaleDateString(undefined, options)
  }

  if (loading) {
    return (
      <div className="text-center py-3">
        <div className="spinner-border spinner-border-sm text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-2 mb-0">Loading reviews...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="alert alert-danger d-flex align-items-center" role="alert">
        <AlertTriangle size={20} className="me-2" />
        <div>{error}</div>
      </div>
    )
  }

  if (!reviews || reviews.length === 0) {
    return (
      <div className="text-center py-3">
        <p className="text-muted mb-0">No reviews yet. Be the first to review!</p>
      </div>
    )
  }

  return (
    <div className="review-list">
      {reviews.map((review, index) => (
        <div key={review.id || index} className="card mb-3">
          <div className="card-body">
            <div className="d-flex justify-content-between align-items-start mb-3">
              <div className="d-flex align-items-center">
                <div className="bg-light rounded-circle p-2 me-3">
                  <User size={24} />
                </div>
                <div>
                  <h6 className="mb-0">Patient</h6>
                  <div className="d-flex align-items-center mt-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={16}
                        fill={i < review.rating ? "#FFD700" : "#e4e5e9"}
                        color={i < review.rating ? "#FFD700" : "#e4e5e9"}
                      />
                    ))}
                    <span className="ms-2 text-muted small">{review.rating}/5</span>
                  </div>
                </div>
              </div>
              <div className="text-muted small d-flex align-items-center">
                <Calendar size={14} className="me-1" />
                {formatDate(review.date)}
              </div>
            </div>

            {review.comment && <p className="mb-3">{review.comment}</p>}

            <div className="d-flex justify-content-between align-items-center">
              <div className="d-flex gap-3">
                <button className="btn btn-sm btn-outline-secondary d-flex align-items-center">
                  <ThumbsUp size={14} className="me-1" />
                  Helpful
                </button>
                <button className="btn btn-sm btn-outline-secondary d-flex align-items-center">
                  <ThumbsDown size={14} className="me-1" />
                  Not Helpful
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default ReviewList
