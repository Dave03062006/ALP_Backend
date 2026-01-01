import { Router } from "express";
import { ItemController } from "../controllers/itemController";

const router = Router();

// POST /items
router.post("/items", ItemController.create);

// GET /items
router.get("/items", ItemController.getAll);

// GET /items/:id
router.get("/items/:id", ItemController.getById);

// DELETE /items/:id
router.delete("/items/:id", ItemController.delete);

export default router;

