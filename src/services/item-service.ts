import { prismaClient } from "../utils/database-util";
import { ResponseError } from "../error/response-error";
import { 
    CreateItemRequest, 
    ItemResponse, 
    toItemResponse 
} from "../models/itemModel";
import { ItemValidation } from "../validations/item-validation";

export class ItemService {
    static async create(request: CreateItemRequest): Promise<ItemResponse> {
        const createRequest = ItemValidation.CREATE.parse(request);

        const item = await prismaClient.item.create({
            data: createRequest
        });

        return toItemResponse(item);
    }

    static async getById(itemId: number): Promise<ItemResponse> {
        const item = await prismaClient.item.findUnique({
            where: { id: itemId }
        });

        if (!item) {
            throw new ResponseError(404, "Item not found");
        }

        return toItemResponse(item);
    }

    static async getAll(rarity?: string, milestoneOnly?: boolean): Promise<ItemResponse[]> {
        const whereClause: any = {};

        if (rarity) {
            whereClause.rarity = rarity;
        }

        if (milestoneOnly !== undefined) {
            whereClause.isMilestone = milestoneOnly;
        }

        const items = await prismaClient.item.findMany({
            where: whereClause,
            orderBy: { itemName: 'asc' }
        });

        return items.map(toItemResponse);
    }

    static async delete(itemId: number): Promise<void> {
        const item = await prismaClient.item.findUnique({
            where: { id: itemId }
        });

        if (!item) {
            throw new ResponseError(404, "Item not found");
        }

        await prismaClient.item.delete({
            where: { id: itemId }
        });
    }
}