import { loginValidation } from "../../requests/login";
import { validate } from "../../utils/helper";
import { login as adminLogin } from '../../controllers/admin/authentication';
import express, { Request, Response } from 'express';
import user from './user';

const adminRouter = express.Router();

adminRouter.post('/login', loginValidation, validate, adminLogin);
adminRouter.use('/registration', user)

export default adminRouter;