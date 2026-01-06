import { prismaClient } from "../utils/database-util";
import { ResponseError } from "../error/response-error";
import { 
    RegisterProfileReqest, 
    LoginProfileRequest, 
    UpdateProfileRequest, 
    ProfileResponse, 
    GameSpendingLeaderboard,
    toProfileResponse 
} from "../models/profileModel";
import { ProfileValidation } from "../validations/profile-validation";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { JWT_SECRET_KEY } from "../utils/env-util";

export class ProfileService {
    static async register(request: RegisterProfileReqest): Promise<ProfileResponse> {
        const registerRequest = ProfileValidation.REGISTER.parse(request);

        // Check if username already exists
        const existingUsername = await prismaClient.profile.findUnique({
            where: { username: registerRequest.username }
        });

        if (existingUsername) {
            throw new ResponseError(400, "Username already exists");
        }

        // Check if email already exists (if provided)
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
                displayName: registerRequest.displayName || registerRequest.username
            }
        });

        return toProfileResponse(profile);
    }

    static async login(request: LoginProfileRequest): Promise<{ profile: ProfileResponse; token: string }> {
        const loginRequest = ProfileValidation.LOGIN.parse(request);

        // Find user by username
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
        if (!JWT_SECRET_KEY) {
            throw new ResponseError(500, "JWT secret key not configured");
        }

        const token = jwt.sign(
            { id: profile.id, username: profile.username },
            JWT_SECRET_KEY,
            { expiresIn: "7d" }
        );

        return {
            profile: toProfileResponse(profile),
            token
        };
    }

    static async getProfile(profileId: number): Promise<ProfileResponse> {
        const profile = await prismaClient.profile.findUnique({
            where: { id: profileId },
            include: {
                profilePicture: true
            }
        });

        if (!profile) {
            throw new ResponseError(404, "Profile not found");
        }

        return toProfileResponse(profile);
    }

    static async updateProfile(profileId: number, request: UpdateProfileRequest): Promise<ProfileResponse> {
        const updateRequest = ProfileValidation.UPDATE.parse(request);

        // Check if profile exists
        const existingProfile = await prismaClient.profile.findUnique({
            where: { id: profileId }
        });

        if (!existingProfile) {
            throw new ResponseError(404, "Profile not found");
        }

        // If updating profile picture, verify item exists
        if (updateRequest.profilePictureId) {
            const item = await prismaClient.item.findUnique({
                where: { id: updateRequest.profilePictureId }
            });

            if (!item) {
                throw new ResponseError(404, "Profile picture item not found");
            }
        }

        // Update profile
        const updatedProfile = await prismaClient.profile.update({
            where: { id: profileId },
            data: updateRequest
        });

        return toProfileResponse(updatedProfile);
    }

    static async getInventory(profileId: number): Promise<any[]> {
        const inventory = await prismaClient.profileItem.findMany({
            where: { profileId },
            include: {
                item: true
            },
            orderBy: {
                acquiredAt: 'desc'
            }
        });

        return inventory;
    }

    static async getGamesLeaderboard(profileId: number, limit: number = 10): Promise<GameSpendingLeaderboard[]> {
        // Verify profile exists
        const profile = await prismaClient.profile.findUnique({
            where: { id: profileId }
        });

        if (!profile) {
            throw new ResponseError(404, "Profile not found");
        }

        // Aggregate spending by game
        const gameStats = await prismaClient.transaction.groupBy({
            by: ['gameId'],
            where: {
                profileId: profileId
            },
            _sum: {
                amount: true,
                pointsEarned: true
            },
            _count: {
                id: true
            },
            orderBy: {
                _sum: {
                    amount: 'desc'
                }
            },
            take: limit
        });

        // Fetch game details for each game
        const leaderboard: GameSpendingLeaderboard[] = await Promise.all(
            gameStats.map(async (stat) => {
                const game = await prismaClient.game.findUnique({
                    where: { id: stat.gameId }
                });

                return {
                    gameId: stat.gameId,
                    gameName: game?.name || 'Unknown Game',
                    gameIconUrl: game?.iconUrl || undefined,
                    totalSpent: stat._sum.amount || 0,
                    transactionCount: stat._count.id,
                    pointsEarned: stat._sum.pointsEarned || 0
                };
            })
        );

        return leaderboard;
    }
}