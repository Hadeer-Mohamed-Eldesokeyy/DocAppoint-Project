import express from 'express';
const router = express.Router();
import { getDoctorReviews, addReview, deleteReview} from '../controllers/review_controller.js';

router.get('/:doctorId', getDoctorReviews);
router.post('/',addReview);
router.delete('/:id', deleteReview);

export default router;

