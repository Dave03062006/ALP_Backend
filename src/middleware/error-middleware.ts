import {Request, Response, NextFunction, ErrorRequestHandler} from "express";
import { ZodError } from "zod";
import { ResponseError } from "../error/response-error";

export const errorMiddleware: ErrorRequestHandler = (
    error: unknown,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    if (error instanceof ZodError) {
        res.status(400).json({
            errors: error.issues,
        });
        return;
    } else if (error instanceof ResponseError) {
        res.status(error.status).json({
            errors: error.message,
        });
        return;
    } else {
        const message = error instanceof Error ? error.message : 'Internal server error';
        res.status(500).json({
            errors: message,
        });
        return;
    }
};