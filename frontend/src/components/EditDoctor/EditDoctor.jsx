"use client"

import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { doctorservice } from "../../../apiservice"
import { AlertTriangle, Save, ArrowLeft } from "lucide-react"

function EditDoctor() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [fetchLoading, setFetchLoading] = useState(true)
  const [error, setError] = useState(null)
  const [formData, setFormData] = useState({
    City: "",
    Price: "",
    WorkingHours: "",
    WorkingDays: "",
    ContactInfo: "",
  })

  useEffect(() => {
    fetchDoctorDetails()
  }, [id])

  const fetchDoctorDetails = async () => {
    try {
      setFetchLoading(true)
      const doctorData = await doctorservice.getDoctorById(id)

      setFormData({
        City: doctorData.city || "",
        Price: doctorData.price || "",
        WorkingHours: doctorData.working_hours || "",
        WorkingDays: doctorData.working_days || "",
        ContactInfo: doctorData.contact_info || "",
      })

      setError(null)
    } catch (err) {
      console.error("Error fetching doctor details:", err)
      setError("Failed to load doctor details. Please try again.")
    } finally {
      setFetchLoading(false)
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
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      // Convert price to number
      const doctorData = {
        ...formData,
        Price: Number.parseFloat(formData.Price),
      }

      try {
        await doctorservice.updateDoctor(id, doctorData)
        alert("Doctor updated successfully!")
        navigate(`/doctor/${id}`)
      } catch (apiError) {
        console.error("API update failed:", apiError)
        // Show error but don't throw to prevent getting stuck in loading state
        setError("Failed to update doctor via API. Please try again.")
      }
    } catch (err) {
      console.error("Error updating doctor:", err)
      setError(err.message || "Failed to update doctor. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  if (fetchLoading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-primary mb-3" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p>Loading doctor details...</p>
      </div>
    )
  }

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="h2">Edit Doctor</h1>
        <button
          onClick={() => navigate(`/doctor/${id}`)}
          className="btn btn-outline-secondary d-flex align-items-center"
        >
          <ArrowLeft size={16} className="me-2" />
          Back to Doctor Profile
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
              </div>

              <div className="col-md-6">
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
              </div>

              <div className="col-12">
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
                onClick={() => navigate(`/doctor/${id}`)}
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
                    Update Doctor
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

export default EditDoctor
