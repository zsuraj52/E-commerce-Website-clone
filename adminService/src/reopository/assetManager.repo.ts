import { AppDataSource } from "../data-source";
import { AssetManager } from "../entity";

const assetManagerRepo = AppDataSource.getRepository(AssetManager);

export const saveAssetManagerRepo = async (assetManager: any) => {
    return await assetManagerRepo.save(assetManager);
}

export const getAssetManagerByEmailRepo = async (email: string) => {
    return await assetManagerRepo.findOne({where:{email: email}})
}

export const getAssetManagerByParamsRepo = async (id: any) => {
    return await assetManagerRepo.findOne({
        where:{...id, isAssetManagerDeleted: false}
    })
}

export const updateAssetManagerRepo = async (id: string, data: any) => {
    return await assetManagerRepo.update(id, {...data}).then(async (assetManager: any) => {
        console.log("🚀 ~ file: assetManager.repo.ts:24 ~ returnawaitassetManagerRepo.update ~ assetManager:", assetManager)
        return await getAssetManagerByEmailRepo(assetManager.email);
    })
}
