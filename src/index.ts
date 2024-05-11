import express, { Request, Response } from 'express';
import api from './routes/api';
import multer from 'multer';

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
app.use('/api', api);

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});;