import { NextFunction, Request as ExpressRequest, Response } from "express";
import { errorResponseJson } from "../utils/helper";
import jwt from 'jsonwebtoken';
import { PrismaClient } from "@prisma/client";

interface Request extends ExpressRequest {
    user?: any;
}


export const approvedUsers = (req: Request, res: Response, next: NextFunction) => {
    const bearerHeader = req.body.headers.authorization;
    const token = bearerHeader && bearerHeader.split(' ')[1];
    if (!token) return errorResponseJson(res, {}, 'Unauthorized', 401);

    const prisma = new PrismaClient();

    jwt.verify(token || "", process.env.JWT_SECRET || "", async (err: any, payload: any) => {
        if (err) return errorResponseJson(res, err, 'Forbidden', 403);

        // Get the user from the database
        const user = await prisma.user.findFirst({ where: { id: payload.id } });

        if (!user) {
            return errorResponseJson(res, {}, 'User not found', 404);
        } else if (!user.approved_at) return errorResponseJson(res, {}, 'User registration is not approved yet', 403);

        // Attach the user to the req object
        req.user = user;

        next();
    })
}