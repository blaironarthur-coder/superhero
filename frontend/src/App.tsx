import { Link } from "react-router-dom";
import React, { useEffect, useState } from "react";

interface Hero {
  _id: string;
  name: string;
  biography?: { publisher?: string };
  powerstats?: {
    intelligence?: number;
    strength?: number;
    speed?: number;
    durability?: number;
    power?: number;
    combat?: number;
  };
  images?: {
    xs?: string;
    sm?: string;
    md?: string;
    lg?: string;
  };
  image?: string;
}

const API_URL = "http://localhost:4000/api/heroes";

export default function App() {
  const [heroes, setHeroes] = useState<Hero[]>([]);
  const [query, setQuery] = useState("");
  const [publisher, setPublisher] = useState("");
  const [loading, setLoading] = useState(false);

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [limit, setLimit] = useState(12);
  const [gotoPage, setGotoPage] = useState("");

  const [minStats, setMinStats] = useState({
    intelligence: "",
    strength: "",
    speed: "",
    durability: "",
    power: "",
    combat: "",
  });

  async function fetchHeroes(pageNum = 1, customLimit = limit) {
    setLoading(true);

    try {
      const params = new URLSearchParams();

      if (query) params.append("q", query);
      if (publisher) params.append("publisher", publisher);

      params.append("page", String(pageNum));
      params.append("limit", String(customLimit));

      Object.entries(minStats).forEach(([key, val]) => {
        if (val) params.append(`min_${key}`, val);
      });

      const res = await fetch(`${API_URL}?${params.toString()}`);
      const data = await res.json();

      setHeroes(data.items || []);
      setPage(data.page || 1);
      setTotalPages(data.pages || 1);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchHeroes(1);
  }, []);

  return (
    <div style={{ padding: 20, fontFamily: "system-ui", background: "#f5f6fa" }}>
      <h1 style={{ textAlign: "center" }}>🦸 SuperHero Manager</h1>

      {localStorage.getItem("role") === "admin" && (
  <div style={{ textAlign: "center", marginBottom: 20 }}>
    <Link
      to="/add-hero"
      style={{
        padding: "10px 20px",
        background: "#2ecc71",
        color: "white",
        borderRadius: 8,
        textDecoration: "none",
        fontWeight: "bold",
      }}
    >
      ➕ Ajouter un héros
    </Link>
  </div>
)}


      {/* Déconnexion */}
      <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 20 }}>
        <button
          onClick={() => {
            localStorage.removeItem("token");
            localStorage.removeItem("role");
            window.location.href = "/login";
          }}
          style={{
            padding: "8px 16px",
            background: "#e74c3c",
            color: "white",
            borderRadius: 8,
            border: "none",
          }}
        >
          🚪 Déconnexion
        </button>
      </div>

      {/* Filtres */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: 10,
          justifyContent: "center",
          marginBottom: 20,
        }}
      >
        <input
          value={query}
          placeholder="Rechercher..."
          onChange={(e) => setQuery(e.target.value)}
          style={{ padding: 8, width: 220, borderRadius: 8 }}
        />

        <select
          value={publisher}
          onChange={(e) => setPublisher(e.target.value)}
          style={{ padding: 8, borderRadius: 8 }}
        >
          <option value="">Tous éditeurs</option>
          <option value="Marvel Comics">Marvel</option>
          <option value="DC Comics">DC</option>
          <option value="Dark Horse Comics">Dark Horse</option>
        </select>

        {Object.keys(minStats).map((key) => (
          <input
            key={key}
            type="number"
            placeholder={`${key} ≥`}
            value={minStats[key as keyof typeof minStats]}
            onChange={(e) => setMinStats({ ...minStats, [key]: e.target.value })}
            style={{ width: 70, padding: 6, borderRadius: 6 }}
          />
        ))}

        <button
          onClick={() => fetchHeroes(1)}
          style={{
            padding: "8px 16px",
            background: "#007bff",
            color: "white",
            borderRadius: 8,
            border: "none",
          }}
        >
          🔍 Rechercher
        </button>
      </div>

      {/* Résultats */}
      {loading ? (
        <p style={{ textAlign: "center" }}>Chargement...</p>
      ) : (
        <>
          <h3 style={{ textAlign: "center", marginBottom: 20 }}>
            {heroes.length > 0
              ? `${heroes.length} héros affichés — Page ${page} / ${totalPages}`
              : "Aucun héros trouvé"}
          </h3>

          {/* Liste */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
              gap: 20,
            }}
          >
            {heroes.map((hero) => {
              const img =
                hero.images?.md ||
                hero.images?.lg ||
                hero.image ||
                "https://via.placeholder.com/300x400?text=No+Image";

              const imageUrl = img.includes("http")
                ? img
                : `http://localhost:4000/images/${img}`;

              return (
                <Link
                  key={hero._id}
                  to={`/hero/${hero._id}`}
                  style={{ textDecoration: "none", color: "inherit" }}
                >
                  <div
                    style={{
                      background: "white",
                      borderRadius: 12,
                      padding: 16,
                      boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                    }}
                  >
                    <h3>{hero.name}</h3>
                    <p style={{ color: "#666" }}>{hero.biography?.publisher}</p>

                    <img
                      src={imageUrl}
                      alt={hero.name}
                      style={{
                        width: "100%",
                        height: "auto",
                        borderRadius: 8,
                        objectFit: "cover",
                      }}
                    />

                    <div style={{ marginTop: 10 }}>
                      {Object.entries(hero.powerstats || {}).map(([k, v]) => (
                        <div key={k} style={{ marginBottom: 6 }}>
                          <div style={{ fontSize: 12 }}>
                            {k}: {v}
                          </div>
                          <div
                            style={{
                              width: "100%",
                              height: 6,
                              background: "#ddd",
                              borderRadius: 4,
                            }}
                          >
                            <div
                              style={{
                                width: `${v}%`,
                                height: "100%",
                                background: "#3498db",
                                borderRadius: 4,
                              }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>

          {/* Pagination */}
          <div
            style={{
              marginTop: 30,
              display: "flex",
              justifyContent: "center",
              gap: 12,
              flexWrap: "wrap",
            }}
          >
            <button
              disabled={page <= 1}
              onClick={() => fetchHeroes(page - 1)}
            >
              ⬅️ Précédent
            </button>

            <span>
              Page {page} / {totalPages}
            </span>

            <button
              disabled={page >= totalPages}
              onClick={() => fetchHeroes(page + 1)}
            >
              Suivant ➡️
            </button>

            <input
              type="number"
              placeholder="Page..."
              value={gotoPage}
              onChange={(e) => setGotoPage(e.target.value)}
              style={{ width: 60, padding: 4 }}
            />

            <button
              onClick={() => {
                const p = Math.min(totalPages, Math.max(1, Number(gotoPage)));
                if (p && p !== page) fetchHeroes(p);
              }}
            >
              Aller
            </button>

            <select
              value={limit}
              onChange={(e) => {
                setLimit(Number(e.target.value));
                fetchHeroes(1, Number(e.target.value));
              }}
            >
              <option value={12}>12 / page</option>
              <option value={24}>24 / page</option>
              <option value={48}>48 / page</option>
            </select>
          </div>
        </>
      )}
    </div>
  );
}
