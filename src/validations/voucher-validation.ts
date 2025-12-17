import { z } from 'zod';

export class VoucherValidation {
    static readonly CREATE = z.object({
        gameId: z.number().int().positive("Game ID must be a positive integer"),
        voucherName: z.string().min(1, "Voucher name is required").max(100, "Voucher name must be at most 100 characters"),
        value: z.number().positive("Value must be a positive number"),
        pointsCost: z.number().int().positive("Points cost must be a positive integer"),
        stock: z.number().int().min(0, "Stock must be non-negative").optional(),
        imageUrl: z.string().url("Invalid URL format").optional()
    });

    static readonly PURCHASE = z.object({
        voucherId: z.number().int().positive("Voucher ID must be a positive integer")
    });

    static readonly GET_BY_GAME = z.object({
        gameId: z.number().int().positive("Game ID must be a positive integer")
    });
}
