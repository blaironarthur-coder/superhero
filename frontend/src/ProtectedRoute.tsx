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
export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const token = localStorage.getItem("token");

  if (!token) {
    // Pas connecté → redirection vers /login
    return <Navigate to="/login" replace />;
  }

  // Connecté → affiche le contenu protégé
  return <>{children}</>;
}
