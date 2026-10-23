
import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  LoaderCircle,
  MapPin,
  RefreshCw,
  Search,
  SlidersHorizontal,
} from "lucide-react";
import "./ExploreIssues.css";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const categories = [
  "All Categories",
  "Garbage",
  "Road Damage",
  "Water Supply",
  "Drainage",
  "Streetlight",
  "Public Sanitation",
  "Other",
];

const statuses = [
  "All Statuses",
  "Submitted",
  "Under Verification",
  "Verified",
  "Assigned",
  "In Progress",
  "Resolved",
  "Rejected",
  "Reopened",
];

function ExploreIssues() {
  const [complaints, setComplaints] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All Categories");
  const [status, setStatus] = useState("All Statuses");
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadComplaints = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const params = new URLSearchParams({
        page: String(page),
        limit: "12",
      });

      if (search.trim()) params.set("search", search.trim());

      if (category !== "All Categories") {
        params.set("category", category);
      }

      if (status !== "All Statuses") {
        params.set("status", status);
      }

      const response = await fetch(
        `${API_URL}/api/complaints/explore?${params.toString()}`
      );

      const data = await response.json();

      if (!response.ok || data.success !== true) {
        throw new Error(data.message || "Unable to load complaints.");
      }

      setComplaints(data.complaints || []);
      setTotal(data.total || 0);
      setPages(Math.max(1, data.pages || 1));
    } catch (err) {
      setError(err.message || "Something went wrong.");
      setComplaints([]);
    } finally {
      setLoading(false);
    }
  }, [page, search, category, status]);

  useEffect(() => {
    loadComplaints();
  }, [loadComplaints]);

  const updateFilter = (setter, value) => {
    setter(value);
    setPage(1);
  };

  const resetFilters = () => {
    setSearch("");
    setCategory("All Categories");
    setStatus("All Statuses");
    setPage(1);
  };

  const getStatusClass = (value = "") =>
    value.toLowerCase().replace(/\s+/g, "-");

  return (
    <div className="explore-page">
      <div className="explore-container">
        <header className="explore-hero">
          <span className="explore-eyebrow">
            COMMUNITY TRANSPARENCY
          </span>
          <h1>
            Explore <span>local issues.</span>
          </h1>
          <p>
            Discover reported civic problems, follow their progress,
            and understand what needs attention in your community.
          </p>

          <div className="explore-summary">
            <div>
              <strong>{loading ? "—" : total}</strong>
              <span>Matching reports</span>
            </div>
            <div>
              <strong>{categories.length - 1}</strong>
              <span>Issue categories</span>
            </div>
          </div>
        </header>

        <section className="explore-filter-panel">
          <div className="explore-search">
            <Search size={19} />
            <input
              type="search"
              value={search}
              maxLength={100}
              placeholder="Search by title, description, or location..."
              aria-label="Search complaints"
              onChange={(event) =>
                updateFilter(setSearch, event.target.value)
              }
            />
          </div>

          <div className="explore-filter-row">
            <div className="explore-filter-label">
              <SlidersHorizontal size={16} />
              <span>Filters</span>
            </div>

            <label className="explore-select-wrap">
              <span>Category</span>
              <select
                value={category}
                onChange={(event) =>
                  updateFilter(setCategory, event.target.value)
                }
              >
                {categories.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </label>

            <label className="explore-select-wrap">
              <span>Status</span>
              <select
                value={status}
                onChange={(event) =>
                  updateFilter(setStatus, event.target.value)
                }
              >
                {statuses.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </label>

            <button
              className="explore-reset-button"
              type="button"
              onClick={resetFilters}
            >
              Reset filters
            </button>
          </div>
        </section>

        <div className="explore-results-heading">
          <div>
            <h2>Community reports</h2>
            <p>
              {loading
                ? "Fetching the latest reports..."
                : `${total} report${total === 1 ? "" : "s"} found`}
            </p>
          </div>
          <span className="explore-live-label">
            <span />
            Live data
          </span>
        </div>

        {loading ? (
          <div className="explore-state">
            <LoaderCircle className="explore-spinner" size={32} />
            <p>Loading community reports...</p>
          </div>
        ) : error ? (
          <div className="explore-state explore-state-error">
            <AlertCircle size={32} />
            <h3>Couldn't load reports</h3>
            <p>{error}</p>
            <button onClick={loadComplaints}>
              <RefreshCw size={16} />
              Try again
            </button>
          </div>
        ) : complaints.length === 0 ? (
          <div className="explore-state">
            <div className="explore-empty-icon">
              <Search size={26} />
            </div>
            <h3>No reports found</h3>
            <p>
              Try another search or change your filters to see more
              community reports.
            </p>
            <button onClick={resetFilters}>Clear filters</button>
          </div>
        ) : (
          <>
            <div className="explore-cards-grid">
              {complaints.map((complaint) => (
                <article
                  className="explore-complaint-card"
                  key={complaint._id}
                >
                  <div className="explore-card-top">
                    <span className="explore-category">
                      {complaint.category}
                    </span>
                    <span
                      className={`explore-status status-${getStatusClass(
                        complaint.status
                      )}`}
                    >
                      {complaint.status}
                    </span>
                  </div>

                  {complaint.evidence?.find(
                    (item) => item.mediaType === "image"
                  ) && (
                    <Link
                      to={`/explore/${complaint._id}`}
                      className="explore-card-image-link"
                      aria-label={`View ${complaint.title}`}
                    >
                      <img
                        className="explore-card-image"
                        src={
                          complaint.evidence.find(
                            (item) => item.mediaType === "image"
                          ).url
                        }
                        alt={`Evidence for ${complaint.title}`}
                        loading="lazy"
                      />
                    </Link>
                  )}

                  <h3>
                    <Link to={`/explore/${complaint._id}`}>
                      {complaint.title}
                    </Link>
                  </h3>

                  <p className="explore-card-description">
                    {complaint.description}
                  </p>

                  <div className="explore-card-location">
                    <MapPin size={15} />
                    <span>
                      {complaint.location?.address ||
                        "Location not provided"}
                    </span>
                  </div>

                  <div className="explore-card-footer">
                    <span>
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

                    <Link to={`/explore/${complaint._id}`}>
                      View details <ArrowRight size={15} />
                    </Link>
                  </div>
                </article>
              ))}
            </div>

            <nav className="explore-pagination" aria-label="Pagination">
              <button
                type="button"
                disabled={page <= 1}
                onClick={() => {
                  setPage((current) => Math.max(1, current - 1));
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
              >
                <ArrowLeft size={16} />
                Previous
              </button>

              <span>
                Page <strong>{page}</strong> of{" "}
                <strong>{pages}</strong>
              </span>

              <button
                type="button"
                disabled={page >= pages}
                onClick={() => {
                  setPage((current) => Math.min(pages, current + 1));
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
              >
                Next
                <ArrowRight size={16} />
              </button>
            </nav>
          </>
        )}
      </div>
    </div>
  );
}

export default ExploreIssues;
