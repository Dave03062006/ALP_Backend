import { Request, Response, NextFunction } from "express";
import { ProfileService } from "../services/profile-service";

export const ProfileController = {
    async register(req: Request, res: Response, next: NextFunction) {
        try {
            const profile = await ProfileService.register(req.body);
            res.status(201).json(profile);
        } catch (err) {
            next(err);
        }
    },

    async login(req: Request, res: Response, next: NextFunction) {
        try {
            const result = await ProfileService.login(req.body);
            res.json(result);
        } catch (err) {
            next(err);
        }
    },

    async getProfile(req: Request, res: Response, next: NextFunction) {
        try {
            const id = Number(req.params.id);
            const profile = await ProfileService.getProfile(id);
            res.json(profile);
        } catch (err) {
            next(err);
        }
    },

    async updateProfile(req: Request, res: Response, next: NextFunction) {
        try {
            const id = Number(req.params.id);
            const profile = await ProfileService.updateProfile(id, req.body);
            res.json(profile);
        } catch (err) {
            next(err);
        }
    },

    async getInventory(req: Request, res: Response, next: NextFunction) {
        try {
            const id = Number(req.params.id);
            const inventory = await ProfileService.getInventory(id);
            res.json(inventory);
        } catch (err) {
            next(err);
        }
    },

    async getLeaderboard(req: Request, res: Response, next: NextFunction) {
        try {
            const limit = req.query.limit ? Number(req.query.limit) : 10;
            const list = await ProfileService.getLeaderboard(limit);
            res.json(list);
        } catch (err) {
            next(err);
        }
    }
};
