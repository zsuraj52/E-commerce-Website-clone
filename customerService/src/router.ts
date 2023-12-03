import { Router } from "express";
import { createCustomer, loginCustomer, createOrder, getCustomer, getAllCustomers, updateCustomer, deleteCustomer, searchProductsByGivenRegex, addReviewForProduct, addRatingForProduct, sendFeedBack, addProductToWishlist, removeProductFromWishlist, cancelOrder, getProductsSuggestions, placeOrderForCustomer, addProductsToCart, getBestSellingProductsFromOrders, getAllCustomersForAssetManagerId, getAllOrdersForCustomerId, getAllProductsFromCart, forgotPassword, resetPassword, forceResetPassword, removeProductFromCart, getMembershipPlan, addCustomerToMembershipPlan, validateCustomerCoupon, addFAQData } from "./controller/customer.controller";
import { verifyCustomerToken } from "./middleware/jwt";

const router = Router();

router.post('/create', createCustomer);
router.post('/login', loginCustomer);
router.post('/forgot/password', forgotPassword);
router.post('/reset/password', resetPassword);
router.post('/force/reset', forceResetPassword);
router.post('/search/product', verifyCustomerToken, searchProductsByGivenRegex);
router.post('/add/faq/:productId', verifyCustomerToken, addFAQData);
router.post('/add/review/:id', verifyCustomerToken, addReviewForProduct);
router.post('/add/rating/:id', verifyCustomerToken, addRatingForProduct);
router.post('/feedback', verifyCustomerToken, sendFeedBack);
router.post('/add/wishlist', verifyCustomerToken, addProductToWishlist);
router.post('/remove/wishlist', verifyCustomerToken, removeProductFromWishlist);
router.post('/validate/coupon', validateCustomerCoupon);
router.post('/create/order', verifyCustomerToken, createOrder);
router.post('/place/order', placeOrderForCustomer);
router.post('/cancel/order/:id', verifyCustomerToken, cancelOrder);
router.post('/add/to/cart', verifyCustomerToken, addProductsToCart);
router.post('/plan', verifyCustomerToken, getMembershipPlan);
router.post('/add/plan/:customerId', verifyCustomerToken, addCustomerToMembershipPlan);
router.get('/suggestions/:id', getProductsSuggestions)
router.get('/cart/products', getAllProductsFromCart);
router.get('/', verifyCustomerToken, getAllCustomers);
router.get('/admin/:adminId', getAllCustomersForAssetManagerId);
router.get('/:id', verifyCustomerToken, getCustomer);
router.get('/best/selling', getBestSellingProductsFromOrders);
router.get('/order/:customerId', getAllOrdersForCustomerId);
router.put('/update/:id', verifyCustomerToken, updateCustomer);
router.delete('/delete/:id', verifyCustomerToken, deleteCustomer);
router.delete('/cart/product', verifyCustomerToken, removeProductFromCart);


export default router;
