import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  AlertCircle,
  Award,
  ChevronRight,
  FilePlus,
  Home,
  LoaderCircle,
  Medal,
  RefreshCw,
  Trophy,
  Users,
} from "lucide-react";
import "./Leaderboard.css";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const text = {
  en: {
    home: "Home",
    crumb: "Leaderboard",
    kicker: "Citizen Recognition",
    title: "Citizens making a difference",
    intro:
      "Recognising citizens who help make their neighbourhoods cleaner, safer and better for everyone.",
    onBoard: "Citizens on the leaderboard",
    loading: "Loading community rankings...",
    errTitle: "Could not load rankings",
    errDefault: "Unable to load the leaderboard.",
    errNetwork: "Unable to connect to the server.",
    retry: "Try again",
    emptyTitle: "The leaderboard starts here",
    emptyText: "Verified civic reports will help build the community rankings.",
    report: "Report an issue",
    topKicker: "Top contributors",
    topTitle: "Community champions",
    allKicker: "Full rankings",
    allTitle: "All contributors",
    citizensCount: (n) => `${n} citizen${n === 1 ? "" : "s"}`,
    places: ["1st Place", "2nd Place", "3rd Place"],
    points: "points",
    pts: "pts",
    rank: "Rank",
    citizen: "Citizen",
    pointsHead: "Points",
    anonymous: "Community Citizen",
    ctaTitle: "Every report counts.",
    ctaText:
      "Help your community by reporting local issues and supporting verified complaints.",
  },
  hi: {
    home: "मुख्य पृष्ठ",
    crumb: "लीडरबोर्ड",
    kicker: "नागरिक सम्मान",
    title: "बदलाव लाने वाले नागरिक",
    intro:
      "उन नागरिकों का सम्मान, जो अपने पड़ोस को सबके लिए अधिक स्वच्छ, सुरक्षित और बेहतर बनाने में मदद करते हैं।",
    onBoard: "लीडरबोर्ड पर नागरिक",
    loading: "सामुदायिक रैंकिंग लोड हो रही है...",
    errTitle: "रैंकिंग लोड नहीं हो सकी",
    errDefault: "लीडरबोर्ड लोड नहीं हो सका।",
    errNetwork: "सर्वर से संपर्क नहीं हो सका।",
    retry: "पुनः प्रयास करें",
    emptyTitle: "लीडरबोर्ड की शुरुआत यहीं से",
    emptyText: "सत्यापित नागरिक रिपोर्ट से सामुदायिक रैंकिंग बनेगी।",
    report: "शिकायत दर्ज करें",
    topKicker: "शीर्ष योगदानकर्ता",
    topTitle: "सामुदायिक अग्रणी",
    allKicker: "पूरी रैंकिंग",
    allTitle: "सभी योगदानकर्ता",
    citizensCount: (n) => `${n} नागरिक`,
    places: ["प्रथम स्थान", "द्वितीय स्थान", "तृतीय स्थान"],
    points: "अंक",
    pts: "अंक",
    rank: "क्रम",
    citizen: "नागरिक",
    pointsHead: "अंक",
    anonymous: "सामुदायिक नागरिक",
    ctaTitle: "हर शिकायत मायने रखती है।",
    ctaText:
      "स्थानीय समस्याओं की शिकायत करके और सत्यापित शिकायतों का समर्थन करके अपने समुदाय की मदद करें।",
  },
};

function Leaderboard({ lang = "en" }) {
  const t = text[lang] || text.en;
  const [citizens, setCitizens] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchLeaderboard() {
      try {
        const response = await fetch(`${API_URL}/api/complaints/leaderboard`);
        const data = await response.json();

        if (!response.ok || data.success === false) {
          throw new Error(data.message || t.errDefault);
        }

        setCitizens(data.leaderboard || data.users || []);
      } catch (err) {
        setError(err.message || t.errNetwork);
      } finally {
        setLoading(false);
      }
    }

    fetchLeaderboard();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getInitials = (name = "Citizen") =>
    name
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((part) => part[0])
      .join("")
      .toUpperCase();

  const topThree = citizens.slice(0, 3);
  const medalIcons = [Trophy, Medal, Award];

  return (
    <div className="gb-page" lang={lang}>
      <div className="gb-tricolour" aria-hidden="true">
        <i />
        <i />
        <i />
      </div>

      <header className="gb-header">
        <div className="gb-wrap">
          <nav className="gb-crumbs" aria-label="Breadcrumb">
            <Link to="/">
              <Home size={14} /> {t.home}
            </Link>
            <ChevronRight size={14} />
            <span aria-current="page">{t.crumb}</span>
          </nav>

          <div className="gb-header-main">
            <span className="gb-header-icon" aria-hidden="true">
              <Trophy size={30} />
            </span>
            <div>
              <p className="gb-kicker">{t.kicker}</p>
              <h1>{t.title}</h1>
              <p className="gb-intro">{t.intro}</p>
            </div>
          </div>

          <div className="gb-summary">
            <span className="gb-summary-icon">
              <Users size={22} />
            </span>
            <div>
              <strong>{loading ? "—" : citizens.length}</strong>
              <span>{t.onBoard}</span>
            </div>
          </div>
        </div>
      </header>

      <div className="gb-wrap gb-body">
        {loading ? (
          <div className="gb-state" role="status">
            <LoaderCircle className="gb-spin" size={32} />
            <p>{t.loading}</p>
          </div>
        ) : error ? (
          <div className="gb-state gb-state-error" role="alert">
            <span className="gb-state-icon">
              <AlertCircle size={28} />
            </span>
            <h3>{t.errTitle}</h3>
            <p>{error}</p>
            <button type="button" onClick={() => window.location.reload()}>
              <RefreshCw size={16} /> {t.retry}
            </button>
          </div>
        ) : citizens.length === 0 ? (
          <div className="gb-state">
            <span className="gb-state-icon">
              <Trophy size={28} />
            </span>
            <h3>{t.emptyTitle}</h3>
            <p>{t.emptyText}</p>
            <Link to="/report-issue" className="gb-btn">
              <FilePlus size={17} /> {t.report}
            </Link>
          </div>
        ) : (
          <>
            <section className="gb-section">
              <div className="gb-heading">
                <p>{t.topKicker}</p>
                <h2>{t.topTitle}</h2>
              </div>

              <div className="gb-podium">
                {topThree.map((citizen, index) => {
                  const rank = index + 1;
                  const Icon = medalIcons[index];
                  return (
                    <article
                      className={`gb-podium-card gb-rank-${rank}`}
                      key={citizen._id || citizen.id || citizen.email || rank}
                    >
                      <span className="gb-medal">
                        <Icon size={22} />
                      </span>
                      <span className="gb-avatar">{getInitials(citizen.name)}</span>
                      <h3>{citizen.name || t.anonymous}</h3>
                      <span className="gb-place">{t.places[index]}</span>
                      <div className="gb-points">
                        <strong>{citizen.points ?? 0}</strong>
                        <span>{t.points}</span>
                      </div>
                    </article>
                  );
                })}
              </div>
            </section>

            <section className="gb-section">
              <div className="gb-heading gb-heading-row">
                <div>
                  <p>{t.allKicker}</p>
                  <h2>{t.allTitle}</h2>
                </div>
                <span className="gb-count">{t.citizensCount(citizens.length)}</span>
              </div>

              <div className="gb-table-wrap">
                <table className="gb-table">
                  <thead>
                    <tr>
                      <th scope="col">{t.rank}</th>
                      <th scope="col">{t.citizen}</th>
                      <th scope="col">{t.pointsHead}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {citizens.map((citizen, index) => (
                      <tr key={citizen._id || citizen.id || citizen.email || index}>
                        <td>
                          <span className={`gb-rank ${index < 3 ? `gb-rank-top-${index + 1}` : ""}`}>
                            {index + 1}
                          </span>
                        </td>
                        <td>
                          <div className="gb-citizen">
                            <span className="gb-small-avatar">
                              {getInitials(citizen.name)}
                            </span>
                            <strong>{citizen.name || t.anonymous}</strong>
                          </div>
                        </td>
                        <td>
                          <span className="gb-points-value">
                            {citizen.points ?? 0}
                            <span> {t.pts}</span>
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          </>
        )}

        <section className="gb-cta">
          <span className="gb-cta-icon" aria-hidden="true">
            <FilePlus size={28} />
          </span>
          <div>
            <h2>{t.ctaTitle}</h2>
            <p>{t.ctaText}</p>
          </div>
          <Link to="/report-issue" className="gb-btn">
            {t.report}
          </Link>
        </section>
      </div>
    </div>
  );
}

export default Leaderboard;