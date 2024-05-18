import { PrismaClient } from "@prisma/client";
import { body } from "express-validator";

const prisma = new PrismaClient();

export const forgotPasswordValidation = [
    body('email')
        .isEmail().withMessage("Must be email")
        .notEmpty().withMessage("Must not be empty")
        .custom(async (value) => {
            return await prisma.user.findFirst({ where: {email: value} })
                .then((data) => {
                    return data ? Promise.resolve() : Promise.reject('Email not found')
               })
        }),
]