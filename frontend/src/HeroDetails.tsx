import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";

interface Hero {
  _id: string;
  name: string;
  biography?: any;
  appearance?: any;
  work?: any;
  connections?: any;
  powerstats?: Record<string, number>;
  images?: { md?: string; lg?: string; sm?: string; xs?: string; local?: string };
}

export default function HeroDetails() {
  const { id } = useParams();
  const [hero, setHero] = useState<Hero | null>(null);
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(false);
  const [editedHero, setEditedHero] = useState<any>({});
  const [uploadPreview, setUploadPreview] = useState<string | null>(null);
  const [uploadFile, setUploadFile] = useState<File | null>(null);

  const isAdmin = localStorage.getItem("role") === "admin";

  // -----------------------------
  // CHARGEMENT DU HÉRO
  // -----------------------------
  useEffect(() => {
    async function loadHero() {
      setLoading(true);
      try {
        const res = await fetch(`http://localhost:4000/api/heroes/${id}`);
        const data = await res.json();
        setHero(data);
        setEditedHero(data);
      } finally {
        setLoading(false);
      }
    }
    loadHero();
  }, [id]);

  if (loading) return <p style={{ textAlign: "center" }}>Chargement...</p>;
  if (!hero) return <p style={{ textAlign: "center" }}>Héros introuvable.</p>;

  // -----------------------------
  // SUPPRESSION
  // -----------------------------
  async function handleDelete() {
    if (!window.confirm("Supprimer ce héros ?")) return;

    const token = localStorage.getItem("token");

    const res = await fetch(`http://localhost:4000/api/heroes/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });

    if (res.ok) {
      alert("Héros supprimé !");
      window.location.href = "/";
    } else {
      alert("Erreur lors de la suppression");
    }
  }

  // -----------------------------
  // ENREGISTRER LES MODIFICATIONS
  // -----------------------------
  async function handleSave() {
    const token = localStorage.getItem("token");

    const res = await fetch(`http://localhost:4000/api/heroes/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(editedHero),
    });

    const data = await res.json();
    setHero(data);
    setEditing(false);
    alert("Modifications enregistrées !");
  }

  // -----------------------------
  // UPLOAD IMAGE
  // -----------------------------
  async function handleUpload() {
    if (!uploadFile) return alert("Choisissez une image");

    const token = localStorage.getItem("token");
    const form = new FormData();
    form.append("image", uploadFile);

    const res = await fetch(`http://localhost:4000/api/heroes/${id}/upload`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: form,
    });

    const data = await res.json();
    alert("Image mise à jour !");
    setHero(data);
    setUploadFile(null);
    setUploadPreview(null);
  }

  // URL de l'image actuelle
  const img =
    hero.images?.local ||
    hero.images?.md ||
    hero.images?.lg ||
    hero.images?.sm ||
    hero.images?.xs;

  const imgUrl = img?.includes("http")
    ? img
    : `http://localhost:4000/images/${img}`;

  return (
    <div style={{ padding: 20, fontFamily: "system-ui", background: "#f5f6fa" }}>
      <Link to="/" style={{ color: "#007bff" }}>← Retour</Link>

      <div
        style={{
          background: "white",
          padding: 20,
          marginTop: 20,
          borderRadius: 12,
          boxShadow: "0 3px 6px rgba(0,0,0,0.1)",
          display: "flex",
          gap: 20,
          flexWrap: "wrap",
        }}
      >
        {/* IMAGE */}
        <div style={{ flex: "1 1 300px", textAlign: "center" }}>
          <img
            src={uploadPreview || imgUrl}
            alt={hero.name}
            style={{ width: "100%", borderRadius: 12, maxWidth: 350 }}
          />

          {isAdmin && (
            <div style={{ marginTop: 10 }}>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0] || null;
                  setUploadFile(file);
                  if (file) {
                    setUploadPreview(URL.createObjectURL(file));
                  }
                }}
              />
              <button
                onClick={handleUpload}
                style={{
                  marginTop: 5,
                  padding: "6px 12px",
                  background: "#27ae60",
                  color: "white",
                  border: "none",
                  borderRadius: 6,
                }}
              >
                📤 Upload
              </button>
            </div>
          )}

          {/* NOM */}
          {editing ? (
            <input
              value={editedHero.name}
              onChange={(e) =>
                setEditedHero({ ...editedHero, name: e.target.value })
              }
              style={{ fontSize: 24, marginTop: 10, textAlign: "center" }}
            />
          ) : (
            <h1>{hero.name}</h1>
          )}

          <p style={{ color: "#666" }}>{hero.biography?.publisher}</p>

          {isAdmin && !editing && (
            <>
              <button
                onClick={() => setEditing(true)}
                style={{ background: "#f39c12", padding: 10, borderRadius: 8 }}
              >
                ✏️ Modifier
              </button>
              <button
                onClick={handleDelete}
                style={{
                  background: "#e74c3c",
                  padding: 10,
                  borderRadius: 8,
                  color: "white",
                  marginLeft: 10,
                }}
              >
                🗑️ Supprimer
              </button>
            </>
          )}

          {isAdmin && editing && (
            <>
              <button
                onClick={handleSave}
                style={{ background: "#2ecc71", padding: 10, borderRadius: 8 }}
              >
                💾 Enregistrer
              </button>
              <button
                onClick={() => setEditing(false)}
                style={{
                  background: "#7f8c8d",
                  padding: 10,
                  borderRadius: 8,
                  marginLeft: 10,
                }}
              >
                ❌ Annuler
              </button>
            </>
          )}
        </div>

        {/* INFORMATIONS */}
        <div style={{ flex: "2 1 400px" }}>
          {/* POWERSTATS */}
          <h2>💪 Powerstats</h2>
          {Object.entries(hero.powerstats || {}).map(([k, v]) => (
            <div key={k} style={{ marginBottom: 8 }}>
              <strong>{k}:</strong> {v}
              <div style={{ height: 6, background: "#ddd", borderRadius: 4 }}>
                <div
                  style={{
                    width: `${v}%`,
                    height: "100%",
                    background: "#3498db",
                    borderRadius: 4,
                  }}
                ></div>
              </div>
            </div>
          ))}

          {/* BIOGRAPHIE */}
          <h2>📖 Biographie</h2>
          <p><strong>Nom complet:</strong> {hero.biography?.fullName}</p>
          <p><strong>Alignement:</strong> {hero.biography?.alignment}</p>
          <p><strong>1ère apparition:</strong> {hero.biography?.firstAppearance}</p>

          {/* APPARENCE */}
          <h2>🧬 Apparence</h2>
          <p>Genre: {hero.appearance?.gender}</p>
          <p>Taille: {hero.appearance?.height?.[1]}</p>
          <p>Poids: {hero.appearance?.weight?.[1]}</p>
          <p>Yeux: {hero.appearance?.eyeColor}</p>

          {/* TRAVAIL */}
          <h2>💼 Travail</h2>
          <p>Occupation: {hero.work?.occupation}</p>

          {/* CONNEXIONS */}
          <h2>🔗 Connexions</h2>
          <p>{hero.connections?.groupAffiliation}</p>
        </div>
      </div>
    </div>
  );
}
