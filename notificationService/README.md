# Notification Service

The Notification Service is a crucial backend component of the shopping website, responsible for handling various email and SMS notifications to 
enhance communication with administrators and customers. This service seamlessly integrates with SendGrid for sending email notifications for 
every customer interaction, including order placement, order cancellation, registration, password reset, feedback submission, and more. 
Additionally, Twilio is utilized for sending SMS alerts to customers, ensuring timely and relevant communication.

This README file provides an overview of the features and functionalities available in the Notification Service, including the API endpoints for 
sending different types of notifications.



## Steps to Run This Project

Follow these steps to run the Notification Service project:

1. Run the following command to install the required dependencies:
   npm install

2. Set up the email service provider settings inside the `config.js` file. Replace the placeholders with your email service provider configuration.

3. Run the following command to start the project:
   npm start


After completing these steps, the Notification Service will be up and running, and it will handle various email notifications for administrators 
and customers based on the specified triggers.


# NOTE : -
Please ensure that you have Node.js and npm (Node Package Manager) installed on your system before running the project. 
Additionally, configure the database settings appropriately to ensure proper database connectivity.


## Features and API Endpoints :-

# sendAdminRegisterEmail: POST /notification/admin/register - Sends an email notification to administrators upon successful registration.

# sendCustomerRegisterEmail: POST /notification/customer/register - Sends a welcome email to customers after successful registration.

# sendForgotPasswordEmail: POST /notification/admin/forgot/password - Sends an email to administrators who initiate the password reset process.

# sendCustomerForgotPasswordEmail: POST /notification/customer/forgot/password - Sends an email to customers who initiate the password reset process.

# sendCustomerResetPasswordEmail: POST /notification/customer/reset/password - Sends an email to customers after successfully resetting their passwords.

# sendCustomerForceResetPasswordEmail: POST /notification/customer/force/reset - Sends an email to customers when their password is forcefully reset by an administrator.

# sendPlacedOrderEmail: POST /notification/order/placed - Sends an email notification to customers upon successfully placing an order.

# sendFeedbackEmail: POST /notification/feedback - Sends an email notification to the website administrators when a customer submits feedback.

# sendCancelOrderEmail: POST /notification/cancel/order - Sends an email notification to customers when an order is canceled.




## Summary

The Notification Service is an integral part of the shopping website's backend, responsible for managing email notifications for administrators 
and customers. It facilitates seamless communication by sending email notifications for various events, such as administrator registration, 
password reset, order placement, feedback submission, order cancellation, customer registration, and customer password reset. 
By handling these notifications, the Notification Service enhances the overall user experience and ensures effective communication between 
the shopping website and its users.

