import {Order} from '../entity/order';
import { AppDataSource } from '../data-source';
import { Between, LessThanOrEqual, MoreThanOrEqual } from 'typeorm';

const orderRepo = AppDataSource.getRepository(Order);

export const createOrderRepo = async (order: any) => {
    return await orderRepo.save(order);
}

export const getOrderByIdRepo = async (id: string) => {
    return await orderRepo.findOne({where:{id: id, isOrderCancelled: false}});
}

export const updateOrderByIdRepo = async (id: string, orderData: any) => {
    return await getOrderByIdRepo(id).then(async (order) => {
        if(order){
            return await orderRepo.update(id, orderData)
        }
    })
}

export const getRecentlyPlacedOrdersRepo = async (dates: any) => {
    console.log("🚀 ~ file: order.repo.ts:24 ~ getRecentlyPlacedOrdersRepo ~ dates:", dates)
    return await orderRepo.find({where: {isOrderCancelled: false, createdAt: Between((dates.start) ,(dates.end))}})
}

export const getAllOrdersForCustomerIdRepo = async (customer: string, data: any) => {
    console.log("🚀 ~ file: order.repo.ts:29 ~ getAllOrdersForCustomerIdRepo ~ data:", data)
    console.log("🚀 ~ file: order.repo.ts:29 ~ getAllOrdersForCustomerIdRepo ~ customer:", customer)
    return await orderRepo.find({
        where:{
            customerId: customer,
            isOrderCancelled: false,
            createdAt: Between((data.start) ,(data.end))
        }
    })   
}
