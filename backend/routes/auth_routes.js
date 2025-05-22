import express from 'express';
const router = express.Router();
import {register, login, get_userprofile, update_userprofile,  change_password} from '../controllers/auth_controllers.js';
import verify_token from '../middleware/verify_token.js';


router.post('/register', register);//for adding a new user //need in body  { username, email, password, phone, gender } 
router.post('/login', login);//obvisly for logingin //need in body {email, password}// a token will be recived from it
router.get('/profile', verify_token, get_userprofile);  //using the token u get to see the user's profile data 
router.put('/profile', verify_token, update_userprofile);  //using the token u may change the data you want from { email, name ,phone}//user shall not change his password, you are welcome
router.put('/change_password', verify_token,  change_password)//user now may change password ehehe

export default router; 
