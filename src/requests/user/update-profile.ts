import { body, validationResult } from "express-validator";
import { Prisma, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const updateProfileValidation = [
    body('email')
        .isEmail().withMessage("Must be email")
        .notEmpty().withMessage("Must not be empty")
        .custom(async (value) => {
            return await prisma.user.findFirst({ where: { email: value } })
                .then((data) => {
                    return data ? Promise.reject('Email already taken') : Promise.resolve()
                })
        })
        .optional(),

    body('password')
        .isLength({ min: 5, max: 16 }).withMessage('Must be between 5-16 characters')
        .optional(),

    body('password_confirmation')
        .optional()
        .custom((value, { req }) => {
            if (value !== req.body.password) {
                throw new Error('Password confirmation does not match password');
            }
            return true;
        }),

    body('name')
        .optional(),

    body('mobile')
        .isNumeric().withMessage("Must be numeric")
        .isLength({ min: 10, max: 16 }).withMessage('At least 10 characters')
        .optional(),

    body('address')
        .optional(),

    body('major_id')
        .isNumeric().withMessage("Must be numeric")
        .custom(async (value) => {
            if (Number.isNaN(Number(value))) return Promise.reject('Major not found')
            return await prisma.major.findFirst({ where: { id: Number(value) } })
                .then((data) => {
                    return data ? Promise.resolve() : Promise.reject('Major not found')
                })
        })
        .optional(),

    body('graduation_date')
        .isDate().withMessage("Must be date")
        .optional(),

    body('lat')
        .isNumeric().withMessage("Must be numeric")
        .optional(),

    body('long')
        .isNumeric().withMessage("Must be numeric")
        .optional(),
]