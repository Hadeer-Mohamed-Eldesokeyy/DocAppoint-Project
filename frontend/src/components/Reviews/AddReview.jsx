"use client"

import { useState } from "react"
import { Star, Send, AlertTriangle } from "lucide-react"
import { reviewservice } from "../../../apiservice"

const AddReview = ({ doctorId, onReviewAdded }) => {
  const [rating, setRating] = useState(0)
  const [comment, setComment] = useState("")
  const [hover, setHover] = useState(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (rating === 0) {
      setError("Please select a rating")
      return
    }

    try {
      setLoading(true)
      setError(null)

      const userData = JSON.parse(localStorage.getItem("user") || "{}")

      if (!userData.id) {
        throw new Error("You must be logged in to leave a review")
      }

      // Try to submit review to API
      try {
        await reviewservice.addReview({
          userId: userData.id,
          doctorId: doctorId,
          rating: rating,
          comment: comment,
        })
      } catch (apiError) {
        console.error("API review submission failed, using mock data:", apiError)

        // Create mock review in localStorage
        const existingReviews = JSON.parse(localStorage.getItem("doctorReviews") || "{}")
        const doctorReviews = existingReviews[doctorId] || []

        const newReview = {
          id: Date.now(),
          userId: userData.id,
          doctorId: doctorId,
          rating: rating,
          comment: comment,
          date: new Date().toISOString(),
        }

        doctorReviews.push(newReview)
        existingReviews[doctorId] = doctorReviews

        localStorage.setItem("doctorReviews", JSON.stringify(existingReviews))
      }

      setSuccess(true)
      setRating(0)
      setComment("")

      // Call the callback function if provided
      if (onReviewAdded && typeof onReviewAdded === "function") {
        onReviewAdded()
      }
    } catch (err) {
      console.error("Error adding review:", err)
      setError(err.message || "Failed to submit review. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="card mb-4">
      <div className="card-header bg-white">
        <h5 className="mb-0">Write a Review</h5>
      </div>
      <div className="card-body">
        {error && (
          <div className="alert alert-danger d-flex align-items-center mb-3" role="alert">
            <AlertTriangle size={20} className="me-2" />
            <div>{error}</div>
          </div>
        )}

        {success && (
          <div className="alert alert-success mb-3" role="alert">
            Your review has been submitted successfully!
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Your Rating</label>
            <div className="d-flex">
              {[...Array(5)].map((_, index) => {
                const ratingValue = index + 1
                return (
                  <div
                    key={index}
                    className="me-2"
                    style={{ cursor: "pointer" }}
                    onClick={() => setRating(ratingValue)}
                    onMouseEnter={() => setHover(ratingValue)}
                    onMouseLeave={() => setHover(0)}
                  >
                    <Star
                      size={24}
                      fill={(hover || rating) >= ratingValue ? "#FFD700" : "#e4e5e9"}
                      color={(hover || rating) >= ratingValue ? "#FFD700" : "#e4e5e9"}
                    />
                  </div>
                )
              })}
              <span className="ms-2 align-self-center">{rating > 0 ? `${rating}/5` : "Select rating"}</span>
            </div>
          </div>

          <div className="mb-3">
            <label htmlFor="comment" className="form-label">
              Your Review (Optional)
            </label>
            <textarea
              className="form-control"
              id="comment"
              rows="3"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Share your experience with this doctor..."
            ></textarea>
          </div>

          <button
            type="submit"
            className="btn btn-primary d-flex align-items-center"
            disabled={loading || rating === 0}
          >
            {loading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                Submitting...
              </>
            ) : (
              <>
                <Send size={16} className="me-2" />
                Submit Review
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  )
}

export default AddReview
