import CryptoJS from "crypto-js";
import dotenv from 'dotenv';
dotenv.config();
import { Promise } from 'bluebird';
import axios from "axios";
import NodeCache from "node-cache";
import fs from 'fs';
import { createCustomerRepo, getCustomerByEmailRepo, getCustomerByIdRepo, createstripeCustomer, updateCustomerByEmail, getAllCustomersRepo, updateCustomerRepo, deleteCustomerRepo, getAllCustomersForassetManagerIdRepo, getCustomerByUsername, updateCustomerPasswordRepo } from "../repository/customer.repo";
import { creatJWTToken } from "../middleware/jwt";
import { customerClient } from "../index";
import { createOrderRepo, getOrderByIdRepo, updateOrderByIdRepo, getRecentlyPlacedOrdersRepo, getAllOrdersForCustomerIdRepo } from "../repository/order.repo";
import { saveInteraction, saveOrderInteraction, getSuggestionRepoForCustomerRepo } from "../repository/interaction.repo";
import { addProductToWishlist, removeProductFromWishlistRepo } from "../repository/wishlist.repo";
import { addToCartRepo, deleteProductFromCart, getCartProductsRepo, getProductFromCartRepo, removeProductFromCartRepo } from "../repository/cart.repo";
import moment from "moment";
import { addCustomerToPlan, getCustomersCurrentMembership } from "../repository/members.repo";
const myCache = new NodeCache();


export const createCustomerService = async (customerData: any) => {
    try {
        console.log("🚀 ~ file: customer.service.ts:16 ~ createCustomerService ~ customerData:", customerData);
        return await getCustomerByEmailRepo(customerData.email).then(async (customer) => {
            console.log("🚀 ~ file: customer.service.ts:18 ~ returnawaitgetCustomerByEmailRepo ~ customer: ", customer);
            if (customer) {
                throw new Error(`Customer with given already exists!`)
            }
            const password = customerData.password
            customerData.password = CryptoJS.AES.encrypt(customerData.password, String(process.env.ENCRYPTION_KEY)).toString();
            customerData.isCustomerDeleted = false;
            customerData.isEmailVerified = false;
            await customerClient.set('createStripeCustomer', JSON.stringify({ email: customerData.email })).then(async () => {
                await axios.post(`http://localhost:3004/payment/customer/create`).then((customer: any) => {
                    console.log("🚀 ~ file: customer.service.ts:28 ~ awaitcustomerClient.set ~ customer:", customer.data.Response)
                    customerData.stripeCustomerId = customer.data.Response.id
                })
            })
            console.log("🚀 ~ file: customer.service.ts:25 ~ returnawaitcreateCustomerRepo ~ customerData:", customerData)
            return await createCustomerRepo(customerData).then(async (customer) => {
                console.log("🚀 ~ file: customer.service.ts:27 ~ returnawaitcreateCustomerRepo ~ customer:", customer);
                return await customerClient.set('customerRegistered', JSON.stringify({ name: customer.firstName + " " + customer.lastName, email: customer.email, phoneNumber: customer.mobile_number, password: password })).then(async () => {
                    return await axios.post(`http://localhost:3001/notification/customer/regitser`).then(() => {
                        return customer;

                    })
                })
            })
        })
    } catch (error) {
        console.error("🚀 ~ file: customer.service.ts:32 ~ createCustomerService ~ error:", error)
        throw (error);
    }
}

export const loginCustomerService = async (data: any) => {
    try {
        console.log("🚀 ~ file: customer.service.ts:26 ~ loginCustomerService ~ data:", data);
        return await getCustomerByEmailRepo(data.email).then(async (customer: any) => {
            console.log("🚀 ~ file: customer.service.ts:29 ~ returnawaitloginCustomerRepo ~ customer:", customer);
            const token = await creatJWTToken(customer);
            delete customer['password'];
            return {
                ...customer,
                token: token
            };

        })
    } catch (error) {
        console.error("🚀 ~ file: customer.service.ts:29 ~ loginCustomerService ~ error:", error);
        throw (error);
    }
}

export const createOrderService = async (orderData: any) => {
    try {
        let redisPaymentObj = {};
        const productArray: any[] = [];
        let subtotal = 0;
        console.log("🚀 ~ file: customer.service.ts:52 ~ createOrderService ~ orderData:", orderData);
        const { products } = orderData;
        const customer = await getCustomerByIdRepo(orderData.customerId);
        return await Promise.each(products, (async (product: any) => {
            console.log("🚀 product line no 83:", product);
            const redisProductObj = { name: product.name };

            return await customerClient.set('getProductDetails', JSON.stringify(redisProductObj)).then(async () => {
                console.log("Message Set to the Channel getProductDetails", redisProductObj);

                return await axios.get(`http://localhost:3002/product/get/name`).then(async (productDBData: any) => {
                    console.log("🚀 ~ file: customer.service.ts:67 ~ awaitaxios.get ~ productDBData:", productDBData.data.Response);
                    if (productDBData.data.Response.quantity < product.quantity) {
                        throw new Error(`The Product ${product.name} Has Less Quantity Than Selected Quantity!`);
                    }
                    const objForProductArray = {
                        name: product.name,
                        quantity: product.quantity
                    }
                    console.log("🚀 ~ file: customer.service.ts:90 ~ awaitaxios.get ~ objForProductArray:", objForProductArray);
                    productArray.push(objForProductArray);
                    subtotal += (product.price * product.quantity);
                    console.log("🚀 subtotal ", subtotal);
                }).catch(async (error: any) => {
                    console.log("🚀 ~ file: customer.service.ts:98 ~ awaitaxios.post ~ error:", error);
                    console.log("Updating quantity if products quantity was removed from db.");
                    await Promise.each(productArray, async (product: any) => {
                        console.log("🚀 ~ file: customer.service.ts:107 ~ awaitPromise.each ~ product:", product)
                        product['type'] = 'add';
                        await customerClient.set('updateProductDetails', JSON.stringify(product)).then(async () => {
                            await axios.put(`http://localhost:3002/product/update/product`).then((product) => {
                                console.log("🚀 ~ file: customer.service.ts:103 ~ awaitaxios.put ~ product:", product.data.Response)
                            })
                        })
                    })
                    throw error;
                })
            }).catch((err) => {
                console.error("🚀 ~ file: customer.service.ts:101 ~ awaitcustomerClient.set ~ err:", err);
                throw err;
            })
        })).then(async () => {
            let total: any = await validateCustomerCouponService({ coupon: orderData.coupon, price: subtotal });
            if (typeof (total) === "string") {
                total = subtotal
            }
            let deliveryCharge = 0
            if (customer?.isFreeDelivery === true) {
                deliveryCharge = 0
            } else {
                const weight = products.reduce((weight: number, product: any) => weight + product.weight, 0);
                deliveryCharge = weight * 10;
            };
            const taxAndServiceFees = (total / 100) * 2;
            total += deliveryCharge;
            console.log("🚀 ~ file: customer.service.ts:142 ~ createOrderService ~ taxAndServiceFees:", taxAndServiceFees)
            total += taxAndServiceFees;
            console.log("🚀 ~ file: customer.service.ts:119 ~ createOrderService ~ total:", total);
            let orderProductObj: any = {};
            orderProductObj['cart'] = orderData.cart;
            if (orderData.paymentMethod === 'paypal') {
                redisPaymentObj = { total: total, items: products };
                console.log("🚀 ~ file: customer.service.ts:98 ~ createOrderService ~ redisPaymentObj:", (redisPaymentObj));
                orderProductObj = await createPaymentObj(orderData, redisPaymentObj, total, productArray, 'paypal');
            }
            if (orderData.paymentMethod === "stripe") {
                const customer: any = await getCustomerByIdRepo(orderData.customerId);
                console.log("🚀 ~ file: customer.service.ts:134 ~ createOrderService ~ customer:", customer);
                redisPaymentObj = { total: total, stripeId: customer?.stripeCustomerId };
                orderProductObj = await createPaymentObj(orderData, redisPaymentObj, total, productArray, 'stripe')
            }
            if (orderData.paymentMethod === "cash") {
                orderProductObj = {
                    paymentLink: "",
                    customerId: orderData.customerId,
                    amount: total,
                    products: orderData.products,
                    billing_address: orderData.billing_address,
                    shipping_address: orderData.shipping_address
                }
            }
            orderProductObj['subtotal'] = subtotal;
            orderProductObj['taxAndServiceFees'] = taxAndServiceFees;
            orderProductObj['deliveryCharge'] = deliveryCharge;
            orderProductObj['grandTotal'] = total;
            console.log("🚀 ~ file: customer.service.ts:172 ~ createOrderService ~ orderProductObj:", orderProductObj)
            const interactionObj: any = {
                customerId: orderData.customerId,
                interaction_type: 'order',
                keyword: [],
                productId: []
            }
            await Promise.each(products, (async (product: any) => {
                const deleteProdQuantiy = { name: product.name, quantity: product.quantity, type: 'subtract' };
                interactionObj.productId.push(product.id);
                interactionObj.keyword.push(product.name);
                return await customerClient.set('updateProductDetails', JSON.stringify(deleteProdQuantiy)).then(async () => {
                    console.log("Message Set to the Channel getProductDetails", deleteProdQuantiy);
                    await axios.put(`http://localhost:3002/product/update/product`)
                })
            }))
            console.log("🚀 ~ file: customer.service.ts:170 ~ returnawaitcreateOrderRepo ~ interactionObj:", interactionObj)
            await saveOrderInteraction(interactionObj).then(() => {
                console.log("interaction saved in db");

            })
            const sucees = await <any>myCache.set('createOrderData', orderProductObj)
            console.log("🚀 ~ file: customer.service.ts:152 ~ createOrderService ~ sucees:", sucees);
            return {
                Message: "Order Payment is Completed, Proceeding to checkout!",
                ...orderProductObj
            }

        })
            .catch((err: any) => {
                console.log("🚀 ~ file: customer.service.ts:119 ~ awaitPromise.each ~ err:", err)
                throw (err);
            })
    } catch (error) {
        console.error("🚀 ~ file: customer.service.ts:202 ~ createOrderService ~ error:", error.data);
        throw (error);
    }
}

export const createPaymentObj = async (orderData: any, redisPaymentObj: any, grandTotal: number, productArray: any[], paymentType: string) => {
    try {
        let paymentLink = "";
        return await customerClient.set(`paymentThrough${paymentType}`, JSON.stringify(redisPaymentObj)).then(async () => {
            return await axios.post(`http://localhost:3004/payment/${paymentType}/checkout`).then(async (payment: any) => {
                console.log("🚀 ~ file: customer.service.ts:127 ~ awaitaxios.post ~ payment:", payment.data.Response);
                paymentLink = paymentType === "stripe" ? payment.data.Response.url : payment.data.Response.approvalUrl;
                console.log("🚀 ~ file: customer.service.ts:131 ~ awaitaxios.post ~ paymentLink:", paymentLink)
                return {
                    paymentLink: paymentLink,
                    customerId: orderData.customerId,
                    amount: grandTotal,
                    products: orderData.products,
                    billing_address: orderData.billing_address,
                    shipping_address: orderData.shipping_address
                }
            }).catch(async (error: any) => {
                console.log("🚀 ~ file: customer.service.ts:130 ~ awaitaxios.post ~ error:", error)
                await Promise.each(productArray, async (product: any) => {
                    product['type'] = 'add';
                    await customerClient.set('updateProductDetails', JSON.stringify(product)).then(async () => {
                        await axios.put(`http://localhost:3002/product/update/product`).then((product) => {
                            console.log("🚀 ~ file: customer.service.ts:134 ~ awaitaxios.put ~ product:", product)
                            console.log("Product Updated....");

                        })
                    })
                })
            })
        }).then((orderData: any) => {
            console.log("🚀 ~ file: customer.service.ts:269 ~ returnawaitcustomerClient.set ~ orderData:", orderData)
            return orderData;
        }).catch((err) => {
            console.log("🚀 ~ file: customer.service.ts:271 ~ returnawaitcustomerClient.set ~ err:", err)
            throw (err);
        })
    } catch (error) {
        console.log("🚀 ~ file: customer.service.ts:244 ~ createPaymentObj ~ error:", error)
        throw (error);
    }
}

export const placeOrderForCustomerService = async () => {
    try {
        let orderData: any = await myCache.get('createOrderData');
        console.log("🚀 ~ file: customer.service.ts:208 ~ placeOrderForCustomerService ~ orderData:", orderData);
        if (orderData === undefined) {
            throw new Error('Failed to create Order')
        }
        delete orderData['paymentLink'];
        orderData.isOrderCancelled = false;
        orderData.orderStatus = "In Process";
        return await createOrderRepo(orderData).then(async (order: any) => {
            console.log("🚀 ~ file: customer.service.ts:215 ~ returnawaitcreateOrderRepo ~ order:", order)
            console.log("Order Placed Successfully");
            console.log("Sending email to customer");
            const customer: any = await getCustomerByIdRepo(orderData.customerId);
            console.log("🚀 ~ file: customer.service.ts:178 ~ returnawaitcreateOrderRepo ~ customer:", customer)
            const customerObj = {
                orderId: order.id,
                subtotal: orderData.subtotal,
                taxAndServiceFees: orderData.taxAndServiceFees,
                deliveryCharge: orderData.deliveryCharge,
                grandTotal: orderData.grandTotal,
                products: orderData.products,
                name: customer?.firstName + " " + customer?.lastName,
                email: customer?.email,
                shipping_address: customer?.shipping_address,
                phoneNumber: customer?.mobile_number,
            }
            const authToken = await geAauthToken();
            console.log("🚀 ~ file: customer.service.ts:274 ~ returnawaitcreateOrderRepo ~ authToken:", authToken)
            return await customerClient.set('sendOrderPlacedEmail', JSON.stringify(customerObj)).then(async () => {
                return await axios.post(`http://localhost:3001/notification/order/placed`).then(async () => {
                    let order_items: any = [];
                    orderData.products.map((product: any, index: number) =>{
                        order_items.push({
                            name: product.name,
                            sku:'sku'+index,
                            units: product.quantity,
                            selling_price: product.price,
                            weight: product.weight
                        }) 
                    })
                    console.log("🚀 ~ file: customer.service.ts:287 ~ returnawaitaxios.post ~ order_items:", order_items)
                    return await axios.post(
                        'https://apiv2.shiprocket.in/v1/external/orders/create/adhoc',
                        {
                            order_id : order.id,
                            order_date: order.createdAt,
                            pickup_location: "Primary",
                            billing_customer_name: customer.firstName,
                            billing_last_name: customer.lastName,
                            billing_address: customer.billing_address.addressLine1,
                            billing_address_2: customer.billing_address.addressLine2,
                            billing_city: customer.billing_address.city,
                            billing_pincode: customer.billing_address.pincode,
                            billing_state: customer.billing_address.state,
                            billing_country: customer.billing_address.country,
                            billing_email: customer.email,
                            billing_phone: customer.mobile_number,
                            shipping_is_billing: true,
                            order_items: order_items,
                            payment_method: "Prepaid",
                            shipping_charges: orderData.deliveryCharge,
                            sub_total: orderData.subtotal,
                            transaction_charges: orderData.taxAndServiceFees,
                            length: 10,
                            breadth: 10,
                            height: 10,
                            weight: 5.3
                        },
                        {
                            headers: {
                                Authorization: `Bearer ${authToken}`,
                            },
                        }
                    ).then(async (shippingOrder: any) => {
                        console.log("🚀 ~ file: customer.service.ts:283 ~ ).then ~ shippingOrder:", shippingOrder.data)
                        if (orderData.cart === true) {
                            const productIds = orderData.products.map((product: any) => {
                                return product.id
                            });
                            console.log("🚀 ~ file: customer.service.ts:233 ~ productIds ~ productIds:", productIds)
                            return await deleteProductFromCart(productIds, orderData.customerId).then(() => {
                                return {
                                    Message: 'Order Placed Successfully',
                                    Response: order
                                }
                            })
                        } else {
                            return {
                                Message: 'Order Placed Successfully',
                                shippingOrderDetails: shippingOrder.data,
                                Response: order
                            };
                        }
                    })
                })
            }).catch(async (err) => {
                console.log("🚀 ~ file: customer.service.ts:236 ~ returnawaitcreateOrderRepo ~ err:", err.data)
                if (orderData.cart === true) {
                    const productIds = orderData.products.map((product: any) => {
                        return product.id
                    });
                    console.log("🚀 ~ file: customer.service.ts:233 ~ productIds ~ productIds:", productIds)
                    return await deleteProductFromCart(productIds, orderData.customerId).then(() => {
                        return {
                            Message: 'Order Placed Successfully',
                            Response: order
                        }
                    })
                } else {
                    return {
                        Message: 'Order Placed Successfully',
                        Response: order
                    };
                }
            })
        }).catch((err) => {
            console.log("🚀 ~ file: customer.service.ts:238 ~ returnawaitcreateOrderRepo ~ err:", err)
            throw ('failed to create order entry');
        })
    } catch (error) {
        console.log("🚀 ~ file: customer.service.ts:209 ~ placeOrderForCustomerService ~ error:", error)
        throw (error);
    }
}

export const createStripePaymentMethodService = async (customer: any) => {
    try {
        console.log("🚀 ~ file: customer.service.ts:171 ~ createStripePaymentMethodService ~ customer:", customer);
        const { firstName, lastName, email } = customer;
        console.log("🚀 ~ file: customer.service.ts:174 ~ createStripePaymentMethodService ~ firstName, lastName, email:", firstName, lastName, email);

        return await createstripeCustomer(email, firstName + " " + lastName).then(async (customer) => {
            console.log("🚀 ~ file: customer.service.ts:177 ~ returnawaitcreatestripeCustomer ~ customer:", customer);
            return await updateCustomerByEmail(email, customer.id)
        })

    } catch (error) {
        console.error("🚀 ~ file: customer.service.ts:175 ~ createStripePaymentMethodService ~ error:", error)
        throw (error);
    }
}

export const getCustomerService = async (customerId: string) => {
    try {
        console.log("🚀 ~ file: customer.service.ts:201 ~ getCustomerService ~ customerId:", customerId)
        return await getCustomerByIdRepo(customerId)
    } catch (error) {
        console.log("🚀 ~ file: customer.service.ts:204 ~ getCustomerService ~ error:", error)
        throw (error);
    }
}

export const getAllCustomersService = async () => {
    try {
        return await getAllCustomersRepo()
    } catch (error) {
        console.log("🚀 ~ file: customer.service.ts:214 ~ getAllCustomersService ~ error:", error)
        throw (error);
    }
}

export const updateCustomerService = async (id: string, data: any) => {
    try {
        return await updateCustomerRepo(id, data)
    } catch (error) {
        console.log("🚀 ~ file: customer.service.ts:223 ~ updateCustomerService ~ error:", error)
        throw (error);
    }
}

export const deleteCustomerService = async (id: string) => {
    try {
        return await deleteCustomerRepo(id);
    } catch (error) {
        console.log("🚀 ~ file: customer.service.ts:232 ~ deleteCustomerService ~ error:", error)
        throw (error);
    }
}

export const searchProductsByGivenRegexService = async (productName: string | any, customerId: string) => {
    try {
        console.log("🚀 ~ file: customer.service.ts:238 ~ searchProductsByGivenRegexService ~ productName:", productName)
        return await customerClient.set('getProductsByRegex', JSON.stringify(productName)).then(async () => {
            return await axios.get(`http://localhost:3002/product/regex`).then(async (products: any) => {
                console.log("🚀 ~ file: customer.service.ts:242 ~ returnawaitaxios.get ~ products:", products.data.Response)
                const interactionObj: any = {
                    customerId: customerId,
                    interaction_type: 'view',
                    keyword: [],
                    productId: []
                }
                products.data.Response.forEach((product: any) => {
                    interactionObj.productId.push(product.id);
                    interactionObj.keyword.push(product.name);
                });
                return await saveInteraction(interactionObj).then(() => {
                    return products.data.Response;
                })
            })
        })
    } catch (error) {
        console.log("🚀 ~ file: customer.service.ts:241 ~ searchProductsByGivenRegexService ~ error:", error)
        throw (error);
    }
}

export const addReviewForProductService = async (productId: string, body: any) => {
    try {
        console.log("🚀 ~ file: customer.service.ts:253 ~ addReviewForProductService ~ productId, review, customerId:", productId, body.review, body.customerId);
        const customer = await getCustomerByIdRepo(body.customerId);
        console.log("🚀 ~ file: customer.service.ts:256 ~ addReviewForProductService ~ customer:", customer);
        return await customerClient.set('addReviewForProduct', JSON.stringify({ id: productId, review: body.review, customer: customer?.firstName + " " + customer?.lastName })).then(async () => {
            return await axios.post(`http://localhost:3002/product/add/review`).then((product) => {
                console.log("🚀 ~ file: customer.service.ts:259 ~ returnawaitaxios.post ~ product:", product.data.Response)
                return product.data.Response;
            })
        })
    } catch (error) {
        console.log("🚀 ~ file: customer.service.ts:256 ~ addReviewForProductService ~ error:", error.data.Response)
        throw (error.data.Response);
    }
}

export const addRatingsForProductService = async (id: string, body: any) => {
    try {
        console.log("🚀 ~ file: customer.service.ts:268 ~ addRatingsForProductService ~ id, rating, customerId:", id, body.rating, body.customerId);
        const customer = await getCustomerByIdRepo(body.customerId);
        console.log("🚀 ~ file: customer.service.ts:271 ~ addRatingsForProductService ~ customer:", customer)
        return await customerClient.set('addRatingForProduct', JSON.stringify({ id: id, rating: body.rating, customer: customer?.firstName + " " + customer?.lastName })).then(async () => {
            return await axios.post(`http://localhost:3002/product/add/rating`).then((product) => {
                console.log("🚀 ~ file: customer.service.ts:274 ~ returnawaitaxios.post ~ product:", product.data.Response)
                return product.data.Response;
            })
        })
    } catch (error) {
        console.log("🚀 ~ file: customer.service.ts:271 ~ addRatingsForProductService ~ error:", error.data.Response)
        throw (error.data.Response);
    }
}

export const sendFeedBackService = async (body: any) => {
    try {
        console.log("🚀 ~ file: customer.service.ts:293 ~ sendFeedBackService ~ body:", body)
        const { customerId } = body;
        return await getCustomerByIdRepo(customerId).then(async (customer) => {
            console.log("🚀 ~ file: customer.service.ts:296 ~ returnawaitgetCustomerByIdRepo ~ customer:", customer)
            const redisEmailObj = {
                name: customer?.firstName + " " + customer?.lastName,
                email: customer?.email,
                subject: body.subject,
                text: body.text,
            }
            console.log("🚀 ~ file: customer.service.ts:303 ~ returnawaitgetCustomerByIdRepo ~ redisEmailObj:", redisEmailObj)
            return await customerClient.set('sendFeedbackEmail', JSON.stringify(redisEmailObj)).then(async () => {
                return await axios.post(`http://localhost:3001/notification/feedback`).then((response) => {
                    console.log("🚀 ~ file: customer.service.ts:307 ~ returnawaitaxios.post ~ response:", response.data)
                    return response.data
                })
            })
        })
    } catch (error) {
        console.log("🚀 ~ file: customer.service.ts:295 ~ sendFeedBackService ~ error:", error)
        throw (error);
    }
}

export const addProductToWishlistService = async (body: any) => {
    try {
        console.log("🚀 ~ file: customer.service.ts:319 ~ addProductToWishlistService ~ body:", body)
        const { productId } = body;
        return await customerClient.set('getProduct', JSON.stringify(productId)).then(async () => {
            return await axios.get(`http://localhost:3002/product/${productId}`).then(async (product: any) => {
                console.log("🚀 ~ file: customer.service.ts:324 ~ returnawaitaxios.get ~ product:", product.data.Response)
                const wishlistObj = {
                    customerId: body.customerId,
                    productId: body.productId,
                    name: product.data.Response[0].name,
                    description: product.data.Response[0].description,
                    price: product.data.Response[0].price
                }
                console.log("🚀 ~ file: customer.service.ts:331 ~ returnawaitaxios.get ~ wishlistObj:", wishlistObj);
                return await addProductToWishlist(wishlistObj)
            })
        })
    } catch (error) {
        console.log("🚀 ~ file: customer.service.ts:321 ~ addProductToWishlistService ~ error:", error)
        throw (error);
    }
}

export const removeProductFromWishlistService = async (body: any) => {
    try {
        console.log("🚀 ~ file: customer.service.ts:343 ~ removeProductFromWishlistService ~ body:", body)
        const { productId, customerId } = body;
        return await removeProductFromWishlistRepo(productId, customerId).then((response) => {
            console.log("🚀 ~ file: customer.service.ts:347 ~ returnawaitremoveProductFromWishlistRepo ~ response:", response)
            return 'Product Is Removed From The Wishlist.'
        })
    } catch (error) {
        console.log("🚀 ~ file: customer.service.ts:346 ~ removeProductFromWishlistService ~ error:", error)
        throw (error);
    }
}

export const cancelOrderService = async (orderId: string) => {
    try {
        console.log("🚀 ~ file: customer.service.ts:377 ~ cancelOrderService ~ orderId:", orderId);
        const order: any = await getOrderByIdRepo(orderId);
        console.log("🚀 ~ file: customer.service.ts:379 ~ cancelOrderService ~ order:", order);
        if (order === null || order === undefined) {
            throw new Error('No Order Found!');
        }
        await Promise.each(order.products, async (product: any) => {
            const obj = {
                id: product.name,
                quantity: product.quantity,
                type: 'add'
            }
            console.log("🚀 ~ file: customer.service.ts:388 ~ awaitPromise.each ~ obj:", obj);
            await customerClient.set('updateProductDetails', JSON.stringify(obj)).then(async () => {
                await axios.put(`http://localhost:3002/product/update/product`).then(() => {
                    console.log("Product's Quantity Updated!");
                })
            })
        })
        const customer = await getCustomerByIdRepo(order.customerId);
        return await customerClient.set('returnPayment', JSON.stringify({ customerId: customer?.stripeCustomerId, amount: order.amount })).then(async () => {
            return await axios.post(`http://localhost:3004/payment/refund`).then(async () => {
                order.isOrderCancelled = true;
                order.orderStatus = "Rejected";
                return await updateOrderByIdRepo(order.id, order).then(async () => {
                    return await customerClient.set('sendCancelOrderEmail', JSON.stringify({
                        orderId: order.id,
                        total: order.amount,
                        products: order.products,
                        name: customer?.firstName + " " + customer?.lastName,
                        email: customer?.email,
                        shipping_address: customer?.shipping_address
                    })).then(async () => {
                        return await axios.post(`http://localhost:3001/notification/cancel/order`).then((response) => {
                            console.log("🚀 ~ file: customer.service.ts:487 ~ returnawaitaxios.post ~ response:", response)
                            return `Order Cancelled Successfully!`
                        })
                    })
                })
            })
        })
    } catch (error) {
        console.log("🚀 ~ file: customer.service.ts:379 ~ cancelOrderService ~ error:", error)
        throw (error);
    }
}

export const getProductsSuggestionsService = async (customerId: string) => {
    try {
        console.log("🚀 ~ file: customer.service.ts:422 ~ getProductsSuggestionsService ~ customerId:", customerId)
        return await getSuggestionRepoForCustomerRepo(customerId).then(async (keywords: any) => {
            console.log("🚀 ~ file: customer.service.ts:424 ~ returnawaitgetSuggestionRepoForCustomerRepo ~ keywords:", keywords);
            let productsArray: any[] = [];
            await Promise.each(keywords, async (obj: any) => {
                await Promise.each(obj.keyword, async (key: string) => {
                    await customerClient.set('getProductByName', JSON.stringify(key)).then(async () => {
                        await axios.get(`http://localhost:3002/product/get/product`).then((product: any) => {
                            console.log("🚀 ~ file: customer.service.ts:430 ~ awaitaxios.get ~ product:", product.data.Response)
                            productsArray.push(product.data.Response);
                        })
                    })
                })
            })
            return productsArray.flat();
        })
    } catch (error) {
        console.log("🚀 ~ file: customer.service.ts:425 ~ getProductsSuggestionsService ~ error:", error)
        throw (error);
    }
}

export const addProductsToCartService = async (data: any) => {
    try {
        console.log("🚀 ~ file: customer.service.ts:501 ~ addProductsToCartService ~ data:", data);
        return await axios.get(`http://localhost:3002/product/${data.product.id}`).then(async (product: any) => {
            console.log("🚀 ~ file: customer.service.ts:505 ~ returnawaitaxios.get ~ product:", product.data.Response)
            const productData = product.data.Response;
            const price = data.product.quantity * productData.price;
            const obj = {
                customerId: data.customerId,
                productId: data.product.id,
                quantity: data.product.quantity,
                price: price,
            }
            console.log("🚀 ~ file: customer.service.ts:513 ~ returnawaitaxios.get ~ obj:", obj);
            return await customerClient.set('updateProductDetails', JSON.stringify({
                name: productData.name,
                quantity: data.product.quantity,
                type: 'subtract'
            })).then(async () => {
                return await axios.put(`http://localhost:3002/product/update/product`).then(async (product) => {
                    return await addToCartRepo(obj).then((cartProduct: any) => {
                        console.log("🚀 ~ file: customer.service.ts:528 ~ returnawaitaddToCartRepo ~ cartProduct:", cartProduct)
                        return {
                            Product: cartProduct
                        }
                    })
                })
            })
        })
    } catch (error) {
        console.log("🚀 ~ file: customer.service.ts:504 ~ addProductsToCartService ~ error:", error)
        throw (error);
    }
}

export const getBestSellingProductsFromOrdersService = async () => {
    try {
        let message: any = await customerClient.get('getBestSellingProducts', (err, count) => {
            if (err) {
                console.error("Failed to subscribe: %s", err.message);
                return err;
            }
            else {
                console.info(`Subscribed successfully! This client is currently subscribed to ${count} channels.`);
                return count;
            }
        })
        console.log("🚀 ~ file: customer.service.ts:571 ~ message ~ message:", message);
        message = JSON.parse(message);
        console.log("🚀 ~ file: customer.service.ts:573 ~ getBestSellingProductsFromOrdersService ~ message:", message)
        return await getRecentlyPlacedOrdersRepo(message).then((orders: any) => {
            console.log("🚀 ~ file: customer.service.ts:573 ~ returnawaitgetRecentlyPlacedOrdersRepo ~ orders:", orders.length)
            fs.writeFileSync('ordersData.text', JSON.stringify(orders))
            return orders;
        })
    } catch (error) {
        console.log("🚀 ~ file: customer.service.ts:563 ~ getBestSellingProductsFromOrdersService ~ error:", error)
        throw (error);
    }
}

export const getAllCustomersForAssetManagerIdService = async (assetManagerId: string) => {
    try {
        console.log("🚀 ~ file: customer.service.ts:587 ~ getAllCustomersForAssetManagerIdService ~ assetManagerId:", assetManagerId);
        return await getAllCustomersForassetManagerIdRepo(assetManagerId);
    } catch (error) {
        console.log("🚀 ~ file: customer.service.ts:590 ~ getAllCustomersForAssetManagerIdService ~ error:", error)
        throw (error);
    }
}

export const getAllOrdersForCustomerIdService = async (customerId: string) => {
    try {
        console.log("🚀 ~ file: customer.service.ts:597 ~ getAllOrdersForCustomerIdService ~ customerId:", customerId)
        const message: any = await customerClient.get('getOrdersForCustomer', (err, count) => {
            if (err) {
                console.error("Failed to subscribe: %s", err.message);
                return err;
            }
            else {
                console.info(`Subscribed successfully! This client is currently subscribed to ${count} channels.`);
                return count;
            }
        })
        const redisCustomerData = JSON.parse(message);
        console.log("🚀 ~ file: customer.service.ts:610 ~ getAllOrdersForCustomerIdService ~ redisCustomerData:", redisCustomerData);
        return await getAllOrdersForCustomerIdRepo(customerId, redisCustomerData).then((orders: any) => {
            console.log("🚀 ~ file: customer.service.ts:612 ~ returnawaitgetAllOrdersForCustomerIdRepo ~ orders:", orders.length);
            return orders
        })
    } catch (error) {
        console.log("🚀 ~ file: customer.service.ts:600 ~ getAllOrdersForCustomerIdService ~ error:", error)
        throw (error);
    }
}

export const getAllProductsFromCartService = async () => {
    try {
        const message: any = await customerClient.get('getCartProducts', (err, count) => {
            if (err) {
                console.error("Failed to subscribe: %s", err.message);
                return err;
            }
            else {
                console.info(`Subscribed successfully! This client is currently subscribed to ${count} channels.`);
                return count;
            }
        })
        const redisCustomerData = JSON.parse(message);
        console.log("🚀 ~ file: customer.service.ts:634 ~ getAllProductsFromCartService ~ redisCustomerData:", redisCustomerData);
        return await getCartProductsRepo(redisCustomerData)
    } catch (error) {
        console.log("🚀 ~ file: customer.service.ts:625 ~ getAllProductsFromCartService ~ error:", error)
        throw (error);
    }
}

export const forgotPasswordService = async (query: any) => {
    try {
        console.log("🚀 ~ file: customer.service.ts:643 ~ forgotPasswordService ~ query:", query)
        const { username, email } = query;
        let customer: any;
        if (query.username) {
            customer = await getCustomerByUsername(username)
        }
        if (query.email) {
            customer = await getCustomerByEmailRepo(email);
        }
        console.log("🚀 ~ file: customer.service.ts:652 ~ forgotPasswordService ~ customer:", customer)
        if (customer === null) {
            throw new Error(`No Customer Found!`)
        }
        return await generateTempPassword(10).then(async (password: string) => {
            console.log("🚀 ~ file: customer.service.ts:657 ~ returnawaitgenerateTempPassword ~ password:", password)
            customer.password = CryptoJS.AES.encrypt(password, String(process.env.ENCRYPTION_KEY)).toString();
            return await customerClient.set('sendForgotPasswordEmail', JSON.stringify({ name: customer.firstName + " " + customer.lastName, email: customer.email, password: password })).then(async () => {
                return await axios.post(`http://localhost:3001/notification/customer/forgot/password`).then(async () => {
                    return await updateCustomerPasswordRepo(customer.id, customer).then((customerData) => {
                        console.log("🚀 ~ file: customer.service.ts:662 ~ returnawaitupdateCustomerByEmail ~ customerData:", customerData)
                        return 'Email Is Sent To The Registered E-mail With Temporary Password. Please Check.'
                    })
                })
            })
        })
    } catch (error) {
        console.log("🚀 ~ file: customer.service.ts:646 ~ forgotPasswordService ~ error:", error)
        throw (error);
    }
}

export const generateTempPassword = async (count: number) => {
    let length = count,
        charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
        retVal = "";
    for (let i = 0, n = charset.length; i < length; ++i) {
        retVal += charset.charAt(Math.floor(Math.random() * n));
    }
    return retVal;
}

export const resetPasswordService = async (body: any) => {
    try {
        console.log("🚀 ~ file: customer.service.ts:686 ~ resetPasswordService ~ body:", body)
        const { oldPassword, confirmNewPassword, newPassword, email } = body;
        return await getCustomerByEmailRepo(email).then(async (customer: any) => {
            console.log("🚀 ~ file: customer.service.ts:690 ~ returnawaitgetCustomerByEmailRepo ~ customer:", customer)
            if (!customer) {
                throw new Error('No Customer Found')
            }
            const customerPassword = CryptoJS.AES.decrypt(customer.password, String(process.env.ENCRYPTION_KEY)).toString(CryptoJS.enc.Utf8);
            console.log("🚀 ~ file: customer.service.ts:695 ~ returnawaitgetCustomerByEmailRepo ~ customerPassword:", customerPassword)
            if (customerPassword !== oldPassword) {
                throw new Error("Old Password Doesn't Match");
            }
            if (newPassword !== confirmNewPassword) {
                throw new Error("New Password & confirmed New Password Doesn't Match");
            }
            customer.password = CryptoJS.AES.encrypt(newPassword, String(process.env.ENCRYPTION_KEY)).toString();
            return await updateCustomerPasswordRepo(customer.id, customer).then(async (customer: any) => {
                console.log("🚀 ~ file: customer.service.ts:704 ~ returnawaitupdateCustomerPasswordRepo ~ customer:", customer)
                await customerClient.set('sendResetPasswordEmail', JSON.stringify({ name: customer.firstName + " " + customer.lastName, email: customer.email })).then(async () => {
                    await axios.post(`http://localhost:3001/notification/customer/reset/password`)
                })
                return await getCustomerByIdRepo(customer.id)
            })
        })
    } catch (error) {
        console.log("🚀 ~ file: customer.service.ts:689 ~ resetPasswordService ~ error:", error)
        throw (error);
    }
}

export const forceResetPasswordService = async (body: any) => {
    try {
        console.log("🚀 ~ file: customer.service.ts:712 ~ forceResetPasswordService ~ body:", body);
        const { email, password } = body;
        return await getCustomerByEmailRepo(email).then(async (customer: any) => {
            console.log("🚀 ~ file: customer.service.ts:716 ~ returnawaitgetCustomerByEmailRepo ~ customer:", customer)
            if (!customer) {
                throw new Error(`Customer Not Found.`);
            }
            customer.password = CryptoJS.AES.encrypt(password, String(process.env.ENCRYPTION_KEY)).toString();
            return await updateCustomerPasswordRepo(customer.id, customer).then(async (customer: any) => {
                console.log("🚀 ~ file: customer.service.ts:722 ~ returnawaitupdateCustomerPasswordRepo ~ customer:", customer)
                await customerClient.set('sendForceResetPasswordEmail', JSON.stringify({ name: customer.firstName + " " + customer.lastName, email: customer.email })).then(async () => {
                    await axios.post(`http://localhost:3001/notification/customer/force/reset`)
                })
                return await getCustomerByIdRepo(customer.id)
            })
        })
    } catch (error) {
        console.log("🚀 ~ file: customer.service.ts:715 ~ forceResetPasswordService ~ error:", error);
        throw (error);
    }
}

export const removeProductFromCartService = async (body: any, productId: any) => {
    try {
        console.log("🚀 ~ file: customer.service.ts:742 ~ removeProductFromCartService ~ body, productId:", body, productId);
        return await getProductFromCartRepo(body.customerId, productId).then(async (product: any) => {
            console.log("🚀 ~ file: customer.service.ts:745 ~ returnawaitgetProductFromCartRepo ~ product:", product)
            if (!product) {
                throw new Error('Product Not Found In Cart or Already Been Removed')
            }
            return await removeProductFromCartRepo(product.id).then(() => {
                return 'Product Removed Successfully!';
            })
        })
    } catch (error) {
        console.log("🚀 ~ file: customer.service.ts:745 ~ removeProductFromCartService ~ error:", error)
        throw (error);
    }
}

export const getMembershipPlanService = async (body: any, planId: any) => {
    try {
        console.log("🚀 ~ file: customer.service.ts:760 ~ getMembershipPlanService ~ body, planId:", body, planId);
        const plan: any = await customerClient.set('getPlan', JSON.stringify(planId)).then(async () => {
            return await axios.get(`http://localhost:3000/admin/plan/${planId}`)
        })
        console.log("🚀 ~ file: customer.service.ts:765 ~ plan ~ plan:", plan.data);
        if (plan.data.Status !== "SUCCESS") {
            throw new Error(`Plan Doesnt Available For Now. Please Try In Sometime`);
        }

        const startDate = moment().format();
        const customerCurrentPlan: any = await getCustomersCurrentMembership(body.customerId, startDate);
        console.log("🚀 ~ file: customer.service.ts:774 ~ getMembershipPlanService ~ customerCurrentPlan:", customerCurrentPlan);
        console.log("String(customerCurrentPlan.end_date) ", (customerCurrentPlan.end_date).toISOString(), "       ", startDate, "    ", moment((customerCurrentPlan.end_date).toISOString()).diff(startDate, 'days') > 0);

        if (customerCurrentPlan) {
            if (moment((customerCurrentPlan.end_date).toISOString()).diff(startDate, 'days') > 0) {
                throw new Error(`You Currently Subscribed to ${customerCurrentPlan.name} plan and it will end on ${(customerCurrentPlan.end_date).toISOString()}`)
            }
        }
        let plan_Id = planId;
        let start_date = startDate;
        let end_date = moment().add(30, 'days').format();
        let price = plan.data.Response.price;
        const customer: any = await getCustomerByIdRepo(body.customerId);
        console.log("🚀 ~ file: customer.service.ts:777 ~ returnawaitaddCustomerToPlan ~ customer:", customer)
        return await customerClient.set('subscribeToMembershipPlan', JSON.stringify({ name: customer?.firstName + " " + customer?.lastName, stripeCustomerId: customer?.stripeCustomerId, amount: plan.data.Response.price })).then(async () => {
            return await axios.post(`http://localhost:3004/payment/customer/membership`).then(async (paymentUrl: any) => {
                return {
                    url: paymentUrl.data.Response,
                    plan_Id: plan_Id,
                    start_date: start_date,
                    end_date: end_date,
                    price: price,
                    customerId: customer.id
                }
            })
        })
    } catch (error) {
        console.log("🚀 ~ file: customer.service.ts:763 ~ getMembershipPlanService ~ error:", error)
        throw (error);
    }
}

export const addCustomerToMembershipPlanService = async (body: any, customerId: string) => {
    try {
        body.customerId = customerId;
        console.log("🚀 ~ file: customer.service.ts:807 ~ addCustomerToMembershipPlanService ~ body:", body)
        return await addCustomerToPlan(body)
    } catch (error) {
        console.log("🚀 ~ file: customer.service.ts:798 ~ addCustomerToMembershipPlanService ~ error:", error)
        throw (error);
    }
}

export const validateCustomerCouponService = async (data: any) => {
    try {
        let couponData: any;
        console.log("🚀 ~ file: customer.service.ts:818 ~ validateCustomerCouponService ~ data:", data)
        if (data.coupon === undefined) {
            return ('No Coupon Found!');
        }
        couponData = await customerClient.set('getCouponByName', JSON.stringify({ coupon: data.coupon })).then(async () => {
            return await axios.post(`http://localhost:3000/asset/manager/validate/coupon`).then((couponData: any) => {
                console.log("🚀 ~ file: customer.service.ts:823 ~ awaitaxios.post ~ couponData:", couponData.data);
                return couponData.data.Response;
            })
        })
        console.log("🚀 ~ file: customer.service.ts:825 ~ couponData ~ couponData:", couponData);
        let amount = 0;
        if (!couponData) {
            throw new Error(`Invalid or Expired Coupon!`)
        }
        if (couponData.type !== "coupon") {
            throw new Error(`Invalid or Expired Coupon!`)
        }
        if (couponData.discountAmount > 0) {
            amount = data.price - couponData.discountAmount
        }
        if (couponData.discountPercentage > 0) {
            if (data.price >= couponData.minTotal) {
                amount = data.price - ((data.price / 100) * (couponData.discountPercentage));
            } else {
                throw new Error(`Cant Apply This Coupon, Minimum Total for this is ${couponData.minTotal}`);
            }
        }
        return amount;
    } catch (error) {
        console.log("🚀 ~ file: customer.service.ts:821 ~ validateCustomerCouponService ~ error:", error)
        throw (error);
    }
}

export const addFAQDataService = async (productId: string, body: any) => {
    try {
        console.log("🚀 ~ file: customer.service.ts:896 ~ addFAQDataService ~ productId:", productId, " & body:", body);
        return await customerClient.set('addFAQForProduct', JSON.stringify({ id: productId, data: body.data })).then(async () => {
            return await axios.post(`http://localhost:3002/product/question`).then((product: any) => {
                console.log("🚀 ~ file: customer.service.ts:901 ~ awaitaxios.post ~ product:", product.data.Response);
                return product.data.Response;
            })
        })
    } catch (error) {
        console.log("🚀 ~ file: customer.service.ts:899 ~ addFAQDataService ~ error:", error)
        throw (error);
    }
}

export const geAauthToken = async () => {
    try {
        return await axios.post(`https://apiv2.shiprocket.in/v1/external/auth/login`,
            {
                email: String(process.env.SHIPROCKET_EMAIL),
                password: String(process.env.SHIPROCKET_PASSWORD)
            }).then((auth: any) => {
                console.log("🚀 ~ file: customer.service.ts:916 ~ geAauthToken ~ auth:", auth.data.token)
                return auth.data.token
            })
    } catch (error) {
        console.log("🚀 ~ file: customer.service.ts:913 ~ geAauthToken ~ error:", error)
        throw (error);
    }
}
