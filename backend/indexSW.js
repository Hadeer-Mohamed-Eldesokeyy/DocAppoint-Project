import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import auth_routes from './routes/auth_routes.js';
import pay_routes from './routes/pay_routes.js';
import doctor_routes from './routes/doctor_routes.js';
import reviews_routes from './routes/reviews_routes.js';
import appointments_routes from './routes/appointments_routes.js';
import {connectToDatabase} from './config_controller/db.js';//this file is for connecting the database to the codes
import bcrypt from 'bcryptjs';



//this file is the main one containing the path to routes and establishing the server(app)

dotenv.config();//security stuff
const app = express() ;
const port = process.env.PORT || 3000;//establishing port 
connectToDatabase();

//middlwares
app.use(cors());//talking to front
app.use(bodyParser.json());//another coneccting to front stuff i have no idea how it work


// Middleware to handle ngrok warning header
app.use((req, res, next) => {
    res.setHeader("ngrok-skip-browser-warning", "true");
    next();
  });


//routes
app.use('/api/auth', auth_routes);//to the user, {/register, /login, (2 0f) /profile }
app.use('/api/payments', pay_routes);//to payment {/checkout, /invoice} //make sure payments with "s"
app.use('/api/doctors', doctor_routes );//to doctors {/(2 of it),/:id(3 of it)}
app.use('/api/reviews', reviews_routes);//to reviews {/(2 of it), /:id, /doctor/:doctorId }
app.use('/api/appointments', appointments_routes);//to appointments {/ (2 of it), /user/:userId, /user/:P_ID }








app.listen(port, () => {
    console.log(`server started at port ${port}`)
});
