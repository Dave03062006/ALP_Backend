import { prismaClient } from "../utils/database-util";
import { ResponseError } from "../error/response-error";
import { RegisterRequest, LoginRequest, AuthResponse, toAuthResponse } from "../models/authModel";
import { AuthValidation } from "../validations/auth-validation";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "your-super-secret-jwt-key-change-this-in-production";

export class AuthService {
    static async register(request: RegisterRequest): Promise<AuthResponse> {
        const registerRequest = AuthValidation.REGISTER.parse(request);

        // Check if username already exists
        const existingUsername = await prismaClient.profile.findUnique({
            where: { username: registerRequest.username }
        });

        if (existingUsername) {
            throw new ResponseError(400, "Username already exists");
        }

        // Check if email already exists
        if (registerRequest.email) {
            const existingEmail = await prismaClient.profile.findUnique({
                where: { email: registerRequest.email }
            });

            if (existingEmail) {
                throw new ResponseError(400, "Email already exists");
            }
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(registerRequest.password, 10);

        // Create profile
        const profile = await prismaClient.profile.create({
            data: {
                username: registerRequest.username,
                email: registerRequest.email,
                password: hashedPassword,
                displayName: registerRequest.displayName || registerRequest.username,
                points: 0,
                totalSpent: 0,
                achievementCount: 0
            }
        });

        // Generate JWT token
        const token = jwt.sign(
            { profileId: profile.id, username: profile.username },
            JWT_SECRET,
            { expiresIn: "7d" }
        );

        return toAuthResponse(profile, token);
    }

    static async login(request: LoginRequest): Promise<AuthResponse> {
        const loginRequest = AuthValidation.LOGIN.parse(request);

        // Find profile by username
        const profile = await prismaClient.profile.findUnique({
            where: { username: loginRequest.username }
        });

        if (!profile) {
            throw new ResponseError(401, "Invalid username or password");
        }

        // Verify password
        const isPasswordValid = await bcrypt.compare(loginRequest.password, profile.password);

        if (!isPasswordValid) {
            throw new ResponseError(401, "Invalid username or password");
        }

        // Generate JWT token
        const token = jwt.sign(
            { profileId: profile.id, username: profile.username },
            JWT_SECRET,
            { expiresIn: "7d" }
        );

        return toAuthResponse(profile, token);
    }

    static verifyToken(token: string): { profileId: number; username: string } {
        try {
            const decoded = jwt.verify(token, JWT_SECRET) as { profileId: number; username: string };
            return decoded;
        } catch (error) {
            throw new ResponseError(401, "Invalid or expired token");
        }
    }
}

