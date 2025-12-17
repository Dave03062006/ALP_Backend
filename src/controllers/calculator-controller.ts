import { Request, Response, NextFunction } from "express";
import { prismaClient } from "../utils/database-util";

export const getCalculatorData = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const games = await prismaClient.game.findMany({
            where: { isActive: true },
            include: {
                currencyRates: {
                    where: { isActive: true }
                }
            }
        });

        const responseData = games.map((game) => {
            const rate = game.currencyRates[0];
            return {
                id: game.id,
                name: game.name,
                iconUrl: game.iconUrl,
                currency: rate?.currencyName || "Currency",
                pricePerUnit: rate?.toIDR || 0,
                standardBundles: [100, 500, 1000, 2000, 5000]
            };
        });

        res.status(200).json({ data: responseData });
    } catch (e) {
        next(e);
    }
};