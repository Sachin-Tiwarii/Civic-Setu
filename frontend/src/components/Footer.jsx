
import { Heart } from "lucide-react";
import { Link } from "react-router-dom";
import "./Footer.css";

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        <Link to="/" className="footer-brand">
          CivicSetu
        </Link>

        <p className="footer-description">
          Building cleaner, safer, and better communities together.
        </p>

        <div className="footer-bottom">
          <p>
            © {new Date().getFullYear()} CivicSetu. All rights reserved.
          </p>

          <p className="footer-made-with">
            Made with <Heart size={14} fill="currentColor" />
            {" "}for our community
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
