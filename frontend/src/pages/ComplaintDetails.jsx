
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import "./ComplaintDetails.css";

const API_URL = import.meta.env.DEV
  ? "http://localhost:5000"
  : "";

const statusSteps = [
  "Submitted",
  "Under Verification",
  "Verified",
  "Assigned",
  "In Progress",
  "Resolved",
];

const text = {
  en: {
    loading: "Loading complaint details...",
    unavailable: "Complaint unavailable",
    notFound: "This complaint could not be found.",
    loadError: "Could not load this complaint.",
    networkError: "Unable to connect to CivicSetu.",
    backExplore: "← Back to Explore Issues",
    allReports: "← All community reports",
    reportedOn: "Reported on",
    aboutIssue: "About this issue",
    reportedLocation: "Reported location",
    addressMissing: "Address not provided",
    viewMap: "View location on OpenStreetMap ↗",
    attachedEvidence: "Attached evidence",
    openEvidence: "Open evidence ↗",
    resolutionProgress: "Resolution progress",
    rejected: "This report was rejected.",
    currentStatus: "Current status",
    status: "CURRENT STATUS",
    followPage:
      "Follow this page to see the latest publicly available information about the report.",
    reportCategory: "REPORT CATEGORY",
    lastUpdated: "LAST UPDATED",
    anotherIssue: "Have you noticed another issue?",
    submitReport: "Submit a new report ↗",
    current: "Current status",
    reopened:
      "This complaint has been reopened for further attention.",
    notAvailable: "Not available",
    statuses: {
      Submitted: "Submitted",
      "Under Verification": "Under Verification",
      Verified: "Verified",
      Assigned: "Assigned",
      "In Progress": "In Progress",
      Resolved: "Resolved",
      Rejected: "Rejected",
      Reopened: "Reopened",
    },
  },

  hi: {
    loading: "शिकायत का विवरण लोड हो रहा है...",
    unavailable: "शिकायत उपलब्ध नहीं है",
    notFound: "यह शिकायत नहीं मिल सकी।",
    loadError: "इस शिकायत को लोड नहीं किया जा सका।",
    networkError: "CivicSetu से कनेक्ट नहीं हो सका।",
    backExplore: "← शिकायतें देखें",
    allReports: "← सभी सामुदायिक रिपोर्ट",
    reportedOn: "रिपोर्ट की तारीख",
    aboutIssue: "इस समस्या के बारे में",
    reportedLocation: "रिपोर्ट किया गया स्थान",
    addressMissing: "पता उपलब्ध नहीं है",
    viewMap: "OpenStreetMap पर स्थान देखें ↗",
    attachedEvidence: "संलग्न साक्ष्य",
    openEvidence: "साक्ष्य खोलें ↗",
    resolutionProgress: "समाधान की प्रगति",
    rejected: "यह रिपोर्ट अस्वीकार कर दी गई है।",
    currentStatus: "वर्तमान स्थिति",
    status: "वर्तमान स्थिति",
    followPage:
      "रिपोर्ट की नवीनतम सार्वजनिक जानकारी देखने के लिए इस पेज पर जाएँ।",
    reportCategory: "रिपोर्ट की श्रेणी",
    lastUpdated: "अंतिम अपडेट",
    anotherIssue: "क्या आपने कोई अन्य समस्या देखी है?",
    submitReport: "नई रिपोर्ट दर्ज करें ↗",
    current: "वर्तमान स्थिति",
    reopened:
      "इस शिकायत को आगे की कार्रवाई के लिए दोबारा खोला गया है।",
    notAvailable: "उपलब्ध नहीं है",
    statuses: {
      Submitted: "जमा की गई",
      "Under Verification": "सत्यापन के अंतर्गत",
      Verified: "सत्यापित",
      Assigned: "सौंपा गया",
      "In Progress": "कार्य प्रगति पर",
      Resolved: "समाधान हो गया",
      Rejected: "अस्वीकृत",
      Reopened: "दोबारा खोली गई",
    },
  },
};

function formatDate(date, locale, notAvailable) {
  if (!date) return notAvailable;

  return new Date(date).toLocaleString(locale, {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function ComplaintDetails({ lang = "en" }) {
  const currentLang = lang === "hi" ? "hi" : "en";
  const t = text[currentLang];
  const locale = currentLang === "hi" ? "hi-IN" : "en-IN";

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
          throw new Error(data.message || "LOAD_ERROR");
        }

        setComplaint(data.complaint);
      } catch (err) {
        if (err.name !== "AbortError") {
          setError(
            err.message === "LOAD_ERROR"
              ? "LOAD_ERROR"
              : err instanceof TypeError
                ? "NETWORK_ERROR"
                : err.message || "LOAD_ERROR"
          );
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
      <div className={`complaint-details-state ${currentLang === "hi" ? "complaint-details-hindi-page" : ""}`}>
        <div className="complaint-details-spinner" />
        <p>{t.loading}</p>
      </div>
    );
  }

  if (error || !complaint) {
    const errorMessage =
      error === "NETWORK_ERROR"
        ? t.networkError
        : error === "LOAD_ERROR"
          ? t.loadError
          : error || t.notFound;

    return (
      <div className={`complaint-details-state ${currentLang === "hi" ? "complaint-details-hindi-page" : ""}`}>
        <h2>{t.unavailable}</h2>
        <p>{errorMessage}</p>
        <Link to="/explore">{t.backExplore}</Link>
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

  const displayStatus =
    t.statuses[complaint.status] || complaint.status;

  return (
    <div className={`complaint-details-page ${currentLang === "hi" ? "complaint-details-hindi-page" : ""}`}>
      <div className="complaint-details-container">
        <Link to="/explore" className="complaint-back-link">
          {t.allReports}
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
                {displayStatus}
              </span>
            </div>

            <h1>{complaint.title}</h1>

            <p className="complaint-reported-date">
              {t.reportedOn}{" "}
              {formatDate(
                complaint.createdAt,
                locale,
                t.notAvailable
              )}
            </p>

            <section className="complaint-details-section">
              <h2>{t.aboutIssue}</h2>
              <p className="complaint-full-description">
                {complaint.description}
              </p>
            </section>

            <section className="complaint-details-section">
              <h2>{t.reportedLocation}</h2>

              <div className="complaint-location-box">
                <span className="complaint-location-icon">⌖</span>
                <div>
                  <strong>
                    {complaint.location?.address || t.addressMissing}
                  </strong>

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
                  {t.viewMap}
                </a>
              )}
            </section>

            {Array.isArray(complaint.evidence) &&
              complaint.evidence.length > 0 && (
                <section className="complaint-details-section">
                  <h2>{t.attachedEvidence}</h2>

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
                          <video
                            src={item.url}
                            controls
                            preload="metadata"
                          />
                        ) : (
                          <img
                            src={item.url}
                            alt={`Evidence for ${complaint.title}`}
                            loading="lazy"
                          />
                        )}

                        <span>{t.openEvidence}</span>
                      </a>
                    ))}
                  </div>
                </section>
              )}

            <section className="complaint-details-section">
              <h2>{t.resolutionProgress}</h2>

              {complaint.status === "Rejected" ? (
                <div className="complaint-rejection-note">
                  <strong>{t.rejected}</strong>

                  {complaint.rejectionReason && (
                    <p>{complaint.rejectionReason}</p>
                  )}
                </div>
              ) : (
                <div className="complaint-timeline">
                  {statusSteps.map((step, index) => {
                    const isComplete =
                      currentStatusIndex >= 0 &&
                      index <= currentStatusIndex;

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
                          <strong>{t.statuses[step] || step}</strong>

                          {isCurrent && (
                            <span>{t.current}</span>
                          )}
                        </div>
                      </div>
                    );
                  })}

                  {complaint.status === "Reopened" && (
                    <div className="complaint-reopened-note">
                      {t.reopened}
                    </div>
                  )}
                </div>
              )}
            </section>
          </main>

          <aside className="complaint-sidebar">
            <div className="complaint-sidebar-card">
              <p className="complaint-sidebar-eyebrow">
                {t.status}
              </p>

              <h3>{displayStatus}</h3>

              <p>{t.followPage}</p>

              <div className="complaint-sidebar-divider" />

              <p className="complaint-sidebar-eyebrow">
                {t.reportCategory}
              </p>

              <strong>{complaint.category}</strong>

              <div className="complaint-sidebar-divider" />

              <p className="complaint-sidebar-eyebrow">
                {t.lastUpdated}
              </p>

              <strong>
                {formatDate(
                  complaint.updatedAt,
                  locale,
                  t.notAvailable
                )}
              </strong>
            </div>

            <div className="complaint-sidebar-help">
              <span>{t.anotherIssue}</span>
              <Link to="/report-issue">{t.submitReport}</Link>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

export default ComplaintDetails;
  