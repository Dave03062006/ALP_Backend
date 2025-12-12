import { Profile } from '../../generated/prisma/client';

export interface RegisterProfileReqest{
    username: string;
    email?: string;
    password: string;
    displayName?: string;
}

export interface LoginProfileRequest{
    username: string;
    password: string;
}

export interface UpdateProfileRequest{
    displayName?: string;
    profilePictureId?: number;
}

export interface ProfileResponse extends Omit<Profile, 'password'>{}

export const toProfileResponse = (profile: Profile): ProfileResponse => {
    const { password, ...rest } = profile;
    return rest;
}