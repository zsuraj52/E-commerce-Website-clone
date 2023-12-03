import { Router } from "express";
import { registerAdmin, loginAdmin, forgotPassword, resetPassword, verifyEmail, getSuperAdmin, updateSuperAdmin, deleteSuperAdmin, generateSalesReport, createMembershipPlans, getPlanById, verifyAssetManagersBusiness } from "./controller/superAdmin.controller";
import { verifySuperAdminToken, verifyAssetManagerToken } from "./middleware/jwt";
import { createDiscountCoupons, createProduct, deleteAssetManager, getAllProductsForAssetManagerId, getAssetManager, getProduct, registerAssetManager, updateAssetManager, updateProduct, validateCoupon } from "./controller/assetManager.controller";
import { deleteProductService } from "./service/assetManage.service";

const router = Router();


//SuperAdmin Role
router.post('/super/register', registerAdmin);
router.post('/super/login', loginAdmin);
router.get('/super/:id', verifySuperAdminToken, getSuperAdmin);
router.put('/super/update/:id', verifySuperAdminToken, updateSuperAdmin);
router.delete('/super/delete/:id', verifySuperAdminToken, deleteSuperAdmin);

router.post('/super/verify/email', verifyEmail);
router.post('/super/forgot/password', forgotPassword);
router.post('/super/reset/password', verifySuperAdminToken, resetPassword);

router.post('/super/plan', verifySuperAdminToken, createMembershipPlans);
router.get('/super/plan/:planId', verifySuperAdminToken, getPlanById);

router.post('/super/verify/asset/manager', verifySuperAdminToken, verifyAssetManagersBusiness);


//Asset Manager Role
router.post('/asset/manager/register', registerAssetManager);
router.post('/asset/manager/login', loginAdmin);
router.get('/asset/manager/:id', verifyAssetManagerToken, getAssetManager);
router.put('/asset/manager/update/:id', verifyAssetManagerToken, updateAssetManager);
router.delete('/asset/manager/delete/:id', verifyAssetManagerToken, deleteAssetManager);

router.post('/asset/manager/verify/email', verifyEmail);
router.post('/asset/manager/forgot/password', forgotPassword);
router.post('/asset/manager/reset/password', verifyAssetManagerToken, resetPassword);

router.post('/asset/manager/coupon', verifyAssetManagerToken, createDiscountCoupons);
router.post('/asset/manager/validate/coupon', validateCoupon);

router.post('/asset/manager/create/product', verifyAssetManagerToken, createProduct);
router.get('/asset/manager/get/product/:productId', verifyAssetManagerToken, getProduct);
router.get('/asset/manager/get/products', verifyAssetManagerToken, getAllProductsForAssetManagerId);
router.put('/asset/manager/update/product/:productId', verifyAssetManagerToken, updateProduct);
router.delete('/asset/manager/delete/product/:productId', deleteProductService);

router.post('/asset/manager/report/:assetManagerId', verifyAssetManagerToken, generateSalesReport);

export default router;