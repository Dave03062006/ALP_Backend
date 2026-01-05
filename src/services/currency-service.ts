import { prismaClient as prisma } from "../utils/database-util";
import { 
    ConvertCurrencyRequest, 
    ConversionResult, 
    toConversionResult 
} from "../models/currencyModel";
import { ResponseError } from "../error/response-error";

export const calculateCurrency = async (request: ConvertCurrencyRequest): Promise<ConversionResult> => {
    
    const rateData = await prisma.currencyRate.findFirst({
        where: {
            gameId: request.gameId,
            currencyName: request.currencyName,
            isActive: true 
        }
    });

    if (!rateData) {
        throw new ResponseError(404, `Currency rate not found for Game ID ${request.gameId} (${request.currencyName})`);
    }

    return toConversionResult(
        request.gameId,
        request.currencyName,
        request.amount,
        rateData.toIDR
    );
};