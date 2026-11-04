
import { Link } from "react-router-dom";
import {
  ExternalLink,
  ShieldCheck,
} from "lucide-react";
import "./Footer.css";

const translations = {
  en: {
    tagline: "Citizen Participation Portal",
    description:
      "Building better neighbourhoods through citizen participation, transparent governance and accountable civic reporting.",
    badge: "Citizen Powered Governance",
    explore: "Explore",
    home: "Home",
    reports: "Public Reports",
    leaderboard: "Leaderboard",
    services: "Citizen Services",
    report: "Report an Issue",
    dashboard: "My Dashboard",
    login: "Citizen Login",
    rights: "All Rights Reserved.",
    developer: "Designed & Developed with ❤️ by",
    footerTagline: "सेवा • सहभागिता • समाधान",
  },

  hi: {
    tagline: "नागरिक सहभागिता पोर्टल",
    description:
      "नागरिक भागीदारी, पारदर्शी शासन और जवाबदेह शिकायत प्रणाली के माध्यम से बेहतर पड़ोस का निर्माण।",
    badge: "नागरिक सशक्त शासन",
    explore: "अन्वेषण करें",
    home: "मुख्य पृष्ठ",
    reports: "सार्वजनिक शिकायतें",
    leaderboard: "लीडरबोर्ड",
    services: "नागरिक सेवाएँ",
    report: "समस्या की शिकायत करें",
    dashboard: "मेरा डैशबोर्ड",
    login: "नागरिक लॉगिन",
    rights: "सर्वाधिकार सुरक्षित।",
    developer: "डिज़ाइन और विकास ❤️ द्वारा",
    footerTagline: "सेवा • सहभागिता • समाधान",
  },
};

export default function Footer({ lang = "en" }) {
  const t = translations[lang] || translations.en;

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
              <span>{t.tagline}</span>
            </div>
          </Link>

          <p>{t.description}</p>

          <div className="footer-government-badge">
            <ShieldCheck size={15} />
            <span>{t.badge}</span>
          </div>
        </div>

        {/* Explore links */}
        <div className="civic-footer-links">
          <h3>{t.explore}</h3>

          <Link to="/">{t.home}</Link>
          <Link to="/explore">{t.reports}</Link>
          <Link to="/leaderboard">{t.leaderboard}</Link>
        </div>

        {/* Services */}
        <div className="civic-footer-links">
          <h3>{t.services}</h3>

          <Link to="/report-issue">{t.report}</Link>
          <Link to="/dashboard">{t.dashboard}</Link>
          <Link to="/login">{t.login}</Link>
        </div>

      </div>

      {/* Bottom section */}
      <div className="civic-footer-bottom">

        <p>
          © {new Date().getFullYear()} CivicSetu.
          {" "}{t.rights}
        </p>

        <div className="footer-developer">

          <span>{t.developer}</span>

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
          {t.footerTagline}
        </span>

      </div>

    </footer>
  );
}
