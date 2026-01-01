import { prismaClient as prisma } from "../utils/database-util";
import { ResponseError } from "../error/response-error";

export interface CreateTransactionRequest {
    gameId: number;
    eventId?: number;
    transactionTypeId: number;
    amount: number;
}

export interface TransactionHistoryQuery {
    gameId?: number;
    startDate?: string;
    endDate?: string;
    limit?: number;
    offset?: number;
}

export const TransactionService = {
    async create(profileId: number, request: CreateTransactionRequest) {
        // Validate profile exists
        const profile = await prisma.profile.findUnique({
            where: { id: profileId }
        });

        if (!profile) {
            throw new ResponseError(404, "Profile not found");
        }

        // Validate game exists
        const game = await prisma.game.findUnique({
            where: { id: request.gameId }
        });

        if (!game) {
            throw new ResponseError(404, "Game not found");
        }

        // Validate transaction type exists
        const transactionType = await prisma.transactionType.findUnique({
            where: { id: request.transactionTypeId }
        });

        if (!transactionType) {
            throw new ResponseError(404, "Transaction type not found");
        }

        // Validate event if provided
        if (request.eventId) {
            const event = await prisma.event.findUnique({
                where: { id: request.eventId }
            });

            if (!event) {
                throw new ResponseError(404, "Event not found");
            }
        }

        // Calculate points earned
        const pointsEarned = Math.floor(request.amount * transactionType.pointsMultiplier);

        // Create transaction and update profile in a transaction
        const transaction = await prisma.$transaction(async (tx) => {
            // Create the transaction
            const newTransaction = await tx.transaction.create({
                data: {
                    profileId,
                    gameId: request.gameId,
                    eventId: request.eventId,
                    transactionTypeId: request.transactionTypeId,
                    amount: request.amount,
                    pointsEarned
                },
                include: {
                    game: true,
                    event: true,
                    transactionType: true
                }
            });

            // Update profile points and total spent
            await tx.profile.update({
                where: { id: profileId },
                data: {
                    points: { increment: pointsEarned },
                    totalSpent: { increment: request.amount }
                }
            });

            return newTransaction;
        });

        return transaction;
    },

    async getHistory(profileId: number, query: TransactionHistoryQuery) {
        // Validate profile exists
        const profile = await prisma.profile.findUnique({
            where: { id: profileId }
        });

        if (!profile) {
            throw new ResponseError(404, "Profile not found");
        }

        const where: any = { profileId };

        if (query.gameId) {
            where.gameId = query.gameId;
        }

        if (query.startDate || query.endDate) {
            where.purchaseDate = {};
            if (query.startDate) {
                where.purchaseDate.gte = new Date(query.startDate);
            }
            if (query.endDate) {
                where.purchaseDate.lte = new Date(query.endDate);
            }
        }

        const transactions = await prisma.transaction.findMany({
            where,
            include: {
                game: true,
                event: true,
                transactionType: true
            },
            orderBy: { purchaseDate: 'desc' },
            take: query.limit || 50,
            skip: query.offset || 0
        });

        return transactions;
    },

    async getStatistics(profileId: number, gameId?: number) {
        // Validate profile exists
        const profile = await prisma.profile.findUnique({
            where: { id: profileId }
        });

        if (!profile) {
            throw new ResponseError(404, "Profile not found");
        }

        const where: any = { profileId };
        if (gameId) {
            where.gameId = gameId;
        }

        const [totalTransactions, totalSpent, totalPointsEarned] = await Promise.all([
            prisma.transaction.count({ where }),
            prisma.transaction.aggregate({
                where,
                _sum: { amount: true }
            }),
            prisma.transaction.aggregate({
                where,
                _sum: { pointsEarned: true }
            })
        ]);

        return {
            totalTransactions,
            totalSpent: totalSpent._sum.amount || 0,
            totalPointsEarned: totalPointsEarned._sum.pointsEarned || 0,
            currentPoints: profile.points
        };
    }
};
