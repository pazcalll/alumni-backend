import { Router } from 'express';
import express, { Request, Response } from 'express';
import { register } from '../controllers/authentication';
import { registerValidation } from '../requests/register';
import bodyParser from 'body-parser';

const app = express()

app.post('/register', register)
app.get('/', (req: Request, res: Response) => res.send('Hello, TypeScript Express!'))

export default app;