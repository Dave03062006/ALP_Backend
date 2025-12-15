import { prismaClient } from "../utils/database-util";
import { ResponseError } from "../error/response-error";
import { 
    CreateEventRequest, 
    UpdateEventRequest, 
    EventResponse, 
    toEventResponse 
} from "../models/eventModel";
import { EventValidation } from "../validations/event-validation";

export class EventService {
    static async create(request: CreateEventRequest): Promise<EventResponse> {
        const createRequest = EventValidation.CREATE.parse(request);

        // Verify game exists
        const game = await prismaClient.game.findUnique({
            where: { id: createRequest.gameId }
        });

        if (!game) {
            throw new ResponseError(404, "Game not found");
        }

        const event = await prismaClient.event.create({
            data: createRequest
        });

        return toEventResponse(event);
    }

    static async update(eventId: number, request: UpdateEventRequest): Promise<EventResponse> {
        const updateRequest = EventValidation.UPDATE.parse(request);

        const existingEvent = await prismaClient.event.findUnique({
            where: { id: eventId }
        });

        if (!existingEvent) {
            throw new ResponseError(404, "Event not found");
        }

        const updatedEvent = await prismaClient.event.update({
            where: { id: eventId },
            data: updateRequest
        });

        return toEventResponse(updatedEvent);
    }

    static async getById(eventId: number): Promise<EventResponse> {
        const event = await prismaClient.event.findUnique({
            where: { id: eventId },
            include: { game: true }
        });

        if (!event) {
            throw new ResponseError(404, "Event not found");
        }

        return toEventResponse(event);
    }

    static async getByGame(gameId: number, activeOnly: boolean = false): Promise<EventResponse[]> {
        const events = await prismaClient.event.findMany({
            where: {
                gameId,
                ...(activeOnly ? { isActive: true } : {})
            },
            orderBy: { eventName: 'asc' }
        });

        return events.map(toEventResponse);
    }

    static async delete(eventId: number): Promise<void> {
        const event = await prismaClient.event.findUnique({
            where: { id: eventId }
        });

        if (!event) {
            throw new ResponseError(404, "Event not found");
        }

        await prismaClient.event.delete({
            where: { id: eventId }
        });
    }
}