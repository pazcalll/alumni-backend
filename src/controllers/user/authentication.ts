import { Request, Response } from "express";
import { hashPassword } from "../../utils/helper";
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient();

export const register = async (req: Request, res: Response) => {
    const { name, email, password } = req.body;
    const hashedPassword = await hashPassword(password);
    const user = await prisma.user.create({
        data: {
            name: name,
            email: email,
            password: hashedPassword
        }
    })

    res.send(user);
}