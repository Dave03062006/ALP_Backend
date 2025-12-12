import { Transaction  } from "../../generated/prisma";

export interface CreateTransactionRequest{
    gameId: number;
    eventId?: number;
    transactionTypeId: number;
    amount: number;
}

export interface GetTransactionHistoryQuery{
    gameId?: number;
    startDate?: string;
    endDate?: string;
    limit?:number;
    offset?:number;
}

export interface TransactionResponse extends Transaction{}

export const toTransactionResponse = (transaction: Transaction): TransactionResponse => {
    return transaction;
}