import "dotenv/config";
import mongoose from "mongoose";
import fs from "fs";
import path from "path";
import Hero from "../models/heroModel.js";

const filePath = path.resolve("./SuperHerosComplet.json");

async function importHeroes() {
  try {
    console.log("🚀 Connexion à MongoDB...");
    await mongoose.connect(process.env.MONGO_URI || "mongodb://localhost:27017/superheroes");
    console.log("✅ Connecté à MongoDB");

    if (!fs.existsSync(filePath)) {
      throw new Error(`❌ Fichier introuvable : ${filePath}`);
    }

    console.log("📂 Lecture du fichier JSON...");
    const raw = fs.readFileSync(filePath, "utf-8");
    const parsed = JSON.parse(raw);

    const data = Array.isArray(parsed)
      ? parsed
      : parsed.superheros || parsed.heroes || [];

    console.log(`📊 ${data.length} héros trouvés, insertion en cours...`);

    if (!Array.isArray(data) || data.length === 0) {
      throw new Error("❌ Aucun héros trouvé dans le fichier JSON !");
    }

    // 👉 Structure parfaitement compatible avec heroModel et ton frontend
    const heroes = data.map((hero: any) => {
      const slug = hero.slug || hero.id || hero.name?.toLowerCase().replace(/\s+/g, "-") || "unknown";

      return {
        name: hero.name || "Unknown Hero",
        slug: slug,
        powerstats: hero.powerstats || {},
        biography: hero.biography || {},
        appearance: hero.appearance || {},
        work: hero.work || {},
        connections: hero.connections || {},

        // --- 💥 Le champ complet "images" ---
        images: {
          xs: hero.images?.xs || `xs/${slug}.jpg`,
          sm: hero.images?.sm || `sm/${slug}.jpg`,
          md: hero.images?.md || `md/${slug}.jpg`,
          lg: hero.images?.lg || `lg/${slug}.jpg`
        },

        // Champ secondaire (optionnel)
        image: hero.images?.md || `md/${slug}.jpg`
      };
    });

    await Hero.deleteMany({});
    await Hero.insertMany(heroes);

    console.log("✅ Import terminé avec succès !");
  } catch (err: any) {
    console.error("❌ Erreur pendant l'import :", err.message);
  } finally {
    await mongoose.disconnect();
    console.log("🔌 Déconnexion MongoDB");
  }
}

importHeroes();
