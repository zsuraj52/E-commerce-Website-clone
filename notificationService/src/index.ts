import morgan from 'morgan';
import express from 'express';
import Redis from 'ioredis';
import dotenv from 'dotenv';
dotenv.config();
import logger from './logger/logger';
import { banner } from './logger/banner';
import router from './router';


export const subClient = new Redis({
    host: 'localhost',
    port: 6379,
    password: "test"
});

const app = express();
const port = process.env.port || 3001;
app.use(express.json());
app.use('/notification', router);
app.use(morgan(function (tokens, req, res) {
    return [
        tokens.method(req, res),
        tokens.url(req, res),
        tokens.status(req, res),
        tokens['response-time'](req, res), 'ms',
    ].join(' ')
}));

app.listen(port, () => {
    banner(logger);
});
