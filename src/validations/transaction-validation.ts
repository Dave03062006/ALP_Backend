import { z } from 'zod';

export class TransactionValidation {
    static readonly CREATE = z.object({
        gameId: z.number().int().positive("Game ID must be a positive integer"),
        eventId: z.number().int().positive("Event ID must be a positive integer").optional(),
        transactionTypeId: z.number().int().positive("Transaction type ID must be a positive integer"),
        amount: z.number().positive("Amount must be a positive number")
    });

    static readonly GET_HISTORY = z.object({
        gameId: z.number().int().positive("Game ID must be a positive integer").optional(),
        startDate: z.string().datetime("Invalid date format").optional(),
        endDate: z.string().datetime("Invalid date format").optional(),
        limit: z.number().int().positive("Limit must be a positive integer").optional(),
        offset: z.number().int().min(0, "Offset must be non-negative").optional()
    });
}
