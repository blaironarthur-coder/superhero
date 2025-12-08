import "dotenv/config";
import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import morgan from "morgan";
import path from "path";

import authRoutes from "./routes/auth";
import heroRoutes from "./routes/heroes";

const app = express();

// 👉 servir les images : /images/md/1-a-bomb.jpg etc.
app.use("/images", express.static(path.join(__dirname, "../images")));

app.use(cors());
app.use(express.json({ limit: "2mb" }));
app.use(morgan("dev"));

// Routes test
app.get("/", (_req, res) => {
  res.send("🚀 SuperHeroManager API en ligne !");
});

app.get("/health", (_req, res) => {
  res.json({ ok: true });
});

// Routes principales
app.use("/api/auth", authRoutes);
app.use("/api/heroes", heroRoutes);

const MONGO_URI =
  process.env.MONGO_URI || "mongodb://localhost:27017/superheroes";
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
