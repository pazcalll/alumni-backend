import { PrismaClient } from "@prisma/client";
import { body } from "express-validator";

const prisma = new PrismaClient();

export const resetPasswordValidation = [
    body('token')
        .notEmpty().withMessage("Must not be empty")
        .custom(async (value) => {
            return await prisma.resetPasswordToken.findFirst({ where: {token: value} })
                .then((data) => {
                    return data ? Promise.resolve() : Promise.reject('Token not found')
               })
        }),
    body('email')
        .isEmail().withMessage("Must be email")
        .notEmpty().withMessage("Must not be empty")
        .custom(async (value) => {
            const user = await prisma.user.findFirst({ where: {email: value} })
            if (!user) return Promise.reject('Email not found')

            const token = await prisma.resetPasswordToken.findFirst({
                where: {
                    model_id: user.id,
                    model: 'users'
                }
            })
            if (!token) return Promise.reject('Token not found')
        }),
    body('password')
        .notEmpty().withMessage("Must not be empty")
        .isLength({ min: 6 }).withMessage("Password must be at least 6 characters"),
    body('password_confirmation')
        .notEmpty().withMessage("Must not be empty")
        .isLength({ min: 6 }).withMessage("Password must be at least 6 characters")
        .custom((value, { req }) => {
            if (value !== req.body.password) {
                throw new Error('Password confirmation does not match password');
            }
            return true;
        }),
];