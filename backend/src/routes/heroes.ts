import express from "express";
import {
  listHeroes,
  getHero,
  createHero,
  updateHero,
  deleteHero,
  uploadHeroImage   // ✅ AJOUT ICI
} from "../controllers/heroController";

import { authMiddleware, roleMiddleware } from "../middleware/auth";
import multer from "multer";

const router = express.Router();

const upload = multer({ dest: "uploads/" });

// ROUTES PUBLIQUES
router.get("/", listHeroes);
router.get("/:id", getHero);

// 🔐 ROUTES ADMIN
router.post("/", authMiddleware, roleMiddleware("admin"), createHero);
router.put("/:id", authMiddleware, roleMiddleware("admin"), updateHero);
router.delete("/:id", authMiddleware, roleMiddleware("admin"), deleteHero);

// 📸 UPLOAD IMAGE
router.post(
  "/:id/upload",
  authMiddleware,
  roleMiddleware("admin"),
  upload.single("image"),
  uploadHeroImage
);

export default router;
