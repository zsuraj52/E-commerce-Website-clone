import { Interactions } from "../entity/interactions";
import { AppDataSource } from "../data-source";
import moment from "moment";
import { MoreThanOrEqual } from "typeorm";

const interactionRepo = AppDataSource.getRepository(Interactions);

export const saveInteraction = async (interactionObj: any) => {
    
    return await interactionRepo.save(interactionObj)
}

export const saveOrderInteraction = async (interactionObj: any) => {
    return await interactionRepo.save(interactionObj);
}

export const getSuggestionRepoForCustomerRepo = async (customerId: string) => {
    return await interactionRepo.find({ where:{ customerId: customerId, createdAt: MoreThanOrEqual(moment().subtract(1, 'days').toDate())}, select:['keyword'] })
}