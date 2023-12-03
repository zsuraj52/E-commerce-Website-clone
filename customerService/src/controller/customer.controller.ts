import { Request, Response } from "express";
import { createCustomerService, loginCustomerService, createOrderService, createStripePaymentMethodService, getCustomerService, getAllCustomersService, updateCustomerService, deleteCustomerService, searchProductsByGivenRegexService, addReviewForProductService, addRatingsForProductService, sendFeedBackService, addProductToWishlistService, removeProductFromWishlistService, cancelOrderService, getProductsSuggestionsService, placeOrderForCustomerService, addProductsToCartService, getBestSellingProductsFromOrdersService, getAllCustomersForAssetManagerIdService, getAllOrdersForCustomerIdService, getAllProductsFromCartService, forgotPasswordService, resetPasswordService, forceResetPasswordService, removeProductFromCartService, getMembershipPlanService, addCustomerToMembershipPlanService, validateCustomerCouponService, addFAQDataService } from "../services/customer.service";

export const createCustomer = async (req: Request, res: Response) => {
    return await createCustomerService(req.body).then((customer: any)=>{
        return res.status(201).send({Status: "SUCCESS", Response: customer})
    }).catch((err)=>{
        return res.status(400).send({Status: "FAILED", Response: err})
    })
}

export const loginCustomer = async (req: Request, res: Response) => {
    return await loginCustomerService(req.body).then((customer: any)=>{
        return res.status(201).send({Status: "SUCCESS", Response: customer})
    }).catch((err)=>{
        return res.status(400).send({Status: "FAILED", Response: err})
    })
}

export const createOrder = async (req: Request, res: Response) => {
    return await createOrderService(req.body).then((customer: any)=>{
        return res.status(201).send({Status: "SUCCESS", Response: customer})
    }).catch((err) => {
        return res.status(400).send({Status: "FAILED", Response: err.message})
    })
}

export const placeOrderForCustomer = async (req: Request, res: Response) => {
    return await placeOrderForCustomerService().then((customer: any)=>{
        return res.status(201).send({Status: "SUCCESS", Response: customer})
    }).catch((err) => {
        return res.status(400).send({Status: "FAILED", Response: err.message})
    })
}

export const createStripePaymentMethod = async (req: Request, res: Response) => {
    return await createStripePaymentMethodService(req.body).then((customer: any)=>{
        return res.status(201).send({Status: "SUCCESS", Response: customer})
    }).catch((err) => {
        return res.status(400).send({Status: "FAILED", Response: err.message})
    })
}

export const getCustomer = async (req: Request, res: Response) => {
    return await getCustomerService(req.params.id).then((customer: any)=>{
        return res.status(200).send({Status: "SUCCESS", Response: customer})
    }).catch((err) => {
        return res.status(400).send({Status: "FAILED", Response: err.message})
    })
}

export const getAllCustomers = async (req: Request, res: Response) => {
    return await getAllCustomersService().then((customer: any)=>{
        return res.status(200).send({Status: "SUCCESS", Response: customer})
    }).catch((err) => {
        return res.status(400).send({Status: "FAILED", Response: err.message})
    })
}

export const updateCustomer = async (req: Request, res: Response) => {
    return await updateCustomerService(req.params.id, req.body).then((customer: any)=>{
        return res.status(200).send({Status: "SUCCESS", Response: customer})
    }).catch((err) => {
        return res.status(400).send({Status: "FAILED", Response: err.message})
    })
}

export const deleteCustomer = async (req: Request, res: Response) => {
    return await deleteCustomerService(req.params.id).then((customer: any)=>{
        return res.status(200).send({Status: "SUCCESS", Response: customer})
    }).catch((err) => {
        return res.status(400).send({Status: "FAILED", Response: err.message})
    })
}

export const searchProductsByGivenRegex = async (req: Request, res: Response) => {
    return await searchProductsByGivenRegexService(req.query.productName, req.body.customerId).then((customer: any)=>{
        return res.status(200).send({Status: "SUCCESS", Response: customer})
    }).catch((err) => {
        return res.status(400).send({Status: "FAILED", Response: err.message})
    })
}

export const addReviewForProduct = async (req: Request, res: Response) =>  {
    return await addReviewForProductService(req.params.id, req.body).then((customer: any)=>{
        return res.status(200).send({Status: "SUCCESS", Response: customer})
    }).catch((err) => {
        return res.status(400).send({Status: "FAILED", Response: err.message})
    })
}

export const addRatingForProduct = async (req: Request, res: Response) =>  {
    return await addRatingsForProductService(req.params.id, req.body).then((customer: any)=>{
        return res.status(200).send({Status: "SUCCESS", Response: customer})
    }).catch((err) => {
        return res.status(400).send({Status: "FAILED", Response: err.message})
    })
}

export const sendFeedBack = async (req: Request, res: Response) => {
    return await sendFeedBackService(req.body).then((customer: any)=>{
        return res.status(200).send({Status: "SUCCESS", Response: customer})
    }).catch((err) => {
        return res.status(400).send({Status: "FAILED", Response: err.message})
    })
}

export const addProductToWishlist = async (req: Request, res: Response) => {
    return await addProductToWishlistService(req.body).then((customer: any)=>{
        return res.status(200).send({Status: "SUCCESS", Response: customer})
    }).catch((err) => {
        return res.status(400).send({Status: "FAILED", Response: err.message})
    })
}

export const removeProductFromWishlist = async (req: Request, res: Response) => {
    return await removeProductFromWishlistService(req.body).then((customer: any)=>{
        return res.status(200).send({Status: "SUCCESS", Response: customer})
    }).catch((err) => {
        return res.status(400).send({Status: "FAILED", Response: err.message})
    })
}

export const cancelOrder = async (req: Request, res: Response) => {
    return await cancelOrderService(req.params.id).then((customer: any)=>{
        return res.status(200).send({Status: "SUCCESS", Response: customer})
    }).catch((err) => {
        return res.status(400).send({Status: "FAILED", Response: err.message})
    })
}

export const getProductsSuggestions = async (req: Request, res:Response) => {
    return await getProductsSuggestionsService(req.params.id).then((customer: any)=>{
        return res.status(200).send({Status: "SUCCESS", Response: customer})
    }).catch((err) => {
        return res.status(400).send({Status: "FAILED", Response: err.message})
    })
}

export const addProductsToCart = async (req: Request, res: Response) => {
    return await addProductsToCartService(req.body).then((customer: any)=>{
        return res.status(200).send({Status: "SUCCESS", Response: customer})
    }).catch((err) => {
        return res.status(400).send({Status: "FAILED", Response: err.message})
    })
}

export const getBestSellingProductsFromOrders = async (req: Request, res: Response) => {
    return await getBestSellingProductsFromOrdersService().then((orders: any)=>{
        return res.status(200).send({Status: "SUCCESS", Response: orders})
    }).catch((err) => {
        return res.status(400).send({Status: "FAILED", Response: err.message})
    })
}

export const getAllCustomersForAssetManagerId = async (req: Request, res: Response) => {
    return await getAllCustomersForAssetManagerIdService(req.params.assetManagerId).then((orders: any)=>{
        return res.status(200).send({Status: "SUCCESS", Response: orders})
    }).catch((err) => {
        return res.status(400).send({Status: "FAILED", Response: err.message})
    })
}

export const getAllOrdersForCustomerId = async (req: Request, res: Response) => {
    return await getAllOrdersForCustomerIdService(req.params.customerId).then((orders: any)=>{
        return res.status(200).send({Status: "SUCCESS", Response: orders})
    }).catch((err) => {
        return res.status(400).send({Status: "FAILED", Response: err.message})
    })
}

export const getAllProductsFromCart = async (req: Request, res:Response) => {
    return await getAllProductsFromCartService().then((orders: any)=>{
        return res.status(200).send({Status: "SUCCESS", Response: orders})
    }).catch((err) => {
        return res.status(400).send({Status: "FAILED", Response: err.message})
    })
}

export const forgotPassword = async (req: Request, res:Response) => {
    return await forgotPasswordService(req.query).then((orders: any)=>{
        return res.status(200).send({Status: "SUCCESS", Response: orders})
    }).catch((err) => {
        return res.status(400).send({Status: "FAILED", Response: err.message})
    })   
}

export const resetPassword = async (req: Request, res: Response) => {
    return await resetPasswordService(req.body).then((customer: any)=>{
        return res.status(200).send({Status: "SUCCESS", Response: customer})
    }).catch((err) => {
        return res.status(400).send({Status: "FAILED", Response: err.message})
    })
}

export const forceResetPassword = async (req: Request, res: Response) => {
    return await forceResetPasswordService(req.body).then((customer: any)=>{
        return res.status(200).send({Status: "SUCCESS", Response: customer})
    }).catch((err) => {
        return res.status(400).send({Status: "FAILED", Response: err.message})
    })
}

export const removeProductFromCart = async (req: Request, res: Response) => {
    return await removeProductFromCartService(req.body, req.query.productId).then((customer: any)=>{
        return res.status(200).send({Status: "SUCCESS", Response: customer})
    }).catch((err) => {
        return res.status(400).send({Status: "FAILED", Response: err.message})
    })
}

export const getMembershipPlan = async (req: Request, res: Response) => {
    return await getMembershipPlanService(req.body, req.query.planId).then((customer: any)=>{
        return res.status(200).send({Status: "SUCCESS", Response: customer})
    }).catch((err) => {
        return res.status(400).send({Status: "FAILED", Response: err.message})
    })
}

export const addCustomerToMembershipPlan = async (req: Request, res: Response) => {
    return await addCustomerToMembershipPlanService(req.body, req.params.customerId).then((customer: any)=>{
        return res.status(200).send({Status: "SUCCESS", Response: customer})
    }).catch((err) => {
        return res.status(400).send({Status: "FAILED", Response: err.message})
    })
}

export const validateCustomerCoupon = async (req: Request, res: Response) => {
    return await validateCustomerCouponService(req.body).then((plan: any)=>{
        return res.status(200).send({Status: "SUCCESS", Response: plan})
    }).catch((err) => {
        return res.status(400).send({Status: "FAILED", Response: err.message})
    })
}

export const addFAQData = async (req: Request, res: Response) => {
    return await addFAQDataService(req.params.productId, req.body).then((plan: any)=>{
        return res.status(200).send({Status: "SUCCESS", Response: plan})
    }).catch((err) => {
        return res.status(400).send({Status: "FAILED", Response: err.message})
    })
}
