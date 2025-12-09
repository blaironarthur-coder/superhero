import React from "react";
import { Navigate } from "react-router-dom";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

/**
 * Vérifie si un token existe dans le localStorage.
 * Si oui → affiche la page.
 * Si non → redirige vers /login.
 */
export default function ProtectedRoute({ children, role }: any) {
  const token = localStorage.getItem("token");
  const userRole = localStorage.getItem("role");

  if (!token) return <Navigate to="/login" />;

  if (role && userRole !== role)
    return <h2 style={{ textAlign: "center", marginTop: 50 }}>
      🚫 Accès interdit (rôle insuffisant)
    </h2>;

  return children;
}
