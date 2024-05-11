import * as bcrypt from 'bcrypt';

export const hashPassword = async (password: string) => {
	const saltRounds = 10;
	return await bcrypt.genSalt(saltRounds)
		.then((salt) => {
			return bcrypt.hash(password, salt)
		});
};