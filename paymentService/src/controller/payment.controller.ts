import { Request, Response } from "express";
import { createPaypalPaymentService, createStripeCheckoutService, createStripeRefundService, createStripeCustomerService, subscribeToMembershipPlanService } from "../services/payment.service";

export const createPaypalPayment = async (req: Request, res: Response) => {
    return await createPaypalPaymentService().then((customer: any)=>{
        return res.status(201).send({Status: "SUCCESS", Response: customer})
    }).catch((err: any)=>{
        return res.status(400).send({Status: "FAILED", Response: err})
    })
}

export const createStripeCheckout = async (req: Request, res: Response) => {
    return await createStripeCheckoutService().then((customer: any)=>{
        return res.status(201).send({Status: "SUCCESS", Response: customer})
    }).catch((err: any)=>{
        return res.status(400).send({Status: "FAILED", Response: err})
    })
}

export const createStripeRefund = async (req: Request, res: Response) => {
    return await createStripeRefundService().then((response)=>{
        return res.status(201).send({Status: "SUCCESS", Response: response })
    }).catch((err: any)=>{
        return res.status(400).send({Status: "FAILED", Response: err})
    })
}

export const createStripeCustomer = async (req: Request, res: Response) => {
    return await createStripeCustomerService().then((customer) => {
        return res.status(201).send({Status: "SUCCESS", Response: customer })
    }).catch((err: any)=>{
        return res.status(400).send({Status: "FAILED", Response: err})
    })
}

export const subscribeToMembershipPlan = async (req: Request, res: Response) => {
    return await subscribeToMembershipPlanService().then((plan: any) => {
        return res.status(201).send({Status: "SUCCESS", Response: plan })
    }).catch((err: any)=>{
        return res.status(400).send({Status: "FAILED", Response: err})
    })
}
