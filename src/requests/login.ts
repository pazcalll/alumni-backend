import { body, validationResult } from "express-validator";
import { Prisma, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const loginValidation = [
    body('email')
        .isEmail().withMessage("Must be email")
        .notEmpty().withMessage("Must not be empty"),

    body('password')
        .isLength({ min: 5, max: 16 }).withMessage('Must be between 5-16 characters')
        .notEmpty().withMessage("Must not be empty"),
]