import express, { Request, Response } from 'express';
import apiRouter from './routes/api';
import multer from 'multer';

const app = express();
const port = process.env.PORT || 3000;
const upload = multer();

app.use(express.urlencoded({extended: true}));
app.use(upload.any());
app.use(express.json());

app.use('/api', apiRouter.export());

export {app, port};