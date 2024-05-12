import express, { Request, Response } from 'express';
import { register } from '../controllers/user/authentication';
import { registerValidation } from '../requests/user/registration';
import { validate } from '../utils/helper';
import { loginValidation } from '../requests/login';
import { login as adminLogin } from '../controllers/admin/authentication';

const app = express()
const adminRoute = express()

app.post('/register', registerValidation, validate, register)
app.get('/', (req: Request, res: Response) => res.send('Hello, TypeScript Express!'))

adminRoute.get('/login', loginValidation, validate, adminLogin);
app.use('/admin', adminRoute);

export default app;