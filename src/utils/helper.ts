import * as bcrypt from 'bcrypt';
import { NextFunction, Request, Response } from 'express';
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

export const dataResponsePagination = (
	res: Response,
	data: Array<any> = [],
	page: number | null | any = 1,
	limit: number | null | any = 10,
	message: string = "",
): Response => {
	const defaultPage = 1; // Default page
	const defaultTake = 10; // Default limit

	if (page === null || typeof page != 'number') page = defaultPage;
	if (limit === null || typeof limit != 'number') limit = defaultTake;

	return res.json({
		message: message,
		data: data,
		page: page,
		limit: limit
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
	data: object = {},
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

export const prismaPagination = (page: number | null | any = 1, take: number | null | any = 10): object => {
	const defaultPage = 1; // Default page
	const defaultTake = 10; // Default limit

	const actualPage = (page === null || typeof page != 'number') ? defaultPage : page;
	const actualTake = (take === null || typeof take != 'number') ? defaultTake : take;

	return {
		skip: (actualPage - 1) * actualTake,
		take: actualTake
	}
}

export const xssProtection = (req: Request, res: Response, next: NextFunction) => {
	const escapeHTML = (unsafeText: string | undefined): string | undefined => {
		if (!unsafeText) {
			return unsafeText;
		}

		return unsafeText
			.replace(/&/g, "&amp;")
			.replace(/</g, "&lt;")
			.replace(/>/g, "&gt;")
			.replace(/"/g, "&quot;")
			.replace(/'/g, "&#039;");
	}

	for (let queryParam in req.query) {
		if (typeof req.query[queryParam] === 'string') {
			req.query[queryParam] = escapeHTML(String(req.query[queryParam]));
		}
	}

	for (let bodyField in req.body) {
		if (typeof req.body[bodyField] === 'string') {
			req.body[bodyField] = escapeHTML(String(req.body[bodyField]));
		}
	}

	next();
}