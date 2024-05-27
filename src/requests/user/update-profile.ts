import { body, validationResult } from "express-validator";
import { Prisma, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const updateProfileValidation = [
    // body('email')
    //     .isEmail().withMessage("Must be email")
    //     .notEmpty().withMessage("Must not be empty")
    //     .custom(async (value) => {
    //         return await prisma.user.findFirst({ where: { email: value } })
    //             .then((data) => {
    //                 return data ? Promise.reject('Email already taken') : Promise.resolve()
    //             })
    //     })
    //     .optional(),

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
        .notEmpty().withMessage("Must not be empty")
        .isLength({ min: 5, max: 255 }).withMessage('minimum 5 characters, maximum 255 characters'),

    body('mobile')
        // .isNumeric().withMessage("Must be numeric")
        .isLength({ min: 10, max: 16 }).withMessage('At least 10 characters')
        .notEmpty().withMessage("Must not be empty"),

    body('address')
        .notEmpty().withMessage("Must not be empty")
        .isLength({ min: 5, max: 255 }).withMessage('minimum 5 characters, maximum 255 characters'),

    body('graduation_year')
        .notEmpty().withMessage("Must not be empty")
        .isNumeric().withMessage("Must be numeric")
        .custom((value) => {
            let now = new Date();
            if (value > now.getFullYear()) {
                throw new Error('Graduation year must be less than '+now.getFullYear());
            }
            return true;
        }),

    body('lat')
        .isNumeric().withMessage("Must be numeric")
        .notEmpty().withMessage("Must not be empty"),

    body('long')
        .isNumeric().withMessage("Must be numeric")
        .notEmpty().withMessage("Must not be empty"),
]