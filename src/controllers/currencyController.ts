import { Request, Response, NextFunction } from "express";
import { prismaClient } from "../utils/database-util";
import { ConvertCurrencyRequest, toConversionResult } from "../models/currencyModel";

export class CurrencyController {

    // 1. Menghitung Konversi (POST /currency/convert)
    static async convert(req: Request, res: Response, next: NextFunction) {
        try {
            const request: ConvertCurrencyRequest = req.body;
            
            // Cari rate aktif untuk game tersebut
            const rate = await prismaClient.currencyRate.findFirst({
                where: {
                    gameId: request.gameId,
                    currencyName: request.currencyName,
                    isActive: true
                }
            });

            if (!rate) {
                // Jika rate tidak ada, kembalikan 0 atau error
                throw new Error("Currency rate not found");
            }

            // Hitung pakai helper yang sudah ada di model
            const result = toConversionResult(
                request.gameId,
                request.currencyName,
                request.amount,
                rate.toIDR
            );

            res.status(200).json({
                data: result
            });
        } catch (e) {
            next(e);
        }
    }

    // 2. Ambil List Rate (GET /currency-rates?gameId=1)
    static async getRates(req: Request, res: Response, next: NextFunction) {
        try {
            const gameId = Number(req.query.gameId);

            const rates = await prismaClient.currencyRate.findMany({
                where: {
                    gameId: gameId,
                    isActive: true
                }
            });

            res.status(200).json({
                data: rates
            });
        } catch (e) {
            next(e);
        }
    }
}