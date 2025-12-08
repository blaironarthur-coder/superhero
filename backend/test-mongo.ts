import mongoose from "mongoose";

const uri = "mongodb://localhost:27017/superheroes";

console.log("🚀 Test de connexion à MongoDB...");

mongoose
  .connect(uri)
  .then(() => {
    console.log("✅ Connexion MongoDB réussie !");
    return mongoose.connection.close();
  })
  .catch((err) => {
    console.error("❌ Erreur de connexion :", err);
  });
