"use client"
import AppointmentList from "../Appointments/Appointmentlist"

function AppointmentsPage() {
  return (
    <div className="container py-4">
      <h1 className="mb-4">My Appointments</h1>
      <AppointmentList />
    </div>
  )
}

export default AppointmentsPage
