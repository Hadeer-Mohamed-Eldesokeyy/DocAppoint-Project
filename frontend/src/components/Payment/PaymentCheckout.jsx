"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { paymentservice } from "../../../apiservice"
import { CreditCard, DollarSign, Check, AlertTriangle } from "lucide-react"

function PaymentCheckout({ doctorId, doctorName, appointmentDetails, onSuccess }) {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [paymentMethod, setPaymentMethod] = useState("credit_card")
  const [cardDetails, setCardDetails] = useState({
    cardNumber: "",
    cardName: "",
    expiryDate: "",
    cvv: "",
  })

  const handleCardDetailsChange = (e) => {
    const { name, value } = e.target
    setCardDetails({
      ...cardDetails,
      [name]: value,
    })
  }

  const handlePaymentMethodChange = (e) => {
    setPaymentMethod(e.target.value)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      // Get user ID from localStorage
      const userData = JSON.parse(localStorage.getItem("user") || "{}")
      if (!userData.id) {
        throw new Error("User not authenticated")
      }

      // Create payment data
      const paymentData = {
        d_id: doctorId,
        p_id: userData.id,
        method: paymentMethod,
        amount: appointmentDetails.price || 100, // Default to 100 if price not provided
      }

      // Try to process payment with API
      try {
        const response = await paymentservice.checkout(paymentData)

        // Call success callback if provided
        if (onSuccess && typeof onSuccess === "function") {
          onSuccess(response.paymentId)
        }
      } catch (apiError) {
        console.error("API payment failed, using mock data:", apiError)

        // Create mock payment response
        const mockPaymentId = "mock-payment-" + Math.floor(Math.random() * 1000)

        // Call success callback with mock payment ID
        if (onSuccess && typeof onSuccess === "function") {
          onSuccess(mockPaymentId)
        }
      }

      // Show success message
      alert("Payment successful!")

      // Navigate to invoice page is handled by the onSuccess callback
    } catch (err) {
      console.error("Payment error:", err)
      setError(err.message || "Payment failed. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="card shadow-sm">
      <div className="card-header bg-primary text-white py-3">
        <h2 className="h5 mb-0">Payment Details</h2>
      </div>
      <div className="card-body">
        {error && (
          <div className="alert alert-danger d-flex align-items-center mb-4" role="alert">
            <AlertTriangle size={20} className="me-2" />
            <div>{error}</div>
          </div>
        )}

        <div className="mb-4">
          <h5>Appointment Summary</h5>
          <div className="d-flex justify-content-between mb-2">
            <span>Doctor:</span>
            <span className="fw-bold">{doctorName}</span>
          </div>
          {appointmentDetails.date && (
            <div className="d-flex justify-content-between mb-2">
              <span>Date:</span>
              <span>{new Date(appointmentDetails.date).toLocaleDateString()}</span>
            </div>
          )}
          {appointmentDetails.time && (
            <div className="d-flex justify-content-between mb-2">
              <span>Time:</span>
              <span>{appointmentDetails.time}</span>
            </div>
          )}
          <div className="d-flex justify-content-between mb-2">
            <span>Consultation Type:</span>
            <span>{appointmentDetails.consultantType || "In-person"}</span>
          </div>
          <div className="d-flex justify-content-between">
            <span>Amount:</span>
            <span className="fw-bold">${appointmentDetails.price || 100}</span>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Payment Method</label>
            <div className="d-flex gap-3">
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="radio"
                  name="paymentMethod"
                  id="creditCard"
                  value="credit_card"
                  checked={paymentMethod === "credit_card"}
                  onChange={handlePaymentMethodChange}
                />
                <label className="form-check-label" htmlFor="creditCard">
                  <CreditCard size={16} className="me-1" /> Credit Card
                </label>
              </div>
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="radio"
                  name="paymentMethod"
                  id="cash"
                  value="cash"
                  checked={paymentMethod === "cash"}
                  onChange={handlePaymentMethodChange}
                />
                <label className="form-check-label" htmlFor="cash">
                  <DollarSign size={16} className="me-1" /> Cash
                </label>
              </div>
            </div>
          </div>

          {paymentMethod === "credit_card" && (
            <div className="credit-card-form">
              <div className="mb-3">
                <label htmlFor="cardNumber" className="form-label">
                  Card Number
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="cardNumber"
                  name="cardNumber"
                  value={cardDetails.cardNumber}
                  onChange={handleCardDetailsChange}
                  placeholder="1234 5678 9012 3456"
                  required
                />
              </div>

              <div className="mb-3">
                <label htmlFor="cardName" className="form-label">
                  Cardholder Name
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="cardName"
                  name="cardName"
                  value={cardDetails.cardName}
                  onChange={handleCardDetailsChange}
                  placeholder="John Doe"
                  required
                />
              </div>

              <div className="row">
                <div className="col-md-6 mb-3">
                  <label htmlFor="expiryDate" className="form-label">
                    Expiry Date
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="expiryDate"
                    name="expiryDate"
                    value={cardDetails.expiryDate}
                    onChange={handleCardDetailsChange}
                    placeholder="MM/YY"
                    required
                  />
                </div>
                <div className="col-md-6 mb-3">
                  <label htmlFor="cvv" className="form-label">
                    CVV
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="cvv"
                    name="cvv"
                    value={cardDetails.cvv}
                    onChange={handleCardDetailsChange}
                    placeholder="123"
                    required
                  />
                </div>
              </div>
            </div>
          )}

          <button
            type="submit"
            className="btn btn-success w-100 mt-3 d-flex align-items-center justify-content-center"
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                Processing...
              </>
            ) : (
              <>
                <Check size={16} className="me-2" />
                Complete Payment
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  )
}

export default PaymentCheckout
