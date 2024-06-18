import jwt from 'jsonwebtoken';
import 'dotenv/config';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const isAdmin = async (req: any, res: any, next: any) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    console.log(authHeader, token)

    if (token == null) return res.sendStatus(401);

    const secret = process.env.JWT_SECRET;
    if (!secret) {
        return res.status(500).send('Server error: JWT_SECRET is not set.');
    }

    jwt.verify(token, secret, async (err: any, user: any) => {
        if (err) return res.sendStatus(403);

        const admin = await prisma.admin.findFirst({
            where: {
                id: user.id,
                email: user.email
            }
        })

        // Check if the user is an admin
        if (!admin) return res.sendStatus(403);

        req.user = user;
        next();
    });
}