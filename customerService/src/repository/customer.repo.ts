import dotenv from 'dotenv';
dotenv.config();
const stripe = require('stripe')(process.env.STRIPE_SECRET); 
import { Customer } from "../entity/customer";
import { AppDataSource } from "../data-source";


const customerRepo = AppDataSource.getRepository(Customer);

export const createCustomerRepo = async (customer: any) => {
    return await customerRepo.save(customer);
}

export const getCustomerByEmailRepo = async (email: string) => {
    return await customerRepo.findOne({where: {email: email, isCustomerDeleted: false}});
}

export const getCustomerByIdRepo = async (customerId : string ) => {
    return await customerRepo.findOne({where:{id: customerId, isCustomerDeleted: false}})
}

export const createstripeCustomer = async (email: string, name: string) => {

    return await stripe.customers.create({
        email: email,
        name: name
    })
}

export const updateCustomerByEmail = async (email: string, data:string) => {
    console.log("🚀 ~ file: customer.repo.ts:30 ~ updateCustomerByEmail ~ email, data:", email, data)
    return await getCustomerByEmailRepo(email).then(async(customer: any) => {
        console.log("🚀 ~ file: customer.repo.ts:31 ~ returnawaitgetCustomerByEmailRepo ~ customer:", customer)
        customer['stripeCustomerId'] = data;
        return await customerRepo.update(customer.id, {...customer}).then(async ()=> {
            return await customerRepo.findOne({where:{id: customer.id, isCustomerDeleted: false}})
        })
    })
}

export const getAllCustomersRepo = async () => {
    return await customerRepo.find({where:{isCustomerDeleted: false}})
}

export const updateCustomerRepo = async (id: string, data: any) => {
    return await getCustomerByIdRepo(id).then(async (customer) => {
        console.log("🚀 ~ file: customer.repo.ts:47 ~ returnawaitgetCustomerByIdRepo ~ customer:", customer)
        if(customer === null || customer === undefined){
            throw('Customer Not Found')
        }
        customer = Object.assign(customer, data);
        console.log("🚀 ~ file: customer.repo.ts:52 ~ returnawaitgetCustomerByIdRepo ~ customer:", customer)
        return await customerRepo.update(id, {...customer}).then(async()=>{
            return await getCustomerByIdRepo(id);
        })
    })
}

export const deleteCustomerRepo = async (id: string) => {
    const data = {
        isCustomerDeleted: true
    };
    return await updateCustomerRepo(id, data).then((customer) => {
        return 'Customer De-activated Successfully!'
    })
}

export const getAllCustomersForassetManagerIdRepo = async (admin: string) => {
    return await customerRepo.find({
        where:{
            assetManagerId: admin,
            isCustomerDeleted: false
        }
    })
}

export const getCustomerByUsername = async (username: string) => {
    console.log("🚀 ~ file: customer.repo.ts:78 ~ getCustomerByUsername ~ username:", username)
    return await customerRepo.findOne({
        where:{
            username: username,
            isCustomerDeleted: false,
            isEmailVerified: true
        }
    })
}

export const updateCustomerPasswordRepo = async (id: string, customer: any) => {
    console.log("🚀 ~ file: customer.repo.ts:89 ~ updateCustomerPasswordRepo ~ id:", id)
    console.log("🚀 ~ file: customer.repo.ts:89 ~ updateCustomerPasswordRepo ~ customer:", customer)
    return await customerRepo.update(id, customer)
}
