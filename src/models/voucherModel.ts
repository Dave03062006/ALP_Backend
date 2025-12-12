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

export interface VoucherPurchaseResponse extends VoucherPurchase{}

export const toVoucherResponse = (voucher: Voucher): VoucherResponse => {
    return voucher;
}

export const toVoucherPurchaseResponse = (purchase: VoucherPurchase): VoucherPurchaseResponse => {
    return purchase;
}   