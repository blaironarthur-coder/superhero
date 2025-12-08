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
  images?: { xs?: string; sm?: string; md?: string; lg?: string };
}

export default function HeroDetails() {
  const { id } = useParams();
  const [hero, setHero] = useState<Hero | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchHero() {
      setLoading(true);
      const res = await fetch(`http://localhost:4000/api/heroes/${id}`);
      const data = await res.json();
      setHero(data);
      setLoading(false);
    }
    fetchHero();
  }, [id]);

  if (loading) return <p>Chargement...</p>;
  if (!hero) return <p>Héros introuvable.</p>;

  const statsColors: Record<string, string> = {
    intelligence: "#3498db",
    strength: "#e74c3c",
    speed: "#f1c40f",
    durability: "#8e44ad",
    power: "#e67e22",
    combat: "#2ecc71",
  };

  const imageUrl = hero.images?.lg
    ? `http://localhost:4000/images/${hero.images.lg}`
    : hero.images?.md
    ? `http://localhost:4000/images/${hero.images.md}`
    : hero.images?.sm
    ? `http://localhost:4000/images/${hero.images.sm}`
    : "";

  return (
    <div style={{ padding: 20, fontFamily: "system-ui" }}>
      <Link to="/" style={{ textDecoration: "none", color: "#007bff" }}>
        ← Retour
      </Link>

      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: 30,
          marginTop: 20,
          alignItems: "flex-start",
        }}
      >
        {/* IMAGE */}
        <div style={{ flex: "1 1 350px" }}>
          <img
            src={imageUrl}
            alt={hero.name}
            style={{
              width: "100%",
              borderRadius: 15,
              maxHeight: 550,
              objectFit: "cover",
            }}
          />
        </div>

        {/* INFORMATIONS */}
        <div style={{ flex: "2 1 450px" }}>
          <h1 style={{ marginBottom: 10 }}>{hero.name}</h1>
          <p style={{ color: "#777", marginBottom: 20 }}>
            🏢 {hero.biography?.publisher || "Éditeur inconnu"}
          </p>

          {/* POWERSTATS */}
          <h2>💪 Powerstats</h2>
          {Object.entries(hero.powerstats || {}).map(([key, value]) => (
            <div key={key} style={{ marginBottom: 8 }}>
              <div style={{ fontSize: 14 }}>
                {key}: {value}
              </div>
              <div
                style={{
                  height: 6,
                  background: "#eee",
                  borderRadius: 4,
                  marginTop: 2,
                }}
              >
                <div
                  style={{
                    height: "100%",
                    width: `${value}%`,
                    backgroundColor: statsColors[key] || "#999",
                    borderRadius: 4,
                  }}
                />
              </div>
            </div>
          ))}

          {/* BIOGRAPHIE */}
          <h2 style={{ marginTop: 25 }}>📖 Biographie</h2>
          <ul style={{ lineHeight: "1.7" }}>
            <li><b>Nom complet :</b> {hero.biography?.fullName || "Inconnu"}</li>
            <li><b>Alignement :</b> {hero.biography?.alignment}</li>
            <li>
              <b>Première apparition :</b> {hero.biography?.firstAppearance}
            </li>
            <li>
              <b>Lieu de naissance :</b> {hero.biography?.placeOfBirth || "?"}
            </li>
            <li>
              <b>Alias :</b>{" "}
              {hero.biography?.aliases?.length
                ? hero.biography.aliases.join(", ")
                : "Aucun"}
            </li>
          </ul>

          {/* APPARENCE */}
          <h2 style={{ marginTop: 25 }}>🧬 Apparence</h2>
          <ul style={{ lineHeight: "1.7" }}>
            <li><b>Genre :</b> {hero.appearance?.gender}</li>
            <li><b>Race :</b> {hero.appearance?.race || "Inconnu"}</li>
            <li><b>Taille :</b> {hero.appearance?.height?.[1]}</li>
            <li><b>Poids :</b> {hero.appearance?.weight?.[1]}</li>
            <li><b>Yeux :</b> {hero.appearance?.eyeColor}</li>
            <li><b>Cheveux :</b> {hero.appearance?.hairColor}</li>
          </ul>

          {/* TRAVAIL */}
          <h2 style={{ marginTop: 25 }}>🛠️ Travail</h2>
          <ul style={{ lineHeight: "1.7" }}>
            <li><b>Occupation :</b> {hero.work?.occupation}</li>
            <li><b>Base :</b> {hero.work?.base}</li>
          </ul>

          {/* CONNECTIONS */}
          <h2 style={{ marginTop: 25 }}>🔗 Connexions</h2>
          <ul style={{ lineHeight: "1.7" }}>
            <li><b>Groupes :</b> {hero.connections?.groupAffiliation}</li>
            <li><b>Famille :</b> {hero.connections?.relatives}</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
