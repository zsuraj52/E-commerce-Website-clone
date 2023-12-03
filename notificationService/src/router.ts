import { Router } from "express";
import { sendSuperAdminRegisterEmail, sendAssetManagerRegisterEmail, sendForgotPasswordEmailToSuperAdmin, sendForgotPasswordEmailToAssetManager, sendPlacedOrderEmail, sendFeedbackEmail, sendCancelOrderEmail, sendCustomerRegisterEmail, sendCustomerForgotPasswordEmail, sendCustomerResetPasswordEmail, sendCustomerForceResetPasswordEmail } from "./controller/notification.controller";

const router = Router();
router.post('/super/admin/register', sendSuperAdminRegisterEmail);
router.post('/asset/manager/register', sendAssetManagerRegisterEmail);

router.post('/customer/regitser', sendCustomerRegisterEmail);

router.post('/super/admin/forgot/password', sendForgotPasswordEmailToSuperAdmin);
router.post('/asset/manager/forgot/password', sendForgotPasswordEmailToAssetManager);

router.post('/customer/forgot/password', sendCustomerForgotPasswordEmail);
router.post('/customer/reset/password', sendCustomerResetPasswordEmail);

router.post('/customer/force/reset', sendCustomerForceResetPasswordEmail);
router.post('/order/placed', sendPlacedOrderEmail);
router.post('/feedback', sendFeedbackEmail);
router.post('/cancel/order', sendCancelOrderEmail);

export default router;