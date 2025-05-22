"use client"

import { useState, useEffect } from "react"
import { useParams, Link } from "react-router-dom"
import { paymentservice } from "../../../apiservice"
import { FileText, Printer, Download, AlertTriangle } from "lucide-react"

function PaymentInvoice() {
  const { id } = useParams()
  const [invoice, setInvoice] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchInvoice()
  }, [id])

  const fetchInvoice = async () => {
    try {
      setLoading(true)

      // Try to get invoice from API
      try {
        const data = await paymentservice.getInvoice(id)
        setInvoice(data)
      } catch (apiError) {
        console.error("API fetch failed, using mock data:", apiError)

        // Create mock invoice data
        const mockInvoice = {
          Payment_ID: id || "mock-payment-123",
          date: new Date().toISOString(),
          statuses: "completed",
          method: "credit_card",
          P_ID: 1,
          D_ID: 1,
          amount: 150,
        }

        setInvoice(mockInvoice)
      }

      setError(null)
    } catch (err) {
      console.error("Error fetching invoice:", err)
      setError("Failed to load invoice. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handlePrint = () => {
    window.print()
  }

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-primary mb-3" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p>Loading invoice...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container py-5">
        <div className="alert alert-danger d-flex align-items-center" role="alert">
          <AlertTriangle size={24} className="me-2" />
          <div>{error}</div>
        </div>
        <button onClick={fetchInvoice} className="btn btn-primary">
          Try Again
        </button>
      </div>
    )
  }

  return (
    <div className="container py-5">
      <div className="card shadow-sm">
        <div className="card-header bg-white py-3 d-flex justify-content-between align-items-center">
          {/* <div className="d-flex align-items-center">
            <FileText size={24} className="text-primary me-2" />
            <h2 className="h4 mb-0">Invoice #{invoice?.Payment_ID}</h2>
          </div> */}
          <div className="d-flex gap-2">
            <button onClick={handlePrint} className="btn btn-outline-secondary d-flex align-items-center">
              <Printer size={16} className="me-2" />
              Print
            </button>
            <button className="btn btn-outline-primary d-flex align-items-center">
              <Download size={16} className="me-2" />
              Download
            </button>
          </div>
        </div>
        <div className="card-body p-4">
          <div className="row mb-4">
            <div className="col-md-6">
              <div className="d-flex align-items-center mb-4">
                <div
                  className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center me-2"
                  style={{ width: "40px", height: "40px", fontSize: "1.2rem", fontWeight: "bold" }}
                >
                  +
                </div>
                <span className="h5">HealthCare</span>
              </div>
              <p className="mb-1">123 Medical Center Dr</p>
              <p className="mb-1">Healthcare City</p>
              <p className="mb-1">support@healthapp.com</p>
              <p>+1 (555) 123-4567</p>
            </div>
            <div className="col-md-6 text-md-end">
              <h5 className="text-muted mb-2">Invoice Details</h5>
              {/* <p className="mb-1">
                <strong>Invoice Number:</strong> #{invoice?.Payment_ID}
              </p> */}
              <p className="mb-1">
                <strong>Date:</strong> {formatDate(invoice?.date)}
              </p>
              <p className="mb-1">
                <strong>Status:</strong> <span className="badge bg-success">{invoice?.statuses}</span>
              </p>
              <p>
                <strong>Payment Method:</strong> {invoice?.method}
              </p>
            </div>
          </div>

          <hr className="my-4" />

          <div className="row mb-4">
            <div className="col-md-6">
              <h5 className="text-muted mb-3">Appointment Information</h5>
              <p className="mb-1">
                <strong>Service:</strong> Medical Consultation
              </p>
            </div>
          </div>

          <div className="table-responsive">
            <table className="table">
              <thead className="table-light">
                <tr>
                  <th>Description</th>
                  <th className="text-end">Amount</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Medical Consultation</td>
                  <td className="text-end">${invoice?.amount.toFixed(2)}</td>
                </tr>
              </tbody>
              <tfoot>
                <tr>
                  <th>Total</th>
                  <th className="text-end">${invoice?.amount.toFixed(2)}</th>
                </tr>
              </tfoot>
            </table>
          </div>

          <div className="mt-4 pt-4 border-top">
            <div className="row">
              <div className="col-md-6">
                <h5 className="text-muted mb-3">Payment Notes</h5>
                <p className="text-muted">
                  Thank you for your payment. If you have any questions about this invoice, please contact our support
                  team.
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="card-footer bg-white py-3">
          <div className="text-center">
            <Link to="/" className="btn btn-primary">
              Return to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PaymentInvoice
