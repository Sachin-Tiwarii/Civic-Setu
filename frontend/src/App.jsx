
import { useState } from "react";
import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
} from "react-router-dom";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ProtectedRoute from "./components/ProtectedRoute";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ReportIssue from "./pages/ReportIssue";
import ExploreIssues from "./pages/ExploreIssues";
import Leaderboard from "./pages/Leaderboard";
import Dashboard from "./pages/Dashboard";
import AdminDashboard from "./pages/AdminDashboard";
import ComplaintDetails from "./pages/ComplaintDetails";

import "./index.css";

function AppLayout({ children, lang, onLangChange }) {
  return (
    <>
      <Navbar
        lang={lang}
        onLangChange={onLangChange}
      />

      <div className="app-content">
        {children}
      </div>

      <Footer lang={lang} />
    </>
  );
}

export default function App() {

  // Default language is English
  const [lang, setLang] = useState("en");

  const layoutProps = {
    lang,
    onLangChange: setLang,
  };

  return (
    <BrowserRouter>
      <Routes>

        {/* Public pages */}
        <Route
          path="/"
          element={
            <AppLayout {...layoutProps}>
              <Home lang={lang} />
            </AppLayout>
          }
        />

        <Route
          path="/login"
          element={
            <AppLayout {...layoutProps}>
              <Login lang={lang} />
            </AppLayout>
          }
        />

        <Route
          path="/register"
          element={
            <AppLayout {...layoutProps}>
              <Register lang={lang} />
            </AppLayout>
          }
        />

        <Route
          path="/explore"
          element={
            <AppLayout {...layoutProps}>
              <ExploreIssues lang={lang} />
            </AppLayout>
          }
        />

        <Route
          path="/explore/:id"
          element={
            <AppLayout {...layoutProps}>
              <ComplaintDetails lang={lang} />
            </AppLayout>
          }
        />

        <Route
          path="/leaderboard"
          element={
            <AppLayout {...layoutProps}>
              <Leaderboard lang={lang} />
            </AppLayout>
          }
        />

        {/* Protected pages */}
        <Route
          path="/report-issue"
          element={
            <ProtectedRoute>
              <AppLayout {...layoutProps}>
                <ReportIssue lang={lang} />
              </AppLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <AppLayout {...layoutProps}>
                <Dashboard lang={lang} />
              </AppLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AppLayout {...layoutProps}>
                <AdminDashboard lang={lang} />
              </AppLayout>
            </ProtectedRoute>
          }
        />

        {/* Redirect unknown URLs */}
        <Route
          path="*"
          element={<Navigate to="/" replace />}
        />

      </Routes>
    </BrowserRouter>
  );
}
