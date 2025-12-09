import React, { useState, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";

export default function AddHero() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [preview, setPreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);

  const [hero, setHero] = useState({
    name: "",
    publisher: "",
    fullName: "",
    alignment: "",
    firstAppearance: "",
    placeOfBirth: "",
    intelligence: "",
    strength: "",
    speed: "",
    durability: "",
    power: "",
    combat: "",
    image: "",
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  function updateField(key: string, value: any) {
    setHero({ ...hero, [key]: value });
  }

  // ⬇️ Sélection d'image + Preview
  function handleImageSelect(file: File) {
    setImageFile(file);
    setPreview(URL.createObjectURL(file));
  }

  async function uploadImage(heroId: string) {
    if (!imageFile) return null;

    const formData = new FormData();
    formData.append("image", imageFile);

    const res = await fetch(
      `http://localhost:4000/api/heroes/${heroId}/upload`,
      {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      }
    );

    const data = await res.json();
    return data.images?.local || null;
  }

  async function handleSubmit(e: any) {
    e.preventDefault();

    // 1️⃣ Enregistrer le héros
    const payload = {
      name: hero.name,
      biography: {
        publisher: hero.publisher,
        fullName: hero.fullName,
        alignment: hero.alignment,
        firstAppearance: hero.firstAppearance,
        placeOfBirth: hero.placeOfBirth,
      },
      powerstats: {
        intelligence: Number(hero.intelligence),
        strength: Number(hero.strength),
        speed: Number(hero.speed),
        durability: Number(hero.durability),
        power: Number(hero.power),
        combat: Number(hero.combat),
      },
      image: hero.image,
    };

    const res = await fetch("http://localhost:4000/api/heroes", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    const created = await res.json();

    if (!res.ok) {
      alert("Erreur : " + created.error);
      return;
    }

    // 2️⃣ Upload image si fichier sélectionné
    if (imageFile) {
      await uploadImage(created._id);
    }

    alert("Héros ajouté avec succès !");
    navigate("/");
  }

  return (
    <div style={{ padding: 20 }}>
      <Link to="/">← Retour</Link>
      <h1>➕ Ajouter un héros</h1>

      <form onSubmit={handleSubmit} style={{ maxWidth: 500 }}>
        
        <h2>💬 Informations</h2>
        <input
          required
          placeholder="Nom du héros"
          value={hero.name}
          onChange={(e) => updateField("name", e.target.value)}
          style={{ width: "100%", marginBottom: 10, padding: 8 }}
        />

        <input
          placeholder="Nom complet"
          value={hero.fullName}
          onChange={(e) => updateField("fullName", e.target.value)}
          style={{ width: "100%", marginBottom: 10, padding: 8 }}
        />

        <input
          placeholder="Publisher"
          value={hero.publisher}
          onChange={(e) => updateField("publisher", e.target.value)}
          style={{ width: "100%", marginBottom: 10, padding: 8 }}
        />

        <input
          placeholder="Alignement (good / bad / neutral)"
          value={hero.alignment}
          onChange={(e) => updateField("alignment", e.target.value)}
          style={{ width: "100%", marginBottom: 10, padding: 8 }}
        />

        <input
          placeholder="Première apparition"
          value={hero.firstAppearance}
          onChange={(e) => updateField("firstAppearance", e.target.value)}
          style={{ width: "100%", marginBottom: 10, padding: 8 }}
        />

        <input
          placeholder="Lieu de naissance"
          value={hero.placeOfBirth}
          onChange={(e) => updateField("placeOfBirth", e.target.value)}
          style={{ width: "100%", marginBottom: 10, padding: 8 }}
        />

        <h2>💪 Powerstats</h2>
        {["intelligence", "strength", "speed", "durability", "power", "combat"].map((key) => (
          <input
            key={key}
            type="number"
            placeholder={key}
            value={(hero as any)[key]}
            onChange={(e) => updateField(key, e.target.value)}
            style={{ width: "100%", marginBottom: 10, padding: 8 }}
          />
        ))}

        <h2>🖼 Image du héros</h2>

        {/* Zone de drop + clic */}
        <div
          onClick={() => fileInputRef.current?.click()}
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            const file = e.dataTransfer.files[0];
            if (file) handleImageSelect(file);
          }}
          style={{
            border: "2px dashed #aaa",
            padding: 20,
            textAlign: "center",
            borderRadius: 10,
            cursor: "pointer",
            marginBottom: 15,
          }}
        >
          {preview ? (
            <img
              src={preview}
              alt="preview"
              style={{ width: "100%", borderRadius: 8 }}
            />
          ) : (
            <p>📁 Glissez une image ici ou cliquez pour sélectionner</p>
          )}
        </div>

        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          hidden
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleImageSelect(file);
          }}
        />

        <button
          type="submit"
          style={{
            background: "#2ecc71",
            color: "white",
            padding: 12,
            width: "100%",
            borderRadius: 8,
            marginTop: 10,
            border: "none",
            fontSize: 16,
          }}
        >
          ➕ Ajouter le héros
        </button>
      </form>
    </div>
  );
}
