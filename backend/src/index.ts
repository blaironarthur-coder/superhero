import "dotenv/config";
import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import morgan from "morgan";

import authRoutes from "./routes/auth.js";
import heroRoutes from "./routes/heroes.js";

const app = express();

import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 👉 pour servir le dossier images
app.use("/images", express.static(path.join(__dirname, "../images")));


// === Middleware de base ===
app.use(cors());
app.use(morgan("dev"));
app.use(express.json({ limit: "2mb" }));

// === Routes de test ===
app.get("/", (_req, res) => {
  res.send("🚀 SuperHeroManager API en ligne !");
});

app.get("/health", (_req, res) => {
  res.json({ ok: true });
});

// === Enregistrement des routes principales ===
app.use("/api/auth", authRoutes);
app.use("/api/heroes", heroRoutes);

// === Connexion à MongoDB et lancement du serveur ===
const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/superheroes";
const PORT = Number(process.env.PORT) || 4000;

console.log("🚀 Démarrage du serveur...");
console.log("MONGO_URI =", MONGO_URI);

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB connecté avec succès");
    app.listen(PORT, () => {
      console.log(`✅ Serveur Express en écoute sur http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ Erreur de connexion à MongoDB :", err);
  });
