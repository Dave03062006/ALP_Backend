import { Event } from "../../generated/prisma";

export interface CreateEventRequest{
    gameId: number;
    eventName: string;
}

export interface UpdateEventRequest{
    eventName?: string;
    isActive?: boolean;
}

export interface EventResponse extends Event{}

export const toEventResponse = (event: Event): EventResponse => {
    return event;
}