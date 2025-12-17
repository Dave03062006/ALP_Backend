import { Request, Response, NextFunction } from "express";
import { ItemService } from "../services/item-service";

export const ItemController = {
    async create(req: Request, res: Response, next: NextFunction) {
        try {
            const item = await ItemService.create(req.body);
            res.status(201).json(item);
        } catch (err) {
            next(err);
        }
    },

    async getById(req: Request, res: Response, next: NextFunction) {
        try {
            const id = Number(req.params.id);
            const item = await ItemService.getById(id);
            res.json(item);
        } catch (err) {
            next(err);
        }
    },

    async getAll(req: Request, res: Response, next: NextFunction) {
        try {
            const rarity = req.query.rarity as string | undefined;
            const milestoneOnly = req.query.milestoneOnly !== undefined ? req.query.milestoneOnly === 'true' : undefined;
            const items = await ItemService.getAll(rarity, milestoneOnly);
            res.json(items);
        } catch (err) {
            next(err);
        }
    },

    async delete(req: Request, res: Response, next: NextFunction) {
        try {
            const id = Number(req.params.id);
            await ItemService.delete(id);
            res.status(204).send();
        } catch (err) {
            next(err);
        }
    }
};
