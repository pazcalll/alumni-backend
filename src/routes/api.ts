import express, { Request, Response } from 'express';
import { register } from '../controllers/user/authentication';
import { registerValidation } from '../requests/user/registration';
import { validate } from '../utils/helper';
import adminRouter from './admin/index';

const apiRouter = express.Router();

apiRouter.post('/register', registerValidation, validate, register)
apiRouter.use('/admin', adminRouter)

export default apiRouter;