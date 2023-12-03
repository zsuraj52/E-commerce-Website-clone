import { Request, Response } from "express";
import { createDiscountCouponsService, createProductService, deleteAssetManagerService, deleteProductService, getAllProductsForAssetManagerIdService, getAssetManagerService, getProductService, updateAssetManagerService, updateProductService, validateCouponService } from "../service/assetManage.service";
import { registerAdminService } from "../service/superAdmin.service";

export const registerAssetManager = async (req: Request, res: Response) => {
    return await registerAdminService(req.body) .then((admin: any) => {
        return res.status(201).send({ Status: "SUCCESS", Response : admin});
    }).catch((error: any) => {
        return res.status(400).send({ Status: "FAILED", Response : error.message});
    })
}

export const getAssetManager = async (req: Request, res: Response) => {
    return await getAssetManagerService(req.params).then((response: any) =>{
        return res.status(200).send({ Status: "SUCCESS", Response : response})
    }).catch((error: any) => {
        return res.status(400).send({ Status: "FAILED", Response : error.message});
    })
}

export const updateAssetManager = async (req: Request, res: Response) => {
    return await updateAssetManagerService({data: req.body, id: req.params}).then((response: any) =>{
        return res.status(200).send({ Status: "SUCCESS", Response : response})
    }).catch((error: any) => {
        return res.status(400).send({ Status: "FAILED", Response : error.message});
    })
}

export const deleteAssetManager = async (req: Request, res: Response) => {
    return await deleteAssetManagerService(req.params).then((response: any) =>{
        return res.status(200).send({ Status: "SUCCESS", Response : response})
    }).catch((error: any) => {
        return res.status(400).send({ Status: "FAILED", Response : error.message});
    })
}

export const createDiscountCoupons = async (req:Request, res:Response) => {
    return await createDiscountCouponsService(req.body).then((response: any) => {
        return res.status(200).send({ Status: "SUCCESS", Response : response})
    }).catch((error: any) => {
        return res.status(400).send({ Status: "FAILED", Response : error.message});
    })
}

export const validateCoupon = async (req:Request, res:Response) => {
    return await validateCouponService().then((response: any) => {
        return res.status(200).send({ Status: "SUCCESS", Response : response})
    }).catch((error: any) => {
        return res.status(400).send({ Status: "FAILED", Response : error.message});
    })
}

export const createProduct = async (req: Request, res: Response) => {
    return await createProductService(req.body).then((response: any) =>{
        return res.status(200).send({ Status: "SUCCESS", Response : response})
    }).catch((error: any) => {
        return res.status(400).send({ Status: "FAILED", Response : error.message});
    })
}

export const getProduct = async (req: Request, res: Response) => {
    return await getProductService({adminId: req.body.adminId, id: req.params.productId }).then((response: any) =>{
        return res.status(200).send({ Status: "SUCCESS", Response : response})
    }).catch((error: any) => {
        return res.status(400).send({ Status: "FAILED", Response : error.message});
    })
}

export const getAllProductsForAssetManagerId = async (req: Request, res: Response) =>{
    return await getAllProductsForAssetManagerIdService(req.body.assetManagerId).then((response: any) =>{
        return res.status(200).send({ Status: "SUCCESS", Response : response})
    }).catch((error: any) => {
        return res.status(400).send({ Status: "FAILED", Response : error.message});
    })
}

export const updateProduct = async (req: Request, res: Response) => {
    return await updateProductService({productId: req.params.productId, data: req.body}).then((response: any) =>{
        return res.status(200).send({ Status: "SUCCESS", Response : response})
    }).catch((error: any) => {
        return res.status(400).send({ Status: "FAILED", Response : error.message});
    })
}

export const deleteProduct = async (req: Request, res: Response) => {
    return await deleteProductService(req.params.productId).then((response: any) => {
        return res.status(200).send({ Status: "SUCCESS", Response : response})
    }).catch((error: any) => {
        return res.status(400).send({ Status: "FAILED", Response : error.message});
    })
}
