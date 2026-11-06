
import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  AlertCircle,
  Eye,
  EyeOff,
  FilePlus,
  LoaderCircle,
  Lock,
  LogIn,
  Mail,
  ShieldCheck,
  Clock,
} from "lucide-react";
import "./Login.css";

const API_URL = import.meta.env.DEV
  ? "http://localhost:5000"
  : "";

const text = {
  en: {
    panelKicker: "Citizen Login",
    panelTitle: "Your voice for a better neighbourhood",
    points: [
      { icon: FilePlus, text: "Lodge complaints about civic issues in your area" },
      { icon: Clock, text: "Follow the status of every complaint you submit" },
      { icon: ShieldCheck, text: "Your account and complaints are kept secure" },
    ],
    title: "Sign in to your account",
    subtitle: "Enter your registered email and password to continue.",
    email: "Email address",
    emailPh: "you@example.com",
    password: "Password",
    passwordPh: "Enter your password",
    show: "Show password",
    hide: "Hide password",
    submit: "Sign in",
    submitting: "Signing in...",
    noAccount: "Don't have an account?",
    create: "Register now",
    errDefault: "Unable to log in. Please try again.",
    errNetwork: "Could not connect to the server. Check that your backend is running.",
  },

  hi: {
    panelKicker: "नागरिक लॉगिन",
    panelTitle: "बेहतर पड़ोस के लिए आपकी आवाज़",
    points: [
      { icon: FilePlus, text: "अपने क्षेत्र की नागरिक समस्याओं की शिकायत दर्ज करें" },
      { icon: Clock, text: "अपनी हर शिकायत की स्थिति देखते रहें" },
      { icon: ShieldCheck, text: "आपका खाता और शिकायतें सुरक्षित रखी जाती हैं" },
    ],
    title: "अपने खाते में साइन इन करें",
    subtitle: "जारी रखने के लिए अपना पंजीकृत ईमेल और पासवर्ड दर्ज करें।",
    email: "ईमेल पता",
    emailPh: "you@example.com",
    password: "पासवर्ड",
    passwordPh: "अपना पासवर्ड दर्ज करें",
    show: "पासवर्ड दिखाएँ",
    hide: "पासवर्ड छिपाएँ",
    submit: "साइन इन करें",
    submitting: "साइन इन हो रहा है...",
    noAccount: "खाता नहीं है?",
    create: "अभी पंजीकरण करें",
    errDefault: "लॉगिन नहीं हो सका। कृपया पुनः प्रयास करें।",
    errNetwork: "सर्वर से संपर्क नहीं हो सका। जाँचें कि आपका बैकएंड चल रहा है।",
  },
};

function Login({ lang = "en" }) {
  const currentLang = lang === "hi" ? "hi" : "en";
  const t = text[currentLang];

  const navigate = useNavigate();
  const location = useLocation();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((previous) => ({ ...previous, [name]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(form),
      });

      const data = await response.json();

      if (!response.ok || data.success !== true) {
        throw new Error(data.message || t.errDefault);
      }

      const destination = location.state?.from?.pathname || "/dashboard";
      navigate(destination, { replace: true });

    } catch (err) {
      setError(
        err instanceof TypeError
          ? t.errNetwork
          : err.message || t.errDefault
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <section
      className={`gl-page ${currentLang === "hi" ? "gl-hindi-page" : ""}`}
      lang={currentLang}
    >
      <div className="gl-card">

        <aside className="gl-panel">
          <svg className="gl-panel-wheel" viewBox="0 0 100 100" aria-hidden="true">
            <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="4" />
            <circle cx="50" cy="50" r="8" fill="currentColor" />

            {Array.from({ length: 24 }, (_, i) => (
              <line
                key={i}
                x1="50"
                y1="12"
                x2="50"
                y2="42"
                stroke="currentColor"
                strokeWidth="2.5"
                transform={`rotate(${i * 15} 50 50)`}
              />
            ))}
          </svg>

          <Link to="/" className="gl-panel-brand">
            <ShieldCheck size={22} /> CivicSetu
          </Link>

          <div className="gl-panel-body">
            <p className="gl-panel-kicker">{t.panelKicker}</p>
            <h2>{t.panelTitle}</h2>

            <ul>
              {t.points.map(({ icon: Icon, text: label }) => (
                <li key={label}>
                  <span><Icon size={18} /></span>
                  {label}
                </li>
              ))}
            </ul>
          </div>

          <div className="gl-tricolour" aria-hidden="true">
            <i />
            <i />
            <i />
          </div>
        </aside>

        <div className="gl-form-side">
          <span className="gl-lock" aria-hidden="true">
            <LogIn size={24} />
          </span>

          <h1>{t.title}</h1>
          <p className="gl-subtitle">{t.subtitle}</p>

          {error && (
            <div className="gl-error" role="alert">
              <AlertCircle size={18} />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <label htmlFor="login-email">{t.email}</label>

            <div className="gl-field">
              <Mail size={18} />
              <input
                id="login-email"
                type="email"
                name="email"
                placeholder={t.emailPh}
                value={form.email}
                onChange={handleChange}
                autoComplete="email"
                required
              />
            </div>

            <label htmlFor="login-password">{t.password}</label>

            <div className="gl-field">
              <Lock size={18} />

              <input
                id="login-password"
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder={t.passwordPh}
                value={form.password}
                onChange={handleChange}
                autoComplete="current-password"
                required
              />

              <button
                type="button"
                className="gl-eye"
                aria-label={showPassword ? t.hide : t.show}
                aria-pressed={showPassword}
                onClick={() => setShowPassword((v) => !v)}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            <button type="submit" className="gl-submit" disabled={loading}>
              {loading ? (
                <>
                  <LoaderCircle size={18} className="gl-spin" />
                  {t.submitting}
                </>
              ) : (
                <>
                  {t.submit}
                  <LogIn size={18} />
                </>
              )}
            </button>
          </form>

          <p className="gl-register">
            {t.noAccount} <Link to="/register">{t.create}</Link>
          </p>
        </div>

      </div>
    </section>
  );
}

export default Login;
