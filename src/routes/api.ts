import { login as userLogin, register, forgotPassword, resetPassword, updateProfile } from '../controllers/user/authentication';
import { registerValidation } from '../requests/user/registration';
import { validate } from '../utils/helper';
import RouteGroup from 'express-route-grouping';
import { loginValidation } from '../requests/login';
import { login as adminLogin } from '../controllers/admin/authentication';
import { verifyToken } from '../middlewares/token-verification';
import { approveRegistration, registrationRequests } from '../controllers/admin/user';
import { forgotPasswordValidation as userForgotPasswordValidation } from '../requests/user/forgot-password';
import { resetPasswordValidation } from '../requests/user/reset-password';
import { updateProfileValidation } from '../requests/user/update-profile';
import { approvedUsers } from '../middlewares/verified-users';

const root = new RouteGroup();

root.group('/user', route => {
    route.post('/registration', registerValidation, validate, register);
    route.post('/login', loginValidation, validate, userLogin);
    route.post('/forgot-password', userForgotPasswordValidation, validate, forgotPassword);
    route.post('/reset-password', resetPasswordValidation, validate, resetPassword);

    route.group('/', userRoute => {
        userRoute.use('/', approvedUsers);
        userRoute.put('/update', updateProfileValidation, validate, updateProfile);
    })
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