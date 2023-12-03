import { Router } from "express";
import { createProduct, getProduct, getAllProducts, updateProduct, deleteProduct, getProductByNameForOrderService, updateProducts, getProductsByRegex, addProductReview, addProductRating, getAllProductsByPagination, getProductById, updateProductQuantity, getProductByKeyword, getProductByCategory, getProductByPriceRange, updateProductRating, getPopularProducts, getBestSellingProducts, getProductsByBrand, getProductsByfilterData, addFAQToProduct } from "./controller/product.controller";

const router = Router();

router.post('/create', createProduct);
router.post('/add/review', addProductReview);
router.post('/add/rating', addProductRating);
router.post('/question', addFAQToProduct);
router.get('/category', getProductByCategory);
router.get('/brand', getProductsByBrand);
router.get('/filter', getProductsByfilterData);
router.get('/price', getProductByPriceRange);
router.get('/popular', getPopularProducts);
router.get('/best/selling', getBestSellingProducts);
router.get('/products', getAllProductsByPagination); // here, handled both recently created products and pagination for products
router.get('/regex', getProductsByRegex);
router.get('/id', getProduct);
router.get('/assetManagerId', getAllProducts);
router.get('/:id', getProductById);
router.get('/get/name', getProductByNameForOrderService);
router.get('/get/product', getProductByKeyword);
router.put('/update', updateProduct);
router.put('/update/product', updateProducts);
router.put('/update/quantity', updateProductQuantity);
router.put('/update/rating', updateProductRating);
router.delete('/delete', deleteProduct);

export default router;