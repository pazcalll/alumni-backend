import { Request as ExpressRequest, Response } from 'express';
import jwt from 'jsonwebtoken';
import { errorResponseJson } from '../utils/helper';

interface Request extends ExpressRequest {
    admin?: any;
}

export const verifyToken = (req: Request, res: Response, next: any) => {
    const bearerHeader = req.headers['authorization'];
    const token = bearerHeader && bearerHeader.split(' ')[1];
    if (!token) return errorResponseJson(res, {}, 'Unauthorized', 401);

    jwt.verify(token || "", process.env.JWT_SECRET || "", (err: any, admin: any) => {
        if (err) return errorResponseJson(res, {}, 'Forbidden', 403);
        req.admin = admin;
        next();
    })
}