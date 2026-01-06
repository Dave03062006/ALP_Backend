import { Router } from "express";
import { ProfileController } from "../controllers/profileController";

const router = Router();

// POST /profiles/register
router.post("/profiles/register", ProfileController.register);

// POST /profiles/login
router.post("/profiles/login", ProfileController.login);

// GET /profiles/:id
router.get("/profiles/:id", ProfileController.getProfile);

// PUT /profiles/:id
router.put("/profiles/:id", ProfileController.updateProfile);

// GET /profiles/:id/inventory
router.get("/profiles/:id/inventory", ProfileController.getInventory);

// GET /profiles/:id/games/leaderboard
router.get("/profiles/:id/games/leaderboard", ProfileController.getGamesLeaderboard);

export default router;

