import { ILike } from "typeorm";
import { AppDataSource } from "../data-source";
import { Discounts } from "../entity";

export const discountsRepo = AppDataSource.getRepository(Discounts);

export const createMembershipPlansRepo = async (adminId: string, name: string, description: string, price:number) => {
    const plan = await discountsRepo.findOne({where:{name:ILike(`${name}`), isPlanDeactivated: false}});
    if(plan){
        throw new Error( 'Plan Already Exist!');
    }
    return await discountsRepo.save({
        adminId: adminId,
        name: name,
        description: description,
        price: price
    })
}

export const getPlanByIdRepo = async (id: string) => {
    return await discountsRepo.findOne({where:{
        id: id
    }})
}

export const getPlanByName = async (name: string) => {
    return await discountsRepo.findOne({
        where:{
            isPlanDeactivated: false,
            name: name
        }
    })
}

export const createDiscountCouponsRepo = async (data: any) => {
    const plan = await getPlanByName(data.name);
    console.log("🚀 ~ file: discounts.repo.ts:37 ~ createDiscountCouponsRepo ~ plan:", plan)
    if(plan){
        throw new Error('Plan with provided name already exists')
    }
    return await discountsRepo.save({...data});
}

export const validateCouponRepo = async (coupon: any) => {
    console.log("🚀 ~ file: discounts.repo.ts:45 ~ validateCouponRepo ~ coupon:", coupon)
    return await discountsRepo.findOne({
        where:{
            name: coupon,
            isPlanDeactivated: false
        }
    }) 
}
