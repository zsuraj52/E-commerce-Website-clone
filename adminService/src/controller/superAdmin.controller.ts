import { Request, Response } from "express";
import { registerAdminService, loginAdminService, forgotPasswordService, resetPasswordService, verifyEmailService, getSuperAdminService,updateSuperAdminService, deleteSuperAdminService, generateSalesReportService, createMembershipPlansService, getPlanByIdService, verifyAssetManagersBusinessService } from "../service/superAdmin.service";

export const registerAdmin = async (req: Request, res: Response) => {
    return await registerAdminService(req.body) .then((superAdmin: any) => {
        return res.status(201).send({ Status: "SUCCESS", Response : superAdmin});
    }).catch((error) => {
        return res.status(400).send({ Status: "FAILED", Response : error.message});
    })
}

export const loginAdmin = async (req: Request, res: Response) => {
    return await loginAdminService(req.body) .then((admin: any) => {
        return res.status(201).send({ Status: "SUCCESS", Response : admin});
    }).catch((error) => {
        return res.status(400).send({ Status: "FAILED", Response : error.message});
    })
}

export const forgotPassword = async (req: Request, res: Response) => {
    return await forgotPasswordService(req.body).then((response: any) =>{
        return res.status(200).send({ Status: "SUCCESS", Response : response})
    }).catch((error: any) => {
        return res.status(400).send({ Status: "FAILED", Response : error.message});
    })
}

export const resetPassword = async (req: Request, res: Response) => {
    return await resetPasswordService(req.body).then((response: any) =>{
        return res.status(200).send({ Status: "SUCCESS", Response : response})
    }).catch((error: any) => {
        return res.status(400).send({ Status: "FAILED", Response : error.message});
    })
}

export const verifyEmail = async (req: Request, res: Response) => {
    return await verifyEmailService(req.body).then((response: any) =>{
        return res.status(200).send({ Status: "SUCCESS", Response : `Email Verified Successfully!`})
    }).catch((error: any) => {
        return res.status(400).send({ Status: "FAILED", Response : error.message});
    })
}

export const getSuperAdmin = async (req: Request, res: Response) => {
    return await getSuperAdminService(req.params).then((response: any) =>{
        return res.status(200).send({ Status: "SUCCESS", Response : response})
    }).catch((error: any) => {
        return res.status(400).send({ Status: "FAILED", Response : error.message});
    })
}

export const updateSuperAdmin = async (req: Request, res: Response) => {
    return await updateSuperAdminService({data: req.body, id: req.params}).then((response: any) =>{
        return res.status(200).send({ Status: "SUCCESS", Response : response})
    }).catch((error: any) => {
        return res.status(400).send({ Status: "FAILED", Response : error.message});
    })
}

export const deleteSuperAdmin = async (req: Request, res: Response) => {
    return await deleteSuperAdminService(req.params).then((response: any) =>{
        return res.status(200).send({ Status: "SUCCESS", Response : response})
    }).catch((error: any) => {
        return res.status(400).send({ Status: "FAILED", Response : error.message});
    })
}

export const generateSalesReport = async (req:Request, res:Response) => {
    return await generateSalesReportService(req.params.assetManagerId, req.body).then((response: any) => {
        return res.status(200).send({ Status: "SUCCESS", Response : response})
    }).catch((error: any) => {
        return res.status(400).send({ Status: "FAILED", Response : error.message});
    })
}

export const createMembershipPlans = async (req:Request, res:Response) => {
    return await createMembershipPlansService(req.body).then((response: any) => {
        return res.status(200).send({ Status: "SUCCESS", Response : response})
    }).catch((error: any) => {
        return res.status(400).send({ Status: "FAILED", Response : error.message});
    })
}

export const getPlanById = async (req:Request, res:Response) => {
    return await getPlanByIdService(req.params.planId).then((response: any) => {
        return res.status(200).send({ Status: "SUCCESS", Response : response})
    }).catch((error: any) => {
        return res.status(400).send({ Status: "FAILED", Response : error.message});
    })
}

export const verifyAssetManagersBusiness = async (req:Request, res:Response) => {
    return await verifyAssetManagersBusinessService(req.body).then((response: any) => {
        return res.status(200).send({ Status: "SUCCESS", Response : response})
    }).catch((error: any) => {
        return res.status(400).send({ Status: "FAILED", Response : error.message});
    })
}
