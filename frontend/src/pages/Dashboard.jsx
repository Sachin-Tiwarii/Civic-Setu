import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  AlertCircle,
  ArrowRight,
  CheckCircle2,
  Clock3,
  FilePlus2,
  FileText,
  Landmark,
  LoaderCircle,
  MapPin,
  RefreshCw,
  ShieldCheck,
  Trophy,
} from "lucide-react";
import "./Dashboard.css";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

function Dashboard() {
  const [user, setUser] = useState(null);
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [fontSize, setFontSize] = useState(15);
  const [highContrast, setHighContrast] = useState(false);

  const loadDashboard = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const [userResponse, complaintsResponse] = await Promise.all([
        fetch(`${API_URL}/api/auth/me`, { credentials: "include" }),
        fetch(`${API_URL}/api/complaints`, { credentials: "include" }),
      ]);

      const userData = await userResponse.json();
      const complaintsData = await complaintsResponse.json();

      if (!userResponse.ok || userData.success !== true) {
        throw new Error(userData.message || "Unable to load your account.");
      }

      if (!complaintsResponse.ok || complaintsData.success !== true) {
        throw new Error(
          complaintsData.message || "Unable to load your complaints."
        );
      }

      setUser(userData.user);
      setComplaints(complaintsData.complaints || []);
    } catch (err) {
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadDashboard();
  }, [loadDashboard]);

  const resolvedCount = complaints.filter(
    (item) => item.status === "Resolved"
  ).length;

  const pendingCount = complaints.filter(
    (item) => !["Resolved", "Rejected"].includes(item.status)
  ).length;

  const verifiedCount = complaints.filter((item) =>
    ["Verified", "Assigned", "In Progress", "Resolved"].includes(item.status)
  ).length;

  const getStatusClass = (status = "") =>
    status.toLowerCase().replace(/\s+/g, "-");

  const formatDate = (value) =>
    value
      ? new Date(value).toLocaleDateString("en-IN", {
          day: "numeric",
          month: "short",
          year: "numeric",
        })
      : "Not available";

  if (loading) {
    return (
      <div className="dashboard-state" role="status">
        <LoaderCircle className="dashboard-spinner" size={32} />
        <p>Loading your dashboard… / कृपया प्रतीक्षा करें</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-state dashboard-state-error" role="alert">
        <AlertCircle size={32} />
        <h2>Dashboard unavailable</h2>
        <p>{error}</p>
        <button onClick={loadDashboard}>
          <RefreshCw size={16} />
          Try again
        </button>
      </div>
    );
  }

  const initials = (user?.name || "C")
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();

  return (
    <div
      className={`dashboard-page${highContrast ? " high-contrast" : ""}`}
      style={{ fontSize: `${fontSize}px` }}
    >
      <a href="#main-content" className="gov-skip">
        Skip to main content
      </a>
      <main id="main-content" className="dashboard-container">

        <header className="dashboard-welcome">
          <div>
            <h1>
              Welcome, {user?.name?.split(" ")[0] || "Citizen"} | स्वागत है
            </h1>
            <p>
              Track the status of your grievances and view your contribution
              to your community.
            </p>
          </div>

          <Link to="/report-issue" className="dashboard-primary-button">
            <FilePlus2 size={18} />
            Lodge a grievance
          </Link>
        </header>

        <section className="dashboard-profile-card" aria-label="Citizen profile">
          <div className="dashboard-profile-avatar" aria-hidden="true">
            {initials}
          </div>

          <div className="dashboard-profile-info">
            <h2>{user?.name || "Citizen"}</h2>
            <p>{user?.email || ""}</p>
            <span className="dashboard-member-badge">
              <ShieldCheck size={14} />
              Registered Citizen
            </span>
          </div>

          <div className="dashboard-points">
            <Trophy size={23} />
            <div>
              <strong>{user?.points ?? 0}</strong>
              <span>Community points</span>
            </div>
          </div>
        </section>

        <section className="dashboard-stats-grid" aria-label="Grievance summary">
          <article className="dashboard-stat-card">
            <div className="dashboard-stat-icon stat-icon-green">
              <FileText size={24} />
            </div>
            <span>Total grievances</span>
            <strong>{complaints.length}</strong>
            <p>Lodged by you</p>
          </article>

          <article className="dashboard-stat-card">
            <div className="dashboard-stat-icon stat-icon-orange">
              <Clock3 size={24} />
            </div>
            <span>Pending</span>
            <strong>{pendingCount}</strong>
            <p>Awaiting further action</p>
          </article>

          <article className="dashboard-stat-card">
            <div className="dashboard-stat-icon stat-icon-blue">
              <ShieldCheck size={24} />
            </div>
            <span>Verified</span>
            <strong>{verifiedCount}</strong>
            <p>Verified or being processed</p>
          </article>

          <article className="dashboard-stat-card">
            <div className="dashboard-stat-icon stat-icon-purple">
              <CheckCircle2 size={24} />
            </div>
            <span>Resolved</span>
            <strong>{resolvedCount}</strong>
            <p>Marked as resolved</p>
          </article>
        </section>

        <div className="dashboard-content-grid">
          <section className="dashboard-panel">
            <div className="dashboard-panel-heading">
              <h2>Recent grievances</h2>
              <Link to="/explore" className="dashboard-text-link">
                Public grievances <ArrowRight size={15} />
              </Link>
            </div>

            {complaints.length === 0 ? (
              <div className="dashboard-empty">
                <div className="dashboard-empty-icon">
                  <FileText size={30} />
                </div>
                <h3>No grievances lodged yet</h3>
                <p>
                  Report a problem in your neighbourhood to bring it to the
                  notice of the concerned authority.
                </p>
                <Link to="/report-issue" className="dashboard-primary-button">
                  Lodge your first grievance
                </Link>
              </div>
            ) : (
              <div className="dashboard-table-wrap">
                <table className="dashboard-table">
                  <caption className="gov-skip" style={{ position: "absolute" }}>
                    Your most recent grievances
                  </caption>
                  <thead>
                    <tr>
                      <th scope="col">Grievance</th>
                      <th scope="col">Category</th>
                      <th scope="col">Date</th>
                      <th scope="col">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {complaints.slice(0, 5).map((complaint) => (
                      <tr key={complaint._id}>
                        <td className="dashboard-complaint-info">
                          <Link
                            to={`/explore/${complaint._id}`}
                            className="dashboard-complaint-title"
                          >
                            {complaint.title}
                          </Link>
                          <p>
                            <MapPin size={12} />{" "}
                            {complaint.location?.address ||
                              "Location not provided"}
                          </p>
                        </td>
                        <td>{complaint.category}</td>
                        <td>{formatDate(complaint.createdAt)}</td>
                        <td>
                          <span
                            className={`dashboard-status status-${getStatusClass(
                              complaint.status
                            )}`}
                          >
                            {complaint.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {complaints.length > 5 && (
              <Link to="/explore" className="dashboard-view-all">
                View all public grievances <ArrowRight size={16} />
              </Link>
            )}
          </section>

          <aside className="dashboard-side-column">
            <section className="dashboard-impact-card">
              <div className="dashboard-impact-body">
                <div className="dashboard-impact-icon">
                  <Trophy size={24} />
                </div>
                <h2>Your community contribution</h2>
                <p>
                  Every well-documented report helps the authorities act on
                  local issues faster.
                </p>

                <div className="dashboard-impact-divider" />

                <div className="dashboard-impact-row">
                  <span>Resolved grievances</span>
                  <strong>{resolvedCount}</strong>
                </div>
                <div className="dashboard-impact-row">
                  <span>Community points</span>
                  <strong>{user?.points ?? 0}</strong>
                </div>
              </div>

              <Link to="/leaderboard" className="dashboard-impact-link">
                View leaderboard <ArrowRight size={16} />
              </Link>
            </section>

            <section className="dashboard-quick-actions">
              <h3>Quick links</h3>

              <Link to="/report-issue">
                <FilePlus2 size={20} />
                <span>
                  <strong>Lodge a grievance</strong>
                  <small>Submit a local problem</small>
                </span>
                <ArrowRight size={17} />
              </Link>

              <Link to="/explore">
                <MapPin size={20} />
                <span>
                  <strong>Public grievances</strong>
                  <small>See community reports</small>
                </span>
                <ArrowRight size={17} />
              </Link>

              <Link to="/leaderboard">
                <Trophy size={20} />
                <span>
                  <strong>Leaderboard</strong>
                  <small>See top contributors</small>
                </span>
                <ArrowRight size={17} />
              </Link>
            </section>
          </aside>
        </div>

        <p className="gov-notice">
          <strong>Note:</strong> Status shown above is updated by the concerned
          department. Please quote your grievance title and date in any
          follow-up.
        </p>
      </main>

      <footer className="gov-footer">
        <div className="gov-footer-inner">
          <span>
            <a href="/help">Help</a>
            <a href="/privacy">Privacy Policy</a>
            <a href="/terms">Terms of Use</a>
            <a href="/accessibility">Accessibility Statement</a>
          </span>
          <span>© CivicSetu. Content owned and maintained by CivicSetu.</span>
        </div>
      </footer>
    </div>
  );
}

export default Dashboard;