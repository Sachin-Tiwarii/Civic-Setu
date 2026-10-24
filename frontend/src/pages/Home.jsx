
import { Link } from "react-router-dom";
import "./Home.css";

const features = [
  {
    number: "01",
    icon: "pin",
    title: "Report a civic issue",
    description:
      "Bring attention to potholes, waste, water supply problems, and other issues affecting your neighbourhood.",
    link: "/report-issue",
    action: "Submit a report",
  },
  {
    number: "02",
    icon: "map",
    title: "Explore your community",
    description:
      "Discover reported civic issues and learn more about the problems affecting your surroundings.",
    link: "/explore",
    action: "Explore reports",
  },
  {
    number: "03",
    icon: "check",
    title: "Follow the progress",
    description:
      "Keep track of your submissions and check their latest status through your citizen dashboard.",
    link: "/dashboard",
    action: "View dashboard",
  },
];

const steps = [
  {
    number: "01",
    title: "Identify the issue",
    description: "Notice a problem in your neighbourhood that needs attention.",
    icon: "search",
  },
  {
    number: "02",
    title: "Submit a report",
    description: "Share the details and location using the reporting form.",
    icon: "file",
  },
  {
    number: "03",
    title: "Track its status",
    description: "Visit your dashboard to follow your submitted report.",
    icon: "check",
  },
];

function Icon({ name, size = 22, className = "" }) {
  const common = {
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
    pin: (
      <>
        <path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z" />
        <circle cx="12" cy="10" r="2.5" />
      </>
    ),
    map: (
      <>
        <path d="m3 6 6-3 6 3 6-3v15l-6 3-6-3-6 3Z" />
        <path d="M9 3v15M15 6v15" />
      </>
    ),
    check: (
      <>
        <path d="m5 12 4 4L19 6" />
        <circle cx="12" cy="12" r="9" />
      </>
    ),
    search: (
      <>
        <circle cx="10.8" cy="10.8" r="6.8" />
        <path d="m16 16 4.5 4.5" />
      </>
    ),
    file: (
      <>
        <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9Z" />
        <path d="M13 2v7h7M8 13h8M8 17h8" />
      </>
    ),
    arrow: <path d="M7 17 17 7M7 7h10v10" />,
    arrowRight: <path d="M5 12h14m-6-6 6 6-6 6" />,
    shield: (
      <>
        <path d="M12 22s8-4 8-11V5l-8-3-8 3v6c0 7 8 11 8 11Z" />
        <path d="m9 12 2 2 4-4" />
      </>
    ),
    users: (
      <>
        <path d="M16 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
        <circle cx="10" cy="7" r="4" />
        <path d="M20 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
      </>
    ),
    location: (
      <>
        <path d="M12 21s7-5.5 7-12a7 7 0 1 0-14 0c0 6.5 7 12 7 12Z" />
        <circle cx="12" cy="9" r="2.3" />
      </>
    ),
  };

  return <svg {...common}>{paths[name] || paths.check}</svg>;
}

function Home() {
  return (
    <main className="home-page">
      <section className="home-hero">
        <div className="home-container home-hero-inner">
          <div className="home-hero-copy">
            <div className="home-eyebrow-pill">
              <span className="home-pill-mark">
                <Icon name="shield" size={15} />
              </span>
              A CITIZEN-FIRST CIVIC PLATFORM
            </div>

            <h1>
              Better cities
              <br />
              begin with <span>you.</span>
            </h1>

            <p className="home-hero-description">
              Every neighbourhood deserves attention. Report local problems,
              share their location, and help make your community a better
              place to live.
            </p>

            <div className="home-hero-actions">
              <Link
                to="/report-issue"
                className="home-button home-button-primary"
              >
                Report an issue
                <Icon name="arrow" size={17} />
              </Link>

              <Link
                to="/explore"
                className="home-button home-button-secondary"
              >
                Explore reports
                <Icon name="arrowRight" size={17} />
              </Link>
            </div>

            <div className="home-trust-note">
              <span className="home-trust-icon">
                <Icon name="check" size={15} />
              </span>
              <span>Local voices. Shared responsibility. Better communities.</span>
            </div>
          </div>

          <div className="home-hero-visual">
            <div className="home-visual-orbit home-visual-orbit-one" />
            <div className="home-visual-orbit home-visual-orbit-two" />

            <div className="home-map-card">
              <div className="home-map-header">
                <div className="home-map-heading-icon">
                  <Icon name="map" size={19} />
                </div>

                <div className="home-map-heading-copy">
                  <span className="home-overline">YOUR LOCAL AREA</span>
                  <h2>Community overview</h2>
                </div>

                <span className="home-map-label">ILLUSTRATION</span>
              </div>

              <div
                className="home-map-art"
                role="img"
                aria-label="Illustration of neighbourhood streets, green spaces, and civic issue locations"
              >
                <div className="home-map-grid" />
                <div className="home-map-park home-map-park-one" />
                <div className="home-map-park home-map-park-two" />

                <div className="home-map-road home-road-one" />
                <div className="home-map-road home-road-two" />
                <div className="home-map-road home-road-three" />
                <div className="home-map-road home-road-four" />
                <div className="home-map-road home-road-five" />

                <div className="home-map-building home-building-one" />
                <div className="home-map-building home-building-two" />
                <div className="home-map-building home-building-three" />
                <div className="home-map-building home-building-four" />
                <div className="home-map-building home-building-five" />
                <div className="home-map-building home-building-six" />

                <div className="home-map-location home-location-one">
                  <Icon name="pin" size={15} />
                </div>
                <div className="home-map-location home-location-two">
                  <Icon name="pin" size={15} />
                </div>
                <div className="home-map-location home-location-three">
                  <Icon name="pin" size={15} />
                </div>

                <div className="home-map-center">
                  <span />
                </div>

                <div className="home-map-caption">
                  <span className="home-map-caption-dot" />
                  Location-based reporting
                </div>
              </div>

              <div className="home-map-footer">
                <span>
                  <i className="home-legend-dot home-legend-issue" />
                  Issue location
                </span>
                <span>
                  <i className="home-legend-dot home-legend-community" />
                  Community area
                </span>
              </div>
            </div>

            <div className="home-float-card home-float-report">
              <span className="home-float-icon home-float-icon-orange">
                <Icon name="pin" size={20} />
              </span>
              <span className="home-float-copy">
                <strong>Report locally</strong>
                <small>Make the issue visible</small>
              </span>
            </div>

            <div className="home-float-card home-float-progress">
              <span className="home-float-icon home-float-icon-teal">
                <Icon name="check" size={20} />
              </span>
              <span className="home-float-copy">
                <strong>Stay informed</strong>
                <small>Follow your submissions</small>
              </span>
            </div>
          </div>
        </div>

        <div className="home-container home-hero-footer">
          <span>NOTICE A PROBLEM?</span>
          <span className="home-footer-rule" />
          <span>REPORT IT</span>
          <span className="home-footer-rule" />
          <span>FOLLOW THE PROGRESS</span>
          <span className="home-footer-spacer" />
          <span className="home-footer-caption">CIVICSETU · YOUR COMMUNITY, YOUR VOICE</span>
        </div>
      </section>

      <section className="home-features">
        <div className="home-container">
          <div className="home-section-heading">
            <div>
              <span className="home-section-kicker">WHAT YOU CAN DO</span>
              <h2>
                From noticing to <span>making a difference.</span>
              </h2>
            </div>

            <p>
              Civic participation should be simple. Start with a local issue
              and take the next step toward a more informed community.
            </p>
          </div>

          <div className="home-feature-grid">
            {features.map((feature) => (
              <article className="home-feature-card" key={feature.number}>
                <div className="home-feature-top">
                  <span className="home-feature-number">{feature.number}</span>
                  <span className="home-feature-icon">
                    <Icon name={feature.icon} size={23} />
                  </span>
                </div>

                <h3>{feature.title}</h3>
                <p>{feature.description}</p>

                <Link to={feature.link} className="home-feature-link">
                  {feature.action}
                  <Icon name="arrow" size={16} />
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="home-how">
        <div className="home-container home-how-inner">
          <div className="home-how-intro">
            <span className="home-section-kicker">HOW IT WORKS</span>
            <h2>
              Three steps.
              <br />
              <span>One stronger community.</span>
            </h2>
            <p>
              Help bring local issues into focus. CivicSetu gives citizens a
              place to submit reports and follow their progress.
            </p>
            <Link to="/report-issue" className="home-text-link">
              Get started
              <Icon name="arrowRight" size={17} />
            </Link>
          </div>

          <div className="home-steps">
            {steps.map((step) => (
              <article className="home-step" key={step.number}>
                <div className="home-step-marker">
                  <span className="home-step-number">{step.number}</span>
                  <span className="home-step-icon">
                    <Icon name={step.icon} size={21} />
                  </span>
                </div>
                <div className="home-step-content">
                  <h3>{step.title}</h3>
                  <p>{step.description}</p>
                </div>
                <Icon
                  name="arrow"
                  size={17}
                  className="home-step-arrow"
                />
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="home-cta-section">
        <div className="home-container">
          <div className="home-cta">
            <div className="home-cta-emblem">
              <Icon name="users" size={30} />
            </div>

            <div className="home-cta-copy">
              <span className="home-cta-kicker">YOUR COMMUNITY MATTERS</span>
              <h2>
                See a problem?
                <br />
                <span>Be part of the solution.</span>
              </h2>
              <p>
                Start with one report. Help make local issues easier to see,
                understand, and follow.
              </p>
            </div>

            <div className="home-cta-actions">
              <Link
                to="/report-issue"
                className="home-button home-button-cta"
              >
                Report an issue
                <Icon name="arrow" size={17} />
              </Link>
              <span className="home-cta-note">
                A better neighbourhood starts with participation.
              </span>
            </div>

            <div className="home-cta-decoration" aria-hidden="true">
              <div />
              <div />
              <div />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

export default Home;
