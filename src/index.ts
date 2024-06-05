import express, { Request, Response } from 'express';
import apiRouter from './routes/api';
import { xssProtection } from './utils/helper';
import cors from 'cors';

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.urlencoded({extended: true}));
app.use(express.json());

app.use('/storage', express.static('storage'))
app.use('/api', xssProtection, apiRouter.export());

export {app, port};