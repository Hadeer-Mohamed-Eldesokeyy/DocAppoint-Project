import { Link } from "react-router-dom"
import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin } from "lucide-react"

function Footer() {
  return (
    <footer className="bg-dark text-white pt-5 mt-5">
      <div className="container pb-4">
        <div className="row g-4">
          <div className="col-lg-3 col-md-6">
            <div className="d-flex align-items-center mb-3">
              <span
                className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center me-2"
                style={{ width: "38px", height: "38px", boxShadow: "0 4px 8px rgba(255, 255, 255, 0.2)" }}
              >
                +
              </span>
              <span className="fs-4 fw-bold">HealthCare</span>
            </div>
            <p className="mb-4 text-white-50">
              Connecting patients with the best healthcare professionals for quality medical care.
            </p>
            <div className="d-flex gap-2">
              <a
                href="#"
                className="footer-icon btn btn-sm btn-outline-light rounded-circle d-flex align-items-center justify-content-center"
              >
                <Facebook size={18} />
              </a>
              <a
                href="#"
                className="footer-icon btn btn-sm btn-outline-light rounded-circle d-flex align-items-center justify-content-center"
              >
                <Twitter size={18} />
              </a>
              <a
                href="#"
                className="footer-icon btn btn-sm btn-outline-light rounded-circle d-flex align-items-center justify-content-center"
              >
                <Instagram size={18} />
              </a>
              <a
                href="#"
                className="footer-icon btn btn-sm btn-outline-light rounded-circle d-flex align-items-center justify-content-center"
              >
                <Linkedin size={18} />
              </a>
            </div>
          </div>

          <div className="col-lg-3 col-md-6">
            <h3 className="fs-5 mb-3 position-relative pb-2 border-bottom border-primary">Quick Links</h3>
            <ul className="list-unstyled">
              <li className="mb-2">
                <Link to="/" className="text-white-50 text-decoration-none hover-white">
                  Home
                </Link>
              </li>
              <li className="mb-2">
                <Link to="/" className="text-white-50 text-decoration-none hover-white">
                  Find Doctors
                </Link>
              </li>
              <li className="mb-2">
                <Link to="/" className="text-white-50 text-decoration-none hover-white">
                  Services
                </Link>
              </li>
              <li className="mb-2">
                <Link to="/" className="text-white-50 text-decoration-none hover-white">
                  About Us
                </Link>
              </li>
              <li className="mb-2">
                <Link to="/" className="text-white-50 text-decoration-none hover-white">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          <div className="col-lg-3 col-md-6">
            <h3 className="fs-5 mb-3 position-relative pb-2 border-bottom border-primary">Services</h3>
            <ul className="list-unstyled">
              <li className="mb-2">
                <Link to="/" className="text-white-50 text-decoration-none hover-white">
                  Online Consultation
                </Link>
              </li>
              <li className="mb-2">
                <Link to="/" className="text-white-50 text-decoration-none hover-white">
                  Emergency Services
                </Link>
              </li>
              <li className="mb-2">
                <Link to="/" className="text-white-50 text-decoration-none hover-white">
                  Home Visits
                </Link>
              </li>
              <li className="mb-2">
                <Link to="/" className="text-white-50 text-decoration-none hover-white">
                  Medical Tests
                </Link>
              </li>
              <li className="mb-2">
                <Link to="/" className="text-white-50 text-decoration-none hover-white">
                  Health Packages
                </Link>
              </li>
            </ul>
          </div>

          <div className="col-lg-3 col-md-6">
            <h3 className="fs-5 mb-3 position-relative pb-2 border-bottom border-primary">Contact Us</h3>
            <div className="mb-3 d-flex align-items-center">
              <div
                className="bg-primary rounded-circle d-flex align-items-center justify-content-center me-3"
                style={{ width: "32px", height: "32px" }}
              >
                <Phone size={16} className="text-white" />
              </div>
              <span>+1 (555) 123-4567</span>
            </div>
            <div className="mb-3 d-flex align-items-center">
              <div
                className="bg-primary rounded-circle d-flex align-items-center justify-content-center me-3"
                style={{ width: "32px", height: "32px" }}
              >
                <Mail size={16} className="text-white" />
              </div>
              <span>support@healthapp.com</span>
            </div>
            <div className="d-flex align-items-center">
              <div
                className="bg-primary rounded-circle d-flex align-items-center justify-content-center me-3"
                style={{ width: "32px", height: "32px" }}
              >
                <MapPin size={16} className="text-white" />
              </div>
              <span>123 Medical Center Dr, Healthcare City</span>
            </div>
          </div>
        </div>
      </div>

      <div className="py-3 border-top border-secondary">
        <div className="container d-flex flex-column flex-md-row justify-content-between align-items-center">
          <p className="mb-3 mb-md-0 text-white-50">
            &copy; {new Date().getFullYear()} HealthCare. All rights reserved.
          </p>
          <div className="d-flex gap-3">
            <Link to="/" className="text-white-50 text-decoration-none hover-white">
              Privacy Policy
            </Link>
            <Link to="/" className="text-white-50 text-decoration-none hover-white">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
