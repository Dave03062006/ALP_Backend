import { prismaClient } from "../utils/database-util";
import { ResponseError } from "../error/response-error";
import { 
    CreateGameRequest, 
    UpdateGameRequest, 
    GameResponse, 
    toGameResponse 
} from "../models/gameModel";
import { GameValidation } from "../validations/game-validation";

export class GameService {
    static async create(request: CreateGameRequest): Promise<GameResponse> {
        const createRequest = GameValidation.CREATE.parse(request);

        // Check if game name already exists
        const existingGame = await prismaClient.game.findUnique({
            where: { name: createRequest.name }
        });

        if (existingGame) {
            throw new ResponseError(400, "Game with this name already exists");
        }

        const game = await prismaClient.game.create({
            data: createRequest
        });

        return toGameResponse(game);
    }

    static async update(gameId: number, request: UpdateGameRequest): Promise<GameResponse> {
        const updateRequest = GameValidation.UPDATE.parse(request);

        // Check if game exists
        const existingGame = await prismaClient.game.findUnique({
            where: { id: gameId }
        });

        if (!existingGame) {
            throw new ResponseError(404, "Game not found");
        }

        // If updating name, check if new name already exists
        if (updateRequest.name && updateRequest.name !== existingGame.name) {
            const gameWithName = await prismaClient.game.findUnique({
                where: { name: updateRequest.name }
            });

            if (gameWithName) {
                throw new ResponseError(400, "Game with this name already exists");
            }
        }

        const updatedGame = await prismaClient.game.update({
            where: { id: gameId },
            data: updateRequest
        });

        return toGameResponse(updatedGame);
    }

    static async getById(gameId: number): Promise<GameResponse> {
        const game = await prismaClient.game.findUnique({
            where: { id: gameId }
        });

        if (!game) {
            throw new ResponseError(404, "Game not found");
        }

        return toGameResponse(game);
    }

    static async getAll(activeOnly: boolean = false): Promise<GameResponse[]> {
        const games = await prismaClient.game.findMany({
            where: activeOnly ? { isActive: true } : undefined,
            orderBy: { name: 'asc' }
        });

        return games.map(toGameResponse);
    }

    static async delete(gameId: number): Promise<void> {
        const game = await prismaClient.game.findUnique({
            where: { id: gameId }
        });

        if (!game) {
            throw new ResponseError(404, "Game not found");
        }

        await prismaClient.game.delete({
            where: { id: gameId }
        });
    }
}