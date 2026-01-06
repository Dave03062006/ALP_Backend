import { Request, Response, NextFunction } from "express";
import { GameService } from "../services/game-service";

export const GameController = {
    async create(req: Request, res: Response, next: NextFunction) {
        try {
            const game = await GameService.create(req.body);
            res.status(201).json(game);
        } catch (err) {
            next(err);
        }
    },

    async update(req: Request, res: Response, next: NextFunction) {
        try {
            const id = Number(req.params.id);
            const game = await GameService.update(id, req.body);
            res.json(game);
        } catch (err) {
            next(err);
        }
    },

    async getById(req: Request, res: Response, next: NextFunction) {
        try {
            const id = Number(req.params.id);
            const game = await GameService.getById(id);
            res.json(game);
        } catch (err) {
            next(err);
        }
    },

    async getAll(req: Request, res: Response, next: NextFunction) {
        try {
            const activeOnly = req.query.activeOnly === 'true';
            const games = await GameService.getAll(activeOnly);
            res.json(games);
        } catch (err) {
            next(err);
        }
    },

    async delete(req: Request, res: Response, next: NextFunction) {
        try {
            const id = Number(req.params.id);
            await GameService.delete(id);
            res.status(204).send();
        } catch (err) {
            next(err);
        }
    }
};
