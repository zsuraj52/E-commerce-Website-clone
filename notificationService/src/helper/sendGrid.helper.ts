
export const superAdminRegisterHtml = async (data: any) => {
    try {
        console.log("🚀 ~ file: sendGrid.helper.ts:2 ~ superAdminRegisterHtml ~ data:", data)
        return `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Welcome to Shippr - Your Super Admin Account is Ready!</title>
        </head>
        <body>
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                <h2>Welcome to Shippr - Your Super Admin Account is Ready!</h2>
                <p>Dear ${data.name},</p>
                <p>Congratulations and welcome to Shippr, your go-to e-commerce platform for seamless shopping experiences! We are thrilled to have you on board as a Super Admin, and we are excited to work together in shaping the future of our online marketplace.</p>
                <p>Your Super Admin account has been successfully registered, and now you have full access to Shippr's powerful admin panel, enabling you to manage every aspect of our platform efficiently.</p>
                <p><strong>Here are your Super Admin credentials:</strong></p>
                <ul>
                    <li><strong>Username:</strong> ${data.username}</li>
                    <li><strong>Password:</strong> ${data.password}</li>
                </ul>
                <p>Please keep your credentials secure and do not share them with anyone for security purposes.</p>
                <p>As a Super Admin, you have access to a wide range of features, including managing products, sales reports, membership plans, discount coupons, and much more. You play a vital role in ensuring that our customers have the best shopping experience possible.</p>
                <p>Should you encounter any issues or need any assistance while navigating through our platform, our dedicated support team is always ready to help you. Feel free to reach out to us at ${data.customerSupportEmail} or +91 ${data.contactNumber}.</p>
                <p><strong>Please click the button below to verify your email:</strong></p>
                <a href="http://localhost:3000/admin/super/verify/email" style="display: inline-block; padding: 10px 20px; background-color: #32CD32; color: #fff; text-decoration: none; border-radius: 4px;">Verify Email</a>
                <p>We want to take this opportunity to express our gratitude for joining the Shippr family. Together, we will continue to deliver exceptional service and innovation to our customers.</p>
                <p>Thank you for your commitment to Shippr. We look forward to building a successful and prosperous partnership.</p>
                <p>Happy managing, and welcome aboard!</p>
                <br>
                <p>Best regards,</p>
                <p>Shippr Team</p>
            </div>
        </body>
        </html>`
    } catch (error) {
        console.log("🚀 ~ file: sendGrid.helper.ts:5 ~ superAdminRegisterHtml ~ error:", error)
        throw (error);
    }
};

export const assetManagerReisterHtml = async (data: any) => {
    try {
        console.log("🚀 ~ file: sendGrid.helper.ts:45 ~ assetManagerReisterHtml ~ data:", data)
        return `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Welcome to Shippr - Your Asset Manager Account is Ready!</title>
        </head>
        <body>
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                <h2>Welcome to Shippr - Your Asset Manager Account is Ready!</h2>
                <p>Dear ${data.name},</p>
                <p>Congratulations and welcome to Shippr! We are excited to have you join us as an Asset Manager, responsible for managing products and customers on our e-commerce platform. Your skills and expertise will play a crucial role in delivering outstanding shopping experiences to our valued customers.</p>
                <p>Your Asset Manager account has been successfully registered, and we are thrilled to provide you with the necessary tools and access to ensure smooth and efficient product management and customer support.</p>
                <p>Here are your Asset Manager credentials:</p>
                <ul>
                    <li><strong>Username:</strong> ${data.username}</li>
                    <li><strong>Password:</strong> ${data.password}</li>
                </ul>
                <p>Please keep your credentials secure and do not share them with anyone for security purposes.</p>
                <p>If you require any assistance or have questions during your onboarding process or while managing assets, please do not hesitate to reach out to our support team at ${data.customerSupportEmail} or +91 ${data.contactNumber}. We are here to help you succeed!</p>
                
                <p><strong>Please click the button below to verify your email:</strong></p>
                <a href="http://localhost:3000/admin/super/verify/email" style="display: inline-block; padding: 10px 20px; background-color: #32CD32; color: #fff; text-decoration: none; border-radius: 4px;">Verify Email</a>
        
                <p>We want to take this opportunity to extend our warmest welcome to you and express our gratitude for becoming a part of the Shippr family. Together, we will continue to deliver exceptional shopping experiences to our customers.</p>
                <p>Thank you for your commitment to Shippr. We look forward to a successful and rewarding journey together!</p>
                <p>Best regards,</p>
                <p>Shippr Team</p>
            </div>
        </body>
        </html>`
    } catch (error) {
        console.log("🚀 ~ file: sendGrid.helper.ts:48 ~ assetManagerReisterHtml ~ error:", error)
        throw (error);
    }
}

export const adminForgotPasswordEmail = async (data: any) => {
    try {
        console.log("🚀 ~ file: sendGrid.helper.ts:85 ~ AdminForgotPasswordEmail ~ data:", data)
        return `<!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Password Reset - Shippr</title>
        </head>
        <body>
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                <h2>Password Reset - Shippr</h2>
                <p>Dear ${data.name},</p>
                <p>We have received a request to reset your password on Shippr.</p>
                <p>Here is your temporary newly generated password:</p>
                <p><strong>${data.password}</strong></p>
                <p>Please use this temporary password to log in to your account. Once logged in, we strongly recommend changing the password to something more secure and memorable. You can do this by navigating to your account settings and selecting the option to change your password.</p>
                <p>If you did not request a password reset, please contact our support team immediately at ${data.customerSupportEmail} or +91 ${data.contactNumber}.</p>
                <p>Thank you for using Shippr. We hope you have a pleasant experience on our platform!</p>
                <p>Best regards,</p>
                <p>The Shippr Team</p>
            </div>
        </body>
        </html>
        `
    } catch (error) {
        console.log("🚀 ~ file: sendGrid.helper.ts:88 ~ AdminForgotPasswordEmail ~ error:", error)
        throw(error);
    }
}

export const sendSuperAdminWelcomeTextMessage = async (data: any) => {
    console.log("🚀 ~ file: sendGrid.helper.ts:117 ~ sendSuperAdminWelcomeTextMessage ~ data:", data)
    return `
    [Shippr] Welcome to Shippr Super Admin!
    Hello ${data.name},
    
    Thank you for registering as a Super Admin on Shippr! We're delighted to have you as a part of our team.
    Your account has been successfully created. Please keep your login credentials secure.
    As a Super Admin, you will have access to powerful tools to manage and oversee various aspects of our e-commerce platform.
    If you have any questions or need assistance, feel free to reach out to our support team at ${data.customerSupportEmail} or call us at +91 ${data.contactNumber}.
    We look forward to working together to make Shippr a success!
    Best regards,
    The Shippr Team    
    `
}

export const sendAssetManagerWelcomeTextMessage = async (data: any) => {
    console.log("🚀 ~ file: sendGrid.helper.ts:134 ~ sendAssetManagerWelcomeTextMessage ~ data:", data)
    return `
        [Shippr] Welcome to Shippr!
        Hello ${data.name},
        Thank you for registering as an Asset Manager on Shippr! We're excited to have you on board.
        Your account has been successfully created. Please keep your login credentials secure.
        We have received your business and personal details for verification. You will be notified once we approve and confirm your details.
        If you have any questions or need assistance, feel free to reach out to our support team at ${data.customerSupportEmail} or call us at ${data.contactNumber}.
        Happy managing!
        Best regards,
        The Shippr Team
    `
}

export const sendCustomerRegistrationEmail = async (data: any) => {
    console.log("🚀 ~ file: sendGrid.helper.ts:149 ~ sendCustomerRegistrationEmail ~ data:", data)
    return `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Welcome to Shippr</title>
        </head>
        <body>
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                <h2>Welcome to Shippr</h2>
                <p>Dear ${data.name},</p>
                <p>Thank you for registering on Shippr! We are thrilled to have you as a new customer.</p>
                <p>Your account has been successfully created with the following details:</p>
                <ul>
                    <li><strong>Name:</strong> ${data.username}</li>
                    <li><strong>Email:</strong> ${data.email}</li>
                    <li><strong>Phone Number:</strong> ${data.password}</li>
                </ul>
                <p>Start exploring and discover a wide range of products for all your needs.</p>
                <p>If you have any questions or need assistance, feel free to contact our customer support team at ${data.customerSupportEmail} or call us at +91 ${data.contactNumber}.</p>
                <p>Thank you for choosing Shippr. We hope you have a great shopping experience!</p>
                <p>Best regards,</p>
                <p>The Shippr Team</p>
            </div>
        </body>
        </html>
    `;
}

export const sendCustomerWelcomeSMS = async (data: any) => {
    console.log("🚀 ~ file: sendGrid.helper.ts:181 ~ sendCustomerWelcomeSMS ~ data:", data)
    return `
        Welcome to Shippr! 🎉
        Dear ${data.name}, thank you for joining us. Your account is now ready.
        Explore our wide range of products and enjoy a seamless shopping experience. 🛍️
        If you have any questions, feel free to contact our support team at ${data.customerSupportEmail} or call +91${data.contactNumber}.
        Happy shopping with Shippr! 😊
        -The Shippr Team
    `
}

export const sendOrderPlacedEmailToCustomer = async (data: any) => {
    return `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Order Placed - Shippr</title>
        </head>
        <body>
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                <h2>Shippr - Order Placed</h2>
                <p>Hello ${data.name},</p>
                <p>We're happy to let you know that we've received your order. Your Confirmation Number is : s${data.orderId}.</p>
                <p>We will get started on your order right away. When we ship your order, we will send an auto-generated notification email and link so you can see the movement of your package.</p>
                <p>An invoice for your order is attached to this email.</p>

                <p>The transit time will vary based on the method of shipping you chose.In the meantime, if any questions come up, please do not hesitate to connect with us on +91 ${data.contactNumber} or ${data.customerSupportEmail}.</p>
                <p> We are here to help!</p>

                <p style = "color: red"><strong style = "color: red"> NOTE :- </strong> If you would like to cancel your order(s), please see <a href= http://localhost:3003/customer/cancel/order/${data.orderId} > Link </a>.</p>        
                <p>We hope you enjoyed your shopping experience with us and that you will visit us again soon. Cheers!</p>
                <p>Thank you for choosing Shippr. </p>

                <br>
                <p>Best regards,</p>
                <p>The Shippr Team</p>
            </div>
        </body>
        </html>
    `
}
