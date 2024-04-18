import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 3000;
app.use(express.json());
app.use(cors(
    {
        origin: process.env.CLIENT_URL,
        credentials: true
    }
));

app.get('/', (req, res) => {
    res.send('Hello World');
}
);


import userRouter from './routes/user.router.js';

app.use('/api', userRouter);


export default app;
