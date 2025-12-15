import { Request, Response, NextFunction } from "express";
import { EventService } from "../services/event-service";

export const EventController = {
    async create(req: Request, res: Response, next: NextFunction) {
        try {
            const ev = await EventService.create(req.body);
            res.status(201).json(ev);
        } catch (err) {
            next(err);
        }
    },

    async update(req: Request, res: Response, next: NextFunction) {
        try {
            const id = Number(req.params.id);
            const ev = await EventService.update(id, req.body);
            res.json(ev);
        } catch (err) {
            next(err);
        }
    },

    async getById(req: Request, res: Response, next: NextFunction) {
        try {
            const id = Number(req.params.id);
            const ev = await EventService.getById(id);
            res.json(ev);
        } catch (err) {
            next(err);
        }
    },

    async getByGame(req: Request, res: Response, next: NextFunction) {
        try {
            const gameId = Number(req.params.gameId);
            const activeOnly = req.query.activeOnly === 'true';
            const list = await EventService.getByGame(gameId, activeOnly);
            res.json(list);
        } catch (err) {
            next(err);
        }
    },

    async delete(req: Request, res: Response, next: NextFunction) {
        try {
            const id = Number(req.params.id);
            await EventService.delete(id);
            res.status(204).send();
        } catch (err) {
            next(err);
        }
    }
};
