import { z } from 'zod';

export class EventValidation {
    static readonly CREATE = z.object({
        gameId: z.number().int().positive("Game ID must be a positive integer"),
        eventName: z.string().min(1, "Event name is required").max(100, "Event name must be at most 100 characters")
    });

    static readonly UPDATE = z.object({
        eventName: z.string().min(1, "Event name cannot be empty").max(100, "Event name must be at most 100 characters").optional(),
        isActive: z.boolean().optional()
    });
}
