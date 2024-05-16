import { register } from '../controllers/user/authentication';
import { registerValidation } from '../requests/user/registration';
import { validate } from '../utils/helper';
import RouteGroup from 'express-route-grouping';
import { loginValidation } from '../requests/login';
import { login as adminLogin } from '../controllers/admin/authentication';
import { verifyToken } from '../middlewares/token-verification';
import { approveRegistration, registrationRequests } from '../controllers/admin/user';

const root = new RouteGroup();

root.group('/user', route => {
    route.post('/registration', registerValidation, validate, register);
});

root.group('/admin', adminRoute => {
    adminRoute.post('/login', loginValidation, validate, adminLogin);

    adminRoute.group('/user', adminUserRoute => {
        adminUserRoute.use('/', verifyToken);
        adminUserRoute.get('/requests', registrationRequests);
        adminUserRoute.put('/approve-user-registration/:id?', approveRegistration);
    })
});

export default root;