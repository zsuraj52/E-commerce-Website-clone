import morgan from 'morgan';
import express from 'express';
import Redis from 'ioredis';
import dotenv from 'dotenv';
dotenv.config();
import { AppDataSource } from "./data-source"
import { banner } from './logger/banner';
import logger from './logger/logger';
import router from './router';


export const productClient = new Redis({
    host: 'localhost',
    port: 6379,
    password: "test"
});
const app = express();
app.use(express.json({limit: '50mb'}));
app.use('/product', router);
const port = process.env.port || 3002;
app.use(morgan(function (tokens, req, res) {
    return [
        tokens.method(req, res),
        tokens.url(req, res),
        tokens.status(req, res),
        tokens['response-time'](req, res), 'ms',
    ].join(' ')
}));
AppDataSource.initialize().then(async () => {
    app.listen(port, () => {
        banner(logger);
    })
}).catch(error => console.log(error))
