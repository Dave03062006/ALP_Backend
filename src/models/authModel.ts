import { Profile } from "../../generated/prisma/client";

export interface RegisterRequest {
    username: string;
    email: string;
    password: string;
    displayName?: string;
}

export interface LoginRequest {
    username: string;
    password: string;
}

export interface AuthResponse {
    profile: {
        id: number;
        username: string;
        email: string | null;
        displayName: string | null;
        points: number;
        totalSpent: number;
        achievementCount: number;
    };
    token: string;
    message: string;
}

export const toAuthResponse = (profile: Profile, token: string): AuthResponse => {
    return {
        profile: {
            id: profile.id,
            username: profile.username,
            email: profile.email,
            displayName: profile.displayName,
            points: profile.points,
            totalSpent: profile.totalSpent,
            achievementCount: profile.achievementCount
        },
        token,
        message: "Authentication successful"
    };
};

