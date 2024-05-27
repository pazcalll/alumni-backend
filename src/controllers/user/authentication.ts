import { Request, Response } from "express";
import { dataResponseJson, errorResponseJson, generateRandomString, hashPassword, keyToCamelCase } from "../../utils/helper";
import { PrismaClient, User } from '@prisma/client'
import * as bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { userFields } from "../../utils/model-fields";
import { transporter } from "../../utils/mail";
import fs from 'fs';
import path from 'path';
import 'dotenv/config';
import { userUpdateable } from "../../utils/model-updateable-fields";

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

interface RegisterRequest extends Request {
    files?: any;
}
export const register = async (req: RegisterRequest, res: Response) => {
    const {
        name,
        email,
        password,
        graduation_year,
        address,
        mobile,
        lat,
        long
    } = req.body;

    const userImage = req.files[0];
    const filename = userImage.fieldname + '-' + Date.now() + '.' + userImage.mimetype.split('/')[1];
    fs.writeFileSync(`storage/${filename}`, userImage.buffer);

    const hashedPassword = await hashPassword(password);
    const user = await prisma.user.create({
        data: {
            name: name,
            email: email,
            password: hashedPassword,
            userDetail: {
                create: {
                    image_url: filename,
                    graduation_year: Number(graduation_year),
                    address: address,
                    mobile: mobile,
                    lat: lat,
                    long: long
                }
            }
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

    let token = generateRandomString(10);

    const isTokenExist = await prisma.resetPasswordToken.findFirst({
        where: {
            model: 'users',
            model_id: user.id
        }
    })

    if (!isTokenExist) {
        await prisma.resetPasswordToken.create({
            data: {
                token: token,
                model: 'users',
                model_id: user.id
            }
        });
    } else {
        token = generateRandomString(10);
        let updateable = await prisma.resetPasswordToken.findFirst({
            where: {
                model: 'users',
                model_id: user.id
            }
        })
        if (!updateable) return errorResponseJson(res, [], 'Data not found', 400);

        await prisma.resetPasswordToken.update({
            where: {
                id: Number(updateable.id)
            },
            data: {
                token: token
            }
        });
    }

    let emailString = fs.readFileSync(path.resolve(__dirname, '../../mails/forgot-password.html'), 'utf8')
        .replace(':link', `${process.env.APP_URL_FRONTEND}/reset-password?token=${token}`)
        .replace(':token', token);

    const mailData = {
        from: process.env.MAIL_FROM_ADDRESS,
        to: user.email,
        subject: String(process.env.APP_NAME)+' | Reset Password Link',
        html:  emailString,
    };
    transporter.sendMail(mailData).catch((err) => console.log('error', err))

    // Send email with reset password link
    return dataResponseJson(res, {}, "Reset password link sent to your email");
}

export const resetPassword = async (req: Request, res: Response) => {
    const { token, email, password } = req.body;
    const user = await prisma.user.findFirst({
        where: {
            email: email
        },
    })
    if (!user) return errorResponseJson(res, [], 'Data not found', 400);

    const resetToken = await prisma.resetPasswordToken.findFirst({
        where: {
            token: token,
            model: 'users',
            model_id: user.id
        }
    })

    if (!resetToken) return errorResponseJson(res, [], 'Token not found', 400);

    const hashedPassword = await hashPassword(password);
    await prisma.user.update({
        where: {
            email: email
        },
        data: {
            password: hashedPassword
        }
    });

    await prisma.resetPasswordToken.delete({
        where: {
            id: resetToken.id
        }
    })

    return dataResponseJson(res, {}, "Password reset successfully");
}

export const updateProfile = async (req: any, res: Response) => {
    const {
        name,
        password,
        graduation_year,
        address,
        mobile,
        lat,
        long
    } = req.body;

    const user = req.user;

    const userImage = req.files[0];
    const filename = userImage.fieldname + '-' + Date.now() + '.' + userImage.mimetype.split('/')[1];
    fs.writeFileSync(`storage/${filename}`, userImage.buffer);

    let updateData: userUpdateable = {
        name: name,
        userDetail: {
            update: {
                graduation_year: Number(graduation_year),
                address: address,
                mobile: mobile,
                lat: lat,
                long: long,
                image_url:filename
            }
        }
    }

    if (password) {
        const hashedPassword = await hashPassword(password);
        updateData.password = hashedPassword;
    }

    const update = await prisma.user.update({
        where: {
            id: user.id
        },
        data: updateData
    });

    return dataResponseJson(res, {}, "User updated successfully");
}