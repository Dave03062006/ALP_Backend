import { GachaPool, GachaHistory, Item } from "../../generated/prisma";

export interface CreateGachaPoolRequest{
    gameId: number;
    name: string;
    costPerRoll: number;
}

export interface RollGachaRequest{
    gameId: number;
    rolls?: number;
}

export interface AddItemToGachaPoolRequest{
    gachaPoolId: number;
    itemId: number;
    dropRate: number;
}

export interface GachaPoolResponse extends GachaPool{}

export interface GachaHistoryResponse extends GachaHistory{}

export interface GachaRollResult{
    items: Item[];
    totalPointsSpent: number;
}

export const toGachaPoolResponse = (gachaPool: GachaPool): GachaPoolResponse => {
    return gachaPool;
}

export const toGachaHistoryResponse = (history: GachaHistory): GachaHistoryResponse => {
    return history;
}

export const toGachaRollResult = (items: Item[], totalPointsSpent: number): GachaRollResult => {
    return {
        items,
        totalPointsSpent
    };
}