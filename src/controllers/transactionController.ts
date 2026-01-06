import { Request, Response, NextFunction } from "express";
import { TransactionService } from "../services/transaction-service";

export const TransactionController = {
    async create(req: Request, res: Response, next: NextFunction) {
        try {
            const profileId = Number(req.params.profileId);
            const transaction = await TransactionService.create(profileId, req.body);
            res.status(201).json(transaction);
        } catch (err) {
            next(err);
        }
    },

    async getHistory(req: Request, res: Response, next: NextFunction) {
        try {
            const profileId = Number(req.params.profileId);

            // Convert query parameters to proper types
            const query = {
                gameId: req.query.gameId ? Number(req.query.gameId) : undefined,
                startDate: req.query.startDate as string | undefined,
                endDate: req.query.endDate as string | undefined,
                limit: req.query.limit ? Number(req.query.limit) : undefined,
                offset: req.query.offset ? Number(req.query.offset) : undefined
            };

            const result = await TransactionService.getHistory(profileId, query);
            res.json(result);
        } catch (err) {
            next(err);
        }
    },

    async getStatistics(req: Request, res: Response, next: NextFunction) {
        try {
            const profileId = Number(req.params.profileId);
            const gameId = req.query.gameId ? Number(req.query.gameId) : undefined;
            const stats = await TransactionService.getStatistics(profileId, gameId);
            res.json(stats);
        } catch (err) {
            next(err);
        }
    }
};
