import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config(); 
import { registerSuperAdmin } from '../dto/admin.DTO';
import { getSuperAdminByEmailRepo } from '../reopository/superAdmin.repo';
import { NextFunction, Request, Response } from 'express';
import { getAssetManagerByEmailRepo } from '../reopository/assetManager.repo';

export const createAdminToken = async (admin: registerSuperAdmin) => {
    return jwt.sign({admin}, String(process.env.ENCRYPTION_KEY),{expiresIn: '1d'})
}

export const verifySuperAdminToken = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const token: any = req.header("Authorization")?.replace("Bearer ", "");
        // console.log("🚀 ~ file: jwt.ts:15 ~ verifySuperAdminToken ~ token:",token);
        if(!token){
            return res.status(404).send({ "Status :": "FAILED", "Response ": "Please Authenticate" })
        }
        const admin: any = await <any> jwt.verify(token, String(process.env.ENCRYPTION_KEY));
        // console.log("🚀 ~ file: jwt.ts:14 ~ verifySuperAdminToken ~ admin:", admin);
        const adminData = await getSuperAdminByEmailRepo(admin.admin.email);
        // console.log("🚀 ~ file: jwt.ts:17 ~ verifySuperAdminToken ~ adminData:", adminData);
        if(adminData === null) {
            throw new Error ('No Admin Found , Please Authenticate Yourself First! ');
        }
        if(adminData.role.toLowerCase() !== "super admin"){
            throw new Error(`401, UnAuthorized!`)
        }
        console.log ('Super Admin Validation SuccessFully');
        next();
    } catch (error:any) {
        console.log("🚀 ~ file: jwt.ts:12 ~ verifySuperAdminToken ~ error:", error)
        return res.status(401).send({"Status":"FAILED", "Response":error.message});
    }
}

export const verifyAssetManagerToken = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const token: any = req.header("Authorization")?.replace("Bearer ", "");
        // console.log("🚀 ~ file: jwt.ts:40 ~ verifyAssetManagerToken ~ token:", token);
        if(!token){
            res.status(404).send({ "Status :": "FAILED", "Response ": "Please Authenticate" })
        }
        const admin: any = await <any> jwt.verify(token, String(process.env.ENCRYPTION_KEY));
        // console.log("🚀 ~ file: jwt.ts:14 ~ verifyAssetManagerToken ~ admin:", admin)
        const adminData: any = await getAssetManagerByEmailRepo(admin.admin.email);
        // console.log("🚀 ~ file: jwt.ts:17 ~ verifyAssetManagerToken ~ adminData:", adminData);
        if(adminData === null) {
            throw new Error ('No Admin Found , Please Authenticate Yourself First! ');
        }
        if((adminData.role).toLowerCase() !== "asset manager"){
            throw new Error("401, UnAuthorized!")
        }
        console.log ('Asset Manager Validation SuccessFully');
        next();
    } catch (error:any) {
        console.log("🚀 ~ file: jwt.ts:12 ~ verifyAssetManagerToken ~ error:", error)
        res.status(401).send({"Status":"FAILED", "Response":error.message});
    }
}