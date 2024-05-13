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
	if (!errors.isEmpty()) return errorResponseArray(res, errors.array(), "Validation error");

	next();
}

export const errorResponseArray = (
	res: Response,
	data: Array<any> = [],
	message: string = "",
	status: number = 400
): Response => {
	return res.status(status).json({
		message: message,
		errors: data
	});
}

export const errorResponseJson = (
	res: Response,
	data: any = {},
	message: string = "",
	status: number = 400
): Response => {
	return res.status(status).json({
		message: message,
		error: data
	});
}

export const dataResponseArray = (
	res: Response,
	data: Array<any> = [],
	message: string = "",
	status: number = 200
): Response => {
	return res.status(status).json({
		message: message,
		data: data
	});
}

export const dataResponseJson = (
	res: Response,
	data: any = {},
	message: string = "",
	status: number = 200
): Response => {
	return res.status(status).json({
		message: message,
		data: data
	});
}

export const prettyEndpoints = (endpoints: any) => {
	console.log('Available endpoints:');
	endpoints.forEach((route: any) => {
		console.log(`  ${route.methods.join(', ')}\t${route.path}`);
	});
}