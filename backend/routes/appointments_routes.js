import express from 'express';
const router = express.Router();
import { getPatientAppointments, bookAppointment, cancelAppointmentsByUser} from '../controllers/appointment_controller.js';

router.get('/user/:P_ID', getPatientAppointments);
router.post('/user/:P_ID/:D_ID', bookAppointment);
router.delete('/user/:P_ID/:D_ID',cancelAppointmentsByUser);

export default router;

