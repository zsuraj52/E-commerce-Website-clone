import morgan from 'morgan';
import express from 'express';
import Redis from 'ioredis';
import dotenv from 'dotenv';
dotenv.config();
import router from './router';
import logger from './logger/logger';
import { banner } from './logger/banner';
import { AppDataSource } from "./data-source";


export const superAdminClient = new Redis({
    host: 'localhost',
    port: 6379,
    password: "test"
});

export const assetManagerClient = new Redis({
    host: 'localhost',
    port: 6379,
    password: "test"
});
const app = express();
app.use(express.json({limit: '50mb'}));
app.use('/admin', router);
const port = process.env.port || 3000;
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
