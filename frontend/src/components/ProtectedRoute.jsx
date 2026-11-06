
import { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";

const API_URL = import.meta.env.DEV
  ? "http://localhost:5000"
  : "";

function ProtectedRoute({ children }) {
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);
  const location = useLocation();

  useEffect(() => {
    let cancelled = false;

    async function checkAuth() {
      try {
        const response = await fetch(`${API_URL}/api/auth/me`, {
          method: "GET",
          credentials: "include",
        });

        if (!response.ok) {
          if (!cancelled) setAuthenticated(false);
          return;
        }

        const data = await response.json();

        if (!cancelled) {
          setAuthenticated(data.success === true);
        }
      } catch (error) {
        console.error("Authentication check failed:", error);

        if (!cancelled) {
          setAuthenticated(false);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    checkAuth();

    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) {
    return (
      <div className="route-loading">
        <p>Checking your session...</p>
      </div>
    );
  }

  if (!authenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return children;
}

export default ProtectedRoute;
