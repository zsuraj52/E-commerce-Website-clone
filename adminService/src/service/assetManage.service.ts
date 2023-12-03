import { createDiscountCouponsRepo, validateCouponRepo } from "../reopository/discounts.repo";
import { getAssetManagerByParamsRepo, updateAssetManagerRepo } from "../reopository/assetManager.repo";
import { assetManagerClient } from "../index";
import axios from "axios";
import { getSuperAdminByParamsRepo } from "../reopository/superAdmin.repo";

export const getAssetManagerService = async (id: any) => {
    try {
        console.log("🚀 ~ file: admin.service.ts:5 ~ getAssetManagerService ~ id:", id)
        if(id === null){
            throw new Error(`Please Provide Id`);
        }
        const admin: any = await getAssetManagerByParamsRepo(id);
        console.log("🚀 ~ file: admin.service.ts:10 ~ getAssetManagerService ~ admin:", admin);
        delete admin.password;
        return admin;
    } catch (error) {
        console.log("🚀 ~ file: admin.service.ts:14 ~ getAssetManagerService ~ error:", error)
        throw(error);
    }
}

export const updateAssetManagerService = async (body: any) => {
    try {
        console.log("🚀 ~ file: admin.service.ts:21 ~ updateAssetManagerService ~ body:", body);
        const { id, data } = body;
        if (!id) {
            throw new Error(`Please Provide id`)
        };
        const admin = await getAssetManagerByParamsRepo(id);
        console.log("🚀 ~ file: admin.service.ts:27 ~ updateAssetManagerService ~ admin:", admin);
        if (admin === null) {
            throw new Error(`No Admin Found`)
        }
        if (data.password) {
            data.password = CryptoJS.AES.encrypt(admin.password, String(process.env.ENCRYPTION_KEY)).toString();
        }
        return await updateAssetManagerRepo(id.id, data).then((admin: any) => {
            console.log("🚀 ~ file: admin.service.ts:35 ~ returnawaitupdateAdminRepo ~ admin:", admin);
            delete admin.password;
            return admin;
        })
    } catch (error) {
        console.log("🚀 ~ file: admin.service.ts:40 ~ updateAssetManagerService ~ error:",error);
        throw (error);
    }
}

export const deleteAssetManagerService = async (id: any) => {
    try {
        console.log("🚀 ~ file: admin.service.ts:47 ~ deleteAssetManagerService ~ id:", id);
        if (id.id === null) {
            throw new Error(`Failed to deactivate asset manager`)
        }
        const assetManager = await getAssetManagerByParamsRepo(id);
        console.log("🚀 ~ file: admin.service.ts:52 ~ deleteAssetManagerService ~ assetManager:", assetManager);
        if (assetManager === null) {
            throw new Error(`No assetManager found to deactivate`)
        }
        assetManager.isAssetManagerDeleted = true;
        return await updateAssetManagerRepo(assetManager.id, assetManager).then(() => {
            return `Admin De-activated Successfully!`
        })
    } catch (error) {
        console.log("🚀 ~ file: admin.service.ts:61 ~ deleteAssetManagerService ~ error:", error)
        throw(error);
    }
}

export const createDiscountCouponsService = async (data: any) => {
    try {
        console.log("🚀 ~ file: admin.service.ts:69 ~ createDiscountCouponsService ~ data:", data)
        const { name, description, minTotal, discountAmount, discountPercentage, superAdminId, type } = data;
        if (!superAdminId || !name || !description || !minTotal || !type) {
            throw new Error('Please Provide All Required Fields');
        }
        return await createDiscountCouponsRepo({ name, description, minTotal, discountAmount, discountPercentage, superAdminId, type })
    } catch (error) {
        console.log("🚀 ~ file: admin.service.ts:76 ~ createDiscountCouponsService ~ error:", error)
        throw (error);
    }
}

export const validateCouponService = async () => {
    try {
        const message: any = await assetManagerClient.get('getCouponByName', (err: any, count: any) => {
            if (err) {
                console.log("Failed to subscribe: %s", err.message);
                return err;
            }
            else {
                console.log("Subscribed successfully! This client is currently subscribed to ${count} channels.");
                return count;
            }
        })
        const adminRedisData = JSON.parse(message);
        console.log("🚀 ~ file: admin.service.ts:94 ~ validateCouponService ~ adminRedisData:", adminRedisData);
        return await validateCouponRepo(adminRedisData.coupon)
    } catch (error) {
        console.log("🚀 ~ file: admin.service.ts:97 ~ validateCouponService ~ error:", error)
        throw (error);
    }
}


export const createProductService = async (productData: any) => {
    try {
        console.log("🚀 ~ file: admin.service.ts:107 ~ createProductService ~ productData:", productData);
        const createProductData: any = {
            ...productData
        };

        return await assetManagerClient.set('createProduct', JSON.stringify(createProductData)).then(async () => {
            console.log("message set successfully on adminRegistered channel with data", createProductData)
            return await axios.post(`http://localhost:3002/product/create`).then((product: any) => {
                console.log("🚀 ~ file: admin.service.ts:115 ~ datas ~ product:", product.data.Response);
                return product.data.Response;
            }).catch((err): any => {
                console.log("err", err);
                throw new Error(err);
            })
        })
    } catch (error) {
        console.log("🚀 ~ file: admin.service.ts:123 ~ createProductService ~ error:", error);
        throw error;
    }
}

export const getProductService = async (dataObj: any) => {
    try {
        console.log("🚀 ~ file: admin.service.ts:130 ~ getProductService ~ dataObj:", dataObj);
        return await assetManagerClient.set('getProduct', JSON.stringify(dataObj)).then(async () => {
            return await axios.get(`http://localhost:3002/product/id`).then((product: any) => {
                console.log("🚀 ~ file: admin.service.ts:133 ~ returnawaitassetManagerClient.set ~ product:", product.data.Response);
                return JSON.parse(product.data.Response);
            }).catch((err) => {
                console.log("🚀 ~ file: admin.service.ts:136 ~ returnawaitassetManagerClient.set ~ err:", err);
                throw new Error(err);
            })
        })
    } catch (error) {
        console.log("🚀 ~ file: admin.service.ts:141 ~ getProductService ~ error:", error);
        throw error;
    }
}

export const getAllProductsForAssetManagerIdService = async (assetManagerId: string) => {
    try {
        console.log("🚀 ~ file: admin.service.ts:149 ~ getAllProductsForAssetManagerIdService ~ data:", assetManagerId);
        if (assetManagerId === null) {
            throw new Error(`Please Provide AdminId`)
        }
        return await getAssetManagerByParamsRepo({ id: assetManagerId }).then(async (assetManagerId) => {
            console.log("🚀 ~ file: admin.service.ts:152 ~ returnawaitggetAssetManagerByParamsRepo ~ assetManagerId:", assetManagerId);
            if (assetManagerId === undefined || assetManagerId === null) {
                throw new Error(`assetManagerIdId not found`)
            }
            const obj = {
                assetManagerId: assetManagerId.id
            }
            console.log("🚀 ~ file: assetManage.service.ts:161 ~ returnawaitgetAssetManagerByParamsRepo ~ obj:", obj)
            return await assetManagerClient.set('getAllProductsForAssetManagerId', JSON.stringify(obj)).then(async () => {
                console.log("hereeee");
                return await axios.get(`http://localhost:3002/product/assetManagerId`).then(async (products) => {
                    console.log("🚀 ~ file: assetManagerId.service.ts:163 ~ returnawaitaxios.post ~ products:", products.data.Response);
                    return products.data.Response;
                }).catch((err) => {
                    console.log("🚀 ~ file: assetManagerId.service.ts:166 ~ returnawaitaxios.post ~ err:", err.data);
                    throw new Error(err);
                })
            }).catch((err) => {
                console.log("🚀 ~ file: assetManagerId.service.ts:170 ~ returnawaitassetManagerClient.set ~ err:", err.message);
                throw (err);
            })
        })

    } catch (error) {
        console.log("🚀 ~ file: assetManagerId.service.ts:176 ~ getAllProductsForAssetManagerIdService ~ error:", error);
        throw error;
    }
}

export const updateProductService = async (updateData: any) => {
    console.log("🚀 ~ file: assetManage.service.ts:184 ~ updateProductService ~ updateData:", updateData)
    try {
        const { productId } = updateData;
        console.log("🚀 ~ file: admin.service.ts:184 ~ updateProductService ~ productId:", productId);
        const assetManagerId = updateData.data.assetManagerId;
        console.log("🚀 ~ file: admin.service.ts:186 ~ updateProductService ~ assetManagerId:", assetManagerId);
        return await getSuperAdminByParamsRepo({ id: assetManagerId }).then(async (admin) => {
            console.log("🚀 ~ file: admin.service.ts:188 ~ returnawaitgetSuperAdminByParamsRepo ~ assetManagerId:", assetManagerId);
            const redisObj = {
                productId: productId,
                data: updateData.data
            }
            console.log("🚀 ~ file: admin.service.ts:193 ~ returnawaitgetSuperAdminByParamsRepo ~ redisObj:", redisObj);
            return await assetManagerClient.set('updateProduct', JSON.stringify(redisObj)).then(async () => {
                return await axios.put(`http://localhost:3002/product/update`).then((product) => {
                    console.log("🚀 ~ file: admin.service.ts:196 ~ returnawaitassetManagerClient.set ~ product:", product.data.Response);
                    return product.data.Response;
                }).catch((err) => {
                    console.log("🚀 ~ file: admin.service.ts:199 ~ returnawaitaxios.put ~ err:", err);
                    throw new Error(err);
                })
            })
        })
    } catch (error) {
        console.log("🚀 ~ file: admin.service.ts:205 ~ updateProductService ~ error:", error)
        throw (error);
    }
}

export const deleteProductService = async (productId: string) => {
    try {
        console.log("🚀 ~ file: admin.service.ts:212 ~ deleteProductService ~ productId:", productId)
        return await assetManagerClient.set('deleteProduct', JSON.stringify(productId)).then(async () => {
            return await axios.delete(`http://localhost:3002/product/delete`).then((product) => {
                console.log("🚀 ~ file: admin.service.ts:215 ~ returnawaitassetManagerClient.set ~ product:", product.data.Response);
                return product.data.Response;
            }).catch((err) => {
                console.log("🚀 ~ file: admin.service.ts:218 ~ returnawaitaxios.put ~ err:", err);
                throw new Error(err);
            })
        })
    } catch (error) {
        console.log("🚀 ~ file: admin.service.ts:223 ~ deleteProductService ~ error:", error);
        throw (error);
    }
}
