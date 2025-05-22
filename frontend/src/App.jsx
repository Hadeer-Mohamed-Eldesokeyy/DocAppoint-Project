"use client"

import { useState, useEffect } from "react"
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import Navbar from "./components/Navbar/Navbar"
import DoctorsList from "./components/DoctorList/DoctorList"
import DoctorProfile from "./components/DoctorProfile/DoctorProfile"
import AddDoctor from "./components/AddDoctor/AddDoctor"
import EditDoctor from "./components/EditDoctor/EditDoctor"
import UserProfile from "./components/Userprofile/Userprofile"
import PaymentCheckout from "./components/Payment/PaymentCheckout"
import PaymentInvoice from "./components/Payment/PaymentInvoice"
import BookAppointment from "./components/BookAppointment/BookAppointment"
import Login from "./components/Auth/Login"
import Register from "./components/Auth/Register"
import Favorites from "./components/Favourites/Favourites"
import Footer from "./components/Footer/Footer"
import "bootstrap/dist/css/bootstrap.min.css"
import "./App.css"
import AppointmentList from "./components/Appointments/Appointmentlist"

function App() {
  const [isAdmin, setIsAdmin] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    // Check if admin status is stored in localStorage
    const storedAdminStatus = localStorage.getItem("isAdmin") === "true"
    setIsAdmin(storedAdminStatus)

    // Check if user is authenticated
    const token = localStorage.getItem("token")
    setIsAuthenticated(!!token)

    // Add event listener for storage changes (for login/logout across tabs)
    const handleStorageChange = () => {
      const token = localStorage.getItem("token")
      setIsAuthenticated(!!token)

      const adminStatus = localStorage.getItem("isAdmin") === "true"
      setIsAdmin(adminStatus)
    }

    window.addEventListener("storage", handleStorageChange)

    // Clean up
    return () => {
      window.removeEventListener("storage", handleStorageChange)
    }
  }, [])

  // Simple protected route component
  const ProtectedRoute = ({ children }) => {
    const token = localStorage.getItem("token")
    const isUserAuthenticated = !!token

    return isUserAuthenticated ? children : <Navigate to="/login" replace />
  }

  return (
    <Router>
      <div className="d-flex flex-column min-vh-100">
        <Navbar isAdmin={isAdmin} setIsAdmin={setIsAdmin} />

        <main className="flex-grow-1">
          <Routes>
            <Route path="/" element={<DoctorsList />} />
            <Route path="/doctor/:id" element={<DoctorProfile />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Protected routes */}
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <UserProfile />
                </ProtectedRoute>
              }
            />
            <Route
              path="/favorites"
              element={
                <ProtectedRoute>
                  <Favorites />
                </ProtectedRoute>
              }
            />
            <Route
              path="/appointments"
              element={
                <ProtectedRoute>
                  <AppointmentList />
                </ProtectedRoute>
              }
            />
            <Route
              path="/book-appointment/:doctorId"
              element={
                <ProtectedRoute>
                  <BookAppointment />
                </ProtectedRoute>
              }
            />
            <Route
              path="/payment/checkout"
              element={
                <ProtectedRoute>
                  <PaymentCheckout />
                </ProtectedRoute>
              }
            />
            <Route
              path="/payment/invoice/:id"
              element={
                <ProtectedRoute>
                  <PaymentInvoice />
                </ProtectedRoute>
              }
            />

            {/* Admin routes */}
            {isAdmin && (
              <>
                <Route path="/add-doctor" element={<AddDoctor />} />
                <Route path="/edit-doctor/:id" element={<EditDoctor />} />
              </>
            )}

            {/* Fallback route */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>

        <Footer />
      </div>
    </Router>
  )
}

export default App
