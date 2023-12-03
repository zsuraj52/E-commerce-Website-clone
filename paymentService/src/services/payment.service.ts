import axios from 'axios';
import qs from 'qs';
import dotenv from 'dotenv';
dotenv.config();
const stripe = require('stripe')(process.env.STRIPE_SECRET);
import { paymentClient } from "../index";
import logger from "../logger/logger";

export const createPaypalPaymentService = async () => {
    try {
        console.log(String(process.env.PAYPAL_CLIENT_ID));
        console.log(String(process.env.PAYPAL_SECRET_ID));

        const message: any = await paymentClient.get('paymentThroughpaypal', (err: any, count: any) => {
            if (err) {
                logger.error("Failed to subscribe: %s", err.message);
                return err;
            }
            else {
                logger.info(`Subscribed successfully! This client is currently subscribed to ${count} channels.`);
                return count;
            }
        })
        const redisProductData = JSON.parse(message);
        logger.info(`🚀 ~ file: payment.service.ts:17 ~ createPaypalPaymentService ~ redisProductData: ${JSON.stringify(redisProductData)}`);

        const access_token = await getPaypalAccessToken();
        logger.info(`🚀 access_token: ${access_token}`);

        return await axios.post(
            'https://api-m.sandbox.paypal.com/v2/checkout/orders',
            {
                intent: 'CAPTURE',
                purchase_units: [
                    {
                        amount: {
                            currency_code: 'USD',
                            value: String(((redisProductData.total) / 82.589949).toFixed(2)),
                        },
                    },
                ]
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${access_token}`
                }
            }
        ).then(async (response) => {
            logger.info(`🚀 ~ file: payment.service.ts:50 ~ createPaypalPaymentService ~ response: ${JSON.stringify(response.data)}`)
            const orderId = response.data.id;
            const approvalUrl = response.data.links.find((link: any) => link.rel === 'approve');

            return {
                paymentId: response.data.id,
                approvalUrl: approvalUrl.href
            };
        }).catch((err) => {
            logger.error(`err `, err);
            throw new Error(err);
        })
    } catch (error) {
        logger.info(`🚀 ~ file: payment.service.ts:70 ~ createPaypalPaymentService ~ error: ${error}`)
        throw (error.message);
    }
}

export const getPaypalAccessToken = async () => {
    const url = 'https://api-m.sandbox.paypal.com/v1/oauth2/token';
    const auth = Buffer.from(`${String(process.env.PAYPAL_CLIENT_ID)}:${String(process.env.PAYPAL_SECRET_ID)}`).toString('base64');
    const formData = qs.stringify({
        grant_type: 'client_credentials'
    });

    try {
        const response = await axios.post(url, formData, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': `Basic ${auth}`
            }
        });
        return response.data.access_token;
    } catch (error) {
        throw new Error('Failed to obtain PayPal access token');
    }
}

export const createStripeCheckoutService = async () => {
    try {
        const message: any = await paymentClient.get('paymentThroughstripe', (err: any, count: any) => {
            if (err) {
                logger.error("Failed to subscribe: %s", err.message);
                return err;
            }
            else {
                logger.info(`Subscribed successfully! This client is currently subscribed to ${count} channels.`);
                return count;
            }
        })
        const redisProductData = JSON.parse(message);
        console.log("🚀 ~ file: payment.service.ts:113 ~ createStripeCheckoutService ~ redisProductData:", redisProductData);
        return await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            customer: redisProductData.stripeId,
            success_url: 'http://localhost:3003/customer/place/order',
            cancel_url: 'http://localhost:3003/customer/failed/payment',
            line_items: [
                { 
                    price_data: { 
                        currency: "inr", 
                        product_data: { 
                        name: 'Checkout', 
                        }, 
                    unit_amount: (redisProductData.total)*100, 
                    }, 
                    quantity: 1 
                }
            ],
            mode: 'payment',
        })

    } catch (error) {
        console.log("🚀 ~ file: payment.service.ts:104 ~ createStripeCheckoutService ~ error:", error)
        throw (error);
    }
}

export const createStripeRefundService = async () => {
    try {
        const message: any = await paymentClient.get('returnPayment', (err: any, count: any) => {
            if (err) {
                logger.error("Failed to subscribe: %s", err.message);
                return err;
            }
            else {
                logger.info(`Subscribed successfully! This client is currently subscribed to ${count} channels.`);
                return count;
            }
        })
        const redisProductData = JSON.parse(message);
        console.log("🚀 ~ file: payment.service.ts:154 ~ createStripeRefundService ~ redisProductData:", redisProductData);
        return await stripe.paymentIntents.list({customer: redisProductData.customerId}).then(async (paymentIntent: any) => {
            console.log("🚀 ~ file: payment.service.ts:156 ~ returnawaitstripe.paymentIntents.retrieve ~ paymentIntent:", paymentIntent.data[0]);
            return await stripe.refunds.create({
                payment_intent:paymentIntent.data[0].id,
                amount: (redisProductData.amount),
            }).then((refund: any) => {
                console.log("🚀 ~ file: payment.service.ts:160 ~ createStripeRefundService ~ refund:", refund);
                return refund;
            }).catch((err: any) => {
                console.log("🚀 ~ file: payment.service.ts:165 ~ returnawaitstripe.paymentIntents.list ~ err:", err)
                throw new Error(err);
            })
        })
    } catch (error) {
        console.log("🚀 ~ file: payment.service.ts:145 ~ createStripeRefundService ~ error:", error.message)
        throw(error.message);
    }
}

export const createStripeCustomerService = async () => {
    try {
        const message: any = await paymentClient.get('returnPayment', (err: any, count: any) => {
            if (err) {
                logger.error("Failed to subscribe: %s", err.message);
                return err;
            }
            else {
                logger.info(`Subscribed successfully! This client is currently subscribed to ${count} channels.`);
                return count;
            }
        })
        const redisProductData = JSON.parse(message);
        console.log("🚀 ~ file: payment.service.ts:187 ~ createStripeCustomerService ~ redisProductData:", redisProductData)
        return await stripe.customers.create({email: redisProductData.email})
    } catch (error) {
        console.log("🚀 ~ file: payment.service.ts:178 ~ createStripeCustomerService ~ error:", error)
        throw(error);
    }
}

export const subscribeToMembershipPlanService = async () => {
    try {
        const message: any = await paymentClient.get('subscribeToMembershipPlan', (err: any, count: any) => {
            if (err) {
                logger.error("Failed to subscribe: %s", err.message);
                return err;
            }
            else {
                logger.info(`Subscribed successfully! This client is currently subscribed to ${count} channels.`);
                return count;
            }
        })
        const redisProductData = JSON.parse(message);
        console.log("🚀 ~ file: payment.service.ts:195 ~ subscribeToMembershipPlanService ~ redisProductData:", redisProductData);
        return await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            customer: redisProductData.stripeCustomerId,
            success_url: 'https://www.google.com',
            cancel_url:  'https://www.gmail.com',
            line_items: [
                { 
                    price_data: { 
                        currency: "inr", 
                        product_data: { 
                        name: redisProductData.name, 
                        }, 
                    unit_amount: (redisProductData.amount), 
                    }, 
                    quantity: 1 
                }
            ],
            mode: 'payment',
        }).then((payment: any) => {
            console.log("🚀 ~ file: payment.service.ts:215 ~ subscribeToMembershipPlanService ~ payment:", payment)
            return payment.url
        })
    } catch (error) {
        console.log("🚀 ~ file: payment.service.ts:186 ~ subscribeToMembershipPlanService ~ error:", error)
        throw(error);
    }
}
