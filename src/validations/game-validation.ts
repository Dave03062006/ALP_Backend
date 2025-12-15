import { z } from 'zod';

export class GameValidation {
    static readonly CREATE = z.object({
        name: z.string().min(1, "Game name is required").max(100, "Game name must be at most 100 characters"),
        iconUrl: z.string().url("Invalid URL format").optional()
    });

    static readonly UPDATE = z.object({
        name: z.string().min(1, "Game name cannot be empty").max(100, "Game name must be at most 100 characters").optional(),
        iconUrl: z.string().url("Invalid URL format").optional(),
        isActive: z.boolean().optional()
    });
}
