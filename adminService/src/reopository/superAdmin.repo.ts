import { SuperAdmin } from "../entity/superAdmin"
import { AppDataSource } from "../data-source"

const superAdminRepo = AppDataSource.getRepository(SuperAdmin);

export const saveSuperAdminRepo = async (admin: any) => {
    console.log("🚀 ~ file: admin.repo.ts:7 ~ saveAdmin ~ admin:", admin)
    return await superAdminRepo.save(admin);
}

export const getSuperAdminByEmailRepo = async (email: string) => {
    return await superAdminRepo.findOne({ where: { email: email , isSuperAdminDeleted: false} });
}

export const getSuperAdminByParamsRepo = async (data:any) => {
    console.log("🚀 ~ file: admin.repo.ts:16 ~ getAdminByParams ~ data:", data)
    return await superAdminRepo.findOne({ where: {...data, isSuperAdminDeleted: false}})
}

export const updateSuperAdminRepo = async (id: string, data: any) => {
    return await superAdminRepo.update(id,  {...data} ).then(async () => {
        return await getSuperAdminByParamsRepo({id: id, isSuperAdminDeleted: false})
    })
}