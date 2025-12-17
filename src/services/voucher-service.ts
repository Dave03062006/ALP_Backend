import { prismaClient } from "../utils/database-util";
import { ResponseError } from "../error/response-error";
import { 
    CreateVoucherRequest,
    PurchaseVoucherRequest,
    GetVouchersByGameQuery,
    VoucherResponse,
    VoucherPurchaseResponse,
    toVoucherResponse,
    toVoucherPurchaseResponse
} from "../models/voucherModel";
import { VoucherValidation } from "../validations/voucher-validation";
import { v4 as uuidv4 } from "uuid";

export class VoucherService {
    static async create(request: CreateVoucherRequest): Promise<VoucherResponse> {
        const createRequest = VoucherValidation.CREATE.parse(request);

        // Verify game exists
        const game = await prismaClient.game.findUnique({
            where: { id: createRequest.gameId }
        });

        if (!game) {
            throw new ResponseError(404, "Game not found");
        }

        const voucher = await prismaClient.voucher.create({
            data: createRequest
        });

        return toVoucherResponse(voucher);
    }

    static async purchase(profileId: number, request: PurchaseVoucherRequest): Promise<VoucherPurchaseResponse> {
        const purchaseRequest = VoucherValidation.PURCHASE.parse(request);

        // Get voucher
        const voucher = await prismaClient.voucher.findUnique({
            where: { id: purchaseRequest.voucherId }
        });

        if (!voucher || !voucher.isActive) {
            throw new ResponseError(404, "Voucher not found or inactive");
        }

        // Check stock
        if (voucher.stock !== -1 && voucher.stock <= 0) {
            throw new ResponseError(400, "Voucher out of stock");
        }

        // Check if profile has enough points
        const profile = await prismaClient.profile.findUnique({
            where: { id: profileId }
        });

        if (!profile) {
            throw new ResponseError(404, "Profile not found");
        }

        if (profile.points < voucher.pointsCost) {
            throw new ResponseError(400, "Insufficient points");
        }

        // Generate voucher code
        const voucherCode = this.generateVoucherCode();

        // Create purchase in transaction
        const purchase = await prismaClient.$transaction(async (tx) => {
            // Deduct points
            await tx.profile.update({
                where: { id: profileId },
                data: { points: { decrement: voucher.pointsCost } }
            });

            // Decrease stock if not unlimited
            if (voucher.stock !== -1) {
                await tx.voucher.update({
                    where: { id: voucher.id },
                    data: { stock: { decrement: 1 } }
                });
            }

            // Create purchase record
            const newPurchase = await tx.voucherPurchase.create({
                data: {
                    profileId,
                    voucherId: voucher.id,
                    pointsSpent: voucher.pointsCost,
                    voucherCode
                }
            });

            return newPurchase;
        });

        return toVoucherPurchaseResponse(purchase);
    }

    private static generateVoucherCode(): string {
        return `VC-${uuidv4().substring(0, 8).toUpperCase()}`;
    }

    static async getByGame(query: GetVouchersByGameQuery): Promise<VoucherResponse[]> {
        const validatedQuery = VoucherValidation.GET_BY_GAME.parse(query);

        const vouchers = await prismaClient.voucher.findMany({
            where: {
                gameId: validatedQuery.gameId,
                isActive: true,
                OR: [
                    { stock: { gt: 0 } },
                    { stock: -1 }
                ]
            },
            orderBy: { pointsCost: 'asc' }
        });

        return vouchers.map(toVoucherResponse);
    }

    static async getPurchaseHistory(profileId: number): Promise<VoucherPurchaseResponse[]> {
        const purchases = await prismaClient.voucherPurchase.findMany({
            where: { profileId },
            include: {
                voucher: {
                    include: { game: true }
                }
            },
            orderBy: { purchasedAt: 'desc' }
        });

        return purchases.map(toVoucherPurchaseResponse);
    }

    static async getById(voucherId: number): Promise<VoucherResponse> {
        const voucher = await prismaClient.voucher.findUnique({
            where: { id: voucherId },
            include: { game: true }
        });

        if (!voucher) {
            throw new ResponseError(404, "Voucher not found");
        }

        return toVoucherResponse(voucher);
    }

    static async markAsUsed(purchaseId: number): Promise<VoucherPurchaseResponse> {
        const purchase = await prismaClient.voucherPurchase.findUnique({
            where: { id: purchaseId }
        });

        if (!purchase) {
            throw new ResponseError(404, "Purchase not found");
        }

        if (purchase.isUsed) {
            throw new ResponseError(400, "Voucher already used");
        }

        const updatedPurchase = await prismaClient.voucherPurchase.update({
            where: { id: purchaseId },
            data: { isUsed: true }
        });

        return toVoucherPurchaseResponse(updatedPurchase);
    }
}