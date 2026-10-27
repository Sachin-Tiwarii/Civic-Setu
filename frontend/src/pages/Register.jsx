import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  AlertCircle,
  Check,
  Eye,
  EyeOff,
  LoaderCircle,
  Lock,
  Mail,
  MapPin,
  ShieldCheck,
  User,
  UserPlus,
  FilePlus,
} from "lucide-react";
import "./Register.css";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const text = {
  en: {
    panelKicker: "New citizen registration",
    panelTitle: "Join your community and make local issues visible",
    points: [
      { icon: FilePlus, text: "Register once and lodge complaints any time" },
      { icon: MapPin, text: "Mark the exact location of every problem" },
      { icon: ShieldCheck, text: "Your details are used only for your complaints" },
    ],
    title: "Create your account",
    subtitle: "Fill in the details below to register as a citizen.",
    name: "Full name",
    namePh: "Enter your full name",
    email: "Email address",
    emailPh: "you@example.com",
    password: "Password",
    passwordPh: "At least 8 characters",
    confirm: "Confirm password",
    confirmPh: "Enter your password again",
    show: "Show password",
    hide: "Hide password",
    ruleLength: "At least 8 characters",
    ruleMatch: "Both passwords match",
    submit: "Create account",
    submitting: "Creating account...",
    haveAccount: "Already have an account?",
    signIn: "Sign in",
    successMessage: "Account created successfully. Please sign in.",
    errLength: "Your password must contain at least 8 characters.",
    errMatch: "Passwords do not match.",
    errDefault: "Registration failed. Please try again.",
    errNetwork: "Could not connect to the server. Check your backend.",
  },
  hi: {
    panelKicker: "नए नागरिक का पंजीकरण",
    panelTitle: "अपने समुदाय से जुड़ें और स्थानीय समस्याओं को सामने लाएँ",
    points: [
      { icon: FilePlus, text: "एक बार पंजीकरण करें और कभी भी शिकायत दर्ज करें" },
      { icon: MapPin, text: "हर समस्या का सटीक स्थान चिह्नित करें" },
      { icon: ShieldCheck, text: "आपका विवरण केवल आपकी शिकायतों के लिए उपयोग होता है" },
    ],
    title: "अपना खाता बनाएँ",
    subtitle: "नागरिक के रूप में पंजीकरण के लिए नीचे विवरण भरें।",
    name: "पूरा नाम",
    namePh: "अपना पूरा नाम दर्ज करें",
    email: "ईमेल पता",
    emailPh: "you@example.com",
    password: "पासवर्ड",
    passwordPh: "कम से कम 8 अक्षर",
    confirm: "पासवर्ड की पुष्टि करें",
    confirmPh: "पासवर्ड दोबारा दर्ज करें",
    show: "पासवर्ड दिखाएँ",
    hide: "पासवर्ड छिपाएँ",
    ruleLength: "कम से कम 8 अक्षर",
    ruleMatch: "दोनों पासवर्ड मेल खाते हैं",
    submit: "खाता बनाएँ",
    submitting: "खाता बनाया जा रहा है...",
    haveAccount: "पहले से खाता है?",
    signIn: "साइन इन करें",
    successMessage: "खाता सफलतापूर्वक बन गया। कृपया साइन इन करें।",
    errLength: "आपके पासवर्ड में कम से कम 8 अक्षर होने चाहिए।",
    errMatch: "पासवर्ड मेल नहीं खाते।",
    errDefault: "पंजीकरण नहीं हो सका। कृपया पुनः प्रयास करें।",
    errNetwork: "सर्वर से संपर्क नहीं हो सका। अपना बैकएंड जाँचें।",
  },
};

function Register({ lang = "en" }) {
  const t = text[lang] || text.en;
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const lengthOk = form.password.length >= 8;
  const matchOk =
    form.confirmPassword.length > 0 && form.password === form.confirmPassword;

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((previous) => ({ ...previous, [name]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");

    if (form.password.length < 8) {
      setError(t.errLength);
      return;
    }

    if (form.password !== form.confirmPassword) {
      setError(t.errMatch);
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          name: form.name.trim(),
          email: form.email.trim(),
          password: form.password,
        }),
      });

      const data = await response.json();

      if (!response.ok || data.success !== true) {
        throw new Error(data.message || t.errDefault);
      }

      // Registration may not automatically sign the user in.
      navigate("/login", {
        replace: true,
        state: { message: t.successMessage },
      });
    } catch (err) {
      setError(err.message || t.errNetwork);
    } finally {
      setLoading(false);
    }
  }

  const eyeButton = (
    <button
      type="button"
      className="gr-eye"
      aria-label={showPassword ? t.hide : t.show}
      aria-pressed={showPassword}
      onClick={() => setShowPassword((v) => !v)}
    >
      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
    </button>
  );

  return (
    <section className="gr-page" lang={lang}>
      <div className="gr-card">
        <aside className="gr-panel">
          <svg className="gr-panel-wheel" viewBox="0 0 100 100" aria-hidden="true">
            <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="4" />
            <circle cx="50" cy="50" r="8" fill="currentColor" />
            {Array.from({ length: 24 }, (_, i) => (
              <line
                key={i}
                x1="50" y1="12" x2="50" y2="42"
                stroke="currentColor" strokeWidth="2.5"
                transform={`rotate(${i * 15} 50 50)`}
              />
            ))}
          </svg>

          <Link to="/" className="gr-panel-brand">
            <ShieldCheck size={22} /> CivicSetu
          </Link>

          <div className="gr-panel-body">
            <p className="gr-panel-kicker">{t.panelKicker}</p>
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

          <div className="gr-tricolour" aria-hidden="true">
            <i />
            <i />
            <i />
          </div>
        </aside>

        <div className="gr-form-side">
          <span className="gr-badge" aria-hidden="true">
            <UserPlus size={24} />
          </span>
          <h1>{t.title}</h1>
          <p className="gr-subtitle">{t.subtitle}</p>

          {error && (
            <div className="gr-error" role="alert">
              <AlertCircle size={18} />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <label htmlFor="register-name">{t.name}</label>
            <div className="gr-field">
              <User size={18} />
              <input
                id="register-name"
                type="text"
                name="name"
                placeholder={t.namePh}
                value={form.name}
                onChange={handleChange}
                autoComplete="name"
                maxLength={80}
                required
              />
            </div>

            <label htmlFor="register-email">{t.email}</label>
            <div className="gr-field">
              <Mail size={18} />
              <input
                id="register-email"
                type="email"
                name="email"
                placeholder={t.emailPh}
                value={form.email}
                onChange={handleChange}
                autoComplete="email"
                required
              />
            </div>

            <label htmlFor="register-password">{t.password}</label>
            <div className="gr-field">
              <Lock size={18} />
              <input
                id="register-password"
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder={t.passwordPh}
                value={form.password}
                onChange={handleChange}
                autoComplete="new-password"
                minLength={8}
                required
              />
              {eyeButton}
            </div>

            <label htmlFor="register-confirm-password">{t.confirm}</label>
            <div className="gr-field">
              <Lock size={18} />
              <input
                id="register-confirm-password"
                type={showPassword ? "text" : "password"}
                name="confirmPassword"
                placeholder={t.confirmPh}
                value={form.confirmPassword}
                onChange={handleChange}
                autoComplete="new-password"
                minLength={8}
                required
              />
            </div>

            <ul className="gr-rules" aria-live="polite">
              <li className={lengthOk ? "is-ok" : ""}>
                <Check size={14} /> {t.ruleLength}
              </li>
              <li className={matchOk ? "is-ok" : ""}>
                <Check size={14} /> {t.ruleMatch}
              </li>
            </ul>

            <button type="submit" className="gr-submit" disabled={loading}>
              {loading ? (
                <>
                  <LoaderCircle size={18} className="gr-spin" /> {t.submitting}
                </>
              ) : (
                <>
                  {t.submit} <UserPlus size={18} />
                </>
              )}
            </button>
          </form>

          <p className="gr-login">
            {t.haveAccount} <Link to="/login">{t.signIn}</Link>
          </p>
        </div>
      </div>
    </section>
  );
}

export default Register;