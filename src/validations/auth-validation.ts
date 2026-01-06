import { z } from "zod";

export class AuthValidation {
    static readonly REGISTER = z.object({
        username: z.string().min(3).max(50),
        email: z.string().email(),
        password: z.string().min(6).max(100),
        displayName: z.string().max(100).optional()
    });

    static readonly LOGIN = z.object({
        username: z.string().min(3).max(50),
        password: z.string().min(6).max(100)
    });
}

