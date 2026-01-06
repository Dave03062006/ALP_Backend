import { Voucher, VoucherPurchase } from "../../generated/prisma";

export interface CreateVoucherRequest{
    gameId: number;
    voucherName: string;
    value: number;
    pointsCost: number;
    stock?: number;
    imageUrl?: string;
}

export interface PurchaseVoucherRequest{
    voucherId: number;
}

export interface GetVouchersByGameQuery{
    gameId: number;
}

export interface VoucherResponse extends Voucher{}

export interface VoucherPurchaseResponse {
    purchaseId: number;
    voucherId: number;
    profileId: number;
    voucherName: string;
    voucherValue: number;
    pointsSpent: number;
    code: string | null;
    isUsed: boolean;
    purchasedAt: Date | string;
}

export const toVoucherResponse = (voucher: Voucher): VoucherResponse => {
    return voucher;
}

export const toVoucherPurchaseResponse = (purchase: any): VoucherPurchaseResponse => {
    return {
        purchaseId: purchase.id,
        voucherId: purchase.voucherId,
        profileId: purchase.profileId,
        voucherName: purchase.voucher?.voucherName || 'Unknown Voucher',
        voucherValue: purchase.voucher?.value || 0,
        pointsSpent: purchase.pointsSpent,
        code: purchase.voucherCode,
        isUsed: purchase.isUsed,
        purchasedAt: purchase.purchasedAt
    };
}
