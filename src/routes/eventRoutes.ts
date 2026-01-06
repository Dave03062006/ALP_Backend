import { Router } from "express";
import { EventController } from "../controllers/eventController";

const router = Router();

// POST /events
router.post("/events", EventController.create);

// GET /events/:id
router.get("/events/:id", EventController.getById);

// GET /events/by-game/:gameId - Fixed to match frontend
router.get("/events/by-game/:gameId", EventController.getByGame);

// PUT /events/:id
router.put("/events/:id", EventController.update);

// DELETE /events/:id
router.delete("/events/:id", EventController.delete);

export default router;
