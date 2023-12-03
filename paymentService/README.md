# Payment Service

The Payment Service is an integral part of the shopping website's backend, dedicated to handling payment-related functionalities. 
It supports both Stripe and PayPal payment methods, providing a comprehensive payment processing solution. 
This README file provides an overview of the features and functionalities available in the Payment Service.


## Steps to Run This Project

Follow these steps to run the Payment Service project:

1. Run the following command to install the required dependencies:
   npm install

2. Set up the necessary configuration for payment gateways such as Stripe and PayPal.

3. Run the following command to start the project:
   npm start



After completing these steps, the Payment Service will be up and running, and it will handle various payment-related actions for the shopping website.

# NOTE :-
Please ensure that you have Node.js and npm (Node Package Manager) installed on your system before running the project. 
Additionally, configure the payment gateway settings appropriately to enable smooth payment transactions.



## Features and API Endpoints

1. **createStripeCustomer**: `POST /payment/customer/create` - Allows the creation of a new Stripe customer for handling payments.

2. **createPaypalPayment**: `POST /payment/paypal/checkout` - Initiates the checkout process for payments using PayPal.

3. **createStripeCheckout**: `POST /payment/stripe/checkout` - Initiates the checkout process for payments using Stripe.

4. **createStripeRefund**: `POST /payment/refund` - Allows administrators to issue refunds using Stripe.

5. **subscribeToMembershipPlan**: `POST /payment/customer/membership` - Enables customers to subscribe to a membership plan using a payment gateway.



## Summary

The Payment Service plays a critical role in the shopping website's backend by facilitating secure and efficient payment processing. With features for creating Stripe customers, initiating PayPal and Stripe checkout processes, issuing refunds, and enabling customer subscriptions to membership plans, the Payment Service ensures seamless and reliable payment transactions. By integrating with popular payment gateways, the service provides customers with a smooth and secure payment experience, contributing to enhanced customer satisfaction and successful e-commerce operations.