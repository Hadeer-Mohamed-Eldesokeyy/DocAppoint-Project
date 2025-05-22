import express from 'express';
const router = express.Router();
import { checkout, get_invoice} from '../controllers/payment_controller.js';
import verify_token from '../middleware/verify_token.js';

router.post('/checkout/:d_id',verify_token, checkout);//paying for the appointment //need in body  {d_id,p_id, method, amount } //make sure the appoinement exists
router.get('/invoice/:id', get_invoice);//used to see the check, or the payment data, //error due to lackof infos / make sure to pass the id of an existing payment
//this api take also the user token as they cant view other ppls payments// make sure the p_id in that payment match the user befor testing

export default router;
