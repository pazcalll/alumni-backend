import { Request as ExpressRequest, Response } from 'express';
import jwt from 'jsonwebtoken';
import { errorResponseJson } from '../utils/helper';

interface Request extends ExpressRequest {
    model?: any;
}

export const verifyToken = (req: Request, res: Response, next: any) => {
    const bearerHeader = req.headers.authorization;
    const token = bearerHeader && bearerHeader.split(' ')[1];
    console.log(token, bearerHeader)
    if (!token) return errorResponseJson(res, {}, 'Unauthorized', 401);

    jwt.verify(token || "", process.env.JWT_SECRET || "", (err: any, model: any) => {
        if (err) return errorResponseJson(res, err, 'Forbidden', 403);
        req.model = model;
        next();
    })
}