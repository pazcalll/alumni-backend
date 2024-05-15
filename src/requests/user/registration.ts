import { body, validationResult } from "express-validator";
import { Prisma, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const registerValidation = [
    body('email')
        .isEmail().withMessage("Must be email")
        .notEmpty().withMessage("Must not be empty")
        .custom(async (value) => {
            return await prisma.user.findFirst({ where: {email: value} })
               .then((data) => {
                    return data ? Promise.reject('Email already taken') : Promise.resolve()
               })
         }),

    body('password')
        .isLength({ min: 5, max: 16 }).withMessage('Must be between 5-16 characters')
        .notEmpty().withMessage("Must not be empty"),

    body('passwordConfirmation')
        .custom((value, { req }) => {
            if (value !== req.body.password) {
                throw new Error('Password confirmation does not match password');
            }
            return true;
        })
        .notEmpty().withMessage("Must not be empty"),

    body('name')
        .notEmpty().withMessage("Must not be empty"),

    body('mobile')
        .notEmpty().withMessage("Must not be empty")
        .isNumeric().withMessage("Must be numeric")
        .isLength({ min: 10, max: 16 }).withMessage('At least 10 characters'),

    body('address')
        .notEmpty().withMessage("Must not be empty"),

    body('graduationDate')
        .notEmpty().withMessage("Must not be empty")
        .isDate().withMessage("Must be date"),

    body('lat')
        .isNumeric().withMessage("Must be numeric")
        .notEmpty().withMessage("Must not be empty"),

    body('long')
        .isNumeric().withMessage("Must be numeric")
        .notEmpty().withMessage("Must not be empty"),
]