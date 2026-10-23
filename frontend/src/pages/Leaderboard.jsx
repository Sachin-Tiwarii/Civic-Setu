
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Trophy,
  Medal,
  Award,
  ArrowLeft,
  Users,
  LoaderCircle,
  AlertCircle,
} from "lucide-react";
import "./Leaderboard.css";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

function Leaderboard() {
  const [citizens, setCitizens] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchLeaderboard() {
      try {
        const response = await fetch(`${API_URL}/api/complaints/leaderboard`);
        const data = await response.json();

        if (!response.ok || data.success === false) {
          throw new Error(data.message || "Unable to load the leaderboard.");
        }

        setCitizens(data.leaderboard || data.users || []);
      } catch (err) {
        setError(err.message || "Unable to connect to the server.");
      } finally {
        setLoading(false);
      }
    }

    fetchLeaderboard();
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

  return (
    <div className="leaderboard-page">
      <div className="leaderboard-container">
        <Link to="/" className="leaderboard-back">
          <ArrowLeft size={17} />
          Back to home
        </Link>

        <header className="leaderboard-header">
          <div className="leaderboard-icon">
            <Trophy size={28} />
          </div>
          <span className="leaderboard-eyebrow">
            COMMUNITY RECOGNITION
          </span>
          <h1>People making a <span>difference.</span></h1>
          <p>
            Celebrating citizens who help make their neighbourhoods
            cleaner, safer, and better for everyone.
          </p>
        </header>

        <div className="leaderboard-summary">
          <div className="leaderboard-summary-icon">
            <Users size={21} />
          </div>
          <div>
            <strong>{citizens.length}</strong>
            <span>Citizens on the leaderboard</span>
          </div>
        </div>

        {loading ? (
          <div className="leaderboard-state">
            <LoaderCircle className="leaderboard-spinner" size={30} />
            <p>Loading community rankings...</p>
          </div>
        ) : error ? (
          <div className="leaderboard-state leaderboard-error">
            <AlertCircle size={28} />
            <h3>Could not load rankings</h3>
            <p>{error}</p>
            <button onClick={() => window.location.reload()}>
              Try again
            </button>
          </div>
        ) : citizens.length === 0 ? (
          <div className="leaderboard-state">
            <Trophy size={34} />
            <h3>The leaderboard starts here</h3>
            <p>
              Verified civic reports will help build the community rankings.
            </p>
            <Link to="/report-issue" className="leaderboard-action">
              Report an issue
            </Link>
          </div>
        ) : (
          <>
            <section className="leaderboard-podium-section">
              <div className="leaderboard-section-heading">
                <div>
                  <span className="leaderboard-eyebrow">TOP CONTRIBUTORS</span>
                  <h2>Community champions</h2>
                </div>
                <Trophy size={23} />
              </div>

              <div className="leaderboard-podium">
                {topThree.map((citizen, index) => {
                  const rank = index + 1;

                  return (
                    <article
                      className={`podium-card podium-rank-${rank}`}
                      key={citizen._id || citizen.id || citizen.email || rank}
                    >
                      <div className="podium-medal">
                        {rank === 1 ? (
                          <Trophy size={23} />
                        ) : rank === 2 ? (
                          <Medal size={23} />
                        ) : (
                          <Award size={23} />
                        )}
                      </div>

                      <div className="podium-avatar">
                        {getInitials(citizen.name)}
                      </div>

                      <h3>{citizen.name || "Community Citizen"}</h3>
                      <span className="podium-rank-label">
                        {rank === 1
                          ? "1st Place"
                          : rank === 2
                            ? "2nd Place"
                            : "3rd Place"}
                      </span>

                      <div className="podium-points">
                        <strong>{citizen.points ?? 0}</strong>
                        <span>points</span>
                      </div>
                    </article>
                  );
                })}
              </div>
            </section>

            <section className="leaderboard-table-section">
              <div className="leaderboard-section-heading">
                <div>
                  <span className="leaderboard-eyebrow">FULL RANKINGS</span>
                  <h2>All contributors</h2>
                </div>
                <span className="leaderboard-count">
                  {citizens.length} citizens
                </span>
              </div>

              <div className="leaderboard-table-wrap">
                <table className="leaderboard-table">
                  <thead>
                    <tr>
                      <th>Rank</th>
                      <th>Citizen</th>
                      <th>Points</th>
                    </tr>
                  </thead>
                  <tbody>
                    {citizens.map((citizen, index) => (
                      <tr
                        key={citizen._id || citizen.id || citizen.email || index}
                      >
                        <td>
                          <span className="leaderboard-rank">
                            {index < 3 ? (
                              <Trophy size={15} />
                            ) : (
                              `#${index + 1}`
                            )}
                          </span>
                        </td>
                        <td>
                          <div className="leaderboard-citizen">
                            <span className="leaderboard-small-avatar">
                              {getInitials(citizen.name)}
                            </span>
                            <strong>
                              {citizen.name || "Community Citizen"}
                            </strong>
                          </div>
                        </td>
                        <td>
                          <span className="leaderboard-points-value">
                            {citizen.points ?? 0}
                            <span> pts</span>
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

        <section className="leaderboard-cta">
          <div>
            <h2>Every report counts.</h2>
            <p>
              Help your community by reporting local issues and supporting
              verified complaints.
            </p>
          </div>
          <Link to="/report-issue" className="leaderboard-action">
            Report an issue
          </Link>
        </section>
      </div>
    </div>
  );
}

export default Leaderboard;
