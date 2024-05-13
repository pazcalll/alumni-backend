import { loginValidation } from "../../requests/login";
import { validate } from "../../utils/helper";
import { login as adminLogin } from '../../controllers/admin/authentication';
import express, { Request, Response } from 'express';

const adminRouter = express.Router();

adminRouter.get('/requests', (req: Request, res: Response) => res.send('Registration requests'));
adminRouter.put('/approve-registration', (req: Request, res: Response) => res.send('Approve registration'));

export default adminRouter;