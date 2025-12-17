import { Request, Response, NextFunction } from "express";
import { VoucherService } from "../services/voucher-service";

export const VoucherController = {
    async create(req: Request, res: Response, next: NextFunction) {
        try {
            const voucher = await VoucherService.create(req.body);
            res.status(201).json(voucher);
        } catch (err) {
            next(err);
        }
    },

    async purchase(req: Request, res: Response, next: NextFunction) {
        try {
            const profileId = Number(req.params.profileId);
            const purchase = await VoucherService.purchase(profileId, req.body);
            res.status(201).json(purchase);
        } catch (err) {
            next(err);
        }
    },

    async getAll(req: Request, res: Response, next: NextFunction) {
        try {
            const activeOnly = req.query.activeOnly === 'true';
            const vouchers = await VoucherService.getAll(activeOnly);
            res.json(vouchers);
        } catch (err) {
            next(err);
        }
    },

    async getByGame(req: Request, res: Response, next: NextFunction) {
        try {
            const query = req.query as any;
            const vouchers = await VoucherService.getByGame(query);
            res.json(vouchers);
        } catch (err) {
            next(err);
        }
    },

    async getPurchaseHistory(req: Request, res: Response, next: NextFunction) {
        try {
            const profileId = Number(req.params.profileId);
            const history = await VoucherService.getPurchaseHistory(profileId);
            res.json(history);
        } catch (err) {
            next(err);
        }
    },

    async getById(req: Request, res: Response, next: NextFunction) {
        try {
            const id = Number(req.params.id);
            const voucher = await VoucherService.getById(id);
            res.json(voucher);
        } catch (err) {
            next(err);
        }
    },

    async markAsUsed(req: Request, res: Response, next: NextFunction) {
        try {
            const id = Number(req.params.id);
            const updated = await VoucherService.markAsUsed(id);
            res.json(updated);
        } catch (err) {
            next(err);
        }
    }
};
