import { Router } from "express";
import { VoucherController } from "../controllers/voucherController";

const router = Router();

// POST /vouchers
router.post("/vouchers", VoucherController.create);

// GET /vouchers
router.get("/vouchers", VoucherController.getAll);

// GET /vouchers/game
router.get("/vouchers/game", VoucherController.getByGame);

// GET /vouchers/:id
router.get("/vouchers/:id", VoucherController.getById);

// POST /profiles/:profileId/vouchers/purchase
router.post("/profiles/:profileId/vouchers/purchase", VoucherController.purchase);

// GET /profiles/:profileId/vouchers/purchases
router.get("/profiles/:profileId/vouchers/purchases", VoucherController.getPurchaseHistory);

// PUT /vouchers/:id/use
router.put("/vouchers/:id/use", VoucherController.markAsUsed);

export default router;

