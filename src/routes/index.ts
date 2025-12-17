import { Router } from "express";
import { ProfileController } from "../controllers/profileController";
import { GameController } from "../controllers/gameController";
import { EventController } from "../controllers/eventController";
import { ItemController } from "../controllers/itemController";
import { TransactionController } from "../controllers/transactionController";
import { VoucherController } from "../controllers/voucherController";

const router = Router();

// Profiles
router.post("/profiles/register", ProfileController.register);
router.post("/profiles/login", ProfileController.login);
router.get("/profiles/:id/games-leaderboard", ProfileController.getGamesLeaderboard);
router.get("/profiles/:id", ProfileController.getProfile);
router.put("/profiles/:id", ProfileController.updateProfile);
router.get("/profiles/:id/inventory", ProfileController.getInventory);

// Games
router.post("/games", GameController.create);
router.put("/games/:id", GameController.update);
router.get("/games/:id", GameController.getById);
router.get("/games", GameController.getAll);
router.delete("/games/:id", GameController.delete);

// Events
router.post("/events", EventController.create);
router.put("/events/:id", EventController.update);
router.get("/events/:id", EventController.getById);
router.get("/events/by-game/:gameId", EventController.getByGame);
router.delete("/events/:id", EventController.delete);

// Items
router.post("/items", ItemController.create);
router.get("/items/:id", ItemController.getById);
router.get("/items", ItemController.getAll);
router.delete("/items/:id", ItemController.delete);

// Transactions
router.post("/transactions/:profileId/transactions", TransactionController.create);
router.get("/transactions/:profileId/transactions", TransactionController.getHistory);
router.get("/transactions/:profileId/statistics", TransactionController.getStatistics);

// Vouchers
router.post("/vouchers", VoucherController.create);
router.post("/vouchers/:profileId/purchase", VoucherController.purchase);
router.get("/vouchers/by-game", VoucherController.getByGame);
router.get("/vouchers/purchases/:profileId", VoucherController.getPurchaseHistory);
router.get("/vouchers/:id", VoucherController.getById);
router.post("/vouchers/purchases/:id/use", VoucherController.markAsUsed);

export default router;
