# Admin Service

The Admin Service is responsible for managing administrators and various functionalities related to the administration of the shopping website. 
This README file provides an overview of the features and APIs available in the Admin Service.



## Steps to Run This Project

Follow these steps to run the Admin Service project:

1. Run the following command to install the required dependencies:
   npm install

2. Setup the database settings inside the `data-source.ts` file. Replace the database connection details with your database configuration.

3. Run the following command to start the project:
   npm start


After completing these steps, the Admin Service will be up and running, and you can start using the various API endpoints to manage administrators 
and perform other administrative tasks.


# NOTE : -
Please ensure that you have Node.js and npm (Node Package Manager) installed on your system before running the project. 
Additionally, configure the database settings appropriately to ensure proper database connectivity.


## Features and API Endpoints

# registerAdmin: POST /admin/register - Allows the registration of new administrators with valid credentials.

# loginAdmin: POST /admin/login - Enables administrators to log in using their registered credentials.

# forgotPassword: POST /admin/forgot/password - Provides functionality to initiate the password reset process for administrators who have forgotten their passwords.

# resetPassword: POST /admin/reset/password - Allows administrators to reset their passwords after receiving a reset link.

# verifyEmail: POST /admin/verify/email - Enables email verification for newly registered administrators.

# createProduct: POST /admin/create/product - Allows administrators to add new products to the shopping website.

# generateSalesReport: POST /admin/report/:adminId - Generates a sales report for the website, providing insights into product performance and revenue.

# createMembershipPlans: POST /admin/plan - Allows administrators to create different membership plans for customers.

# createDiscountCoupons: POST /admin/coupon - Enables administrators to create discount coupons for customers.

# validateCoupon: POST /admin/validate/coupon - Provides functionality to validate whether a coupon is applicable and valid for a customer's order.

# getPlanById: GET /admin/plan/:planId - Retrieves the details of a specific membership plan.

# getAdmin: GET /admin/:id - Retrieves the profile information of a specific administrator.

# getProduct: GET /admin/get/product/:productId - Retrieves the details of a specific product.

# getAllProductsForAdmin: GET /admin/get/products - Retrieves all products associated with a particular administrator.

# updateAdmin: PUT /admin/update/:id - Allows administrators to update their profile information.

# updateProduct: PUT /admin/update/product/:productId - Enables administrators to update the details of a product.

# deleteAdmin: DELETE /admin/delete/:id - Permanently removes an administrator account.

# deleteProduct: DELETE /admin/delete/product/:productId - Permanently removes a product from the shopping website.




## Summary

The Admin Service is a backend component of the shopping website that provides essential functionalities for managing administrators and overseeing 
various aspects of the online store. It allows administrators to register, log in, and reset passwords. 
The service supports email verification for new administrators. Administrators can create, update, and delete products and generate sales reports 
to gain insights into product performance and revenue. Additionally, administrators can create membership plans and discount coupons for customers. 
The Admin Service is designed to streamline administrative tasks and ensure smooth operations for the shopping website.

