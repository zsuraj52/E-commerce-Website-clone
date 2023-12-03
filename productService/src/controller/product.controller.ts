import { Request, Response } from "express";
import { createProductService, getProductService, getAllProductsService, updateProductService, deleteProductService, getProductByNameForOrderServiceService, updateProductsService, getProductsByRegexService, addProductReviewService, addProductRatingService, getAllProductsByPaginationService, getProductByIdService, updateProductQuantityService, getProductByKeywordService, getProductByCategoryService, getProductByPriceRangeService, updateProductRatingService, getPopularProductsService, getBestSellingProductsService, getProductsByBrandService, getProductsByfilterDataService, addFAQToProductService } from "../services/product.services";


export const createProduct = async (req: Request, res: Response) => {
    return await createProductService() .then((product: any) => {
        console.log("🚀 ~ file: product.controller.ts:6 ~ returnawaitcreateProductService ~ product:", product)
        return res.status(201).send({ Status: "SUCCESS", Response : product});
    }).catch((error: any) => {
        console.log("🚀 ~ file: product.controller.ts:8 ~ returnawaitcreateProductService ~ error:", error)
        return res.status(400).send({ Status: "FAILED", Response : error});
    })
}

export const getProduct = async (req: Request, res: Response) => {
    return await getProductService() .then((product: any) => {
        console.log("🚀 ~ file: product.controller.ts:17 ~ returnawaitgetProductService ~ product:", product)
        return res.status(200).send({ Status: "SUCCESS", Response : product});
    }).catch((error: any) => {
        console.log("🚀 ~ file: product.controller.ts:20 ~ returnawaitgetProductService ~ error:", error)
        return res.status(400).send({ Status: "FAILED", Response : error});
    })
}

export const getAllProducts = async (req: Request, res: Response) => {
    return await getAllProductsService() .then((product: any) => {
        console.log("🚀 ~ file: product.controller.ts:27 ~ returnawaitgetAllProductsService ~ product:", product)
        return res.status(200).send({ Status: "SUCCESS", Response : product});
    }).catch((error: any) => {
        console.log("🚀 ~ file: product.controller.ts:20 ~ returnawaitgetAllProductsService ~ error:", error)
        return res.status(400).send({ Status: "FAILED", Response : error});
    })
}

export const updateProduct = async (req: Request, res: Response) => {
    return await updateProductService() .then((product: any) => {
        console.log("🚀 ~ file: product.controller.ts:37 ~ returnawaitupdateProductService ~ product:", product)
        return res.status(200).send({ Status: "SUCCESS", Response : product});
    }).catch((error: any) => {
        console.log("🚀 ~ file: product.controller.ts:40 ~ returnawaitupdateProductService ~ error:", error)
        return res.status(400).send({ Status: "FAILED", Response : error});
    })
}

export const deleteProduct = async (req: Request, res: Response) => {
    return await deleteProductService() .then((product: any) => {
        console.log("🚀 ~ file: product.controller.ts:46 ~ returnawaitdeleteProductService ~ product:", product)
        return res.status(200).send({ Status: "SUCCESS", Response : product});
    }).catch((error: any) => {
        console.log("🚀 ~ file: product.controller.ts:50 ~ returnawaitdeleteProductService ~ error:", error)
        return res.status(400).send({ Status: "FAILED", Response : error});
    })
}

export const getProductByNameForOrderService = async (req: Request, res:Response) => {
    return await getProductByNameForOrderServiceService() .then((product: any) => {
        console.log("🚀 ~ file: product.controller.ts:62 ~ returnawaitgetProductByNameForOrderServiceService ~ product:", product)
        return res.status(200).send({ Status: "SUCCESS", Response : product});
    }).catch((error: any) => {
        console.log("🚀 ~ file: product.controller.ts:65 ~ returnawaitgetProductByNameForOrderServiceService ~ error:", error)
        return res.status(400).send({ Status: "FAILED", Response : error});
    })
}

export const updateProducts = async (req: Request, res: Response) => {
    return await updateProductsService() .then((product: any) => {
        console.log("🚀 ~ file: product.controller.ts:72 ~ returnawaitupdateProductsServiceService ~ product:", product)
        return res.status(200).send({ Status: "SUCCESS", Response : product});
    }).catch((error: any) => {
        console.log("🚀 ~ file: product.controller.ts:75 ~ returnawaitupdateProductsServiceService ~ error:", error)
        return res.status(400).send({ Status: "FAILED", Response : error});
    })
}

export const getProductsByRegex = async (req: Request, res: Response) => {
    return await getProductsByRegexService() .then((product: any) => {
        console.log("🚀 ~ file: product.controller.ts:77 ~ returnawaitgetProductsByRegexServiceService ~ product:", product)
        return res.status(200).send({ Status: "SUCCESS", Response : product});
    }).catch((error: any) => {
        console.log("🚀 ~ file: product.controller.ts:80 ~ returnawaitgetProductsByRegexServiceService ~ error:", error)
        return res.status(400).send({ Status: "FAILED", Response : error});
    })
}

export const addProductReview = async (req: Request, res: Response) => {
    return await addProductReviewService() .then((product: any) => {
        console.log("🚀 ~ file: product.controller.ts:87 ~ returnawaitaddProductReviewServiceService ~ product:", product)
        return res.status(200).send({ Status: "SUCCESS", Response : product});
    }).catch((error: any) => {
        console.log("🚀 ~ file: product.controller.ts:90 ~ returnawaitaddProductReviewServiceService ~ error:", error)
        return res.status(400).send({ Status: "FAILED", Response : error});
    })
}

export const addProductRating = async (req: Request, res: Response) => {
    return await addProductRatingService() .then((product: any) => {
        console.log("🚀 ~ file: product.controller.ts:97 ~ returnawaitaddProductRatingServiceService ~ product:", product)
        return res.status(200).send({ Status: "SUCCESS", Response : product});
    }).catch((error: any) => {
        console.log("🚀 ~ file: product.controller.ts:100 ~ returnawaitaddProductRatingServiceService ~ error:", error)
        return res.status(400).send({ Status: "FAILED", Response : error});
    })
}

export const getAllProductsByPagination = async (req: Request, res: Response) => {
    return await getAllProductsByPaginationService(req.query.skip, req.query.limit, req.body.latest) .then((product: any) => {
        console.log("🚀 ~ file: product.controller.ts:107 ~ returnawaitgetAllProductsByPaginationServiceService ~ product:", product)
        return res.status(200).send({ Status: "SUCCESS", Response : product});
    }).catch((error: any) => {
        console.log("🚀 ~ file: product.controller.ts:110 ~ returnawaitgetAllProductsByPaginationServiceService ~ error:", error)
        return res.status(400).send({ Status: "FAILED", Response : error});
    })
}

export const getProductById = async (req: Request, res: Response) => {
    return await getProductByIdService(req.params.id) .then((product: any) => {
        console.log("🚀 ~ file: product.controller.ts:117 ~ returnawaitgetProductByIdServiceService ~ product:", product)
        return res.status(200).send({ Status: "SUCCESS", Response : product});
    }).catch((error: any) => {
        console.log("🚀 ~ file: product.controller.ts:120 ~ returnawaitgetProductByIdServiceService ~ error:", error)
        return res.status(400).send({ Status: "FAILED", Response : error});
    })
}

export const updateProductQuantity = async (req: Request, res: Response) => {
    return await updateProductQuantityService() .then((product: any) => {
        console.log("🚀 ~ file: product.controller.ts:127 ~ returnawaitupdateProductQuantityServiceService ~ product:", product)
        return res.status(200).send({ Status: "SUCCESS", Response : product});
    }).catch((error: any) => {
        console.log("🚀 ~ file: product.controller.ts:130 ~ returnawaitupdateProductQuantityServiceService ~ error:", error)
        return res.status(400).send({ Status: "FAILED", Response : error});
    })
}

export const getProductByKeyword = async (req: Request, res: Response) => {
    return await getProductByKeywordService() .then((product: any) => {
        console.log("🚀 ~ file: product.controller.ts:137 ~ returnawaitgetProductByKeywordServiceService ~ product:", product)
        return res.status(200).send({ Status: "SUCCESS", Response : product});
    }).catch((error: any) => {
        console.log("🚀 ~ file: product.controller.ts:140 ~ returnawaitgetProductByKeywordServiceService ~ error:", error)
        return res.status(400).send({ Status: "FAILED", Response : error});
    })
}

export const getProductByCategory = async (req: Request, res: Response) => {
    return await getProductByCategoryService(req.query.category) .then((product: any) => {
        console.log("🚀 ~ file: product.controller.ts:147 ~ returnawaitgetProductByCategoryServiceService ~ product:", product)
        return res.status(200).send({ Status: "SUCCESS", Response : product});
    }).catch((error: any) => {
        console.log("🚀 ~ file: product.controller.ts:150 ~ returnawaitgetProductByCategoryServiceService ~ error:", error)
        return res.status(400).send({ Status: "FAILED", Response : error});
    })
}

export const getProductByPriceRange = async (req: Request, res: Response) => {
    return await getProductByPriceRangeService(req.body, req.query.category) .then((product: any) => {
        console.log("🚀 ~ file: product.controller.ts:157 ~ returnawaitgetProductByPriceRangeServiceService ~ product:", product)
        return res.status(200).send({ Status: "SUCCESS", Response : product});
    }).catch((error: any) => {
        console.log("🚀 ~ file: product.controller.ts:160 ~ returnawaitgetProductByPriceRangeServiceService ~ error:", error)
        return res.status(400).send({ Status: "FAILED", Response : error});
    })
}

export const updateProductRating = async (req: Request, res: Response) => {
    return await updateProductRatingService() .then((product: any) => {
        console.log("🚀 ~ file: product.controller.ts:167 ~ returnawaitupdateProductRatingServiceService ~ product:", product)
        return res.status(200).send({ Status: "SUCCESS", Response : product});
    }).catch((error: any) => {
        console.log("🚀 ~ file: product.controller.ts:170 ~ returnawaitupdateProductRatingServiceService ~ error:", error)
        return res.status(400).send({ Status: "FAILED", Response : error});
    })
}

export const getPopularProducts = async (req: Request, res: Response) => {
    return await getPopularProductsService() .then((product: any) => {
        console.log("🚀 ~ file: product.controller.ts:177 ~ returnawaitgetPopularProductsServiceService ~ product:", product)
        return res.status(200).send({ Status: "SUCCESS", Response : product});
    }).catch((error: any) => {
        console.log("🚀 ~ file: product.controller.ts:180 ~ returnawaitgetPopularProductsServiceService ~ error:", error)
        return res.status(400).send({ Status: "FAILED", Response : error});
    })   
}

export const getBestSellingProducts = async (req: Request, res: Response) => {
    return await getBestSellingProductsService(req.body.category) .then((product: any) => {
        // console.log("🚀 ~ file: product.controller.ts:177 ~ returnawaitgetBestSellingProductsServiceService ~ product:", product)
        return res.status(200).send({ Status: "SUCCESS", Response : product});
    }).catch((error: any) => {
        console.log("🚀 ~ file: product.controller.ts:180 ~ returnawaitgetBestSellingProductsServiceService ~ error:", error)
        return res.status(400).send({ Status: "FAILED", Response : error});
    })
}

export const getProductsByBrand = async (req: Request, res: Response) => {
    return await getProductsByBrandService(req.query.brand) .then((product: any) => {
        return res.status(200).send({ Status: "SUCCESS", Response : product});
    }).catch((error: any) => {
        console.log("🚀 ~ file: product.controller.ts:180 ~ returnawaitgetProductsByBrandServiceService ~ error:", error)
        return res.status(400).send({ Status: "FAILED", Response : error});
    })
}

export const getProductsByfilterData = async (req: Request, res: Response) =>  {
    return await getProductsByfilterDataService(req.body) .then((product: any) => {
        return res.status(200).send({ Status: "SUCCESS", Response : product});
    }).catch((error: any) => {
        console.log("🚀 ~ file: product.controller.ts:180 ~ returnawaitgetProductsByfilterDataServiceService ~ error:", error)
        return res.status(400).send({ Status: "FAILED", Response : error});
    })
}

export const addFAQToProduct = async (req: Request, res: Response) => {
    return await addFAQToProductService() .then((product: any) => {
        return res.status(200).send({ Status: "SUCCESS", Response : product});
    }).catch((error: any) => {
        console.log("🚀 ~ file: product.controller.ts:180 ~ returnawaitaddFAQToProductServiceService ~ error:", error)
        return res.status(400).send({ Status: "FAILED", Response : error});
    })
}
