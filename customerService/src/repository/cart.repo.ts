import { Cart } from "../entity/cart";
import { AppDataSource } from "../data-source";
import { Between, In, MoreThan } from "typeorm";

const cartRepo = AppDataSource.getRepository(Cart);

export const addToCartRepo = async (data: any) => {
    return await cartRepo.findOne({where:{customerId: data.customerId, productId: data.productId}}).then(async (cartData: any) => {
        console.log("🚀 ~ file: cart.repo.ts:9 ~ returnawaitcartRepo.findOne ~ cartData:", cartData)
        if(cartData === null || cartData === undefined){
            return await cartRepo.save(data);
        }else{
            return 'Product Already In Cart!'
        }
    })
}

export const getCartByCustomerIdRepo = async (customerId: string) => {
    return await cartRepo.findOne({where: {customerId: customerId}});
}

export const deleteProductFromCart = async (ids: string[], customerId: string) => {
    console.log("🚀 ~ file: cart.repo.ts:23 ~ deleteProductFromCart ~ customerId:", customerId)
    console.log("🚀 ~ file: cart.repo.ts:23 ~ deleteProductFromCart ~ ids:", ids)
    return await cartRepo.delete({customerId: customerId, productId: In(ids)})
}

export const removeCarts = async (now: any, date: any) => {
    return await cartRepo.find({ where: {updatedAt:MoreThan(date)} }).then(async (carts: any) => {
        await carts.map(async (cart: any) => {
            await cartRepo.delete({id: cart.id})
        })
    })
}

export const getCartProductsRepo = async (date: any) => {
    return await cartRepo.find({
        where:{
            createdAt: Between((date.start), (date.end))
        }
    })
}

export const getProductFromCartRepo = async (customerId: string, productId: string) => {
    return await cartRepo.findOne({
        where:{
            customerId: customerId,
            productId: productId,
        }
    })
}

export const removeProductFromCartRepo = async (id: string) => {
    return await cartRepo.delete({id: id});
}
