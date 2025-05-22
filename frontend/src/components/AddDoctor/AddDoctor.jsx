"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { doctorservice } from "../../../apiservice"
import { AlertTriangle, Save, ArrowLeft } from "lucide-react"

function AddDoctor() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [formData, setFormData] = useState({
    UserName: "",
    Email: "",
    Password: "",
    Phone: "",
    Gender: "male",
    Speciality: "",
    City: "",
    Price: "",
    WorkingHours: "",
    Rating: "5",
    WorkingDays: "",
    ContactInfo: "",
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      // Validate form data
      if (!formData.UserName || !formData.Email || !formData.Password || !formData.Speciality) {
        throw new Error("Please fill in all required fields")
      }

      // Convert price and rating to numbers
      const doctorData = {
        ...formData,
        Price: Number.parseFloat(formData.Price) || 0,
        Rating: Number.parseFloat(formData.Rating) || 5,
      }

      try {
        await doctorservice.addDoctor(doctorData)
        alert("Doctor added successfully!")
        navigate("/")
      } catch (apiError) {
        console.error("API add doctor failed:", apiError)
        // Show error but don't throw to prevent getting stuck in loading state
        setError("Failed to add doctor via API. Please try again.")
      }
    } catch (err) {
      console.error("Error adding doctor:", err)
      setError(err.message || "Failed to add doctor. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="h2">Add New Doctor</h1>
        <button onClick={() => navigate("/")} className="btn btn-outline-secondary d-flex align-items-center">
          <ArrowLeft size={16} className="me-2" />
          Back to Doctors List
        </button>
      </div>

      {error && (
        <div className="alert alert-danger d-flex align-items-center mb-4" role="alert">
          <AlertTriangle size={20} className="me-2" />
          <div>{error}</div>
        </div>
      )}

      <div className="card shadow-sm">
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <div className="row g-3">
              <div className="col-md-6">
                <h3 className="h5 mb-3">Personal Information</h3>
                <div className="mb-3">
                  <label htmlFor="UserName" className="form-label">
                    Full Name <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="UserName"
                    name="UserName"
                    value={formData.UserName}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="Email" className="form-label">
                    Email <span className="text-danger">*</span>
                  </label>
                  <input
                    type="email"
                    className="form-control"
                    id="Email"
                    name="Email"
                    value={formData.Email}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="Password" className="form-label">
                    Password <span className="text-danger">*</span>
                  </label>
                  <input
                    type="password"
                    className="form-control"
                    id="Password"
                    name="Password"
                    value={formData.Password}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="Phone" className="form-label">
                    Phone Number <span className="text-danger">*</span>
                  </label>
                  <input
                    type="tel"
                    className="form-control"
                    id="Phone"
                    name="Phone"
                    value={formData.Phone}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">
                    Gender <span className="text-danger">*</span>
                  </label>
                  <div>
                    <div className="form-check form-check-inline">
                      <input
                        className="form-check-input"
                        type="radio"
                        name="Gender"
                        id="male"
                        value="male"
                        checked={formData.Gender === "male"}
                        onChange={handleChange}
                      />
                      <label className="form-check-label" htmlFor="male">
                        Male
                      </label>
                    </div>
                    <div className="form-check form-check-inline">
                      <input
                        className="form-check-input"
                        type="radio"
                        name="Gender"
                        id="female"
                        value="female"
                        checked={formData.Gender === "female"}
                        onChange={handleChange}
                      />
                      <label className="form-check-label" htmlFor="female">
                        Female
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-md-6">
                <h3 className="h5 mb-3">Professional Information</h3>
                <div className="mb-3">
                  <label htmlFor="Speciality" className="form-label">
                    Speciality <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="Speciality"
                    name="Speciality"
                    value={formData.Speciality}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="City" className="form-label">
                    City
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="City"
                    name="City"
                    value={formData.City}
                    onChange={handleChange}
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="Price" className="form-label">
                    Consultation Price
                  </label>
                  <div className="input-group">
                    <span className="input-group-text">$</span>
                    <input
                      type="number"
                      className="form-control"
                      id="Price"
                      name="Price"
                      value={formData.Price}
                      onChange={handleChange}
                      min="0"
                      step="0.01"
                    />
                  </div>
                </div>

                <div className="mb-3">
                  <label htmlFor="WorkingHours" className="form-label">
                    Working Hours
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="WorkingHours"
                    name="WorkingHours"
                    value={formData.WorkingHours}
                    onChange={handleChange}
                    placeholder="e.g. 9:00 AM - 5:00 PM"
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="WorkingDays" className="form-label">
                    Working Days
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="WorkingDays"
                    name="WorkingDays"
                    value={formData.WorkingDays}
                    onChange={handleChange}
                    placeholder="e.g. Monday - Friday"
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="ContactInfo" className="form-label">
                    Contact Information
                  </label>
                  <textarea
                    className="form-control"
                    id="ContactInfo"
                    name="ContactInfo"
                    value={formData.ContactInfo}
                    onChange={handleChange}
                    rows="3"
                  ></textarea>
                </div>
              </div>
            </div>

            <div className="d-grid gap-2 d-md-flex justify-content-md-end mt-4">
              <button
                type="button"
                className="btn btn-outline-secondary me-md-2"
                onClick={() => navigate("/")}
                disabled={loading}
              >
                Cancel
              </button>
              <button type="submit" className="btn btn-primary d-flex align-items-center" disabled={loading}>
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    Saving...
                  </>
                ) : (
                  <>
                    <Save size={16} className="me-2" />
                    Add Doctor
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default AddDoctor
