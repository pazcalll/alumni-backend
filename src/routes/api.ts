import { register } from '../controllers/user/authentication';
import { registerValidation } from '../requests/user/registration';
import { validate } from '../utils/helper';
import RouteGroup from 'express-route-grouping';
import { loginValidation } from '../requests/login';
import { login as adminLogin } from '../controllers/admin/authentication';
import express, { Request as ExpressRequest, Response } from 'express';
import { verifyToken } from '../middlewares/token-verification';

const root = new RouteGroup();
const user = express.Router();

interface Request extends ExpressRequest {
    model?: any; // Add your model attribute here
}

root.group('/user', route => {
    route.post('/register', registerValidation, validate, register);
});

user.use('/', verifyToken);
user.get('/requests', (req: Request, res: Response) => res.send(req.model));
user.put('/approve-registration', (req: Request, res: Response) => res.send('Approve registration'));
root.group('/admin', route => {
    route.post('/login', loginValidation, validate, adminLogin);
    route.use('/user', user);
});

export default root;