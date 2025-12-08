console.log("🚀 Test JavaScript en cours...");

import('mongoose').then(mongoose => {
  const uri = "mongodb://localhost:27017/superheroes";
  console.log("Connexion à MongoDB…");
  mongoose.default.connect(uri)
    .then(() => {
      console.log("✅ Connexion MongoDB réussie !");
      return mongoose.default.connection.close();
    })
    .catch(err => console.error("❌ Erreur de connexion :", err));
});
