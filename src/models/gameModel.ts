import { Game } from "../../generated/prisma/client";

export interface CreateGameRequest{
    name: string;
    iconUrl?: string;
}

export interface UpdateGameRequest{
    name?: string;
    iconUrl?: string;
    isActive?: boolean;
}

export interface GameResponse extends Game{}

export const toGameResponse = (game: Game): GameResponse => {
    return game;
}