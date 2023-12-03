import winston from "winston";
import dotenv from 'dotenv';
dotenv.config();
import { loggers } from "./appLogger";

let logger:winston.Logger;
if (process.env.NODE_ENV === 'development') {
    logger = loggers;
} else {
    logger = loggers;
}
export default logger;

