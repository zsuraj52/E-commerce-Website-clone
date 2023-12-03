import CryptoJS from "crypto-js";
import dotenv from 'dotenv';
dotenv.config();
import axios from 'axios';
import { Promise } from "bluebird";
import moment from 'moment'
import { superAdminClient } from '../index';
import { registerSuperAdmin, loginSuperAdminDTO } from "../dto/admin.DTO";
import { saveSuperAdminRepo, getSuperAdminByEmailRepo, getSuperAdminByParamsRepo, updateSuperAdminRepo } from "../reopository/superAdmin.repo";
import { createAdminToken } from "../middleware/jwt";
import { generateSalesReport } from "../reports/report";
import { createMembershipPlansRepo, getPlanByIdRepo } from "../reopository/discounts.repo";
import { validateAdminData, validateEmail } from "../helper/admin.helper.services";
import { getAssetManagerByEmailRepo, saveAssetManagerRepo } from "../reopository/assetManager.repo";


export const registerAdminService = async (adminData: registerSuperAdmin) => {
    try {
        console.log("🚀 adminData: ", adminData);
        console.log("Executing functionality for ", adminData.role, " type.");
        await validateAdminData(adminData)

        await validateEmail(adminData.email);
        let email: any;
        if(adminData.role.toLowerCase() === "super admin"){
            email = await getSuperAdminByEmailRepo(adminData.email);
        }
        if(adminData.role.toLowerCase() === "asset manager"){
            email = await getAssetManagerByEmailRepo(adminData.email);
        }
        console.log("🚀 ~ file: admin.service.ts:27 ~ registerAdminService ~ email:", email)
        if (email) {
            throw new Error(`The Admin With Role of ${adminData.role} for Given E-mail Already Exist`);
        }
        const oldPassword = adminData.password;
        adminData.password = CryptoJS.AES.encrypt(adminData.password, String(process.env.ENCRYPTION_KEY)).toString();
        console.log("🚀 ~ file: admin.service.ts:41 ~ registerAdminService ~ adminData.password:", adminData.password)
        adminData.role = adminData.role;
        const adminDBData: any = {
            ...adminData,
            isEmailVerified: false,
            isSuperAdminDeleted: false
        }
        console.log("🚀 adminDBData:",  adminDBData);
        return await createDatabaseEntry(adminData, adminDBData, oldPassword, adminData.role)
    } catch (error: any) {
        console.log("🚀 error:", error.message);
        throw (error);
    }
}

export const loginAdminService = async (loginAdminData: loginSuperAdminDTO) => {
    try {
        let admin: any 
        if(loginAdminData.role.toLowerCase() === "super admin" ){
            admin = await getSuperAdminByEmailRepo(loginAdminData.email);
        }
        if(loginAdminData.role.toLowerCase() === "asset manager") {
            admin = await getAssetManagerByEmailRepo(loginAdminData.email);
        }
        console.log("🚀 ~ file: admin.service.ts:50 ~ loginAdminService ~ admin:", admin);
        if(admin === null) {
            throw new Error(`No Data Found For ${loginAdminData.role} Role, Please Register.`)
        }
        if (admin.role.toLowerCase() !== loginAdminData.role.toLowerCase()) {
            throw new Error('401, UnAuthorized')
        }
        if (!admin) {
            throw new Error('Admin Not Found')
        }
        let adminPassword = CryptoJS.AES.decrypt(admin.password, String(process.env.ENCRYPTION_KEY)).toString(CryptoJS.enc.Utf8);
        console.log("🚀 ~ file: admin.service.ts:55 ~ loginAdminService ~ adminPassword:", adminPassword)

        let comparedPass = (loginAdminData.password === adminPassword);
        console.log("compare Password Output :", comparedPass);

        if (comparedPass === false) {
            console.log("you have Entered Invalid Email or Password.");
            throw new Error("you have Entered Invalid Email or Password , Please Try Again.")
        }

        let jwtToken = await createAdminToken(admin);
        return {
            ...admin,
            token: jwtToken
        }
    } catch (error) {
        console.error("🚀 ~ file: admin.service.ts:46 ~ loginAdminService ~ error:", error)
        throw (error);
    }
}

export const forgotPasswordService = async (data: string) => {
    try {
        console.log("🚀 ~ file: admin.service.ts:127 ~ forgotPasswordService ~ data:", data);
        const admin: any = await getSuperAdminByParamsRepo(data);
        console.log("🚀 ~ file: admin.service.ts:122 ~ forgotPasswordService ~ admin:", admin);
        if (admin === null) {
            throw new Error(`No Admin Found For Given Data, Please Enter Valid Credentials Or Register Yourself`)
        }
        const tempPassword = Math.random().toString(36).slice(-14)
        console.log("🚀 ~ file: admin.service.ts:127 ~ forgotPasswordService ~ tempPassword:", tempPassword);
        admin.password = CryptoJS.AES.encrypt(tempPassword, String(process.env.ENCRYPTION_KEY)).toString();
        console.log("🚀 ~ file: admin.service.ts:129 ~ forgotPasswordService ~ admin:", admin);
        return await updateSuperAdminRepo(admin.id, admin).then(async (admin: any) => {
            console.log("🚀 ~ file: admin.service.ts:131 ~ returnawaitupdateAdminRepo ~ admin:", admin);
            const redisObj: any = {
                email: admin.email,
                name: admin.firstName + " " + admin.lastName,
                password: tempPassword
            };
            const data = admin.role.toLowerCase().split(" ");
            let url = ""
            if (admin.role.toLowerCase() === "super admin") {
                url = `http://localhost:3001/notification/${data[0]}/${data[1]}/forgot/password`
            }
            if (admin.role.toLowerCase() === "asset manager") {
                url = `http://localhost:3001/notification/${data[0]}/${data[1]}/forgot/password`
            }
            console.log("🚀 ~ file: admin.service.ts:144 ~ returnawaitupdateAdminRepo ~ url:", url)

            return await superAdminClient.set('forgotPasswordEvent', JSON.stringify(redisObj)).then(async () => {
                console.log(`message set successfully on adminRegistered channel with data ${JSON.stringify(redisObj)}`);
                return await axios.post(url).then((response: any) => {
                    console.log(`🚀 response  ${response}`);
                    return `An E-mail Is Sent To ${admin.email}, Please Check`;
                }).catch((err) => {
                    console.log("🚀 ~ file: admin.service.ts:152 ~ returnawaitaxios.post ~ err:", err);
                    return err;
                })
            })
        }).catch((err: any) => {
            console.log("🚀 ~ file: admin.service.ts:134 ~ returnawaitupdateAdminRepo ~ err:", err);
            return err;
        })

    } catch (error) {
        console.log("🚀 ~ file: admin.service.ts:123 ~ forgotPasswordService ~ error:", error)
        throw (error);
    }
}

export const resetPasswordService = async (data: any) => {
    try {
        const { oldPassword, confirmNewPassword, newPassword, email } = data;
        console.log("🚀 ~ file: admin.service.ts:169 ~ resetPasswordService ~ \noldPassword =>", oldPassword, "\nconfirmNewPassword => ", confirmNewPassword, "\nnewPassword => ", newPassword, "\nemail => ", email);
        const admin: any = await getSuperAdminByEmailRepo(email);
        console.log("🚀 ~ file: admin.service.ts:171 ~ resetPasswordService ~ admin:", admin);
        const adminPassword = CryptoJS.AES.decrypt(admin.password, String(process.env.ENCRYPTION_KEY)).toString(CryptoJS.enc.Utf8);
        console.log("🚀 ~ file: admin.service.ts:173 ~ resetPasswordService ~ adminPassword:", adminPassword);
        let comparedPass = (oldPassword === adminPassword);
        console.log("compare Password Output:", comparedPass);

        if (comparedPass === false) {
            console.log("you have Entered old password.");
            throw new Error("you have Entered old password , Please Try Again.")
        }
        admin.password = CryptoJS.AES.encrypt(newPassword, String(process.env.ENCRYPTION_KEY)).toString();
        return await updateSuperAdminRepo(admin.id, admin).then(() => {
            console.log("Password Reset Successfully");
            return `Password Reset Successfully`;
        })
    } catch (error) {
        console.log("🚀 ~ file: admin.service.ts:170 ~ resetPasswordService ~ error:", error);
        throw (error);
    }
}

export const verifyEmailService = async (data: any) => {
    try {
        const { email } = data;
        console.log("🚀 ~ file: admin.service.ts:195 ~ verifyEmailService ~ email:", email);
        if (email === null) {
            throw new Error(`Email not found`);
        }
        return await getSuperAdminByEmailRepo(email).then(async (admin: any) => {
            console.log("🚀 ~ file: admin.service.ts:200 ~ returnawaitgetAdminByEmail ~ admin:", admin);
            admin.isEmailVerified = true;
            return await updateSuperAdminRepo(admin.id, admin);
        })
    } catch (error) {
        console.log("🚀 ~ file: admin.service.ts:196 ~ verifyEmailService ~ error:", error);
        throw error;
    }
}

export const getSuperAdminService = async (id: any) => {
    try {
        console.log("🚀 ~ file: admin.service.ts:191 ~ getSuperAdminService ~ id ", id);
        if (id === null) {
            throw new Error(`Please Provide Id`);
        }
        const admin: any = await getSuperAdminByParamsRepo(id);
        console.log("🚀 ~ file: admin.service.ts:199 ~ getSuperAdminService ~ admin:", admin);
        delete admin.password;
        return admin;
    } catch (error) {
        console.log("🚀 ~ file: admin.service.ts:196 ~ getSuperAdminService ~ error:", error);
        throw (error);
    }
}

export const updateSuperAdminService = async (body: any) => {
    try {
        console.log("🚀 ~ file: admin.service.ts:209 ~ updateAdminService ~ body:", body);
        const { id, data } = body;
        if (!id) {
            throw new Error(`Please Provide id`)
        };
        const admin = await getSuperAdminByParamsRepo(id);
        console.log("🚀 ~ file: admin.service.ts:216 ~ updateAdminService ~ admin:", admin)
        if (admin === null) {
            throw new Error(`No Admin Found`)
        }
        if (data.password) {
            data.password = CryptoJS.AES.encrypt(admin.password, String(process.env.ENCRYPTION_KEY)).toString();
        }
        return await updateSuperAdminRepo(id.id, data).then((admin: any) => {
            console.log("🚀 ~ file: admin.service.ts:224 ~ returnawaitupdateAdminRepo ~ admin:", admin);
            delete admin.password;
            return admin;
        })
    } catch (error) {
        console.log("🚀 ~ file: admin.service.ts:212 ~ updateAdminService ~ error:", error);
        throw (error);
    }
}

export const deleteSuperAdminService = async (id: any) => {
    try {
        console.log("🚀 ~ file: admin.service.ts:235 ~ deleteSuperAdminService ~ id:", id);
        if (id.id === null) {
            throw new Error(`Failed to deactivate admin`)
        }
        const admin = await getSuperAdminByParamsRepo(id);
        console.log("🚀 ~ file: admin.service.ts:240 ~ deleteSuperAdminService ~ admin:", admin);
        if (admin === null) {
            throw new Error(`No admin found to deactivate`)
        }
        admin.isSuperAdminDeleted = true;
        return await updateSuperAdminRepo(admin.id, admin).then(() => {
            return `Admin De-activated Successfully!`
        })
    } catch (error) {
        console.log("🚀 ~ file: admin.service.ts:238 ~ deleteSuperAdminService ~ error:", error)
        throw (error);
    }
}

export const generateSalesReportService = async (assetManagerId: string, body: any) => {
    try {
        const reportType = body.reportType;
        const days = (reportType.toLowerCase() === "week") ? 7 : (reportType.toLowerCase() === "month") ? 30 : (reportType.toLowerCase() === "year") ? 365 : 7; 
        console.log("🚀 ~ file: admin.service.ts:398 ~ generateSalesReportService ~ body:", body)
        const prevStart = moment(body.start).subtract(days, 'days').set({ h: 0, m: 0, s: 0 }).format();
        const prevEnd = moment(body.start).subtract(1, 'days').set({ h: 23, m: 59, s: 59 }).format();
        console.log("🚀 ~ file: admin.service.ts:401 ~ generateSalesReportService ~ prevStart, prevEnd:", prevStart, prevEnd)
        console.log("🚀 ~ file: admin.service.ts:398 ~ generateSalesReportService ~ assetManagerId:", assetManagerId);
        const customers: any = await axios.get(`http://localhost:3003/customer/admin/${assetManagerId}`);
        // console.log("🚀 ~ file: admin.service.ts:400 ~ customers ~ customers:", customers.data.Response);
        const orderData: any = await getOrderData(customers.data.Response, body);
        console.log("🚀 ~ file: admin.service.ts:406 ~ generateSalesReportService ~ orderData:", orderData)
        const lastWeekorderData: any = await getOrderData(customers.data.Response, { start: prevStart, end: prevEnd });
        console.log("🚀 ~ file: admin.service.ts:408 ~ generateSalesReportService ~ lastWeekorderData:", lastWeekorderData)
        const mostSaledCategory = await axios.get(`http://localhost:3002/product/best/selling`).then((categories: any) => {
            return categories.data.Response
        })

        const cartProducts: any = await superAdminClient.set('getCartProducts', JSON.stringify(body)).then(async () => {
            return await axios.get(`http://localhost:3003/customer/cart/products`).then((products: any) => {
                return products.data.Response
            })
        });
        console.log("🚀 ~ file: admin.service.ts:421 ~ constcartProducts:any=awaitsuperAdminClient.set ~ cartProducts:", cartProducts)
        console.log("🚀 ~ file: admin.service.ts:414 ~ mostSaledCategory ~ mostSaledCategory:", mostSaledCategory)
        const start = moment(body.start).format('YYYY-MM-DD');
        const end = moment(body.end).format('YYYY-MM-DD');
        return await generateSalesReport(orderData, lastWeekorderData, mostSaledCategory, cartProducts, start, end, prevStart, prevEnd, assetManagerId, reportType).then(() => {
            return { orderData: orderData }
        })
    } catch (error) {
        console.log("🚀 ~ file: admin.service.ts:398 ~ generateSalesReportService ~ error:", error);
        throw (error);
    }
}

export const getOrderData = async (customers: any, body: any) => {
    let totalSales = 0;
    let orderData: any = [];
    await Promise.each(customers, async (customer: any) => {
        const customerId = customer.id;
        console.log("🚀 ~ file: admin.service.ts:404 ~ awaitPromise.each ~ customerId:", customerId)
        await superAdminClient.set('getOrdersForCustomer', JSON.stringify({ customerId: customerId, start: body.start, end: body.end })).then(async () => {
            await axios.get(`http://localhost:3003/customer/order/${customerId}`).then(async (orders: any) => {
                console.log("🚀 ~ file: admin.service.ts:407 ~ awaitaxios.get ~ orders:", orders.data.Response.length)
                await Promise.each(orders.data.Response, (async (order: any) => {
                    orderData.push(order.products);
                }))
            })
        })
    });
    console.log("🚀 ~ file: admin.service.ts:446 ~ awaitPromise.each ~ orderData:", orderData.flat())
    orderData = (orderData.flat()).reduce((cur: any, next: any) => {
        // console.log("🚀 ~ file: product.services.ts:412 ~ data= ~ next:", next)
        const temp = cur.findIndex((obj: any) => {
            if ((obj.category).toLowerCase() === (next.category).toLowerCase()) {
                return obj;
            }
        });
        // console.log("🚀 ~ file: product.services.ts:413 ~ data= ~ temp:", temp)
        if (temp !== -1) {
            cur[temp] = { ...cur[temp], amount: cur[temp].amount + (next.price * next.quantity) }
            totalSales += (next.price * next.quantity)
        } else {
            cur.push({ category: next.category, amount: next.price * next.quantity });
            totalSales += (next.price * next.quantity)
        }
        return cur;
    }, []);
    return { orderData: orderData, totalSales: '₹ ' + (totalSales).toLocaleString('en-IN') };
}

export const createMembershipPlansService = async (data: any) => {
    try {
        console.log("🚀 ~ file: admin.service.ts:470 ~ createMembershipPlansService ~ data:", data)
        const { superAdminId, name, description, price } = data;
        if (!superAdminId || !name || !description || !price) {
            throw new Error('Please Provide All Required Fields')
        }
        return await createMembershipPlansRepo(superAdminId, name, description, price)
    } catch (error) {
        console.log("🚀 ~ file: admin.service.ts:473 ~ createMembershipPlansService ~ error:", error)
        throw (error);
    }
}

export const getPlanByIdService = async (planId: string) => {
    try {
        console.log("🚀 ~ file: admin.service.ts:485 ~ getPlanByIdService ~ planId:", planId)
        return await getPlanByIdRepo(planId);
    } catch (error) {
        console.log("🚀 ~ file: admin.service.ts:488 ~ getPlanByIdService ~ error:", error)
        throw (error);
    }
}

export const verifyAssetManagersBusinessService = async (assetManagerData: any) => {
    try {
        console.log("🚀 ~ file: admin.service.ts:528 ~ verifyAssetManagersBusinessService ~ assetManagerData:", assetManagerData);
        const { fullName, DOB, contactNumber, Email, residentialAddress, Nationality, GovernmentTssuedID, businessName, businessRegistrationNumber, businessAddress, businessType, Website, businessDescription, GSTNumber, bankAccountDetails } = assetManagerData;

    } catch (error) {
        console.log("🚀 ~ file: admin.service.ts:531 ~ verifyAssetManagersBusinessService ~ error:", error)
        throw (error);
    }
}

export const createDatabaseEntry = async (adminData: any, adminDBData: any, oldPassword: string, type: string) => {
    try {
        console.log("🚀 ~ file: admin.service.ts:539 ~ createDataaseEntry ~ adminDBData:", adminDBData)
        
        const dbData = (type.toLowerCase() === "super admin") ? (await saveSuperAdminRepo(adminDBData)) : (type.toLowerCase() === "asset manager") ? (await saveAssetManagerRepo(adminDBData)) :"";
        console.log("🚀 ~ file: admin.service.ts:545 ~ createDatabaseEntry ~ dbData:", dbData);
        const redisObj: any = {
            email: dbData.email,
            name: dbData.firstName + " " + dbData.lastName,
            username: adminData.username + " or " + adminData.email,
            password: oldPassword,
            phoneNumber: adminData.phoneNumber,
            role: adminData.role
        };    
        
        return await superAdminClient.set('AdminRegistered', JSON.stringify(redisObj)).then(async () => {
            console.log("message set successfully on AdminRegistered channel with data, redisObj");
            console.log("after superAdminClient");
            let url = "";
            if (adminData.role.toLowerCase() === "super admin") {
                console.log("for condition super admin");
                const data = adminData.role.split(" ");
                const firstWord = data[0];
                const secondWord = data[1];
                url = `http://localhost:3001/notification/${firstWord}/${secondWord}/register`;
            }
            if (adminData.role.toLowerCase() === "asset manager") {
                console.log("for condition asset manager");
                const data = adminData.role.split(" ");
                const firstWord = data[0];
                const secondWord = data[1];
                url = `http://localhost:3001/notification/${firstWord}/${secondWord}/register`;
            }
            console.log("🚀 ~ file: admin.service.ts:67 ~ returnawaitsuperAdminClient.set ~ url:", url)
            await axios.post(url).then((response) => {
                console.log("response", response.data);
                return response;
            }).catch((err) => {
                console.log("err ", err.data);
            })
            return dbData;
        })
    } catch (error) {
        console.log("🚀 ~ file: admin.service.ts:542 ~ createDataaseEntry ~ error:", error)
        throw(error);
    }
}
