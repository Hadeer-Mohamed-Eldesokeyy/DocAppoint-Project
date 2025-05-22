import sql from 'mssql';

//the patient can see all his appointments 
export const getPatientAppointments = async (req, res) => {
  const P_ID = parseInt(req.params.P_ID);
  if (isNaN(P_ID)) {
    return res.status(400).json({ error: 'Invalid user ID' });
  }

  try {
    const data = `SELECT date, consultant_type, statuses FROM appointment WHERE P_ID = ${P_ID}`;
    const result = await sql.query(data);
    if (result.recordset.length === 0) {
      return res.status(404).json({ error: 'No appointments found for this user' });
    }
    res.send(result.recordset);
  } catch (err) {
    console.error('❌ Error fetching user appointments:', err);
    res.status(500).json({ error: 'Failed to fetch user appointments' });
  }
};

// the patient can book an appointment with a doctor
export const bookAppointment = async (req, res) => {
  const P_ID = parseInt(req.params.P_ID);
  const D_ID = parseInt(req.params.D_ID);
  const {date, consultant_type } = req.body;

  if (!P_ID || !D_ID || !consultant_type) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  try {
    const data = `EXEC dbo.CreatePatientAndAppointment
  @UserID = ${P_ID},
  @DoctorID = ${D_ID},
  @Date = '${date}',
  @ConsultantType = '${consultant_type}';
`;
    const result = await sql.query(data);
    if (result.rowsAffected[0] === 0) {
      return res.status(400).json({ error: 'Failed to book appointment' });
    }
    res.status(201).json({ message: '✅ Appointment booked successfully' });
  } catch (err) {
    console.error('❌ Error booking appointment:', err);
    res.status(500).json({ error: err.message || 'Failed to book appointment' });
  }
};


// the patient can cancel his appointment
export const cancelAppointmentsByUser = async (req, res) => {
  const P_ID = parseInt(req.params.P_ID);
  const D_ID = parseInt(req.params.D_ID);
  if (!P_ID || !D_ID) {
    return res.status(400).json({ error: 'All fields are required' });
  }
  try {
    const data = `EXEC dbo.cancelAppointment
    @P_ID = ${P_ID}, @D_ID = ${D_ID}`;
    const result = await sql.query(data);
    const message = result.recordset[0]?.Message;
    res.status(200).json({ message: message });
  } catch (err) {
    console.error('❌ Error deleting appointments by user:', err);
    res.status(500).json({ error: 'Failed to delete appointments' });
  }
};
