
import { Link } from "react-router-dom";
import {
  ExternalLink,
  ShieldCheck,
} from "lucide-react";
import "./Footer.css";

export default function Footer() {
  return (
    <footer className="civic-footer">

      {/* Tricolour top border */}
      <div className="footer-tricolour">
        <span></span>
        <span></span>
        <span></span>
      </div>

      <div className="civic-footer-inner">

        {/* Brand section */}
        <div className="civic-footer-brand">

          <Link to="/" className="civic-footer-logo">
            <img
              src="/favicon.png"
              alt="CivicSetu Logo"
              className="civic-footer-logo-img"
            />

            <div className="civic-footer-brand-name">
              <strong>CivicSetu</strong>
              <span>Citizen Participation Portal</span>
            </div>
          </Link>

          <p>
            Building better neighbourhoods through citizen
            participation, transparent governance and
            accountable civic reporting.
          </p>

          <div className="footer-government-badge">
            <ShieldCheck size={15} />
            <span>Citizen Powered Governance</span>
          </div>
        </div>

        {/* Explore links */}
        <div className="civic-footer-links">
          <h3>Explore</h3>

          <Link to="/">Home</Link>
          <Link to="/explore">Public Reports</Link>
          <Link to="/leaderboard">Leaderboard</Link>
        </div>

        {/* Services */}
        <div className="civic-footer-links">
          <h3>Citizen Services</h3>

          <Link to="/report-issue">Report an Issue</Link>
          <Link to="/dashboard">My Dashboard</Link>
          <Link to="/login">Citizen Login</Link>
        </div>

      </div>

      {/* Bottom section */}
      <div className="civic-footer-bottom">

        <p>
          © {new Date().getFullYear()} CivicSetu.
          All Rights Reserved.
        </p>

        <div className="footer-developer">

          <span>Designed & Developed with ❤️ by</span>

          <a
            href="https://sachin-tech.vercel.app/"
            target="_blank"
            rel="noopener noreferrer"
            className="footer-developer-link"
          >
            Sachin
            <ExternalLink size={13} />
          </a>

        </div>

        <span className="footer-tagline">
          सेवा • सहभागिता • समाधान
        </span>

      </div>

    </footer>
  );
}
