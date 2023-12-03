import { MoreThan } from "typeorm";
import { AppDataSource } from "../data-source";
import { Members } from "../entity/members";

const membersRepo = AppDataSource.getRepository(Members);

export const addCustomerToPlan = async (data: any) => {
    return await membersRepo.save(data);
}

export const getCustomersCurrentMembership = async (customerId: string, startDate: string) => {
    return await membersRepo.findOne({
        where:{
            customerId: customerId,
            end_date: MoreThan(startDate)
        },
        order:{
            end_date: 'DESC'
        }
    })
}