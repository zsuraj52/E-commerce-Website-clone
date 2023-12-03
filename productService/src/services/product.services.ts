import { Promise } from 'bluebird';
import moment from 'moment'
import axios from 'axios';
import {productClient} from '../index';
import { createProductRepo, getProductByAdminIdAndName, getProductByAdminIdAndProductId, getAllProducts, updateProductRepo, deleteProductRepo, getProductByNameRepo, updateProductByNameRepo, getProductsByRegexRepo, updateProductRatingByIdRepo, updateProductReviewByIdRepo, getAllProductsByPaginationRepo, getProductByIdRepo, updateProductQuantityRepo, getProductByKeywordRepo, getProductByCategoryRepo, getProductByPriceRange, getAllProductsRepo, updateProductRatingRepo, getPopularProductRepo, getProductsByBrandRepo, getProductsByfilterDataRepo, updateProductFAQRepo } from "../repository/product.repo";


export const createProductService = async () => {
    try {
        const message: any = await productClient.get('createProduct', (err, count) => {
            if (err) {
                console.log("Failed to subscribe: %s", err.message);
                return err;
            }
            else {
                console.log("Subscribed successfully! This client is currently subscribed to", count, "channels.");
                return count;
            }
        })
        const redisProductData = JSON.parse(message);
        console.log("🚀 ~ file: product.services.ts:19 ~ createProductService ~ redisProductData:", redisProductData);
        return await getProductByAdminIdAndName(redisProductData.adminId, redisProductData.name, redisProductData.category).then(async (product: any)=>{
            if(product){
                throw new Error('Product For Given Name & Category Already Exists')
            }
            return await createProductRepo(redisProductData).then((product: any) => {
                console.log("🚀 ~ file: product.services.ts:21 ~ returnawaitcreateProductRepo ~ product:", product);
                return (product);
            })
        }).catch((error) => {
            console.error(`🚀 ~ file: product.services.ts:29 ~ returnawaitgetProductByAdminIdAndName ~ error: ${error.message}`)
            throw new Error(error.message);
        })
    } catch (error: any) {
        console.log(`🚀 ~ file: product.services.ts:5 ~ createProductService ~ error: ${error.message}`)
        throw(error.message);
    }
}

export const getProductService = async () => {
    try {
        const message: any = await productClient.get('getProduct', (err, count) => {
            if (err) {
                console.log("Failed to subscribe: %s", err.message);
                return err;
            }
            else {
                console.log("Subscribed successfully! This client is currently subscribed to", count, "channels.");
                return count;
            }
        })
        const redisProductData = JSON.parse(message);
        console.log("🚀 ~ file: product.services.ts:51 ~ getProductService ~ redisProductData:", redisProductData);
        return await getProductByAdminIdAndProductId(redisProductData).then((product: any) => {
            console.log("🚀 ~ file: product.services.ts:53 ~ returnawaitgetProductByAdminIdAndProductId ~ product:", product);
            return JSON.stringify(product);
        }).catch((err: any) => {
            console.log(`🚀 ~ file: product.services.ts:56 ~ returnawaitgetProductByAdminIdAndProductId ~ err: ${err}`)
            throw new Error(err);
        })
    } catch (error) {
        console.log(`🚀 ~ file: product.services.ts:42 ~ getProductService ~ error: ${error}`)
        throw (error);
    }
}

export const getAllProductsService = async ()=>{
    try {
        const message: any = await productClient.get('getAllProductsForAssetManagerId', (err, count) => {
            if (err) {
                console.log("Failed to subscribe: %s", err.message);
                return err;
            }
            else {
                console.log("Subscribed successfully! This client is currently subscribed to", count, "channels.");
                return count;
            }
        })
        const redisProductData = JSON.parse(message);
        console.log("🚀 ~ file: product.services.ts:78 ~ getAllProductsService ~ redisProductData:", redisProductData);
        return await getAllProducts(redisProductData).then((products: any) => {
            console.log("🚀 ~ file: product.services.ts:80 ~ returnawaitgetAllProducts ~ products:", products);
            return products
        })
    } catch (error) {
        console.log(`🚀 ~ file: product.services.ts:69 ~ getAllProductsService ~ error: ${error}`)
        throw(error);
    }
}

export const updateProductService = async () => {
    try {
        const message: any = await productClient.get('updateProduct', (err, count) => {
            if (err) {
                console.log("Failed to subscribe: %s", err.message);
                return err;
            }
            else {
                console.log("Subscribed successfully! This client is currently subscribed to", count, "channels.");
                return count;
            }
        })
        const redisProductData = JSON.parse(message);
        console.log("🚀 ~ file: product.services.ts:102 ~ updateProductService ~ redisProductData:", redisProductData);
        return await updateProductRepo(redisProductData).then(async (product: any) => {
            console.log("🚀 ~ file: product.services.ts:104 ~ returnawaitupdateProductRepo ~ product:", product);
            return product;
        })
    } catch (error) {
        console.log(`🚀 ~ file: product.services.ts:93 ~ updateProductService ~ error: ${error}`)
        throw(error);
    }
}

export const deleteProductService = async () => {
    try {
        const message: any = await productClient.get('deleteProduct', (err, count) => {
            if (err) {
                console.log("Failed to subscribe: %s", err.message);
                return err;
            }
            else {
                console.log("Subscribed successfully! This client is currently subscribed to", count, "channels.");
                return count;
            }
        })
        const redisProductData = JSON.parse(message);
        console.log("🚀 ~ file: product.services.ts:126 ~ deleteProductService ~ redisProductData:", redisProductData);
        return await deleteProductRepo(redisProductData).then(() => {
            return `Product Deleted Successfully!`
        })
    } catch (error) {
        console.log(`🚀 ~ file: product.services.ts:117 ~ deleteProductService ~ error: ${error}`)
        throw(error);
    }
}

export const getProductByNameForOrderServiceService = async () => { 
    try {
        const message: any = await productClient.get('getProductDetails', (err, count) => {
            if (err) {
                console.log("Failed to subscribe: %s", err.message);
                return err;
            }
            else {
                console.log("Subscribed successfully! This client is currently subscribed to", count, "channels.");
                return count;
            }
        })
        const redisProductData = JSON.parse(message);
        console.log("🚀 ~ file: product.services.ts:154 ~ getProductByNameForOrderServiceService ~ redisProductData:", redisProductData);
        return await getProductByNameRepo(redisProductData.name).then((product) => {
            console.log("🚀 ~ file: product.services.ts:156 ~ returnawaitgetProductByNameRepo ~ product:", product);
            return product;
        })
    } catch (error) {
        console.log(`🚀 ~ file: product.services.ts:145 ~ getProductByNameForOrderServiceService ~ error: ${error}`)
        throw(error);
    }
}

export const updateProductsService = async () => {
    try {
        const message: any = await productClient.get('updateProductDetails', (err, count) => {
            if (err) {
                console.log("Failed to subscribe: %s", err.message);
                return err;
            }
            else {
                console.log("Subscribed successfully! This client is currently subscribed to", count, "channels.");
                return count;
            }
        })
        const redisProductData = JSON.parse(message);
        console.log("🚀 ~ file: product.services.ts:178 ~ updateProductsService ~ redisProductData:", redisProductData)
        return await updateProductByNameRepo(redisProductData)
    } catch (error) {
        console.log(`🚀 ~ file: product.services.ts:169 ~ updateProductsService ~ error: ${error}`)
        throw(error);
    }
}

export const getProductsByRegexService = async () => {
    try {
        const message: any = await productClient.get('getProductsByRegex', (err, count) => {
            if (err) {
                console.log("Failed to subscribe: %s", err.message);
                return err;
            }
            else {
                console.log("Subscribed successfully! This client is currently subscribed to", count, "channels.");
                return count;
            }
        })
        const redisProductData = JSON.parse(message);
        console.log("🚀 ~ file: product.services.ts:199 ~ getProductsByRegexService ~ redisProductData:", redisProductData);
        return await getProductsByRegexRepo(redisProductData)
    } catch (error) {
        console.log("🚀 ~ file: product.services.ts:190 ~ getProductsByRegexService ~ error:", error)
        throw (error);
    }
}

export const addProductReviewService = async () => {
    try {
        const message: any = await productClient.get('addReviewForProduct', (err, count) => {
            if (err) {
                console.log("Failed to subscribe: %s", err.message);
                return err;
            }
            else {
                console.log("Subscribed successfully! This client is currently subscribed to", count, "channels.");
                return count;
            }
        })
        const redisProductData = JSON.parse(message);
        console.log("🚀 ~ file: product.services.ts:220 ~ addProductReviewService ~ redisProductData:", redisProductData);
        return await updateProductReviewByIdRepo(redisProductData.id, redisProductData.review, redisProductData.customer)
    } catch (error) {
        console.log("🚀 ~ file: product.services.ts:211 ~ addProductReviewService ~ error:", error)
        throw(error);
    }
}

export const addProductRatingService = async () => {
    try {
        const message: any = await productClient.get('addRatingForProduct', (err, count) => {
            if (err) {
                console.log("Failed to subscribe: %s", err.message);
                return err;
            }
            else {
                console.log("Subscribed successfully! This client is currently subscribed to", count, "channels.");
                return count;
            }
        })
        const redisProductData = JSON.parse(message);
        return await updateProductRatingByIdRepo(redisProductData.id, redisProductData.rating, redisProductData.customer)
    } catch (error: any) {
        console.log("🚀 ~ file: product.services.ts:232 ~ addProductRatingService ~ error:", error.message)
        throw(error.message);
    }
}

export const getAllProductsByPaginationService = async (skip: number| any, limit: number| any, latest: boolean) => {
    try {
        console.log("🚀 ~ file: product.services.ts:250 ~ getAllProductsByPaginationService ~ skip, limit, latest :", skip, limit, latest);
        return await getAllProductsByPaginationRepo(skip, limit, latest)
        
    } catch (error) {
        console.log("🚀 ~ file: product.services.ts:252 ~ getAllProductsByPaginationService ~ error:", error)
        throw(error);
    }
}

export const getProductByIdService = async (productId: string) => {
    try {
        return await getProductByIdRepo(productId)
    } catch (error) {
        console.log("🚀 ~ file: product.services.ts:263 ~ getProductByIdService ~ error:", error)
        throw(error);
    }
}

export const updateProductQuantityService = async () => {
    try {
        const message: any = await productClient.get('cancelOrder', (err, count) => {
            if (err) {
                console.log("Failed to subscribe: %s", err.message);
                return err;
            }
            else {
                console.log("Subscribed successfully! This client is currently subscribed to", count, "channels.");
                return count;
            }
        })
        const redisProductData = JSON.parse(message);
        console.log("🚀 ~ file: product.services.ts:281 ~ updateProductQuantityService ~ redisProductData:", redisProductData);
        return await updateProductQuantityRepo(redisProductData);
    } catch (error) {
        console.log("🚀 ~ file: product.services.ts:272 ~ updateProductQuantityService ~ error:", error)
        throw(error);
    }
}

export const getProductByKeywordService = async () => {
    try {
        const message: any = await productClient.get('getProductByName', (err, count) => {
            if (err) {
                console.log("Failed to subscribe: %s", err.message);
                return err;
            }
            else {
                console.log("Subscribed successfully! This client is currently subscribed to", count, "channels.");
                return count;
            }
        })
        const redisProductData = JSON.parse(message);
        console.log("🚀 ~ file: product.services.ts:302 ~ getProductByKeywordService ~ redisProductData:", redisProductData);
        return await getProductByKeywordRepo(redisProductData) 
    } catch (error) {
        console.log("🚀 ~ file: product.services.ts:293 ~ getProductByKeywordService ~ error:", error)
        throw(error);
    }
}

export const getProductByCategoryService = async (category: any) => {
    try {
        const message: any = await productClient.get('getProductByCategory', (err, count) => {
            if (err) {
                console.log("Failed to subscribe: %s", err.message);
                return err;
            }
            else {
                console.log("Subscribed successfully! This client is currently subscribed to", count, "channels.");
                return count;
            }
        })
        const redisProductData = JSON.parse(message);
        console.log("🚀 ~ file: product.services.ts:323 ~ geetProductByCategoryService ~ redisProductData:", redisProductData);
        let data="";
        if(redisProductData !== null){
            data = redisProductData
        }
        else{
            data = category
        }
        console.log("dataa  =====> ",data);
        return await getProductByCategoryRepo(data);

    } catch (error) {
        console.log("🚀 ~ file: product.services.ts:314 ~ geetProductByCategoryService ~ error:", error)
        throw(error);
    }
}

export const getProductByPriceRangeService = async (data: any, category: any) => {
    try {
        console.log("🚀 ~ file: product.services.ts:341 ~ getProductByPriceRangeService ~ data:", data, category)
        const {startingPrice, endingPrice} = data;
        return await getProductByPriceRange(startingPrice, endingPrice, category)
    } catch (error) {
        console.log("🚀 ~ file: product.services.ts:344 ~ getProductByPriceRangeService ~ error:", error)
        throw(error);
    }
}

export const updateProductRatingService = async () => {
    try {
        return await getAllProductsRepo().then(async (products: any) => {
            await Promise.each(products, async (product: any) => {
                let avgRating: any = 0;
                if(product.rating.length > 0){
                    console.log(`ratings found for product ${product.id}`);
                    
                    product.rating.map((obj: any) => {
                        avgRating += obj.rating
                    })
                }else{
                    console.log(`ratings not found for product ${product.id}`);
                    avgRating = 0
                }
                avgRating = avgRating > 0? Number((avgRating / product.rating.length).toFixed(1)) : 0
                console.log("🚀 ~ file: product.services.ts:363 ~ awaitPromise.each ~ avgRating:", avgRating, typeof (avgRating));
                await updateProductRatingRepo(product, avgRating)
            })
        }).then(() => {
            return `Products Data updated............`
        })
    } catch (error) {
        console.log("🚀 ~ file: product.services.ts:355 ~ updateProductRatingService ~ error:", error)
        throw(error);
    }
}

export const getPopularProductsService = async () => {
    try {
        return await getPopularProductRepo()
    } catch (error) {
        console.log("🚀 ~ file: product.services.ts:384 ~ getPopularProductsService ~ error:", error)
        throw(error);
    }
}

export const getBestSellingProductsService = async (category?: string) => {
    try {
        const oldDate = moment().set({h:0, m:0, s:0}).subtract(7, 'days').format();
        console.log("🚀 ~ file: product.services.ts:393 ~ getBestSellingProductsService ~ oldDate:", oldDate)
        const currentDate = moment().format();
        console.log("🚀 ~ file: product.services.ts:395 ~ getBestSellingProductsService ~ currentDate:", currentDate);
        const obj = {
            start: oldDate, 
            end: currentDate,
        }
        return await productClient.set('getBestSellingProducts', JSON.stringify(obj)).then(async () => {
            return await axios.get(`http://localhost:3003/customer/best/selling`).then(async (products: any) => {
                console.log("🚀 ~ file: product.services.ts:400 ~ returnawaitaxios.get ~ products:", products.data.Response.length)
                let data: any =[];
                await Promise.each(products.data.Response, async (product: any) => {
                    product.products.forEach((prod: any) =>{
                        if( category?((prod.category).toLowerCase() === category.toLowerCase()) : (prod.category)){
                            data.push(prod);
                        }
                    })
                });
                console.log(data.flat().length);
                
                let outputData = (data).reduce((cur: any, next: any) => {
                    console.log("🚀 ~ file: product.services.ts:412 ~ data= ~ next:", next)
                    const temp = cur.findIndex((obj: any) => { 
                        if (obj.category === next.category){
                            return obj;
                        }
                    });
                    console.log("🚀 ~ file: product.services.ts:413 ~ data= ~ temp:", temp)
                    if (temp !== -1) {
                        console.log("count updated");
                        cur[temp] = { ...cur[temp], count: cur[temp].count + 1 }
                    } else {
                        console.log("new entry");
                        cur.push({ category: next.category, count: 1 });
                    }
                    return cur;
                }, []);
                outputData = outputData.filter((obj: any) => {
                    if(obj.count >2) {
                        return obj;
                    }
                })
                console.log("🚀 ~ file: product.services.ts:431 ~ outputData ~ outputData:", outputData)
                return {Response:outputData, data: data.length};
            })
        })
    } catch (error) {
        console.log("🚀 ~ file: product.services.ts:393 ~ getBestSellingProductsService ~ error:", error)
        throw(error);
    }
}

export const getProductsByBrandService = async (brand: any) => {
    try {
        console.log("🚀 ~ file: product.services.ts:443 ~ getProductsByBrandService ~ brand:", brand)
        return await getProductsByBrandRepo(brand)
    } catch (error) {
        console.log("🚀 ~ file: product.services.ts:446 ~ getProductsByBrandService ~ error:", error)
        throw(error);
    }
}

export const getProductsByfilterDataService = async (filter: any) => {
    try {
        console.log("🚀 ~ file: product.services.ts:460 ~ getProductsByfilterDataService ~ filter:", filter);
        let dbData: any = {};
        for (const type in filter) {
            if(filter[type].length !== 0 ){
                if(filter[type] === 'price'){
                    dbData['minPrice'] = filter[type][0];
                    dbData['maxPrice'] = filter[type][1];
                }else{
                    dbData[type] = filter[type] 
                }
            }
        }
        return await getProductsByfilterDataRepo(dbData)
    } catch (error) {
        console.log("🚀 ~ file: product.services.ts:456 ~ getProductsByfilterDataService ~ error:", error)
        throw(error);
    }
}

export const addFAQToProductService = async () => {
    try {
        const message: any = await productClient.get('addFAQForProduct', (err, count) => {
            if (err) {
                console.log("Failed to subscribe: %s", err.message);
                return err;
            }
            else {
                console.log("Subscribed successfully! This client is currently subscribed to", count, "channels.");
                return count;
            }
        })
        const redisProductData = JSON.parse(message);        
        console.log("🚀 ~ file: product.services.ts:484 ~ addFAQToProductService ~ redisProductData:", redisProductData);
        const { data, id } = redisProductData;
        return await updateProductFAQRepo(id, data)
    } catch (error) {
        console.log("🚀 ~ file: product.services.ts:475 ~ addFAQToProductService ~ error:", error)
        throw(error);
    }
}
