import morgan from 'morgan';
import express from 'express';
import dotenv from 'dotenv';
dotenv.config();
import schedule from 'node-schedule';

import { Redis } from 'ioredis';
import router from './router';
import { AppDataSource } from "./data-source"
import { banner } from './logger/banner';
import logger from './logger/logger';
import { cartCleanupJob } from './middleware/jwt';

export const customerClient = new Redis({
    host: 'localhost',
    port: 6379,
    password: "test"
});
const app = express();
app.use(express.json());
app.use('/customer',router);
const port = process.env.port || 3003;
app.use(morgan(function (tokens: any, req: any, res: any) {
    return [
        tokens.method(req, res),
        tokens.url(req, res),
        tokens.status(req, res),
        tokens['response-time'](req, res), 'ms',
    ].join(' ')
}));
AppDataSource.initialize().then(async () => {
    schedule.scheduleJob('*/5 * * * * *', cartCleanupJob);
    app.listen(port, () => {
        banner(logger);
    })
}).catch(error => console.log(error))   
