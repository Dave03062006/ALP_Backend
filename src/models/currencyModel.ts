import { CurrencyRate } from "../../generated/prisma";

export interface CreateCurrencyRateRequest{
    gameId: number;
    currencyName: string;
    toIDR: number;
}

export interface UpdateCurrencyRateRequest{
    toIDR?: number;
    isActive?: boolean;
}

export interface ConvertCurrencyRequest{
    gameId: number;
    currencyName: string;
    amount: number;
}

export interface CurrencyRateResponse extends CurrencyRate{}

export interface ConversionResult{
    gameId: number;
    currencyName: string;
    amount: number;
    idrValue: number;
}

export const toCurrencyRateResponse = (currencyRate: CurrencyRate): CurrencyRateResponse => {
    return currencyRate;
}

export const toConversionResult = (gameId: number, currencyName: string, amount: number, rate: number): ConversionResult => {
    return {
        gameId,
        currencyName,
        amount,
        idrValue: amount * rate
    };
}

