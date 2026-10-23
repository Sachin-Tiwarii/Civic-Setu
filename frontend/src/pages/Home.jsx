
import { Link } from "react-router-dom";
import "./Home.css";

const features = [
  {
    number: "01",
    title: "Report an Issue",
    description:
      "Report potholes, garbage, water supply problems, and other civic issues in your neighbourhood.",
    icon: "📍",
    link: "/report-issue",
    action: "Submit a report",
  },
  {
    number: "02",
    title: "Explore Your City",
    description:
      "Discover reported issues, check their locations, and see what's happening around your community.",
    icon: "🗺️",
    link: "/explore",
    action: "Explore reports",
  },
  {
    number: "03",
    title: "Track Progress",
    description:
      "Follow the status of your submitted complaints and stay informed as they move toward resolution.",
    icon: "✓",
    link: "/dashboard",
    action: "View dashboard",
  },
];

function Home() {
  return (
    <div className="home-page">
      <section className="home-hero">
        <div className="home-hero-inner">
          <div className="home-hero-copy">
            <div className="home-pill">
              <span className="home-pill-dot" />
              BUILD A BETTER COMMUNITY
            </div>

            <h1>
              Your city.
              <br />
              <span>Your voice.</span>
              <br />
              Real change.
            </h1>

            <p className="home-hero-description">
              See a civic problem? Report it, share its location, and help
              your community move toward a cleaner, safer, better city.
            </p>

            <div className="home-hero-actions">
              <Link to="/report-issue" className="home-button home-button-primary">
                Report an issue <span aria-hidden="true">↗</span>
              </Link>

              <Link to="/explore" className="home-button home-button-secondary">
                Explore reports
              </Link>
            </div>

            <div className="home-trust-note">
              <span className="home-trust-check">✓</span>
              Every report starts with a voice in the community.
            </div>
          </div>

          <div className="home-hero-visual" aria-label="Civic issue reporting illustration">
            <div className="home-visual-glow" />

            <div className="home-map-card">
              <div className="home-map-top">
                <div>
                  <span className="home-map-label">COMMUNITY WATCH</span>
                  <h3>Your neighbourhood</h3>
                </div>
                <span className="home-map-live">
                  <span /> LIVE
                </span>
              </div>

              <div className="home-map-art">
                <div className="map-road map-road-one" />
                <div className="map-road map-road-two" />
                <div className="map-road map-road-three" />
                <div className="map-block map-block-one" />
                <div className="map-block map-block-two" />
                <div className="map-block map-block-three" />
                <div className="map-block map-block-four" />
                <div className="map-park">
                  <span>GREEN SPACE</span>
                </div>
                <div className="map-pin map-pin-one">!</div>
                <div className="map-pin map-pin-two">✓</div>
                <div className="map-pin map-pin-three">!</div>
                <div className="map-center">
                  <div className="map-center-dot" />
                </div>
              </div>

              <div className="home-map-legend">
                <span><i className="legend-orange" /> Reported issue</span>
                <span><i className="legend-green" /> Community progress</span>
              </div>
            </div>

            <div className="home-floating-card home-floating-top">
              <div className="home-floating-icon">📍</div>
              <div>
                <strong>Report locally</strong>
                <span>Pinpoint the problem</span>
              </div>
            </div>

            <div className="home-floating-card home-floating-bottom">
              <div className="home-floating-icon home-floating-success">✓</div>
              <div>
                <strong>Stay informed</strong>
                <span>Follow report status</span>
              </div>
            </div>
          </div>
        </div>

        <div className="home-hero-bottom">
          <span>LOCAL ISSUES</span>
          <span className="home-bottom-line" />
          <span>COMMUNITY ACTION</span>
          <span className="home-bottom-line" />
          <span>BETTER TOMORROWS</span>
        </div>
      </section>

      <section className="home-features">
        <div className="home-section-heading">
          <div>
            <p className="home-eyebrow">HOW CIVICSETU WORKS</p>
            <h2>Small actions. <span>Visible change.</span></h2>
          </div>
          <p>
            A simple way to bring local problems to light and help your
            community follow their progress.
          </p>
        </div>

        <div className="home-feature-grid">
          {features.map((feature) => (
            <article className="home-feature-card" key={feature.number}>
              <div className="home-feature-card-top">
                <span className="home-feature-number">{feature.number}</span>
                <span className="home-feature-icon">{feature.icon}</span>
              </div>

              <h3>{feature.title}</h3>
              <p>{feature.description}</p>

              <Link to={feature.link} className="home-feature-link">
                {feature.action} <span aria-hidden="true">↗</span>
              </Link>
            </article>
          ))}
        </div>
      </section>

      <section className="home-cta">
        <div>
          <p className="home-eyebrow">YOUR COMMUNITY NEEDS YOU</p>
          <h2>Notice a problem? <span>Make it visible.</span></h2>
          <p>
            Start with one report. Give your community a clearer picture of
            the issues that need attention.
          </p>
        </div>

        <Link to="/report-issue" className="home-button home-button-light">
          Report an issue <span aria-hidden="true">↗</span>
        </Link>
      </section>
    </div>
  );
}

export default Home;
