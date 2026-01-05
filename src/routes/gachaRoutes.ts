import { Router } from "express";
import { gachaHandler } from "../controllers/gachaController";

const router = Router();

// POST /gacha/:profileId/:gameId or body { profileId, gameId }
router.post("/gacha/:profileId/:gameId", gachaHandler);
router.post("/gacha", gachaHandler);

export default router;
