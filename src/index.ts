import express, { Request, Response } from 'express';
import apiRouter from './routes/api';
import multer from 'multer';
import { xssProtection } from './utils/helper';

const app = express();
const port = process.env.PORT || 3000;

app.use(express.urlencoded({extended: true}));
app.use(express.json());

app.use('/api', xssProtection, apiRouter.export());

export {app, port};