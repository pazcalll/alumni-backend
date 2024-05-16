import { Request, Response } from "express";
import { dataResponseJson, errorResponseJson } from "../../utils/helper";
import { PrismaClient } from '@prisma/client'
import * as bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient();

export const login = async (req: Request, res: Response) => {
    const { email, password } = req.body;
    const admin = await prisma.admin.findFirst({
        where: {
            email: email
        }
    })
    if (!admin) return errorResponseJson(res, [], 'Data not found', 400);

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) return errorResponseJson(res, [], 'Invalid credentials', 400);

    const { password: _, ...adminWithoutPassword } = admin;

    const accessToken = jwt.sign(admin, process.env.JWT_SECRET || "", { expiresIn: 3600 });
    const data = {
        ...adminWithoutPassword,
        token: {
            "expires_in": 3600,
            "access_token": accessToken
        }
    }

    return dataResponseJson(res, data, "Login successful", 200);
}