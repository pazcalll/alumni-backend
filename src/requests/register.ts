import { checkSchema } from "express-validator";

export const registerValidation = checkSchema({
    email: {
        errorMessage: 'Please provide a valid email address',
        isEmail: true
    },
    password: {
        isLength: {
            errorMessage: 'Password must between 6-16 characters long',
            options: {
                min: 6,
                max: 16
            }
        }
    }
})