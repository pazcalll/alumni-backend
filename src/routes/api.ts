import express, { Request, Response } from 'express';
import { register } from '../controllers/authentication';
import { registerValidation } from '../requests/registration';
import { validate } from '../utils/helper';

const app = express()

app.post('/register', registerValidation, validate, register)
app.get('/', (req: Request, res: Response) => res.send('Hello, TypeScript Express!'))

export default app;