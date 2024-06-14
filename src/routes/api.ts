import { login as userLogin, register, forgotPassword, resetPassword } from '../controllers/user/authentication';
import { registerValidation } from '../requests/user/registration';
import { validate } from '../utils/helper';
import RouteGroup from 'express-route-grouping';
import { loginValidation } from '../requests/login';
import { login as adminLogin, profile } from '../controllers/admin/authentication';
import { verifyToken } from '../middlewares/token-verification';
import { approveRegistration, registrationRequests, rejectRegistration } from '../controllers/admin/user';
import { forgotPasswordValidation as userForgotPasswordValidation } from '../requests/user/forgot-password';
import { resetPasswordValidation } from '../requests/user/reset-password';
import { updateProfileValidation } from '../requests/user/update-profile';
import { approvedUsers } from '../middlewares/verified-users';
import { isAdmin } from '../middlewares/is-admin';
import multer from 'multer';
import { getProfile, updateProfile } from '../controllers/user/user';
import { userList } from '../controllers/authenticated';

const root = new RouteGroup();
const upload = multer();
const formData = upload.any();

root.group('/authenticated', route => {
    route.use('/', verifyToken);
    route.get('/user/list', userList);
})

root.group('/user', route => {
    route.post('/registration', formData, registerValidation, validate, register);
    route.post('/login', loginValidation, validate, userLogin);
    route.post('/forgot-password', userForgotPasswordValidation, validate, forgotPassword);
    route.post('/reset-password', resetPasswordValidation, validate, resetPassword);

    route.group('/profile', userRoute => {
        userRoute.use('/', approvedUsers);
        userRoute.get('/', getProfile)
        userRoute.put('/update', formData, updateProfileValidation, validate, updateProfile);
    })
});

root.group('/admin', adminRoute => {
    adminRoute.post('/login', loginValidation, validate, adminLogin);
    adminRoute.get('/profile', verifyToken, isAdmin, profile);

    adminRoute.group('/user', adminUserRoute => {
        adminUserRoute.use('/', verifyToken, isAdmin);
        adminUserRoute.get('/user-list', userList);
        adminUserRoute.get('/requests', registrationRequests);
        adminUserRoute.put('/approve-user-registration/:id?', approveRegistration);
        adminUserRoute.delete('/reject-user-registration/:id?', rejectRegistration);
    })
});

export default root;