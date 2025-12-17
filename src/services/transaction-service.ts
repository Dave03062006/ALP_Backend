import { prismaClient } from "../utils/database-util";
import { ResponseError } from "../error/response-error";
import { 
    CreateTransactionRequest, 
    GetTransactionHistoryQuery, 
    TransactionResponse, 
    toTransactionResponse 
} from "../models/transactionModel";
import { TransactionValidation } from "../validations/transaction-validation";

export class TransactionService {
    static async create(profileId: number, request: CreateTransactionRequest): Promise<TransactionResponse> {
        const createRequest = TransactionValidation.CREATE.parse(request);

        // Verify game exists
        const game = await prismaClient.game.findUnique({
            where: { id: createRequest.gameId }
        });

        if (!game || !game.isActive) {
            throw new ResponseError(404, "Game not found or inactive");
        }

        // Verify transaction type exists
        const transactionType = await prismaClient.transactionType.findUnique({
            where: { id: createRequest.transactionTypeId }
        });

        if (!transactionType) {
            throw new ResponseError(404, "Transaction type not found");
        }

        // Verify event exists if provided
        if (createRequest.eventId) {
            const event = await prismaClient.event.findUnique({
                where: { id: createRequest.eventId }
            });

            if (!event || !event.isActive) {
                throw new ResponseError(404, "Event not found or inactive");
            }
        }

        // Calculate points earned
        const pointsEarned = Math.floor(createRequest.amount * transactionType.pointsMultiplier);

        // Create transaction and update profile in a transaction
        const transaction = await prismaClient.$transaction(async (tx) => {
            // Create transaction record
            const newTransaction = await tx.transaction.create({
                data: {
                    profileId,
                    gameId: createRequest.gameId,
                    eventId: createRequest.eventId,
                    transactionTypeId: createRequest.transactionTypeId,
                    amount: createRequest.amount,
                    pointsEarned
                }
            });

            // Update profile points and total spent
            await tx.profile.update({
                where: { id: profileId },
                data: {
                    points: { increment: pointsEarned },
                    totalSpent: { increment: createRequest.amount }
                }
            });

            return newTransaction;
        });

        return toTransactionResponse(transaction);
    }

    static async getHistory(
        profileId: number, 
        query: GetTransactionHistoryQuery
    ): Promise<TransactionResponse[]> {
        const validatedQuery = TransactionValidation.GET_HISTORY.parse(query);

        const whereClause: any = { profileId };

        if (validatedQuery.gameId) {
            whereClause.gameId = validatedQuery.gameId;
        }

        if (validatedQuery.startDate || validatedQuery.endDate) {
            whereClause.purchaseDate = {};
            if (validatedQuery.startDate) {
                whereClause.purchaseDate.gte = new Date(validatedQuery.startDate);
            }
            if (validatedQuery.endDate) {
                whereClause.purchaseDate.lte = new Date(validatedQuery.endDate);
            }
        }

        const transactions = await prismaClient.transaction.findMany({
            where: whereClause,
            orderBy: { purchaseDate: 'desc' },
            take: validatedQuery.limit || 50,
            skip: validatedQuery.offset || 0,
            include: {
                game: true,
                event: true,
                transactionType: true
            }
        });

        return transactions.map(toTransactionResponse);
    }

    static async getStatistics(profileId: number, gameId?: number): Promise<any> {
        const whereClause: any = { profileId };
        if (gameId) {
            whereClause.gameId = gameId;
        }

        const [totalTransactions, totalAmount, totalPoints] = await Promise.all([
            prismaClient.transaction.count({ where: whereClause }),
            prismaClient.transaction.aggregate({
                where: whereClause,
                _sum: { amount: true }
            }),
            prismaClient.transaction.aggregate({
                where: whereClause,
                _sum: { pointsEarned: true }
            })
        ]);

        return {
            totalTransactions,
            totalAmount: totalAmount._sum.amount || 0,
            totalPointsEarned: totalPoints._sum.pointsEarned || 0
        };
    }
}