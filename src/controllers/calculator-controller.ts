import { Request, Response, NextFunction } from "express";
import { prismaClient } from "../utils/database-util";

export const getCalculatorData = async (req: Request, res: Response, next: NextFunction) => {
    // ... Masukkan logic ambil data game & rate di sini ...
};