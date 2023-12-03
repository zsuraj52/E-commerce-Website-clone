# Customer Service


The Customer Service is a crucial component of the shopping website's backend, dedicated to managing customer-related functionalities. This README file provides an overview of the features and functionalities available in the Customer Service.


## Steps to Run This Project

Follow these steps to run the Customer Service project:

1. Run the following command to install the required dependencies:
   npm install

2. Configure the database settings inside the `data-source.ts` file. Replace the database connection details with your database configuration.

3. Run the following command to start the project:
   npm start


After completing these steps, the Customer Service will be up and running, and customers can utilize the various API endpoints to perform a range of actions related to their shopping experience on the website.


# NOTE : -
Please ensure that you have Node.js and npm (Node Package Manager) installed on your system before running the project. 
Additionally, configure the database settings appropriately to ensure proper database connectivity.


## Features and API Endpoints

# createCustomer: POST /customer/create - Allows new customers to register and create an account on the shopping website.

# loginCustomer: POST /customer/login - Enables registered customers to log in using their credentials.

# forgotPassword: POST /customer/forgot/password - Initiates the password reset process for customers who have forgotten their passwords.

# resetPassword: POST /customer/reset/password - Allows customers to reset their passwords after receiving a reset link.

# forceResetPassword: POST /customer/force/reset - Enables website administrators to forcefully reset a customer's password.

# searchProductsByGivenRegex: POST /customer/search/product - Enables customers to search for products using a regular expression.

# addReviewForProduct: POST /customer/add/review/:id - Allows customers to add reviews for products they have purchased.

# addRatingForProduct: POST /customer/add/rating/:id - Enables customers to add ratings to products they have purchased.

# sendFeedBack: POST /customer/feedback - Allows customers to submit feedback to the website administrators.

# addProductToWishlist: POST /customer/add/wishlist - Allows customers to add products to their wishlist.

# removeProductFromWishlist: POST /customer/remove/wishlist - Enables customers to remove products from their wishlist.

# validateCustomerCoupon: POST /customer/validate/coupon - Validates whether a coupon is applicable and valid for a customer's order.

# createOrder: POST /customer/create/order - Facilitates customers in placing new orders for products.

# placeOrderForCustomer: POST /customer/place/order - Allows website administrators to place orders on behalf of customers.

# cancelOrder: POST /customer/cancel/order/:id - Allows customers to cancel their placed orders.

# addProductsToCart: POST /customer/add/to/cart - Enables customers to add products to their cart for later purchase.

# getMembershipPlan: POST /customer/plan - Retrieves the details of a specific membership plan.

# addCustomerToMembershipPlan: POST /customer/add/plan/:customerId - Allows customers to subscribe to a membership plan.

# getProductsSuggestions: GET /customer/suggestions/:id - Provides product suggestions to customers based on their preferences.
 
# getAllProductsFromCart: GET /customer/cart/products - Fetches all products present in a customer's cart.
 
# getAllCustomers: GET /customer/ - Fetches the details of all registered customers.
 
# getAllCustomersForAdminId: GET /customer/admin/:adminId - Fetches the details of all customers associated with a specific administrator.
 
# getCustomer: GET /customer/:id - Retrieves the profile information of a specific customer.
 
# getBestSellingProductsFromOrders: GET /customer/best/selling - Retrieves the best-selling products based on order data.
 
# getAllOrdersForCustomerId: GET /customer/order/:customerId - Retrieves all orders placed by a specific customer.
 
# updateCustomer: PUT /customer/update/:id - Allows customers to update their profile information.
 
# deleteCustomer: DELETE /customer/delete/:id - Permanently removes a customer account from the shopping website.

# removeProductFromCart: DELETE /customer/cart/product - Allows customers to remove products from their cart.



## Summary

The Customer Service is an essential part of the shopping website's backend, providing a comprehensive set of functionalities for managing customer accounts, orders, feedback, and interactions. 
From customer registration and login to placing orders, managing the cart, and utilizing membership plans and coupons, the Customer Service empowers customers with seamless and convenient shopping experiences. Additionally, it supports administrators in handling customer-related tasks and monitoring customer interactions on the website. 
With its wide range of features, the Customer Service plays a crucial role in enhancing customer satisfaction and loyalty, contributing to the overall success of the shopping website.