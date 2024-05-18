import { Request, Response } from "express";
import { dataResponseJson, errorResponseJson, hashPassword } from "../../utils/helper";
import { PrismaClient } from '@prisma/client'
import * as bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { userFields } from "../../utils/model-fields";
import { transporter } from "../../utils/mail";
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();

export const login = async (req: Request, res: Response) => {
    const { email, password } = req.body;
    const user = await prisma.user.findFirst({
        where: {
            email: email
        }
    })
    if (!user) return errorResponseJson(res, [], 'Data not found', 400);

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return errorResponseJson(res, [], 'Invalid credentials', 400);

    const { password: _, ...userWithoutPassword } = user;

    const accessToken = jwt.sign(user, process.env.JWT_SECRET || "", { expiresIn: 3600 });
    const data = {
        ...userWithoutPassword,
        token: {
            "expires_in": 3600,
            "access_token": accessToken
        }
    }

    return dataResponseJson(res, data, "Login successful", 200);
}

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

export const forgotPassword = async (req: Request, res: Response) => {
    const { email } = req.body;
    const user = await prisma.user.findFirst({
        where: {
            email: email
        },
        ...userFields
    })
    if (!user) return errorResponseJson(res, [], 'Data not found', 400);

    let emailString = fs.readFileSync(path.resolve(__dirname, '../../mails/forgot-password.html'), 'utf8')
        .replace(':link', `${process.env.APP_URL_FRONTEND}/reset-password?token=${user.id}`)

    const mailData = {
        from: process.env.MAIL_FROM_ADDRESS,
        to: user.email,
        subject: 'Reset Password Link',
        html:  emailString,
    };
    transporter.sendMail(mailData).catch((err) => console.log('error', err))

    // Send email with reset password link
    return dataResponseJson(res, {}, "Reset password link sent to your email");
}