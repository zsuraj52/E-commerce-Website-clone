import { Product } from "../entity/Product"
import { AppDataSource } from "../data-source"
import { Between, ILike, LessThanOrEqual, MoreThanOrEqual } from "typeorm";
const productRepo = AppDataSource.getRepository(Product);

export const createProductRepo = async (product: any) => {
    console.log("🚀 ~ file: product.repo.ts:6 ~ createProductRepo ~ product:", product)
    return await productRepo.save(product);
}

export const getProductByAdminIdAndName = async (assetManagerId: string, name: string, category: string) => {
    return await productRepo.findOne({ where: { name: name, assetManagerId: assetManagerId, category: category } });
}

export const getProductByAdminIdAndProductId = async (data: any) => {
    console.log("🚀 ~ file: product.repo.ts:15 ~ getProductByAdminIdAndProductId ~ data:", data)
    return await productRepo.findOne({ where: { assetManagerId: data.assetManagerId, id: data.id, isProductDeleted: false } });
}

export const getAllProducts = async (data: any) => {
    console.log("🚀 ~ file: product.repo.ts:20 ~ getAllProducts ~ data:", data)
    return await productRepo.find({ where: { assetManagerId: data.assetManagerId, isProductDeleted: false } });
}

export const getProductById = async (productId: string) => {
    return await productRepo.findOne({ where: { id: productId as any, isProductDeleted: false } });
}

export const updateProductRepo = async (data: any) => {
    console.log("🚀 ~ file: product.repo.ts:25 ~ updateProductRepo ~ data:", data)
    const productId = data.productId;
    const adminId = data.data.adminId;
    delete data['productId'];
    return await productRepo.update(productId, { ...data.data }).then(async (product) => {
        console.log("🚀 ~ file: product.repo.ts:31 ~ returnawaitproductRepo.update ~ product:", product);
        return await getProductByAdminIdAndProductId({ adminId: adminId, id: productId })
    })
}

export const deleteProductRepo = async (productId: string) => {
    console.log("id", Number(productId));
    return await getProductById(productId).then(async (product) => {
        console.log("🚀 ~ file: product.repo.ts:41 ~ returnawaitgetProductById ~ product:", product)
        if (product === null || product === undefined) {
            throw ('Product Not Found')
        }
        product.isProductDeleted = true;
        return await productRepo.update(productId, { isProductDeleted: true })
    })
}

export const getProductByNameRepo = async (name: string) => {
    return await productRepo.findOne({ where: { name: name, isProductDeleted: false } });
}

export const updateProductByNameRepo = async (prodData: any) => {
    return await getProductByNameRepo(prodData.name).then(async (product: any) => {
        console.log("🚀 ~ file: product.repo.ts:58 ~ returnawaitgetProductByNameRepo ~ product:", product)
        if (prodData.type && prodData.type === 'add') {
            product.quantity = product.quantity + prodData.quantity;
        } else {
            if(product.quantity >= prodData.quantity){
                console.log("decreasing quantity for true condition");
                product.quantity = product.quantity - prodData.quantity;
            }else{
                console.log("quantity for false condition");
                product.quantity = product.quantity;
            }
        }
        return await productRepo.update(product.id, { quantity: product.quantity }).then(async () => {
            const productData: any = await getProductByIdRepo(product.id)
            console.log("🚀 ~ file: product.repo.ts:72 ~ returnawaitproductRepo.update ~ productData:", productData)
            return `Product with name ${productData.name} updated`;
        })
    })
}

export const getProductsByRegexRepo = async (name: string) => {
    return await productRepo.find({ where: { name: ILike(`%${name}%`) || ILike(`${name}%`) || ILike(`%${name}`) } });
}

export const updateProductReviewByIdRepo = async (id: string, data: any, customer: string) => {
    return await getProductById(id).then(async (product: any) => {
        console.log("🚀 ~ file: product.repo.ts:80 ~ returnawaitgetProductById ~ product:", product);
        const res = product.rating.find((obj: any) => {
            return obj.customer === customer
        })
        if (res === undefined || res === null) {
            product.review.push({ review: data, customer: customer });
            console.log("🚀 ~ file: product.repo.ts:85 ~ returnawaitgetProductById ~ product:", product)
            return await productRepo.update(id, { review: product.review }).then(async (product: any) => {
                console.log("🚀 ~ file: product.repo.ts:86 ~ returnawaitproductRepo.update ~ product:", product);
                return await getProductById(id)
            })
        } else {
            return 'You Already Added the Review For This Product'
        }
    })
}

export const updateProductRatingByIdRepo = async (id: string, data: any, customer: string) => {
    return await getProductById(id).then(async (product: any) => {
        console.log("🚀 ~ file: product.repo.ts:80 ~ returnawaitgetProductById ~ product:", product);
        const res = product.rating.find((obj: any) => {
            return obj.customer === customer
        })
        if (res === null || res === undefined) {
            product.rating.push({ rating: data, customer: customer });
            console.log("🚀 ~ file: product.repo.ts:85 ~ returnawaitgetProductById ~ product:", product)
            return await productRepo.update(product.id, { rating: product.rating }).then(async (product: any) => {
                console.log("🚀 ~ file: product.repo.ts:86 ~ returnawaitproductRepo.update ~ product:", product)
                return await getProductById(id)
            }).catch((error) => {
                console.log("🚀 ~ file: product.repo.ts:100 ~ returnawaitproductRepo.update ~ error:", error)
                throw (error);
            })
        } else {
            return 'You Already Added the Ratings For This Product'
        }
    })
}

export const getAllProductsByPaginationRepo = async (skip: any, limit: any, latest: boolean) => {
    const sortBy = latest === true ? 'DESC' : 'ASC';
    return await productRepo.find({
        where: { isProductDeleted: false }, take: limit, skip: skip, order: {
            createdAt: sortBy
        }
    })
}

export const getProductByIdRepo = async (id: string) => {
    return await productRepo.findOne({ where: { id: id, isProductDeleted: false } });
}

export const updateProductQuantityRepo = async (data: any) => {
    return await getProductById(data.id).then(async (product: any) => {
        product.quantity += data.quantity;
        return await productRepo.update(product.id, product)
    })
}

export const getProductByKeywordRepo = async (key: string) => {
    return await productRepo.find({ where: { name: ILike(`%${key}%`) || ILike(`%${key}`) || ILike(`${key}%`), isProductDeleted: false } })
}

export const getProductByCategoryRepo = async (category: string) => {
    console.log("🚀 ~ file: product.repo.ts:140 ~ getProductByCategoryRepo ~ category:", category)
    return await productRepo.find({ where: { category: ILike(`${category.toLowerCase()}`) || ILike(`${category.toLocaleLowerCase()}`), isProductDeleted: false } })
}

export const getProductByPriceRange = async (start: number, end: number, category: string) => {
    return await productRepo.find({ where: { category: ILike(`%${category}`) || ILike(`${category}%`) || ILike(`%${category}%`), price: MoreThanOrEqual(start) && LessThanOrEqual(end), isProductDeleted: false } });
}

export const getAllProductsRepo = async () => {
    return await productRepo.find({ where: { isProductDeleted: false } })
}

export const updateProductRatingRepo = async (product: any, avgRating: number) => {
    return await productRepo.update(product.id, { avg_rating: avgRating })
}

export const getPopularProductRepo = async () => {
    return await productRepo.find({ where: { avg_rating: MoreThanOrEqual(4.5), isProductDeleted: false } })
}

export const getProductsByBrandRepo = async (brand: string) => {
    return await productRepo.find({
        where: {
            brand: ILike(brand) || ILike(brand.charAt(0).toUpperCase() + brand.slice(1)) || ILike(brand.toUpperCase()),
            isProductDeleted: false
        }
    })
}

export const getProductsByfilterDataRepo = async (filter: any) => {
    let minPrice, maxPrice = 0;
    const whereObj: any = {};
    for(const [key, value] of Object.entries(filter)){
        whereObj[key] = value
    };
    if(whereObj.price.length > 0){
        minPrice = filter.price[0] ;
        maxPrice = filter.price[1] ; 
        console.log("🚀 ~ file: product.repo.ts:175 ~ getProductsByfilterDataRepo ~ whereObj:", whereObj)
        return await productRepo.find({
            where:{ 
                ...whereObj, 
                price: Between(minPrice, maxPrice) 
            }
        }) 
    }else{
        return await productRepo.find({
            where:whereObj
        })
    }
}

export const updateProductFAQRepo = async (id: string, data: any) => {
    console.log("🚀 ~ file: product.repo.ts:201 ~ updateProductFAQRepo ~ data:", data)
    console.log("🚀 ~ file: product.repo.ts:201 ~ updateProductFAQRepo ~ id:", id)
    return await productRepo.update(id, {faq: data}).then(async (product: any) => {
        console.log("🚀 ~ file: product.repo.ts:206 ~ returnawaitproductRepo.update ~ product:", product)
        return await getProductById(id)
    })
}
