import { sendAdminRegisterEmailService, sendCustomerRegisterEmailService, sendForgotPasswordEmailToSuperAdminService,  sendPlacedOrderEmailService, sendFeedbackEmailService, sendCancelOrderEmailService, sendCustomerForgotPasswordEmailService, sendCustomerResetPasswordEmailService, sendCustomerForceResetPasswordEmailService } from "../service/notification.service";
import { Request, Response } from "express";

export const sendSuperAdminRegisterEmail = async (req: Request, res: Response) => {
    return await sendAdminRegisterEmailService().then((response: any) => {
        return res.status(200).send({message: response})
    }).catch((error) => {
        return res.status(400).send(error);      
    })
}

export const sendAssetManagerRegisterEmail = async (req: Request, res: Response) => {
    return await sendAdminRegisterEmailService().then((response: any) => {
        return res.status(200).send({message: response})
    }).catch((error) => {
        return res.status(400).send(error);      
    })
}

export const sendCustomerRegisterEmail = async (req: Request, res: Response) => {
    return await sendCustomerRegisterEmailService().then((response: any) => {
        return res.status(200).send({message: response})
    }).catch((error) => {
        return res.status(400).send(error);      
    })
}

export const sendForgotPasswordEmailToSuperAdmin = async(req: Request, res: Response) => {
    return await sendForgotPasswordEmailToSuperAdminService().then((response) =>{
        return res.status(200).send(response)
    }).catch((error) =>{
        return res.status(400).send(error);      
    })
}

export const sendForgotPasswordEmailToAssetManager = async(req: Request, res: Response) => {
    return await sendForgotPasswordEmailToSuperAdminService().then((response) =>{
        return res.status(200).send(response)
    }).catch((error) =>{
        return res.status(400).send(error);      
    })
}

export const sendPlacedOrderEmail = async (req: Request, res: Response) => {
    return await sendPlacedOrderEmailService().then((response) =>{
        return res.status(200).send(response)
    }).catch((error) =>{
        return res.status(400).send(error);      
    })
}

export const sendFeedbackEmail = async (req: Request, res: Response) => {
    return await sendFeedbackEmailService().then((response) =>{
        return res.status(200).send(response)
    }).catch((error) =>{
        return res.status(400).send(error);      
    })
}

export const sendCancelOrderEmail = async (req: Request, res: Response) => {
    return await sendCancelOrderEmailService().then((response) =>{
        return res.status(200).send(response)
    }).catch((error) =>{
        return res.status(400).send(error);      
    })
}

export const sendCustomerForgotPasswordEmail = async (req: Request, res: Response) => {
    return await sendCustomerForgotPasswordEmailService().then((response) =>{
        return res.status(200).send(response)
    }).catch((error) =>{
        return res.status(400).send(error);      
    })
}

export const sendCustomerResetPasswordEmail = async (req: Request, res: Response) => {
    return await sendCustomerResetPasswordEmailService().then((response) =>{
        return res.status(200).send(response)
    }).catch((error) =>{
        return res.status(400).send(error);      
    })
}

export const sendCustomerForceResetPasswordEmail = async (req: Request, res: Response) => {
    return await sendCustomerForceResetPasswordEmailService().then((response) =>{
        return res.status(200).send(response)
    }).catch((error) =>{
        return res.status(400).send(error);      
    })
}
