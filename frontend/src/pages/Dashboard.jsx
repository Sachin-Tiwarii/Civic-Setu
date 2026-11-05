
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

const text = {
  en: {
    locale: "en-IN",
    loading: "Loading your dashboard...",
    errTitle: "Dashboard unavailable",
    errDefault: "Something went wrong. Please try again.",
    errNetwork: "Unable to connect to the server.",
    retry: "Try again",
    skip: "Skip to main content",
    welcome: "Welcome",
    citizen: "Citizen",
    intro:
      "Track the status of your grievances and view your contribution to your community.",
    lodge: "Lodge a grievance",
    profile: "Citizen profile",
    registered: "Registered Citizen",
    communityPoints: "Community points",
    total: "Total grievances",
    lodged: "Lodged by you",
    pending: "Pending",
    awaiting: "Awaiting further action",
    verified: "Verified",
    verifiedDesc: "Verified or being processed",
    resolved: "Resolved",
    resolvedDesc: "Marked as resolved",
    recent: "Recent grievances",
    public: "Public grievances",
    emptyTitle: "No grievances lodged yet",
    emptyText:
      "Report a problem in your neighbourhood to bring it to the notice of the concerned authority.",
    first: "Lodge your first grievance",
    grievance: "Grievance",
    category: "Category",
    date: "Date",
    status: "Status",
    location: "Location not provided",
    viewAll: "View all public grievances",
    contribution: "Your community contribution",
    impactText:
      "Every well-documented report helps the authorities act on local issues faster.",
    resolvedGrievances: "Resolved grievances",
    quickLinks: "Quick links",
    submitProblem: "Submit a local problem",
    seeReports: "See community reports",
    topContributors: "See top contributors",
    leaderboard: "Leaderboard",
    viewLeaderboard: "View leaderboard",
    note: "Note:",
    notice:
      "Status shown above is updated by the concerned department. Please quote your grievance title and date in any follow-up.",
    categoryNames: {},
    statusNames: {},
  },

  hi: {
    locale: "hi-IN",
    loading: "आपका डैशबोर्ड लोड हो रहा है...",
    errTitle: "डैशबोर्ड उपलब्ध नहीं है",
    errDefault: "कुछ गलत हो गया। कृपया पुनः प्रयास करें।",
    errNetwork: "सर्वर से संपर्क नहीं हो सका।",
    retry: "पुनः प्रयास करें",
    skip: "मुख्य सामग्री पर जाएँ",
    welcome: "स्वागत है",
    citizen: "नागरिक",
    intro:
      "अपनी शिकायतों की स्थिति देखें और अपने समुदाय में दिए गए योगदान की जानकारी प्राप्त करें।",
    lodge: "शिकायत दर्ज करें",
    profile: "नागरिक प्रोफ़ाइल",
    registered: "पंजीकृत नागरिक",
    communityPoints: "सामुदायिक अंक",
    total: "कुल शिकायतें",
    lodged: "आपके द्वारा दर्ज",
    pending: "लंबित",
    awaiting: "आगे की कार्रवाई की प्रतीक्षा में",
    verified: "सत्यापित",
    verifiedDesc: "सत्यापित या प्रक्रिया में",
    resolved: "निराकृत",
    resolvedDesc: "समाधान किया गया",
    recent: "हाल की शिकायतें",
    public: "सार्वजनिक शिकायतें",
    emptyTitle: "अभी तक कोई शिकायत दर्ज नहीं की गई",
    emptyText:
      "अपने क्षेत्र की समस्या दर्ज करें ताकि संबंधित विभाग उसका समाधान कर सके।",
    first: "अपनी पहली शिकायत दर्ज करें",
    grievance: "शिकायत",
    category: "श्रेणी",
    date: "तारीख",
    status: "स्थिति",
    location: "स्थान उपलब्ध नहीं",
    viewAll: "सभी सार्वजनिक शिकायतें देखें",
    contribution: "आपका सामुदायिक योगदान",
    impactText:
      "विस्तृत जानकारी के साथ दर्ज की गई हर शिकायत संबंधित अधिकारियों को स्थानीय समस्याओं पर तेजी से कार्रवाई करने में मदद करती है।",
    resolvedGrievances: "निराकृत शिकायतें",
    quickLinks: "त्वरित लिंक",
    submitProblem: "स्थानीय समस्या दर्ज करें",
    seeReports: "सामुदायिक रिपोर्ट देखें",
    topContributors: "शीर्ष योगदानकर्ता देखें",
    leaderboard: "लीडरबोर्ड",
    viewLeaderboard: "लीडरबोर्ड देखें",
    note: "ध्यान दें:",
    notice:
      "ऊपर दिखाई गई शिकायत की स्थिति संबंधित विभाग द्वारा अपडेट की जाती है। आगे की जानकारी के लिए अपनी शिकायत का शीर्षक और तारीख बताएँ।",

    categoryNames: {
      Garbage: "कचरा",
      "Road Damage": "सड़क क्षति",
      "Water Supply": "जल आपूर्ति",
      Drainage: "जल निकासी",
      Streetlight: "स्ट्रीट लाइट",
      "Public Sanitation": "सार्वजनिक स्वच्छता",
      Other: "अन्य",
    },

    statusNames: {
      Submitted: "दर्ज की गई",
      "Under Verification": "सत्यापन जारी",
      Verified: "सत्यापित",
      Assigned: "सौंपी गई",
      "In Progress": "कार्य प्रगति पर",
      Resolved: "निराकृत",
      Rejected: "अस्वीकृत",
      Reopened: "पुनः खोली गई",
    },
  },
};

function Dashboard({ lang = "en" }) {
  const currentLang = lang === "hi" ? "hi" : "en";
  const t = text[currentLang];

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
        throw new Error("account");
      }

      if (!complaintsResponse.ok || complaintsData.success !== true) {
        throw new Error("complaints");
      }

      setUser(userData.user);
      setComplaints(complaintsData.complaints || []);

    } catch (err) {
      setError(
        err instanceof TypeError ? "network" : "default"
      );
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
    ["Verified", "Assigned", "In Progress", "Resolved"].includes(
      item.status
    )
  ).length;

  const getStatusClass = (status = "") =>
    status.toLowerCase().replace(/\s+/g, "-");

  const getStatusLabel = (status = "") =>
    t.statusNames[status] || status;

  const getCategoryLabel = (category = "") =>
    t.categoryNames[category] || category;

  const formatDate = (value) =>
    value
      ? new Date(value).toLocaleDateString(t.locale, {
          day: "numeric",
          month: "short",
          year: "numeric",
        })
      : currentLang === "hi"
        ? "उपलब्ध नहीं"
        : "Not available";

  if (loading) {
    return (
      <div className="dashboard-state" role="status" lang={currentLang}>
        <LoaderCircle className="dashboard-spinner" size={32} />
        <p>{t.loading}</p>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className="dashboard-state dashboard-state-error"
        role="alert"
        lang={currentLang}
      >
        <AlertCircle size={32} />
        <h2>{t.errTitle}</h2>
        <p>
          {error === "network"
            ? t.errNetwork
            : t.errDefault}
        </p>
        <button onClick={loadDashboard}>
          <RefreshCw size={16} />
          {t.retry}
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
      className={`dashboard-page ${
        highContrast ? "high-contrast" : ""
      } ${currentLang === "hi" ? "dashboard-hindi-page" : ""}`}
      style={{ fontSize: `${fontSize}px` }}
      lang={currentLang}
    >
      <a href="#main-content" className="gov-skip">
        {t.skip}
      </a>

      <main id="main-content" className="dashboard-container">

        {/* Welcome Header */}
        <header className="dashboard-welcome">
          <div>
            <h1>
              {t.welcome},{" "}
              {user?.name?.split(" ")[0] || t.citizen}
            </h1>

            <p>{t.intro}</p>
          </div>

          <Link
            to="/report-issue"
            className="dashboard-primary-button"
          >
            <FilePlus2 size={18} />
            {t.lodge}
          </Link>
        </header>

        {/* Citizen Profile */}
        <section
          className="dashboard-profile-card"
          aria-label={t.profile}
        >
          <div
            className="dashboard-profile-avatar"
            aria-hidden="true"
          >
            {initials}
          </div>

          <div className="dashboard-profile-info">
            <h2>{user?.name || t.citizen}</h2>
            <p>{user?.email || ""}</p>

            <span className="dashboard-member-badge">
              <ShieldCheck size={14} />
              {t.registered}
            </span>
          </div>

          <div className="dashboard-points">
            <Trophy size={23} />

            <div>
              <strong>{user?.points ?? 0}</strong>
              <span>{t.communityPoints}</span>
            </div>
          </div>
        </section>

        {/* Statistics */}
        <section
          className="dashboard-stats-grid"
          aria-label={t.total}
        >
          <article className="dashboard-stat-card">
            <div className="dashboard-stat-icon stat-icon-green">
              <FileText size={24} />
            </div>

            <span>{t.total}</span>
            <strong>{complaints.length}</strong>
            <p>{t.lodged}</p>
          </article>

          <article className="dashboard-stat-card">
            <div className="dashboard-stat-icon stat-icon-orange">
              <Clock3 size={24} />
            </div>

            <span>{t.pending}</span>
            <strong>{pendingCount}</strong>
            <p>{t.awaiting}</p>
          </article>

          <article className="dashboard-stat-card">
            <div className="dashboard-stat-icon stat-icon-blue">
              <ShieldCheck size={24} />
            </div>

            <span>{t.verified}</span>
            <strong>{verifiedCount}</strong>
            <p>{t.verifiedDesc}</p>
          </article>

          <article className="dashboard-stat-card">
            <div className="dashboard-stat-icon stat-icon-purple">
              <CheckCircle2 size={24} />
            </div>

            <span>{t.resolved}</span>
            <strong>{resolvedCount}</strong>
            <p>{t.resolvedDesc}</p>
          </article>
        </section>

        <div className="dashboard-content-grid">

          {/* Recent Complaints */}
          <section className="dashboard-panel">
            <div className="dashboard-panel-heading">
              <h2>{t.recent}</h2>

              <Link to="/explore" className="dashboard-text-link">
                {t.public} <ArrowRight size={15} />
              </Link>
            </div>

            {complaints.length === 0 ? (
              <div className="dashboard-empty">
                <div className="dashboard-empty-icon">
                  <FileText size={30} />
                </div>

                <h3>{t.emptyTitle}</h3>
                <p>{t.emptyText}</p>

                <Link
                  to="/report-issue"
                  className="dashboard-primary-button"
                >
                  {t.first}
                </Link>
              </div>
            ) : (
              <div className="dashboard-table-wrap">
                <table className="dashboard-table">
                  <caption
                    className="gov-skip"
                    style={{ position: "absolute" }}
                  >
                    {t.recent}
                  </caption>

                  <thead>
                    <tr>
                      <th scope="col">{t.grievance}</th>
                      <th scope="col">{t.category}</th>
                      <th scope="col">{t.date}</th>
                      <th scope="col">{t.status}</th>
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
                            {complaint.location?.address || t.location}
                          </p>
                        </td>

                        <td>
                          {getCategoryLabel(complaint.category)}
                        </td>

                        <td>{formatDate(complaint.createdAt)}</td>

                        <td>
                          <span
                            className={`dashboard-status status-${getStatusClass(
                              complaint.status
                            )}`}
                          >
                            {getStatusLabel(complaint.status)}
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
                {t.viewAll} <ArrowRight size={16} />
              </Link>
            )}
          </section>

          {/* Sidebar */}
          <aside className="dashboard-side-column">

            {/* Community Contribution */}
            <section className="dashboard-impact-card">
              <div className="dashboard-impact-body">
                <div className="dashboard-impact-icon">
                  <Trophy size={24} />
                </div>

                <h2>{t.contribution}</h2>
                <p>{t.impactText}</p>

                <div className="dashboard-impact-divider" />

                <div className="dashboard-impact-row">
                  <span>{t.resolvedGrievances}</span>
                  <strong>{resolvedCount}</strong>
                </div>

                <div className="dashboard-impact-row">
                  <span>{t.communityPoints}</span>
                  <strong>{user?.points ?? 0}</strong>
                </div>
              </div>

              <Link
                to="/leaderboard"
                className="dashboard-impact-link"
              >
                {t.viewLeaderboard} <ArrowRight size={16} />
              </Link>
            </section>

            {/* Quick Actions */}
            <section className="dashboard-quick-actions">
              <h3>{t.quickLinks}</h3>

              <Link to="/report-issue">
                <FilePlus2 size={20} />

                <span>
                  <strong>{t.lodge}</strong>
                  <small>{t.submitProblem}</small>
                </span>

                <ArrowRight size={17} />
              </Link>

              <Link to="/explore">
                <MapPin size={20} />

                <span>
                  <strong>{t.public}</strong>
                  <small>{t.seeReports}</small>
                </span>

                <ArrowRight size={17} />
              </Link>

              <Link to="/leaderboard">
                <Trophy size={20} />

                <span>
                  <strong>{t.leaderboard}</strong>
                  <small>{t.topContributors}</small>
                </span>

                <ArrowRight size={17} />
              </Link>
            </section>
          </aside>
        </div>

        {/* Notice */}
        <p className="gov-notice">
          <strong>{t.note}</strong> {t.notice}
        </p>

      </main>
    </div>
  );
}

export default Dashboard;
