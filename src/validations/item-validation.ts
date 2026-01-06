import { z } from 'zod';

export class ItemValidation {
    static readonly CREATE = z.object({
        itemName: z.string().min(1, "Item name is required").max(100, "Item name must be at most 100 characters"),
        rarity: z.string().min(1, "Rarity is required").max(50, "Rarity must be at most 50 characters"),
        imageUrl: z.string().url("Invalid URL format").optional(),
        isMilestone: z.boolean().optional()
    });
}
