import { register } from '../controllers/user/authentication';
import { registerValidation } from '../requests/user/registration';
import { validate } from '../utils/helper';
import RouteGroup from 'express-route-grouping';
import { loginValidation } from '../requests/login';
import { login as adminLogin } from '../controllers/admin/authentication';
import { Request, Response } from 'express';

const root = new RouteGroup();

root.group('/admin', route => {
    route.post('/login', loginValidation, validate, adminLogin);
    route.post('/register', registerValidation, validate, register);
    route.group('/user', user => {
        user.get('/requests', (req: Request, res: Response) => res.send('Registration requests'));
        user.put('/approve-registration', (req: Request, res: Response) => res.send('Approve registration'));
    });
});

export default root;