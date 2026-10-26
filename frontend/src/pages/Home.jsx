
import { Link } from "react-router-dom";
import "./Home.css";

const translations = {
  en: {
    tickerLabel: "Notice",
    notices: [
      "Report civic issues online without visiting an office.",
      "Include a clear landmark or location for faster action.",
      "Track every complaint from your citizen dashboard.",
    ],
    eyebrow: "CITIZEN COMPLAINT & RESOLUTION PORTAL",
    title: "Your city. Your voice. Better communities.",
    description:
      "Report civic problems such as damaged roads, water supply issues, garbage, drainage, and street lights. Submit the location and follow your complaint online.",
    report: "Report an issue",
    explore: "Explore public reports",
    quick: "Quick services",
    actions: [
      {
        icon: "file",
        title: "Lodge a complaint",
        text: "Describe the problem, mark its location and submit your complaint in minutes.",
        link: "/report-issue",
        cta: "Submit a complaint",
      },
      {
        icon: "map",
        title: "Explore public reports",
        text: "Discover issues already reported in your ward and nearby areas.",
        link: "/explore",
        cta: "Explore reports",
      },
      {
        icon: "track",
        title: "Track your complaint",
        text: "Check the current status of complaints you have submitted.",
        link: "/dashboard",
        cta: "Open dashboard",
      },
    ],
    actionHeading: "How can we help you?",
    actionDescription:
      "Choose a service and take the next step towards improving your neighbourhood.",
    serviceHeading: "What can you report?",
    serviceDescription:
      "Report public infrastructure and civic issues affecting your community.",
    services: [
      { icon: "road", title: "Roads & potholes", text: "Damaged roads, broken footpaths and missing signs." },
      { icon: "water", title: "Water supply", text: "Water leaks, low pressure and irregular supply." },
      { icon: "waste", title: "Garbage & sanitation", text: "Uncollected waste, illegal dumping and overflowing bins." },
      { icon: "bulb", title: "Street lights", text: "Broken lights, dark streets and poor lighting." },
      { icon: "drain", title: "Drainage & sewage", text: "Blocked drains, waterlogging and overflowing sewers." },
      { icon: "tree", title: "Parks & public spaces", text: "Damaged parks, playgrounds and neglected public areas." },
    ],
    howHeading: "How CivicSetu works",
    howDescription:
      "Four simple steps to report a problem and follow its progress.",
    getStarted: "Get started",
    steps: [
      { icon: "search", title: "Identify the issue", text: "Describe the problem and identify its location." },
      { icon: "file", title: "Submit your complaint", text: "Provide the details and location in the report form." },
      { icon: "bell", title: "Complaint is registered", text: "Find your submitted complaint in your dashboard." },
      { icon: "check", title: "Track the progress", text: "Check the status as your complaint progresses." },
    ],
    ctaHeading: "Let's make our neighbourhood better.",
    ctaDescription:
      "Your report helps bring local problems to attention and supports better communities.",
    ctaButton: "Report a problem",
  },
  hi: {
    tickerLabel: "सूचना",
    notices: [
      "कार्यालय जाए बिना नागरिक समस्याओं की ऑनलाइन शिकायत करें।",
      "जल्दी कार्रवाई के लिए सही स्थान और नज़दीकी पहचान बताएं।",
      "अपने नागरिक डैशबोर्ड पर शिकायत की स्थिति देखें।",
    ],
    eyebrow: "नागरिक शिकायत एवं निवारण पोर्टल",
    title: "आपका शहर। आपकी आवाज़। बेहतर समुदाय।",
    description:
      "सड़क, पानी, कचरा, नाली और स्ट्रीट लाइट जैसी नागरिक समस्याओं की शिकायत करें। सही स्थान दर्ज करें और अपनी शिकायत की स्थिति ऑनलाइन देखें।",
    report: "समस्या की शिकायत करें",
    explore: "सार्वजनिक शिकायतें देखें",
    quick: "त्वरित सेवाएँ",
    actions: [
      {
        icon: "file",
        title: "शिकायत दर्ज करें",
        text: "समस्या का विवरण दें, स्थान चुनें और कुछ ही मिनटों में शिकायत जमा करें।",
        link: "/report-issue",
        cta: "शिकायत जमा करें",
      },
      {
        icon: "map",
        title: "सार्वजनिक शिकायतें देखें",
        text: "अपने वार्ड और आसपास के क्षेत्रों में दर्ज समस्याएँ देखें।",
        link: "/explore",
        cta: "शिकायतें देखें",
      },
      {
        icon: "track",
        title: "शिकायत की स्थिति देखें",
        text: "अपनी दर्ज की गई शिकायतों की वर्तमान स्थिति जानें।",
        link: "/dashboard",
        cta: "डैशबोर्ड खोलें",
      },
    ],
    actionHeading: "हम आपकी कैसे मदद कर सकते हैं?",
    actionDescription:
      "अपनी सेवा चुनें और अपने क्षेत्र को बेहतर बनाने की शुरुआत करें।",
    serviceHeading: "आप किन समस्याओं की शिकायत कर सकते हैं?",
    serviceDescription:
      "अपने क्षेत्र की सार्वजनिक सुविधाओं और नागरिक समस्याओं की रिपोर्ट करें।",
    services: [
      { icon: "road", title: "सड़कें और गड्ढे", text: "टूटी सड़कें, क्षतिग्रस्त फुटपाथ और गायब संकेतक।" },
      { icon: "water", title: "जल आपूर्ति", text: "पानी का रिसाव, कम दबाव और अनियमित आपूर्ति।" },
      { icon: "waste", title: "कचरा और स्वच्छता", text: "कचरा जमा होना, खुले में कचरा फेंकना और भरे हुए डिब्बे।" },
      { icon: "bulb", title: "स्ट्रीट लाइट", text: "खराब लाइटें, अंधेरी सड़कें और अपर्याप्त रोशनी।" },
      { icon: "drain", title: "जल निकासी और सीवेज", text: "बंद नालियाँ, जलभराव और सीवेज की समस्या।" },
      { icon: "tree", title: "पार्क और सार्वजनिक स्थान", text: "क्षतिग्रस्त पार्क, खेल के मैदान और उपेक्षित सार्वजनिक क्षेत्र।" },
    ],
    howHeading: "CivicSetu कैसे काम करता है?",
    howDescription:
      "समस्या दर्ज करने और उसकी प्रगति देखने के चार आसान चरण।",
    getStarted: "शुरू करें",
    steps: [
      { icon: "search", title: "समस्या पहचानें", text: "समस्या का विवरण दें और उसका स्थान पहचानें।" },
      { icon: "file", title: "शिकायत जमा करें", text: "शिकायत फ़ॉर्म में आवश्यक विवरण और स्थान भरें।" },
      { icon: "bell", title: "शिकायत दर्ज होगी", text: "अपनी जमा की गई शिकायत डैशबोर्ड पर देखें।" },
      { icon: "check", title: "प्रगति देखें", text: "शिकायत की स्थिति में होने वाले बदलाव देखें।" },
    ],
    ctaHeading: "आइए, अपने क्षेत्र को बेहतर बनाएँ।",
    ctaDescription:
      "आपकी शिकायत स्थानीय समस्याओं को सामने लाने और बेहतर समुदाय बनाने में मदद करती है।",
    ctaButton: "समस्या दर्ज करें",
  },
};

function Icon({ name, size = 24, className = "" }) {
  const props = {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.7,
    strokeLinecap: "round",
    strokeLinejoin: "round",
    className,
    "aria-hidden": true,
  };

  const paths = {
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
    users: <><path d="M16 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="10" cy="7" r="4" /><path d="M20 21v-2a4 4 0 0 0-3-3.9M16 3.1a4 4 0 0 1 0 7.8" /></>,
    arrow: <path d="M5 12h14m-6-6 6 6-6 6" />,
  };

  return <svg {...props}>{paths[name] || paths.check}</svg>;
}

function Chakra() {
  const spokes = Array.from({ length: 24 }, (_, i) => i * 15);

  return (
    <svg className="gv-hero-chakra" viewBox="0 0 100 100" aria-hidden="true">
      <circle cx="50" cy="50" r="46" fill="none" stroke="currentColor" strokeWidth="3" />
      <circle cx="50" cy="50" r="7" fill="currentColor" />
      {spokes.map((angle) => (
        <g key={angle} transform={`rotate(${angle} 50 50)`}>
          <line x1="50" y1="9" x2="50" y2="43" stroke="currentColor" strokeWidth="1.8" />
          <circle cx="50" cy="8" r="2" fill="currentColor" />
        </g>
      ))}
    </svg>
  );
}

export default function Home({ lang = "en" }) {
  const t = translations[lang] || translations.en;

  return (
    <main className={`gv-page ${lang === "hi" ? "gv-hindi-page" : ""}`} id="main-content">
      <div className="gv-tricolour" aria-hidden="true">
        <i /><i /><i />
      </div>

      <div className="gv-ticker" role="status">
        <span className="gv-ticker-tag">
          <Icon name="bell" size={15} />
          {t.tickerLabel}
        </span>
        <div className="gv-ticker-track">
          <div className="gv-ticker-move">
            {[...t.notices, ...t.notices].map((notice, i) => (
              <span key={`${i}-${notice}`}>{notice}</span>
            ))}
          </div>
        </div>
      </div>

      <section className="gv-hero">
        <Chakra />
        <div className="gv-wrap gv-hero-grid">
          <div className="gv-hero-copy">
            <p className="gv-hindi">{t.eyebrow}</p>
            <h1>{t.title}</h1>
            <p className="gv-lead">{t.description}</p>

            <div className="gv-hero-actions">
              <Link to="/report-issue" className="gv-btn gv-btn-saffron">
                <Icon name="file" size={19} />
                {t.report}
              </Link>
              <Link to="/explore" className="gv-btn gv-btn-outline">
                <Icon name="map" size={19} />
                {t.explore}
              </Link>
            </div>
          </div>

          <aside className="gv-panel" aria-label={t.quick}>
            <h2>{t.quick}</h2>
            <ul>
              {t.actions.map((action) => (
                <li key={action.title}>
                  <Link to={action.link}>
                    <span className="gv-panel-icon">
                      <Icon name={action.icon} size={23} />
                    </span>
                    <span className="gv-panel-text">
                      <strong>{action.title}</strong>
                      <small>{action.cta}</small>
                    </span>
                    <Icon name="arrow" size={19} className="gv-panel-arrow" />
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
            <h2>{t.actionHeading}</h2>
            <p>{t.actionDescription}</p>
          </header>

          <div className="gv-actions">
            {t.actions.map((action) => (
              <article className="gv-action" key={action.title}>
                <span className="gv-action-icon">
                  <Icon name={action.icon} size={27} />
                </span>
                <h3>{action.title}</h3>
                <p>{action.text}</p>
                <Link to={action.link} className="gv-link">
                  {action.cta}
                  <Icon name="arrow" size={17} />
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="gv-section gv-section-tint">
        <div className="gv-wrap">
          <header className="gv-heading">
            <h2>{t.serviceHeading}</h2>
            <p>{t.serviceDescription}</p>
          </header>

          <ul className="gv-services">
            {t.services.map((service) => (
              <li key={service.title}>
                <span className="gv-service-icon">
                  <Icon name={service.icon} size={26} />
                </span>
                <div>
                  <h3>{service.title}</h3>
                  <p>{service.text}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="gv-section">
        <div className="gv-wrap gv-how">
          <header className="gv-heading gv-heading-left">
            <h2>{t.howHeading}</h2>
            <p>{t.howDescription}</p>
            <Link to="/report-issue" className="gv-btn gv-btn-navy">
              {t.getStarted}
              <Icon name="arrow" size={18} />
            </Link>
          </header>

          <ol className="gv-steps">
            {t.steps.map((step, i) => (
              <li key={step.title}>
                <span className="gv-step-badge">{i + 1}</span>
                <span className="gv-step-icon">
                  <Icon name={step.icon} size={22} />
                </span>
                <div>
                  <h3>{step.title}</h3>
                  <p>{step.text}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="gv-cta">
        <div className="gv-wrap gv-cta-inner">
          <span className="gv-cta-icon">
            <Icon name="users" size={34} />
          </span>
          <div className="gv-cta-copy">
            <h2>{t.ctaHeading}</h2>
            <p>{t.ctaDescription}</p>
          </div>
          <Link to="/report-issue" className="gv-btn gv-btn-saffron">
            <Icon name="file" size={19} />
            {t.ctaButton}
          </Link>
        </div>
        <div className="gv-tricolour" aria-hidden="true">
          <i /><i /><i />
        </div>
      </section>
    </main>
  );
}
