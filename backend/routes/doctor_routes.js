import express from 'express';
const router = express.Router();
import {show_doctor, get_doctor_by_id, add_doctor, update_doctor, delete_doctor} from '../controllers/doctor_controller.js';


router.get('/', show_doctor);// api to get all doctors details (including the main information only) having the option of filtering by city and speciality
router.get('/:id', get_doctor_by_id);// api to get doctor profile by id
router.put('/:id', update_doctor);// api to update doctor profile by id
// ---> this part is assigned to admin only <---
router.post('/', add_doctor);// api to add new doctor profile
router.delete('/:id', delete_doctor);// api to delete doctor profile by id

export default router;