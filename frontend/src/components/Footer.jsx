
import { Link } from "react-router-dom";
import "./Footer.css";

export default function Footer() {
  return (
    <footer className="civic-footer">
      <div className="civic-footer-inner">
        <div className="civic-footer-brand">
          <Link to="/" className="civic-footer-logo">
            <span className="civic-footer-mark">C</span>
            <span>CivicSetu</span>
          </Link>

          <p>
            Building better neighbourhoods through citizen
            participation and transparent civic reporting.
          </p>
        </div>

        <div className="civic-footer-links">
          <h3>Explore</h3>
          <Link to="/">Home</Link>
          <Link to="/explore">Public Reports</Link>
          <Link to="/leaderboard">Leaderboard</Link>
        </div>

        <div className="civic-footer-links">
          <h3>Citizen Services</h3>
          <Link to="/report-issue">Report an Issue</Link>
          <Link to="/dashboard">My Dashboard</Link>
          <Link to="/login">Login</Link>
        </div>
      </div>

      <div className="civic-footer-bottom">
        <p>
          © {new Date().getFullYear()} CivicSetu. Made for better
          communities.
        </p>
        <span>Designed for citizens. Built for change.</span>
      </div>
    </footer>
  );
}
