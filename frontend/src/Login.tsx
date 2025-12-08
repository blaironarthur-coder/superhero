import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch("http://localhost:4000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Erreur inconnue");
        return;
      }

      // Enregistrer le token et le rôle
      localStorage.setItem("token", data.token);
      localStorage.setItem("role", data.user.role);

      // Rediriger vers la page principale
      navigate("/");
    } catch (err) {
      console.error(err);
      setError("Erreur de connexion au serveur");
    }
  }

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        background: "#f5f6fa",
        fontFamily: "system-ui, sans-serif",
      }}
    >
      <form
        onSubmit={handleLogin}
        style={{
          background: "white",
          padding: 40,
          borderRadius: 12,
          boxShadow: "0 3px 8px rgba(0,0,0,0.15)",
          width: 300,
        }}
      >
        <h2 style={{ textAlign: "center", marginBottom: 20 }}>🔐 Connexion</h2>

        <label style={{ display: "block", marginBottom: 10 }}>
          Nom d'utilisateur
        </label>
        <input
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          style={{
            width: "100%",
            padding: 8,
            border: "1px solid #ccc",
            borderRadius: 6,
            marginBottom: 15,
          }}
        />

        <label style={{ display: "block", marginBottom: 10 }}>Mot de passe</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={{
            width: "100%",
            padding: 8,
            border: "1px solid #ccc",
            borderRadius: 6,
            marginBottom: 20,
          }}
        />

        {error && (
          <div
            style={{
              background: "#e74c3c",
              color: "white",
              padding: "8px 12px",
              borderRadius: 6,
              marginBottom: 15,
              textAlign: "center",
            }}
          >
            {error}
          </div>
        )}

        <button
          type="submit"
          style={{
            width: "100%",
            background: "#007bff",
            color: "white",
            padding: "10px 0",
            border: "none",
            borderRadius: 6,
            cursor: "pointer",
          }}
        >
          Se connecter
        </button>
      </form>
    </div>
  );
}
