import { Link } from "react-router-dom";
import "./Home.css";

const services = [
  { icon: "road", title: "Roads & potholes", text: "Damaged roads, broken footpaths, missing signage." },
  { icon: "water", title: "Water supply", text: "Leakages, low pressure, contaminated or irregular supply." },
  { icon: "waste", title: "Garbage & sanitation", text: "Uncollected waste, dumping, overflowing community bins." },
  { icon: "bulb", title: "Street lights", text: "Lights that are not working or poorly placed." },
  { icon: "drain", title: "Drainage & sewage", text: "Blocked drains, waterlogging, open or overflowing sewers." },
  { icon: "tree", title: "Parks & public spaces", text: "Damaged playgrounds, encroachment, unkept green areas." },
];

const actions = [
  { icon: "file", title: "Lodge a complaint", text: "Describe the problem, mark its location and submit it in a few minutes.", link: "/report-issue", cta: "Report an issue" },
  { icon: "map", title: "View public reports", text: "See what has already been reported in your ward and nearby areas.", link: "/explore", cta: "Explore reports" },
  { icon: "track", title: "Track your complaint", text: "Check the current status of every complaint you have submitted.", link: "/dashboard", cta: "Open dashboard" },
];

const steps = [
  { icon: "search", title: "Identify the issue", text: "Note the problem and exactly where it is." },
  { icon: "file", title: "Submit the complaint", text: "Fill in the form with details and location." },
  { icon: "bell", title: "Complaint is registered", text: "Your report appears in your dashboard." },
  { icon: "check", title: "Follow the status", text: "Return any time to see its progress." },
];

const notices = [
  "Report civic issues online, without visiting an office.",
  "Include a clear landmark or location to help faster action.",
  "Track every complaint from your citizen dashboard.",
];

function Icon({ name, size = 24, className = "" }) {
  const p = {
    width: size, height: size, viewBox: "0 0 24 24", fill: "none",
    stroke: "currentColor", strokeWidth: 1.7, strokeLinecap: "round",
    strokeLinejoin: "round", className, "aria-hidden": true,
  };
  const d = {
    road: <><path d="M8 3 4 21M16 3l4 18M12 4v3M12 10v4M12 17v3" /></>,
    water: <path d="M12 3s6 6.2 6 10.5a6 6 0 0 1-12 0C6 9.2 12 3 12 3Z" />,
    waste: <><path d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3" /></>,
    bulb: <><path d="M9 18h6M10 21h4M12 3a6 6 0 0 0-3.5 10.9c.6.5 1 1.2 1 2.1h5c0-.9.4-1.6 1-2.1A6 6 0 0 0 12 3Z" /></>,
    drain: <><rect x="3" y="5" width="18" height="14" rx="2" /><path d="M8 5v14M12 5v14M16 5v14" /></>,
    tree: <><path d="M12 22v-6M12 2 6 10h3l-4 6h14l-4-6h3Z" /></>,
    file: <><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z" /><path d="M14 2v6h6M8 13h8M8 17h5" /></>,
    map: <><path d="m3 6 6-3 6 3 6-3v15l-6 3-6-3-6 3Z" /><path d="M9 3v15M15 6v15" /></>,
    track: <><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>,
    search: <><circle cx="11" cy="11" r="7" /><path d="m16 16 5 5" /></>,
    bell: <><path d="M6 8a6 6 0 0 1 12 0c0 7 3 8 3 8H3s3-1 3-8M10 21a2 2 0 0 0 4 0" /></>,
    check: <><circle cx="12" cy="12" r="9" /><path d="m8 12 3 3 5-6" /></>,
    shield: <><path d="M12 22s8-4 8-11V5l-8-3-8 3v6c0 7 8 11 8 11Z" /><path d="m9 12 2 2 4-4" /></>,
    phone: <path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2Z" />,
    arrow: <path d="M5 12h14m-6-6 6 6-6 6" />,
    pin: <><path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z" /><circle cx="12" cy="10" r="2.5" /></>,
    users: <><path d="M16 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="10" cy="7" r="4" /><path d="M20 21v-2a4 4 0 0 0-3-3.9M16 3.1a4 4 0 0 1 0 7.8" /></>,
  };
  return <svg {...p}>{d[name] || d.check}</svg>;
}

function Chakra({ className = "" }) {
  const spokes = Array.from({ length: 24 }, (_, i) => i * 15);
  return (
    <svg className={className} viewBox="0 0 100 100" aria-hidden="true">
      <circle cx="50" cy="50" r="46" fill="none" stroke="currentColor" strokeWidth="3" />
      <circle cx="50" cy="50" r="7" fill="currentColor" />
      {spokes.map((a) => (
        <g key={a} transform={`rotate(${a} 50 50)`}>
          <line x1="50" y1="9" x2="50" y2="43" stroke="currentColor" strokeWidth="1.8" />
          <circle cx="50" cy="8" r="2" fill="currentColor" />
        </g>
      ))}
    </svg>
  );
}

function Home() {
  return (
    <main className="gv-page" id="main-content">
      <div className="gv-tricolour" aria-hidden="true"><i /><i /><i /></div>

      <div className="gv-ticker" role="status">
        <span className="gv-ticker-tag"><Icon name="bell" size={14} /> Notice</span>
        <div className="gv-ticker-track">
          <div className="gv-ticker-move">
            {[...notices, ...notices].map((n, i) => (
              <span key={i}>{n}</span>
            ))}
          </div>
        </div>
      </div>

      <section className="gv-hero">
        <Chakra className="gv-hero-chakra" />
        <div className="gv-wrap gv-hero-grid">
          <div className="gv-hero-copy">
            <p className="gv-hindi">नागरिक शिकायत एवं निवारण पोर्टल</p>
            <h1>CivicSetu: report a problem in your area, follow it until it is resolved.</h1>
            <p className="gv-lead">
              A citizen service portal to register civic complaints such as bad roads, water
              supply, waste and street lights, with the exact location, and to check their
              status online.
            </p>
            <div className="gv-hero-actions">
              <Link to="/report-issue" className="gv-btn gv-btn-saffron">
                <Icon name="file" size={18} /> Lodge a complaint
              </Link>
              <Link to="/explore" className="gv-btn gv-btn-outline">
                <Icon name="map" size={18} /> View public reports
              </Link>
            </div>
            <p className="gv-assure">
              <Icon name="shield" size={18} /> Free to use. Open to every citizen.
            </p>
          </div>

          <aside className="gv-panel" aria-label="Quick services">
            <h2>Quick services</h2>
            <ul>
              {actions.map((a) => (
                <li key={a.title}>
                  <Link to={a.link}>
                    <span className="gv-panel-icon"><Icon name={a.icon} size={22} /></span>
                    <span className="gv-panel-text">
                      <strong>{a.title}</strong>
                      <small>{a.cta}</small>
                    </span>
                    <Icon name="arrow" size={18} className="gv-panel-arrow" />
                  </Link>
                </li>
              ))}
            </ul>
          </aside>
        </div>
      </section>

      <section className="gv-section">
        <div className="gv-wrap">
          <header className="gv-heading">
            <h2>What would you like to do?</h2>
            <p>Choose a service to get started. No office visit is needed.</p>
          </header>
          <div className="gv-actions">
            {actions.map((a) => (
              <article className="gv-action" key={a.title}>
                <span className="gv-action-icon"><Icon name={a.icon} size={28} /></span>
                <h3>{a.title}</h3>
                <p>{a.text}</p>
                <Link to={a.link} className="gv-link">
                  {a.cta} <Icon name="arrow" size={16} />
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="gv-section gv-section-tint">
        <div className="gv-wrap">
          <header className="gv-heading">
            <h2>Issues you can report</h2>
            <p>If it affects public life in your neighbourhood, it belongs here.</p>
          </header>
          <ul className="gv-services">
            {services.map((s) => (
              <li key={s.title}>
                <span className="gv-service-icon"><Icon name={s.icon} size={26} /></span>
                <div>
                  <h3>{s.title}</h3>
                  <p>{s.text}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="gv-section">
        <div className="gv-wrap gv-how">
          <header className="gv-heading gv-heading-left">
            <h2>How it works</h2>
            <p>Four simple steps from noticing a problem to following its progress.</p>
            <Link to="/report-issue" className="gv-btn gv-btn-navy">
              Get started <Icon name="arrow" size={18} />
            </Link>
          </header>
          <ol className="gv-steps">
            {steps.map((s, i) => (
              <li key={s.title}>
                <span className="gv-step-badge">{i + 1}</span>
                <span className="gv-step-icon"><Icon name={s.icon} size={22} /></span>
                <div>
                  <h3>{s.title}</h3>
                  <p>{s.text}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="gv-cta">
        <div className="gv-wrap gv-cta-inner">
          <span className="gv-cta-icon"><Icon name="users" size={34} /></span>
          <div>
            <h2>A cleaner, safer neighbourhood starts with your complaint.</h2>
            <p>Every report helps make local problems visible and easier to act on.</p>
          </div>
          <Link to="/report-issue" className="gv-btn gv-btn-saffron">
            <Icon name="pin" size={18} /> Report an issue
          </Link>
        </div>
        <div className="gv-tricolour" aria-hidden="true"><i /><i /><i /></div>
      </section>
    </main>
  );
}

export default Home;