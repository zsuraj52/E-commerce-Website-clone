import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();
import { Cart } from '../entity/cart';
import { NextFunction, Request, Response } from 'express';
import logger from '../logger/logger';
import { getCustomerByEmailRepo } from '../repository/customer.repo';
import { removeCarts } from '../repository/cart.repo';
import moment from 'moment';


export const creatJWTToken = async (customer: any) => {
    return jwt.sign({ customer }, String(process.env.ENCRYPTION_KEY), { expiresIn: '1d' })

}

export const verifyCustomerToken = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const token: any = req.header("Authorization")?.replace("Bearer ", "");
        // logger.info(`🚀 ~ file: jwt.ts:15 ~ verifyAdminToken ~ token: ${token}`)
        if (!token) {
            throw new Error("Token Not Found!")
        }
        const customer: any = await <any>jwt.verify(token, String(process.env.ENCRYPTION_KEY));
        // logger.info(`🚀 ~ file: jwt.ts:14 ~ verifyCustomerToken ~ customer: ${JSON.stringify(customer)}`)
        const CustomerData = await getCustomerByEmailRepo(customer.email);
        // logger.info(`🚀 ~ file: jwt.ts:17 ~ verifyCustomerToken ~ CustomerData: ${JSON.stringify(CustomerData)}`)
        if (CustomerData === null) {
            throw new Error('No Customer Found , Please Authenticate Yourself First! ');
        }
        logger.info('Customer Validation SuccessFully');
        next();
    } catch (error: any) {
        logger.error("🚀 ~ file: jwt.ts:12 ~ verifyCustomerToken ~ error:", error)
        res.status(401).send({ "Status": "FAILED", "Response": error.message });
    }
}


export const cartCleanupJob = async () => {
    try {
        // console.log("Started deleting carts......... ");
        const now: any = moment().format();
        const CART_EXPIRATION_DURATION = moment().add('30', 'days').format();
        return await removeCarts(now, CART_EXPIRATION_DURATION).then(() => {
            return 'Cart data removed for being inactive for 30 days.'
        })
    } catch (error) {
        console.error('Error cleaning up expired carts:', error);
    }
};
