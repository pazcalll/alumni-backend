import express, { Request, Response } from 'express';
import apiRouter from './routes/api';
import multer from 'multer';
import expressListEndpoints from 'express-list-endpoints';

const app = express();
const port = process.env.PORT || 3000;
const upload = multer();

app.use(express.urlencoded({extended: true}));
app.use(upload.any());
app.use(express.json());

app.post('/testing', function (req: Request, res: Response) { return res.send('POST request to the homepage') });
app.get('/', (req: Request, res: Response) => {
    res.send('Hello, TypeScript Express!');
});
app.use('/api', apiRouter);

app.get('/end-points', (req, res) => res.send(expressListEndpoints(app)))

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});