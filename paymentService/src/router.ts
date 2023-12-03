import { Router } from "express";
import { createPaypalPayment, createStripeCheckout, createStripeRefund, createStripeCustomer, subscribeToMembershipPlan } from "./controller/payment.controller";

const router = Router();

router.post('/customer/create', createStripeCustomer);
router.post('/paypal/checkout', createPaypalPayment);
router.post('/stripe/checkout', createStripeCheckout);
router.post('/refund', createStripeRefund);
router.post('/customer/membership', subscribeToMembershipPlan);

export default router;