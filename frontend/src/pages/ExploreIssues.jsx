
import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  FileSearch,
  Home,
  MapPin,
  CalendarDays,
  RefreshCw,
  Search,
  SlidersHorizontal,
  ChevronRight,
  Radio,
} from "lucide-react";
import "./ExploreIssues.css";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

/* Values are sent to the API, so they stay in English. Only labels are translated. */
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

const text = {
  en: {
    locale: "en-IN",
    home: "Home",
    crumb: "Public reports",
    kicker: "Citizen Complaint & Redressal Portal",
    title: "Public Reports",
    intro:
      "Browse civic complaints reported by citizens, check their current status and see what needs attention in your area.",
    matching: "Matching reports",
    cats: "Issue categories",
    filterTitle: "Search and filter",
    searchPlaceholder: "Search by title, description or location",
    searchLabel: "Search complaints",
    filters: "Filters",
    category: "Category",
    status: "Status",
    reset: "Reset filters",
    listTitle: "Complaints register",
    fetching: "Fetching the latest reports...",
    found: (n) => `${n} report${n === 1 ? "" : "s"} found`,
    live: "Live data",
    loading: "Loading reports",
    errTitle: "Could not load reports",
    errDefault: "Something went wrong.",
    errNetwork: "Unable to connect to the server.",
    retry: "Try again",
    emptyTitle: "No reports found",
    emptyText:
      "Try a different search or change the filters to see more reports.",
    clear: "Clear filters",
    viewDetails: "View details",
    noLocation: "Location not provided",
    noDate: "Date unavailable",
    evidence: (title) => `Evidence for ${title}`,
    view: (title) => `View ${title}`,
    prev: "Previous",
    next: "Next",
    pageOf: (p, n) => (
      <>
        Page <strong>{p}</strong> of <strong>{n}</strong>
      </>
    ),
    categoryNames: {},
    statusNames: {},
  },

  hi: {
    locale: "hi-IN",
    home: "मुख्य पृष्ठ",
    crumb: "सार्वजनिक रिपोर्ट",
    kicker: "नागरिक शिकायत एवं निवारण पोर्टल",
    title: "सार्वजनिक रिपोर्ट",
    intro:
      "नागरिकों द्वारा दर्ज की गई शिकायतें देखें, उनकी वर्तमान स्थिति जानें और अपने क्षेत्र की समस्याओं को समझें।",
    matching: "मिलती-जुलती रिपोर्ट",
    cats: "समस्या श्रेणियाँ",
    filterTitle: "खोजें और छाँटें",
    searchPlaceholder: "शीर्षक, विवरण या स्थान से खोजें",
    searchLabel: "शिकायतें खोजें",
    filters: "फ़िल्टर",
    category: "श्रेणी",
    status: "स्थिति",
    reset: "फ़िल्टर हटाएँ",
    listTitle: "शिकायत पंजिका",
    fetching: "नवीनतम रिपोर्ट लाई जा रही हैं...",
    found: (n) => `${n} रिपोर्ट मिलीं`,
    live: "लाइव डेटा",
    loading: "रिपोर्ट लोड हो रही हैं",
    errTitle: "रिपोर्ट लोड नहीं हो सकीं",
    errDefault: "कुछ गलत हो गया।",
    errNetwork: "सर्वर से संपर्क नहीं हो सका।",
    retry: "पुनः प्रयास करें",
    emptyTitle: "कोई रिपोर्ट नहीं मिली",
    emptyText:
      "अधिक रिपोर्ट देखने के लिए कोई अन्य खोज करें या फ़िल्टर बदलें।",
    clear: "फ़िल्टर हटाएँ",
    viewDetails: "विवरण देखें",
    noLocation: "स्थान उपलब्ध नहीं",
    noDate: "तारीख उपलब्ध नहीं",
    evidence: (title) => `${title} का साक्ष्य`,
    view: (title) => `${title} देखें`,
    prev: "पिछला",
    next: "अगला",
    pageOf: (p, n) => (
      <>
        पृष्ठ <strong>{p}</strong> / <strong>{n}</strong>
      </>
    ),
    categoryNames: {
      "All Categories": "सभी श्रेणियाँ",
      Garbage: "कचरा",
      "Road Damage": "सड़क क्षति",
      "Water Supply": "जल आपूर्ति",
      Drainage: "जल निकासी",
      Streetlight: "स्ट्रीट लाइट",
      "Public Sanitation": "सार्वजनिक स्वच्छता",
      Other: "अन्य",
    },
    statusNames: {
      "All Statuses": "सभी स्थितियाँ",
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

function ExploreIssues({ lang = "en" }) {
  const currentLang = lang === "hi" ? "hi" : "en";
  const t = text[currentLang];

  const catLabel = (value) => t.categoryNames[value] || value;
  const statLabel = (value) => t.statusNames[value] || value;

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
        throw new Error("Unable to load complaints.");
      }

      setComplaints(data.complaints || []);
      setTotal(data.total || 0);
      setPages(Math.max(1, data.pages || 1));

    } catch (err) {
      setError(
        err instanceof TypeError ? "errNetwork" : "errDefault"
      );
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

  const goToPage = (next) => {
    setPage(next);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div
      className={`ge-page ${currentLang === "hi" ? "ge-hindi-page" : ""}`}
      lang={currentLang}
    >
      <div className="ge-tricolour" aria-hidden="true">
        <i />
        <i />
        <i />
      </div>

      <header className="ge-header">
        <div className="ge-wrap">
          <nav className="ge-crumbs" aria-label="Breadcrumb">
            <Link to="/">
              <Home size={14} /> {t.home}
            </Link>

            <ChevronRight size={14} />
            <span aria-current="page">{t.crumb}</span>
          </nav>

          <p className="ge-kicker">{t.kicker}</p>
          <h1>{t.title}</h1>
          <p className="ge-intro">{t.intro}</p>

          <div className="ge-summary">
            <div>
              <strong>{loading ? "—" : total}</strong>
              <span>{t.matching}</span>
            </div>

            <div>
              <strong>{categories.length - 1}</strong>
              <span>{t.cats}</span>
            </div>
          </div>
        </div>
      </header>

      <div className="ge-wrap ge-body">
        <section className="ge-filters" aria-label={t.filterTitle}>
          <h2>
            <SlidersHorizontal size={17} /> {t.filterTitle}
          </h2>

          <div className="ge-search">
            <Search size={19} />

            <input
              type="search"
              value={search}
              maxLength={100}
              placeholder={t.searchPlaceholder}
              aria-label={t.searchLabel}
              onChange={(e) => updateFilter(setSearch, e.target.value)}
            />
          </div>

          <div className="ge-filter-row">
            <label className="ge-select">
              <span>{t.category}</span>

              <select
                value={category}
                onChange={(e) => updateFilter(setCategory, e.target.value)}
              >
                {categories.map((item) => (
                  <option key={item} value={item}>
                    {catLabel(item)}
                  </option>
                ))}
              </select>
            </label>

            <label className="ge-select">
              <span>{t.status}</span>

              <select
                value={status}
                onChange={(e) => updateFilter(setStatus, e.target.value)}
              >
                {statuses.map((item) => (
                  <option key={item} value={item}>
                    {statLabel(item)}
                  </option>
                ))}
              </select>
            </label>

            <button
              className="ge-reset"
              type="button"
              onClick={resetFilters}
            >
              <RefreshCw size={15} /> {t.reset}
            </button>
          </div>
        </section>

        <div className="ge-results-head">
          <div>
            <h2>{t.listTitle}</h2>
            <p aria-live="polite">
              {loading ? t.fetching : t.found(total)}
            </p>
          </div>

          <span className="ge-live">
            <Radio size={14} /> {t.live}
          </span>
        </div>

        {loading ? (
          <div
            className="ge-grid"
            role="status"
            aria-label={t.loading}
          >
            {[0, 1, 2, 3, 4, 5].map((n) => (
              <div
                className="ge-card ge-skeleton"
                key={n}
                aria-hidden="true"
              >
                <i className="ge-sk-line ge-sk-short" />
                <i className="ge-sk-img" />
                <i className="ge-sk-line" />
                <i className="ge-sk-line ge-sk-mid" />
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="ge-state ge-state-error" role="alert">
            <span className="ge-state-icon">
              <AlertCircle size={28} />
            </span>

            <h3>{t.errTitle}</h3>
            <p>{t[error]}</p>

            <button type="button" onClick={loadComplaints}>
              <RefreshCw size={16} /> {t.retry}
            </button>
          </div>
        ) : complaints.length === 0 ? (
          <div className="ge-state">
            <span className="ge-state-icon">
              <FileSearch size={28} />
            </span>

            <h3>{t.emptyTitle}</h3>
            <p>{t.emptyText}</p>

            <button type="button" onClick={resetFilters}>
              {t.clear}
            </button>
          </div>
        ) : (
          <>
            <div className="ge-grid">
              {complaints.map((complaint, index) => {
                const image = complaint.evidence?.find(
                  (item) => item.mediaType === "image"
                );

                return (
                  <article
                    className={`ge-card ge-s-${getStatusClass(
                      complaint.status
                    )}`}
                    key={complaint._id}
                    style={{ "--i": index }}
                  >
                    <div className="ge-card-top">
                      <span className="ge-category">
                        {catLabel(complaint.category)}
                      </span>

                      <span
                        className={`ge-status status-${getStatusClass(
                          complaint.status
                        )}`}
                      >
                        {statLabel(complaint.status)}
                      </span>
                    </div>

                    {image && (
                      <Link
                        to={`/explore/${complaint._id}`}
                        className="ge-image-link"
                        aria-label={t.view(complaint.title)}
                      >
                        <img
                          src={image.url}
                          alt={t.evidence(complaint.title)}
                          loading="lazy"
                        />
                      </Link>
                    )}

                    <h3>
                      <Link to={`/explore/${complaint._id}`}>
                        {complaint.title}
                      </Link>
                    </h3>

                    <p className="ge-desc">
                      {complaint.description}
                    </p>

                    <div className="ge-location">
                      <MapPin size={15} />
                      <span>
                        {complaint.location?.address || t.noLocation}
                      </span>
                    </div>

                    <div className="ge-card-footer">
                      <span>
                        <CalendarDays size={14} />

                        {complaint.createdAt
                          ? new Date(
                              complaint.createdAt
                            ).toLocaleDateString(t.locale, {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            })
                          : t.noDate}
                      </span>

                      <Link to={`/explore/${complaint._id}`}>
                        {t.viewDetails} <ArrowRight size={15} />
                      </Link>
                    </div>
                  </article>
                );
              })}
            </div>

            <nav className="ge-pagination" aria-label="Pagination">
              <button
                type="button"
                disabled={page <= 1}
                onClick={() => goToPage(Math.max(1, page - 1))}
              >
                <ArrowLeft size={16} /> {t.prev}
              </button>

              <span>{t.pageOf(page, pages)}</span>

              <button
                type="button"
                disabled={page >= pages}
                onClick={() => goToPage(Math.min(pages, page + 1))}
              >
                {t.next} <ArrowRight size={16} />
              </button>
            </nav>
          </>
        )}
      </div>
    </div>
  );
}

export default ExploreIssues;
