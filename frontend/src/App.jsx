
import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
} from "react-router-dom";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer.jsx";
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

function AppLayout({ children }) {
  return (
    <>
      <Navbar />
      <main>{children}</main>
      <Footer />
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={<AppLayout><Home /></AppLayout>}
        />

        <Route
          path="/login"
          element={<AppLayout><Login /></AppLayout>}
        />

        <Route
          path="/register"
          element={<AppLayout><Register /></AppLayout>}
        />

        <Route
          path="/explore"
          element={<AppLayout><ExploreIssues /></AppLayout>}
        />

        <Route
          path="/explore/:id"
          element={<AppLayout><ComplaintDetails /></AppLayout>}
        />

        <Route
          path="/leaderboard"
          element={<AppLayout><Leaderboard /></AppLayout>}
        />

        <Route
          path="/report-issue"
          element={
            <ProtectedRoute>
              <AppLayout><ReportIssue /></AppLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <AppLayout><Dashboard /></AppLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AppLayout><AdminDashboard /></AppLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="*"
          element={<Navigate to="/" replace />}
        />
      </Routes>
    </BrowserRouter>
  );
}
