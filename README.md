
# Medical Appointment System — Full Stack Web App

This is a full-stack medical appointment booking system that allows users to register, browse doctors, book appointments, make payments, and leave reviews. The project is divided into a backend API (Node.js + Express) and a frontend client (React).

---

## Features

- User registration and login
- Browse and search for doctors
- Book and manage appointments
- Submit and view reviews for doctors
- Secure payment integration
- Role-based access logic (e.g., patient/admin)
- Modular and scalable code architecture

---

## Project Structure

```
software_project_collected/
│
├── backend/
│   ├── config_controller/
│   │   └── db.js
│   ├── controllers/
│   │   ├── appointment_controller.js
│   │   ├── auth_controller.js
│   │   ├── doctor_controller.js
│   │   ├── payment_controller.js
│   │   └── review_controller.js
│   ├── routes/
│   │   ├── appointments_routes.js
│   │   ├── auth_routes.js
│   │   ├── doctor_routes.js
│   │   ├── pay_routes.js
│   │   └── reviews_routes.js
│   ├── services/
│   │   ├── appointmentservice.js
│   │   ├── authservice.js
│   │   ├── doctorservice.js
│   │   ├── paymentservice.js
│   │   └── reviewservice.js
│   ├── .env
│   ├── index.js
│   └── indexSW.js
│
├── frontend/
│   ├── public/
│   └── src/
│       ├── components/
│       ├── pages/
│       ├── App.js
│       └── index.js
│
├── .gitignore
├── README.md
```

---

## Installation & Running

### Project Setup

From the **root directory** of the project (`SWE_Project/`):

```bash
npm install
```

This will install dependencies for both `frontend` and `backend`, assuming you've set up proper scripts in the root `package.json` to forward the install.

---

### Run the Full App (Frontend + Backend)

Simply run:

```bash
npm start
```

This command will **automatically start both** the backend server and the React frontend using a custom script defined in the root `package.json`.

> Internally, this uses tools like `concurrently` to run:
> - `npm start` in `backend/` (Express server)
> - `npm start` in `frontend/` (React app)

The app will open in your default browser at:  
`http://localhost:3000` (Frontend)  
`http://localhost:PORT` (Backend, as defined in `.env`)

---

##  API Endpoints Overview (Backend)

### Auth

- `POST /api/auth/register` — Register a new user  
- `POST /api/auth/login` — User login  
- `GET /api/auth/profile` — Get current user profile  

### Doctors

- `GET /api/doctors/` — Get list of doctors  
- `GET /api/doctors/:id` — Get doctor details  

### Appointments

- `POST /api/appointments/` — Book appointment  
- `GET /api/appointments/user/:userId` — User’s appointments  
- `GET /api/appointments/user/:P_ID` — Appointments by patient  

### Payments

- `POST /api/payments/checkout` — Initiate payment  
- `GET /api/payments/invoice` — Get invoice data  

### Reviews

- `POST /api/reviews/` — Create review  
- `GET /api/reviews/doctor/:doctorId` — Reviews by doctor  
- `GET /api/reviews/:id` — Review details  

---

## 🛠 Technologies Used

- **Frontend**: React, React Router, Axios, CSS
- **Backend**: Node.js, Express.js
- **Database**: MySQL or compatible SQL
- **Security**: bcryptjs for hashing, dotenv for environment config
- **Tools**: Git, Postman (for API testing)

---

## Notes
- Run both frontend and backend in development for full functionality.
- CORS is enabled in backend to support frontend communication.
