import { Wishlist } from "../entity/wishlist";
import { AppDataSource } from "../data-source";

const wishlistRepo = AppDataSource.getRepository(Wishlist);

export const addProductToWishlist = async (wishlistObj: any) => {
    return await wishlistRepo.save(wishlistObj);
}

export const removeProductFromWishlistRepo = async (productId: string, customerId: string,) => {
    console.log("🚀 ~ file: wishlist.repo.ts:11 ~ removeProductFromWishlistRepo ~ productId ", productId, "customerId ",customerId);
    return await wishlistRepo.delete({customerId: customerId, productId: productId});
}