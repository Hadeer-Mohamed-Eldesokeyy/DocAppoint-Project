// Main API service file that exports all services
import { doctorservice } from "./doctorservice"
import { authservice } from "./authservice"
import { appointmentservice } from "./appointmentservice"
import { paymentservice } from "./paymentservice"
import { reviewservice } from "./reviewservice"

// The API is responding with HTML instead of JSON, so we need to use a different URL structure
// Try without the /api prefix
export const API_BASE_URL = "http://localhost:3000/api"

// Export all services
export { doctorservice, authservice, appointmentservice, paymentservice, reviewservice }
