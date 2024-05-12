import * as bcrypt from 'bcrypt';
import { Request, Response } from 'express';
import { validationResult } from 'express-validator';

export const hashPassword = async (password: string) => {
	const saltRounds = 10;
	return await bcrypt.genSalt(saltRounds)
		.then((salt) => {
			return bcrypt.hash(password, salt)
		});
};

export const validate = (req: Request, res: Response, next: any) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) return errorResponse(res, errors.array(), "Validation error");

	next();
}

export const errorResponse = (
	res: Response,
	data: Array<any> = [],
	message: string = "",
	status: number = 400
): Response => {
	return res.status(status).json({ message, errors: data });
}