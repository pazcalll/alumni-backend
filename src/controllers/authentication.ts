import { Request, Response } from "express";
import { hashPassword } from "../utils/helper";

export const register = (req: Request, res: Response) => {
    const { email, password } = req.body;
    const hashedPassword = hashPassword(password);

    res.send('Register route');
}