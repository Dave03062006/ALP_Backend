import { Router } from "express";
import { TransactionController } from "../controllers/transactionController";

const router = Router();

// POST /profiles/:profileId/transactions
router.post("/profiles/:profileId/transactions", TransactionController.create);

// GET /profiles/:profileId/transactions
router.get("/profiles/:profileId/transactions", TransactionController.getHistory);

// GET /profiles/:profileId/transactions/statistics
router.get("/profiles/:profileId/transactions/statistics", TransactionController.getStatistics);

export default router;

