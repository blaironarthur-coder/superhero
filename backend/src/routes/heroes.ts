import express from "express";
import {
  listHeroes,
  getHero,
  createHero,
  updateHero,
  deleteHero
} from "../controllers/heroController";
import { authMiddleware, roleMiddleware } from "../middleware/auth";

const router = express.Router();

// Public
router.get("/", listHeroes);
router.get("/:id", getHero);

// Admin only
router.post("/", authMiddleware, roleMiddleware("admin"), createHero);
router.put("/:id", authMiddleware, roleMiddleware("admin"), updateHero);
router.delete("/:id", authMiddleware, roleMiddleware("admin"), deleteHero);

export default router;
