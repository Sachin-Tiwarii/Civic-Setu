
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import "./ComplaintDetails.css";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const statusSteps = [
  "Submitted",
  "Under Verification",
  "Verified",
  "Assigned",
  "In Progress",
  "Resolved",
];

function formatDate(date) {
  if (!date) return "Not available";

  return new Date(date).toLocaleString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function ComplaintDetails() {
  const { id } = useParams();
  const [complaint, setComplaint] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    async function fetchComplaint() {
      setLoading(true);
      setError("");

      try {
        const response = await fetch(
          `${API_URL}/api/complaints/explore/${id}`,
          { signal: controller.signal }
        );

        const data = await response.json();

        if (!response.ok || data.success !== true) {
          throw new Error(data.message || "Could not load this complaint.");
        }

        setComplaint(data.complaint);
      } catch (err) {
        if (err.name !== "AbortError") {
          setError(err.message || "Unable to connect to CivicSetu.");
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    fetchComplaint();

    return () => controller.abort();
  }, [id]);

  if (loading) {
    return (
      <div className="complaint-details-state">
        <div className="complaint-details-spinner" />
        <p>Loading complaint details...</p>
      </div>
    );
  }

  if (error || !complaint) {
    return (
      <div className="complaint-details-state">
        <h2>Complaint unavailable</h2>
        <p>{error || "This complaint could not be found."}</p>
        <Link to="/explore">← Back to Explore Issues</Link>
      </div>
    );
  }

  const currentStatusIndex = statusSteps.indexOf(complaint.status);
  const coordinates = complaint.location?.coordinates;
  const longitude = Array.isArray(coordinates) ? coordinates[0] : null;
  const latitude = Array.isArray(coordinates) ? coordinates[1] : null;
  const mapsUrl =
    latitude != null && longitude != null
      ? `https://www.openstreetmap.org/?mlat=${latitude}&mlon=${longitude}#map=17/${latitude}/${longitude}`
      : null;

  return (
    <div className="complaint-details-page">
      <div className="complaint-details-container">
        <Link to="/explore" className="complaint-back-link">
          ← All community reports
        </Link>

        <div className="complaint-details-layout">
          <main className="complaint-main">
            <div className="complaint-heading-meta">
              <span className="complaint-category-badge">
                {complaint.category}
              </span>
              <span
                className={`complaint-status-badge status-${String(
                  complaint.status || ""
                ).toLowerCase().replace(/[^a-z]+/g, "-")}`}
              >
                {complaint.status}
              </span>
            </div>

            <h1>{complaint.title}</h1>

            <p className="complaint-reported-date">
              Reported on {formatDate(complaint.createdAt)}
            </p>

            <section className="complaint-details-section">
              <h2>About this issue</h2>
              <p className="complaint-full-description">
                {complaint.description}
              </p>
            </section>

            <section className="complaint-details-section">
              <h2>Reported location</h2>
              <div className="complaint-location-box">
                <span className="complaint-location-icon">⌖</span>
                <div>
                  <strong>{complaint.location?.address || "Address not provided"}</strong>
                  {latitude != null && longitude != null && (
                    <p>
                      {latitude.toFixed(5)}, {longitude.toFixed(5)}
                    </p>
                  )}
                </div>
              </div>

              {mapsUrl && (
                <a
                  href={mapsUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="complaint-map-link"
                >
                  View location on OpenStreetMap ↗
                </a>
              )}
            </section>

            {Array.isArray(complaint.evidence) &&
              complaint.evidence.length > 0 && (
                <section className="complaint-details-section">
                  <h2>Attached evidence</h2>
                  <div className="complaint-evidence-grid">
                    {complaint.evidence.map((item, index) => (
                      <a
                        className="complaint-evidence-item"
                        href={item.url}
                        target="_blank"
                        rel="noreferrer"
                        key={item.publicId || item.url || index}
                      >
                        {item.mediaType === "video" ? (
                          <video src={item.url} controls preload="metadata" />
                        ) : (
                          <img
                            src={item.url}
                            alt={`Evidence for ${complaint.title}`}
                            loading="lazy"
                          />
                        )}
                        <span>Open evidence ↗</span>
                      </a>
                    ))}
                  </div>
                </section>
              )}

            <section className="complaint-details-section">
              <h2>Resolution progress</h2>
              {complaint.status === "Rejected" ? (
                <div className="complaint-rejection-note">
                  <strong>This report was rejected.</strong>
                  {complaint.rejectionReason && (
                    <p>{complaint.rejectionReason}</p>
                  )}
                </div>
              ) : (
                <div className="complaint-timeline">
                  {statusSteps.map((step, index) => {
                    const isComplete =
                      currentStatusIndex >= 0 && index <= currentStatusIndex;
                    const isCurrent = step === complaint.status;

                    return (
                      <div
                        className={`complaint-timeline-step ${
                          isComplete ? "is-complete" : ""
                        } ${isCurrent ? "is-current" : ""}`}
                        key={step}
                      >
                        <div className="complaint-timeline-marker">
                          {isComplete ? "✓" : index + 1}
                        </div>
                        <div>
                          <strong>{step}</strong>
                          {isCurrent && <span>Current status</span>}
                        </div>
                      </div>
                    );
                  })}
                  {complaint.status === "Reopened" && (
                    <div className="complaint-reopened-note">
                      This complaint has been reopened for further attention.
                    </div>
                  )}
                </div>
              )}
            </section>
          </main>

          <aside className="complaint-sidebar">
            <div className="complaint-sidebar-card">
              <p className="complaint-sidebar-eyebrow">CURRENT STATUS</p>
              <h3>{complaint.status}</h3>
              <p>
                Follow this page to see the latest publicly available
                information about the report.
              </p>
              <div className="complaint-sidebar-divider" />
              <p className="complaint-sidebar-eyebrow">REPORT CATEGORY</p>
              <strong>{complaint.category}</strong>
              <div className="complaint-sidebar-divider" />
              <p className="complaint-sidebar-eyebrow">LAST UPDATED</p>
              <strong>{formatDate(complaint.updatedAt)}</strong>
            </div>

            <div className="complaint-sidebar-help">
              <span>Have you noticed another issue?</span>
              <Link to="/report-issue">Submit a new report ↗</Link>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

export default ComplaintDetails;
