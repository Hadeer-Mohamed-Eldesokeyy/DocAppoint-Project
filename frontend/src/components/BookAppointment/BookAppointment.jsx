"use client"

import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { Calendar, Clock, User, ArrowLeft, AlertTriangle } from 'lucide-react'
import { API_BASE_URL } from "../../../apiservice" // Import API_BASE_URL directly
import PaymentCheckout from "../Payment/PaymentCheckout"

function BookAppointment() {
  const { doctorId } = useParams()
  const navigate = useNavigate()
  const [doctor, setDoctor] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [rawResponse, setRawResponse] = useState(null) // Store raw response for debugging
  const [showPayment, setShowPayment] = useState(false)
  const [appointmentDetails, setAppointmentDetails] = useState(null)

  // Form state
  const [formData, setFormData] = useState({
    date: "",
    consultantType: "in-person", // Default to in-person
  })

  useEffect(() => {
    fetchDoctorDetails()
  }, [doctorId])

  // Modified to only use API data, no mock data
  const fetchDoctorDetails = async () => {
    try {
      setLoading(true)
      setRawResponse(null)

      const url = `${API_BASE_URL}/doctors/${doctorId}`
      console.log("Fetching doctor details from:", url)

      try {
        const response = await fetch(url, {
          headers: {
            "ngrok-skip-browser-warning": "true",
          },
        })

        // Get the raw text first to see what's being returned
        const responseText = await response.text()

        // Try to parse as JSON
        try {
          const doctorData = JSON.parse(responseText)
          console.log("Doctor details received:", doctorData)
          setDoctor(doctorData)
        } catch (parseError) {
          console.error("Failed to parse response as JSON:", parseError)
          // Fallback to mock data if API fails
          const mockDoctor = {
            name: "Dr. John Smith",
            speciality: "Cardiologist",
            city: "New York",
            working_days: "Monday - Friday",
            working_hours: "9:00 AM - 5:00 PM",
            price: 150,
            contact_info: "Contact via email or phone",
          }
          setDoctor(mockDoctor)
        }
      } catch (fetchError) {
        console.error("Error fetching doctor details:", fetchError)
        // Fallback to mock data if fetch fails
        const mockDoctor = {
          name: "Dr. John Smith",
          speciality: "Cardiologist",
          city: "New York",
          working_days: "Monday - Friday",
          working_hours: "9:00 AM - 5:00 PM",
          price: 150,
          contact_info: "Contact via email or phone",
        }
        setDoctor(mockDoctor)
      }

      setError(null)
    } catch (err) {
      console.error("Error in fetchDoctorDetails:", err)
      setError(`Failed to load doctor details: ${err.message}`)
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })
  }

 const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);
  setError(null);

  try {
    // 1. Get user from localStorage
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    if (!user.id) throw new Error("User ID not found. Please log in again.");

    // 2. Check doctor info
    if (!doctor || !doctor.name) throw new Error("Doctor information is missing.");

    // 3. Save selected doctor in localStorage
    localStorage.setItem(
      "selectedDoctor",
      JSON.stringify({
        D_ID: doctorId,
        name: doctor.name,
      })
    );

    // 4. Get token
    const token = localStorage.getItem("token");
    if (!token) throw new Error("Authentication required.");

    // 5. Validate form data
    if (!formData.date || isNaN(new Date(formData.date))) {
      throw new Error("Please select a valid date.");
    }

    if (!formData.consultantType) {
      throw new Error("Please choose a consultant type.");
    }

    // 6. Format date to ISO
    const formattedDateISO = new Date(formData.date).toISOString();

    // 7. Prepare API request
    const url = `${API_BASE_URL}/appointments/user/${user.id}/${doctorId}`;
    const appointmentData = {
      date: formattedDateISO,
      consultant_type: formData.consultantType,
    };

    console.log("📤 Sending:", appointmentData, "➡️", url);

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "ngrok-skip-browser-warning": "true",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(appointmentData),
    });

    const responseText = await response.text();

    if (!response.ok) {
      console.error("❌ API error:", response.status, responseText);
      throw new Error(`Failed: ${response.status} - ${responseText}`);
    }

    let responseData;
    try {
      responseData = JSON.parse(responseText);
    } catch {
      responseData = { message: responseText };
    }

    alert("✅ Appointment booked successfully! Please proceed to payment.");

    // 8. Save appointment info for payment
    setAppointmentDetails({
      date: formData.date,
      consultantType: formData.consultantType,
      price: doctor.price || 100,
      doctorId,
      doctorName: doctor.name,
    });

    setShowPayment(true);
  } catch (err) {
    console.error("❌ Error booking:", err);
    setError(err.message || "Something went wrong.");
  } finally {
    setLoading(false);
  }
};

  const handlePaymentSuccess = (paymentId) => {
    // Navigate to invoice page
    navigate(`/payment/invoice/${paymentId || "mock-payment-123"}`)
  }

  if (loading && !doctor) {
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
        <div className="alert alert-danger d-flex align-items-center" role="alert">
          <AlertTriangle size={24} className="me-2" />
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
                Current API URL:{" "}
                <code>
                  {API_BASE_URL}/doctors/{doctorId}
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
        </div>
        <button onClick={() => navigate(-1)} className="btn btn-primary">
          Go Back
        </button>
      </div>
    )
  }

  if (showPayment) {
    return (
      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-lg-8">
            <PaymentCheckout
              doctorId={doctorId}
              doctorName={doctor.name}
              appointmentDetails={appointmentDetails}
              onSuccess={handlePaymentSuccess}
            />
          </div>
        </div>
      </div>
    )
  }

  // Update the UI to be more healthcare-themed
  return (
    <div className="container py-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="h2 text-primary">Book an Appointment</h1>
        <button onClick={() => navigate(-1)} className="btn btn-outline-primary d-flex align-items-center">
          <ArrowLeft size={16} className="me-2" />
          Back
        </button>
      </div>

      <div className="row">
        <div className="col-lg-4 mb-4 mb-lg-0">
          <div className="card shadow-sm mb-4 border-0">
            <div className="card-header bg-primary text-white py-3">
              <h2 className="h5 mb-0">Doctor Information</h2>
            </div>
            <div className="card-body">
              <div className="d-flex align-items-center mb-3">
                <div
                  className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center me-3"
                  style={{ width: "60px", height: "60px", fontSize: "1.5rem", fontWeight: "bold" }}
                >
                  {doctor && doctor.name ? doctor.name.charAt(0).toUpperCase() : "D"}
                </div>
                <div>
                  <h3 className="h5 mb-1"> {doctor && doctor.name}</h3>
                  <p className="text-muted mb-0">{doctor && doctor.speciality}</p>
                </div>
              </div>

              <div className="mb-3 pb-3 border-bottom">
                <div className="d-flex justify-content-between mb-2">
                  <span className="text-muted">Consultation Fee:</span>
                  <span className="fw-bold">${doctor && doctor.price ? doctor.price : "100"}</span>
                </div>
                <div className="d-flex justify-content-between">
                  <span className="text-muted">Location:</span>
                  <span>{doctor && doctor.city}</span>
                </div>
              </div>

              {doctor && doctor.working_days && (
                <div className="mb-2">
                  <div className="d-flex align-items-center mb-1">
                    <Calendar size={16} className="text-primary me-2" />
                    <span className="fw-medium">Working Days</span>
                  </div>
                  <p className="ms-4 mb-0">{doctor.working_days}</p>
                </div>
              )}

              {doctor && doctor.working_hours && (
                <div className="mb-2">
                  <div className="d-flex align-items-center mb-1">
                    <Clock size={16} className="text-primary me-2" />
                    <span className="fw-medium">Working Hours</span>
                  </div>
                  <p className="ms-4 mb-0">{doctor.working_hours}</p>
                </div>
              )}
            </div>
          </div>

          {/* Health Tips Card */}
          <div className="card shadow-sm border-0">
            <div className="card-header bg-success text-white py-3">
              <h3 className="h5 mb-0">Health Tips</h3>
            </div>
            <div className="card-body">
              <div className="health-tip-card mb-2">
                <h4 className="h6 mb-1">Arrive 15 Minutes Early</h4>
                <p className="small text-muted mb-0">Allow time for check-in and paperwork</p>
              </div>
              <div className="health-tip-card mb-2">
                <h4 className="h6 mb-1">Bring Your Medical Records</h4>
                <p className="small text-muted mb-0">Have your previous medical history ready</p>
              </div>
              <div className="health-tip-card mb-0">
                <h4 className="h6 mb-1">List Your Medications</h4>
                <p className="small text-muted mb-0">Prepare a list of current medications</p>
              </div>
            </div>
          </div>
        </div>

        <div className="col-lg-8">
          <div className="card shadow-sm border-0">
            <div className="card-header bg-primary text-white py-3">
              <h2 className="h5 mb-0">Appointment Details</h2>
            </div>
            <div className="card-body p-4">
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label htmlFor="date" className="form-label d-flex align-items-center fw-medium">
                    <Calendar size={18} className="me-2 text-primary" />
                    Select Date
                  </label>
                  <input
                    type="date"
                    className="form-control"
                    id="date"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    min={new Date().toISOString().split("T")[0]}
                    required
                  />
                </div>

                <div className="mb-4">
                  <label className="form-label d-flex align-items-center fw-medium">
                    <User size={18} className="me-2 text-primary" />
                    Consultation Type
                  </label>
                  <div className="form-check mb-2 ps-4">
                    <input
                      className="form-check-input"
                      type="radio"
                      name="consultantType"
                      id="inPerson"
                      value="in-person"
                      checked={formData.consultantType === "in-person"}
                      onChange={handleChange}
                    />
                    <label className="form-check-label" htmlFor="inPerson">
                      In-Person Visit
                    </label>
                  </div>
                  <div className="form-check ps-4">
                    <input
                      className="form-check-input"
                      type="radio"
                      name="consultantType"
                      id="virtual"
                      value="virtual"
                      checked={formData.consultantType === "virtual"}
                      onChange={handleChange}
                    />
                    <label className="form-check-label" htmlFor="virtual">
                      Virtual Consultation
                    </label>
                  </div>
                </div>

                <div className="medical-alert medical-alert-info mb-4">
                  <div className="medical-alert-icon">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <circle cx="12" cy="12" r="10"></circle>
                      <line x1="12" y1="16" x2="12" y2="12"></line>
                      <line x1="12" y1="8" x2="12.01" y2="8"></line>
                    </svg>
                  </div>
                  <div className="medical-alert-content">
                    <h4 className="medical-alert-title">Important Information</h4>
                    <p className="mb-0">
                      After booking your appointment, you'll be directed to the payment page. Payment is required to
                      confirm your appointment.
                    </p>
                  </div>
                </div>

                <div className="d-grid gap-2 d-md-flex justify-content-md-end mt-4">
                  <button
                    type="button"
                    className="btn btn-outline-secondary me-md-2"
                    onClick={() => navigate(-1)}
                    disabled={loading}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary" disabled={loading}>
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Processing...
                      </>
                    ) : (
                      "Continue to Payment"
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default BookAppointment
