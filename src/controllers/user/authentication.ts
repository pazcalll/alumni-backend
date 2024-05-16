import { Request, Response } from "express";
import { dataResponseJson, hashPassword } from "../../utils/helper";
import { PrismaClient } from '@prisma/client'
import { userFields } from "../../utils/model-fields";

const prisma = new PrismaClient();

export const register = async (req: Request, res: Response) => {
    const { name, email, password } = req.body;
    const hashedPassword = await hashPassword(password);
    const user = await prisma.user.create({
        data: {
            name: name,
            email: email,
            password: hashedPassword
        },
        ...userFields
    });

    dataResponseJson(res, user, "User registered successfully");
}