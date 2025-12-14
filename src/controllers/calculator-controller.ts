import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { 
    ConvertCurrencyRequest, 
    toConversionResult 
} from '../models/currencyModel';

const prisma = new PrismaClient();

export const getCalculatorPageData = async (req: Request, res: Response) => {
    try {
        const games = await prisma.game.findMany({
            where: { isActive: true },
            select: { id: true, name: true, iconUrl: true }
        });

        const vouchers = await prisma.voucher.findMany({
            where: { isActive: true },
            take: 5
        });

        res.status(200).json({
            success: true,
            data: { games, vouchers }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error fetching data" });
    }
};

export const calculatePrice = async (req: Request, res: Response) => {
    try {
        const requestData: ConvertCurrencyRequest = req.body;

        const rate = await prisma.currencyRate.findFirst({
            where: {
                gameId: requestData.gameId,
                currencyName: requestData.currencyName
            }
        });

        if (!rate) {
            return res.status(404).json({ success: false, message: "Rate not found" });
        }

        const result = toConversionResult(
            requestData.gameId,
            requestData.currencyName,
            requestData.amount,
            rate.toIDR
        );

        res.status(200).json({ success: true, data: result });

    } catch (error) {
        res.status(500).json({ success: false, message: "Calculation error" });
    }
};