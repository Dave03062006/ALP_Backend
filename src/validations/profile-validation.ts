import { z } from 'zod';

export class ProfileValidation {
    static readonly REGISTER = z.object({
        username: z.string().min(3, "Username must be at least 3 characters").max(50, "Username must be at most 50 characters"),
        email: z.string().email("Invalid email format").optional(),
        password: z.string().min(8, "Password must be at least 8 characters"),
        displayName: z.string().max(100, "Display name must be at most 100 characters").optional()
    });

    static readonly LOGIN = z.object({
        username: z.string().min(1, "Username is required"),
        password: z.string().min(1, "Password is required")
    });

    static readonly UPDATE = z.object({
        displayName: z.string().max(100, "Display name must be at most 100 characters").optional(),
        profilePictureId: z.number().int().positive("Profile picture ID must be a positive integer").optional()
    });
}

