import { Router } from "express";
import { GameController } from "../controllers/gameController";

const router = Router();

// POST /games
router.post("/games", GameController.create);

// GET /games
router.get("/games", GameController.getAll);

// GET /games/:id
router.get("/games/:id", GameController.getById);

// PUT /games/:id
router.put("/games/:id", GameController.update);

// DELETE /games/:id
router.delete("/games/:id", GameController.delete);

export default router;

