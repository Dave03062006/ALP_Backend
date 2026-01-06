import { z } from 'zod';

export class CurrencyValidation {
    static readonly CREATE = z.object({
        gameId: z.number().int().positive("Game ID must be a positive integer"),
        currencyName: z.string().min(1, "Currency name is required").max(50, "Currency name must be at most 50 characters"),
        toIDR: z.number().positive("Exchange rate must be a positive number")
    });

    static readonly UPDATE = z.object({
        toIDR: z.number().positive("Exchange rate must be a positive number").optional(),
        isActive: z.boolean().optional()
    });

    static readonly CONVERT = z.object({
        gameId: z.number().int().positive("Game ID must be a positive integer"),
        currencyName: z.string().min(1, "Currency name is required"),
        amount: z.number().positive("Amount must be a positive number")
    });
}
