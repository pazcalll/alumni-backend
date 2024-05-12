import { Request, Response } from "express";
import { hashPassword } from "../../utils/helper";
import { PrismaClient } from '@prisma/client'
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

export const login = async (req: Request, res: Response) => {
    const { email, password } = req.body;
    const admin = await prisma.admin.findFirst({
        where: {
            email: email
        }
    })

    if (!admin) {
        return res.status(404).json({ message: 'User not found' });
    }

    const isMatch = await bcrypt.compare(password, admin.password);

    if (!isMatch) {
        return res.status(400).json({ message: 'Invalid credentials' });
    }

    res.send(admin);
}