import express from 'express';
import morgan from 'morgan';
import { Redis } from "ioredis";
import paypal from 'paypal-rest-sdk';
import dotenv from 'dotenv';
dotenv.config();
import { AppDataSource } from "./data-source";
import router from "./router";
import { banner } from './logger/banner';
import logger from './logger/logger';

export const paymentClient = new Redis({
    host: 'localhost',
    port: 6379,
    password: "test"
});
paypal.configure({
    'mode': 'sandbox',
    'client_id': String(process.env.USERNAME),
    'client_secret': String(process.env.PASSWORD)
});
const app = express();
app.use(express.json());
app.use('/payment',router);

const port = process.env.port || 3004;
app.use(morgan(function (tokens: any, req: any, res: any) {
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
export default paypal;