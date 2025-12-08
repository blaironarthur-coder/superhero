import express from "express";
import { listHeroes, getHero, createHero, updateHero, deleteHero, } from "../controllers/heroController.js";
import { authMiddleware, roleMiddleware } from "../middleware/auth.js";
const router = express.Router();
// Public routes
router.get("/", listHeroes);
router.get("/:id", getHero);
// Protected (admin) routes
router.post("/", authMiddleware, roleMiddleware("admin"), createHero);
router.put("/:id", authMiddleware, roleMiddleware("admin"), updateHero);
router.delete("/:id", authMiddleware, roleMiddleware("admin"), deleteHero);
export default router;
