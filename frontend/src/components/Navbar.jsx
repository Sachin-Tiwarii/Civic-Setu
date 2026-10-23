
import { Link, NavLink } from "react-router-dom";

export default function Navbar() {
  const navLinkStyle = ({ isActive }) => ({
    color: isActive ? "#193f2b" : "#444",
    textDecoration: "none",
    fontWeight: isActive ? 700 : 500,
    fontSize: "14px",
    padding: "8px 10px",
    borderRadius: "8px",
  });

  return (
    <header
      style={{
        width: "100%",
        background: "#ffffff",
        borderBottom: "1px solid #e5e7eb",
        boxSizing: "border-box",
      }}
    >
      <nav
        style={{
          maxWidth: "1200px",
          minHeight: "72px",
          margin: "0 auto",
          padding: "12px 20px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "20px",
          flexWrap: "wrap",
          boxSizing: "border-box",
        }}
      >
        <Link
          to="/"
          style={{
            color: "#193f2b",
            textDecoration: "none",
            fontSize: "24px",
            fontWeight: 800,
            letterSpacing: "-0.7px",
          }}
        >
          CivicSetu
        </Link>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "4px",
            flexWrap: "wrap",
          }}
        >
          <NavLink to="/" end style={navLinkStyle}>
            Home
          </NavLink>

          <NavLink to="/explore" style={navLinkStyle}>
            Explore Issues
          </NavLink>

          <NavLink to="/leaderboard" style={navLinkStyle}>
            Leaderboard
          </NavLink>

          <NavLink to="/report-issue" style={navLinkStyle}>
            Report Issue
          </NavLink>

          <NavLink to="/dashboard" style={navLinkStyle}>
            Dashboard
          </NavLink>

          <NavLink to="/login" style={navLinkStyle}>
            Login
          </NavLink>
        </div>
      </nav>
    </header>
  );
}
