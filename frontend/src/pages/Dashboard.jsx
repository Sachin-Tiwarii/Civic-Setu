
import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  AlertCircle,
  ArrowRight,
  CheckCircle2,
  Clock3,
  FilePlus2,
  FileText,
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

  const loadDashboard = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const [userResponse, complaintsResponse] = await Promise.all([
        fetch(`${API_URL}/api/auth/me`, {
          credentials: "include",
        }),
        fetch(`${API_URL}/api/complaints`, {
          credentials: "include",
        }),
      ]);

      const userData = await userResponse.json();
      const complaintsData = await complaintsResponse.json();

      if (!userResponse.ok || userData.success !== true) {
        throw new Error(userData.message || "Unable to load your account.");
      }

      if (
        !complaintsResponse.ok ||
        complaintsData.success !== true
      ) {
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
    (item) =>
      !["Resolved", "Rejected"].includes(item.status)
  ).length;

  const verifiedCount = complaints.filter((item) =>
    [
      "Verified",
      "Assigned",
      "In Progress",
      "Resolved",
    ].includes(item.status)
  ).length;

  const getStatusClass = (status = "") =>
    status.toLowerCase().replace(/\s+/g, "-");

  if (loading) {
    return (
      <div className="dashboard-state">
        <LoaderCircle className="dashboard-spinner" size={32} />
        <p>Loading your dashboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-state dashboard-state-error">
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

  return (
    <div className="dashboard-page">
      <div className="dashboard-container">
        <header className="dashboard-welcome">
          <div>
            <span className="dashboard-eyebrow">
              CITIZEN DASHBOARD
            </span>
            <h1>
              Welcome back,{" "}
              <span>{user?.name?.split(" ")[0] || "Citizen"}</span>
            </h1>
            <p>
              Track your reports and see the difference you are making
              in your community.
            </p>
          </div>

          <Link to="/report-issue" className="dashboard-primary-button">
            <FilePlus2 size={18} />
            Report an issue
          </Link>
        </header>

        <section className="dashboard-profile-card">
          <div className="dashboard-profile-avatar">
            {(user?.name || "C")
              .trim()
              .split(/\s+/)
              .slice(0, 2)
              .map((part) => part[0])
              .join("")
              .toUpperCase()}
          </div>

          <div className="dashboard-profile-info">
            <h2>{user?.name || "Citizen"}</h2>
            <p>{user?.email || ""}</p>
            <span className="dashboard-member-badge">
              <ShieldCheck size={14} />
              CivicSetu Citizen
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

        <section className="dashboard-stats-grid">
          <article className="dashboard-stat-card">
            <div className="dashboard-stat-icon stat-icon-green">
              <FileText size={21} />
            </div>
            <span>Total reports</span>
            <strong>{complaints.length}</strong>
            <p>Issues submitted by you</p>
          </article>

          <article className="dashboard-stat-card">
            <div className="dashboard-stat-icon stat-icon-orange">
              <Clock3 size={21} />
            </div>
            <span>Pending reports</span>
            <strong>{pendingCount}</strong>
            <p>Awaiting further action</p>
          </article>

          <article className="dashboard-stat-card">
            <div className="dashboard-stat-icon stat-icon-blue">
              <ShieldCheck size={21} />
            </div>
            <span>Verified reports</span>
            <strong>{verifiedCount}</strong>
            <p>Verified or being processed</p>
          </article>

          <article className="dashboard-stat-card">
            <div className="dashboard-stat-icon stat-icon-purple">
              <CheckCircle2 size={21} />
            </div>
            <span>Resolved reports</span>
            <strong>{resolvedCount}</strong>
            <p>Issues marked as resolved</p>
          </article>
        </section>

        <div className="dashboard-content-grid">
          <section className="dashboard-panel">
            <div className="dashboard-panel-heading">
              <div>
                <span className="dashboard-eyebrow">
                  YOUR ACTIVITY
                </span>
                <h2>Recent complaints</h2>
              </div>

              <Link to="/explore" className="dashboard-text-link">
                Explore issues <ArrowRight size={15} />
              </Link>
            </div>

            {complaints.length === 0 ? (
              <div className="dashboard-empty">
                <div className="dashboard-empty-icon">
                  <FileText size={26} />
                </div>
                <h3>No reports yet</h3>
                <p>
                  Your first report can help bring attention to an issue
                  in your neighbourhood.
                </p>
                <Link
                  to="/report-issue"
                  className="dashboard-primary-button"
                >
                  Submit your first report
                </Link>
              </div>
            ) : (
              <div className="dashboard-complaint-list">
                {complaints.slice(0, 5).map((complaint) => (
                  <article
                    className="dashboard-complaint-item"
                    key={complaint._id}
                  >
                    <div className="dashboard-complaint-icon">
                      <MapPin size={19} />
                    </div>

                    <div className="dashboard-complaint-info">
                      <Link
                        to={`/explore/${complaint._id}`}
                        className="dashboard-complaint-title"
                      >
                        {complaint.title}
                      </Link>
                      <span>
                        {complaint.category} ·{" "}
                        {complaint.createdAt
                          ? new Date(
                              complaint.createdAt
                            ).toLocaleDateString("en-IN", {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            })
                          : "Date unavailable"}
                      </span>
                      <p>
                        {complaint.location?.address ||
                          "Location not provided"}
                      </p>
                    </div>

                    <span
                      className={`dashboard-status status-${getStatusClass(
                        complaint.status
                      )}`}
                    >
                      {complaint.status}
                    </span>
                  </article>
                ))}
              </div>
            )}

            {complaints.length > 5 && (
              <Link
                to="/explore"
                className="dashboard-view-all"
              >
                View all public issues <ArrowRight size={16} />
              </Link>
            )}
          </section>

          <aside className="dashboard-side-column">
            <section className="dashboard-impact-card">
              <div className="dashboard-impact-icon">
                <Trophy size={24} />
              </div>
              <span className="dashboard-eyebrow">
                YOUR COMMUNITY IMPACT
              </span>
              <h2>Small actions. Real change.</h2>
              <p>
                Every well-documented report gives your community a
                better chance of getting local issues addressed.
              </p>

              <div className="dashboard-impact-divider" />

              <div className="dashboard-impact-row">
                <span>Resolved reports</span>
                <strong>{resolvedCount}</strong>
              </div>
              <div className="dashboard-impact-row">
                <span>Community points</span>
                <strong>{user?.points ?? 0}</strong>
              </div>

              <Link to="/leaderboard" className="dashboard-impact-link">
                View leaderboard <ArrowRight size={16} />
              </Link>
            </section>

            <section className="dashboard-quick-actions">
              <h3>Quick actions</h3>

              <Link to="/report-issue">
                <span className="quick-action-icon">
                  <FilePlus2 size={18} />
                </span>
                <span>
                  <strong>Report an issue</strong>
                  <small>Submit a local problem</small>
                </span>
                <ArrowRight size={17} />
              </Link>

              <Link to="/explore">
                <span className="quick-action-icon">
                  <MapPin size={18} />
                </span>
                <span>
                  <strong>Explore complaints</strong>
                  <small>See community reports</small>
                </span>
                <ArrowRight size={17} />
              </Link>

              <Link to="/leaderboard">
                <span className="quick-action-icon">
                  <Trophy size={18} />
                </span>
                <span>
                  <strong>Leaderboard</strong>
                  <small>See community contributors</small>
                </span>
                <ArrowRight size={17} />
              </Link>
            </section>
          </aside>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
