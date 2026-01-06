import { z } from 'zod';

export class GachaValidation {
    static readonly CREATE_POOL = z.object({
        gameId: z.number().int().positive("Game ID must be a positive integer"),
        name: z.string().min(1, "Pool name is required").max(100, "Pool name must be at most 100 characters"),
        costPerRoll: z.number().int().positive("Cost per roll must be a positive integer")
    });

    static readonly ROLL = z.object({
        gameId: z.number().int().positive("Game ID must be a positive integer"),
        rolls: z.number().int().positive("Number of rolls must be a positive integer").max(100, "Maximum 100 rolls at a time").optional()
    });

    static readonly ADD_ITEM = z.object({
        gachaPoolId: z.number().int().positive("Gacha pool ID must be a positive integer"),
        itemId: z.number().int().positive("Item ID must be a positive integer"),
        dropRate: z.number().min(0, "Drop rate must be non-negative").max(100, "Drop rate cannot exceed 100")
    });
}
