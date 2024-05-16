import { Request, Response } from "express";
import { dataResponseJson, hashPassword } from "../../utils/helper";
import { PrismaClient } from '@prisma/client'
import { userFields } from "../../utils/model-fields";
import * as bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

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
    });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return dataResponseJson(res, {}, "Invalid credentials", 400);

    const { password: _, ...userWithoutPassword } = user;

    const accessToken = jwt.sign(user, process.env.JWT_SECRET || "", { expiresIn: 3600 });
    const data = {
        ...userWithoutPassword,
        token: {
            "expires_in": 3600,
            "access_token": accessToken
        }
    }

    dataResponseJson(res, data, "User registered successfully");
}