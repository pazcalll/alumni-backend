import { loginValidation } from "../../requests/login";
import { validate } from "../../utils/helper";
import { login as adminLogin } from '../../controllers/admin/authentication';
import express, { Request, Response } from 'express';

const adminRouter = express.Router();

adminRouter.post('/login', loginValidation, validate, adminLogin);
adminRouter.put('/approve-registration', (req: Request, res: Response) => res.send('Approve registration'));

export default adminRouter;