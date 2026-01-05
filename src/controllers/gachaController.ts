import { Request, Response, NextFunction } from "express";
import { AppError } from "../errors/AppError";
import gachaService from "../services/gachaService";
import { ok, fail } from "../utils/response-util";

export async function gachaHandler(req: Request, res: Response, next: NextFunction) {
    try {
        const profileId = Number(req.params.profileId || req.body.profileId);
        const gameId = Number(req.params.gameId || req.body.gameId);
        const rolls = Number(req.body.rolls ?? 1);

        if (!profileId || !gameId) throw new AppError("profileId and gameId are required", 400);
        const result = await gachaService.performGacha(profileId, gameId, rolls);

        if (!result.success) return res.status(400).json(fail(result.message));

        return res.json(
            ok({ results: result.data, rolls, })
        );

    } catch (err) {
        next(err);
    }
}
