import { Request, Response, NextFunction } from "express";
import { prismaClient } from "../utils/database-util";

export const calculatePrice = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { gameId, currencyName, amount } = req.body;

        const rate = await prismaClient.currencyRate.findFirst({
            where: {
                gameId: Number(gameId),
                currencyName: String(currencyName),
                isActive: true
            }
        });

        if (!rate) {
            res.status(404).json({ errors: "Currency rate not found" });
            return;
        }

        const idrValue = amount * rate.toIDR;

        res.status(200).json({
            data: {
                gameId,
                currencyName,
                amount,
                idrValue
            }
        });
    } catch (e) {
        next(e);
    }
};