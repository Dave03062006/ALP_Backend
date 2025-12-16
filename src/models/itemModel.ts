`    import { Item } from "../../generated/prisma";

    export interface CreateItemRequest{
        itemName: string;
        rarity: string;
        imageUrl?: string;
        isMilestone?: boolean;
    }

    export interface ItemResponse extends Item{}

    export const toItemResponse = (item: Item): ItemResponse => {
        return item;
    }`