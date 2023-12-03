import dotenv from 'dotenv'
dotenv.config();
import sgMail from '@sendgrid/mail';
import fs from 'fs';
import PdfPrinter from "pdfmake";
import twilio from 'twilio';
import * as vfsFonts from 'pdfmake/build/vfs_fonts';
import { sendgridUserEmail, contactNumber, customerSupportEmail } from '../constants/constants';
import logger from '../logger/logger';
import { subClient } from '../index';
import { pdfContentService } from './pdf';
import { adminForgotPasswordEmail, assetManagerReisterHtml, sendAssetManagerWelcomeTextMessage, sendCustomerRegistrationEmail, sendCustomerWelcomeSMS, sendOrderPlacedEmailToCustomer, sendSuperAdminWelcomeTextMessage, superAdminRegisterHtml } from '../helper/sendGrid.helper';

const accountSid = String(process.env.ACCOUNT_SID);
const authToken = String(process.env.AUTH_TOKEN);

const client = twilio(accountSid, authToken);

sgMail.setApiKey(process.env.sendGrid_API_KEY)
export const sendAdminRegisterEmailService = async () => {

    const message: any = await subClient.get('AdminRegistered', (err, count) => {
        if (err) {
            logger.error("Failed to subscribe: %s", err.message);
            return err;
        }
        else {
            console.log("Subscribed successfully! This client is currently subscribed to channels.", count);
            return count;
        }
    })
    const surajData = JSON.parse(message);
    const { email, name, username, password, phoneNumber } = surajData;
    console.log("🚀 ~ file: notification.service.ts:28 ~ sendSuperAdminRegisterEmailService ~ email, name:", email, name)
    try {
        if (email === undefined || name === undefined || email.length === 0) {
            throw new Error('Please provide valid e-mail')
        }
        const htmlData = (surajData.role === "super admin") ? 
        await superAdminRegisterHtml({ name: name, username: username, password: password, contactNumber: contactNumber, customerSupportEmail: customerSupportEmail }) :
        (surajData.role === "asset manager") ?
        await assetManagerReisterHtml({ name: name, username: username, password: password, contactNumber: contactNumber, customerSupportEmail: customerSupportEmail }):
        "";
        console.log("🚀 ~ file: notification.service.ts:40 ~ sendAdminRegisterEmailService ~ htmlData:", htmlData)

        return await sgMail.send({
            to: email,
            from: {
                email: sendgridUserEmail,
                name: name
            },
            subject: 'Account Registered successfully!',
            html: htmlData
        }).then(async () => {
            console.log("Email sent to ", email)
            const body = 
            (surajData.role.toLowerCase() === "super admin") ? 
            (await sendSuperAdminWelcomeTextMessage({name: name, customerSupportEmail: customerSupportEmail, contactNumber: contactNumber})) : 
            (surajData.role.toLowerCase() === "asset manager") ? 
            (await sendAssetManagerWelcomeTextMessage({name: name, customerSupportEmail: customerSupportEmail, contactNumber: contactNumber})) : "";
            
            await client.messages.create({
                body: body,
                from: process.env.TWILLIO_NUMBER,
                to: "+91" + (phoneNumber),
            }).then(message => console.log(message.sid))
            return { message: `Email sent to ${email}` };
        }).catch((error) => {
            console.error("Error in sendRegistrationEmail : ", error.message);
            throw new Error(error.message);
        })
    } catch (error) {
        console.error(`🚀 ~ file: notification.service.ts:5 ~ sendRegisterEmailService ~ error: ${error}`)
        throw (error);
    }
}

export const sendCustomerRegisterEmailService = async () => {

    const message: any = await subClient.get('customerRegistered', (err, count) => {
        if (err) {
            console.error("Failed to subscribe: %s", err.message);
            return err;
        }
        else {
            console.log("Subscribed successfully! This client is currently subscribed to channels.", count);
            return count;
        }
    })
    const surajData = JSON.parse(message);
    const { email, name, phoneNumber, password } = surajData;
    console.log("🚀 ~ file: notification.service.ts:91 ~ sendRegisterEmailService ~ email, name:", email, name)
    try {
        if (email === undefined || name === undefined || email.length === 0) {
            throw new Error('Please provide valid e-mail')
        }
        const html = await sendCustomerRegistrationEmail({name: name, email: email, password: password, customerSupportEmail: customerSupportEmail, contactNumber: contactNumber })
        return await sgMail.send({
            to: email,
            from: {
                email: sendgridUserEmail,
                name: name
            },
            subject: 'Account Registered successfully!',
            html: html
        }).then(async () => {
            console.log("Email sent to ", email);
            await client.messages.create({
                body: await sendCustomerWelcomeSMS({name: name, customerSupportEmail: customerSupportEmail, contactNumber: contactNumber }),
                from: process.env.TWILLIO_NUMBER,
                to: "+91" + (phoneNumber),
            }).then(message => console.log(message.sid))
            return { message: `Email sent to ${email}` };
        }).catch((error) => {
            console.error("Error in sendRegistrationEmail : ", error.message);
        })
    } catch (error) {
        console.error(`🚀 ~ file: notification.service.ts:5 ~ sendRegisterEmailService ~ error: ${error}`)
        throw (error);
    }
}

export const sendForgotPasswordEmailToSuperAdminService = async () => {
    try {
        const message: any = await subClient.get('forgotPasswordEvent', (err, count) => {
            if (err) {
                console.error(`Failed to subscribe:  ${err.message}`);
                return err;
            }
            else {
                console.log("Subscribed successfully! This client is currently subscribed to channels.", count);
                return count;
            }
        });
        const surajData = JSON.parse(message);
        const { email, name, password } = surajData;
        console.log("🚀 ~ file: notification.service.ts:75 ~ sendForgotPasswordEmailToSuperAdminService ~ email, password: ", name, email, password);

        if (email === undefined || name === undefined || email.length === 0) {
            throw new Error('Please provide valid e-mail')
        }
        const html = await adminForgotPasswordEmail({name: name, password: password, customerSupportEmail: customerSupportEmail, contactNumber: contactNumber})
        return await sgMail.send({
            to: email,
            from: {
                email: sendgridUserEmail,
                name: name
            },
            subject: 'Forgot Password!',
            html: html
        }).then(() => {
            console.log("ResetE Password Mail Sent To ", email)
            return { message: `Email sent to ${email}` };
        }).catch((error) => {
            console.error("Error in sendForgotPasswordEmailToSuperAdminService : ", error.message);
            throw new Error(error.message);
        })

    } catch (error) {
        console.error(`🚀 ~ file: notification.service.ts:66 ~ sendForgotPasswordEmailToSuperAdminService ~ error: ${error}`)
        throw (error);
    }
}

export const sendPlacedOrderEmailService = async () => {
    try {
        const message: any = await subClient.get('sendOrderPlacedEmail', (err, count) => {
            if (err) {
                console.error(`Failed to subscribe:  ${err.message}`);
                return err;
            }
            else {
                console.log("Subscribed successfully! This client is currently subscribed channels. ", count);
                return count;
            }
        });
        const surajData = JSON.parse(message);
        console.log("🚀 ~ file: notification.service.ts:130 ~ sendPlacedOrderEmailService ~ surajData:", surajData);
        const fileName = `${surajData.name.split(" ").join('')}_${Math.random().toString(36).slice(2)}.pdf`;
        console.log("🚀 ~ file: notification.service.ts:132 ~ sendPlacedOrderEmailService ~ fileName: ", fileName)
        return await generatePDF(surajData, fileName).then(async (response: any) => {
            return await sgMail.send({
                to: surajData.email,
                from: sendgridUserEmail,
                subject: 'Order Placed',
                html: await sendOrderPlacedEmailToCustomer({
                    name: surajData.name,
                    orderId: surajData.orderId,
                    contactNumber : contactNumber,
                    customerSupportEmail : customerSupportEmail,
                }),
                attachments: [
                    {
                        filename: fileName,
                        content: Buffer.from(response.file).toString('base64'),
                        type: 'application/pdf',
                        disposition: 'attachment'
                    }
                ]
            }).then(async () => {
                console.log("Email Sent Successfully!");
                console.log("to ", "+91" + surajData.phoneNumber);

                return await client.messages.create({
                    body: `Your order with ID ${surajData.orderId} has been created successfully.`,
                    from: process.env.TWILLIO_NUMBER,
                    to: "+91" + (surajData.phoneNumber),
                }).then(message => console.log(message.sid))
            })
        }).catch((err) => {
            console.error(`🚀 ~ file: notification.service.ts:166 ~ returnawaitgeneratePDF ~ err: ${err}`)
            throw new Error(err);
        })
    } catch (error) {
        console.error(`🚀 ~ file: notification.service.ts:245 ~ sendPlacedOrderEmailService ~ error: ${error}`)
        throw (error);
    }
}

export const generatePDF = async (surajData: any, fileName: string) => {
    try {
        const tableData: any = {
            headerRows: 1,
            table: {
                widths: [60, '*', 100, 200, 170],
                body: [
                    [
                        {
                            text: 'Sr No.',
                            alignment: 'left',
                            style: 'bold',
                            margin: [0, 7, 0, 7]
                        },
                        {
                            text: 'Product Name',
                            alignment: 'center',
                            style: 'bold',
                            margin: [0, 7, 0, 7]
                        },
                        {
                            text: 'Quantity',
                            alignment: 'center',
                            style: 'bold',
                            margin: [0, 7, 0, 7]
                        },
                        {
                            text: 'Price (₹)',
                            alignment: 'center',
                            style: 'bold',
                            margin: [0, 7, 0, 7]
                        },
                        {
                            text: 'Total (₹)',
                            alignment: 'center',
                            style: 'bold',
                            margin: [0, 7, 0, 7]
                        }],
                ]
            }
        };

        await Promise.all(surajData.products.map((item: any, index: any) => {
            tableData.table.body.push([
                {
                    text: index + 1,
                    alignment: 'center',
                    margin: [0, 7, 0, 7]
                },
                {
                    text: item.name,
                    alignment: 'center',
                    margin: [0, 7, 0, 7]
                },
                {
                    text: item.quantity,
                    alignment: 'center',
                    margin: [0, 7, 0, 7]
                },
                {
                    text: '₹' + (item.price).toLocaleString('en-IN'),
                    alignment: 'center',
                    margin: [0, 7, 0, 7]
                },
                {
                    text: '₹' + (item.price * item.quantity).toLocaleString('en-IN'),
                    alignment: 'center',
                    margin: [0, 7, 0, 7]
                }
            ]);
        }));

        const printer = new PdfPrinter({
            Roboto: {
                normal: Buffer.from(vfsFonts.pdfMake.vfs['Roboto-Regular.ttf'], 'base64'),
                bold: Buffer.from(vfsFonts.pdfMake.vfs['Roboto-Medium.ttf'], 'base64'),
                italics: Buffer.from(vfsFonts.pdfMake.vfs['Roboto-Italic.ttf'], 'base64'),
                bolditalics: Buffer.from(vfsFonts.pdfMake.vfs['Roboto-MediumItalic.ttf'], 'base64'),
            }
        });


        const docDefinitions: any = await pdfContentService(surajData, tableData);
        const pdfDoc = printer.createPdfKitDocument(docDefinitions, {});
        if (!fs.existsSync(`pdfs/order`)) {
            fs.mkdirSync(`pdfs/order`, { recursive: true });
        }

        return {
            fileName: fileName,
            file: await createFile(fileName, pdfDoc)
        }
    } catch (error) {
        console.log("🚀 ~ file: notification.service.ts:179 ~ generatePDF ~ error:", error)
        throw (error);
    }
}

export const createFile = async (fileName: string, pdfDoc: any) => {
    return await new Promise(async (resolve, reject) => {
        let fileStream = fs.createWriteStream(`pdfs/order/${fileName}`, 'utf8');
        await <any>pdfDoc.pipe(fileStream);
        pdfDoc.end();
        let data: Buffer;
        fileStream.on('finish', async () => {
            data = fs.readFileSync(`${process.cwd()}/pdfs/order/${fileName}`);
            resolve(data);
        })
    });
}

export const sendFeedbackEmailService = async () => {
    try {
        const message: any = await subClient.get('sendFeedbackEmail', (err, count) => {
            if (err) {
                console.error(`Failed to subscribe:  ${err.message}`);
                return err;
            }
            else {
                console.log("Subscribed successfully! This client is currently subscribed to channels.", count);
                return count;
            }
        });
        const surajData = JSON.parse(message);
        console.log("🚀 ~ file: notification.service.ts:294 ~ sendFeedbackEmailService ~ surajData:", surajData);
        return await sgMail.send({
            to: surajData.email,
            from: sendgridUserEmail,
            subject: surajData.subject,
            text: surajData.text
        }).then(() => {
            return `Thank You For Your Feedback. We'll Look Into It and Make Improvements In Our Service.`
        }).catch((err) => {
            console.log("🚀 ~ file: notification.service.ts:303 ~ sendFeedbackEmailService ~ err:", err)
            throw (err);
        })
    } catch (error) {
        console.log("🚀 ~ file: notification.service.ts:285 ~ sendFeedbackEmailService ~ error:", error)
        throw (error);
    }
}

export const sendCancelOrderEmailService = async () => {
    try {
        const message: any = await subClient.get('sendCancelOrderEmail', (err, count) => {
            if (err) {
                console.error(`Failed to subscribe:  ${err.message}`);
                return err;
            }
            else {
                console.log("Subscribed successfully! This client is currently subscribed to  channels.", count);
                return count;
            }
        });
        const surajData = JSON.parse(message);
        console.log("🚀 ~ file: notification.service.ts:325 ~ sendCancelOrderEmailService ~ surajData:", surajData);
        const fileName = `${surajData.name.split(" ").join('')}_${Math.random().toString(36).slice(2)}.pdf`;
        console.log("🚀 ~ file: notification.service.ts:327 ~ sendCancelOrderEmailService ~ fileName:", fileName)
        return await generatePDF(surajData, fileName).then(async (response: any) => {
            await sgMail.send({
                to: surajData.email,
                from: sendgridUserEmail,
                subject: 'Order Cancelled',
                text: `
                    Hello ${surajData.name}+',\n,
                    Your Order With id ${surajData.orderId} has been successfully cancelled. For Your reference, We've attached the PDF of Order Summary.\n\n
                    If you have any questions, contact us here or call us on ${contactNumber}!\n
                    We are here to help!\n
                    We hope you enjoyed your shopping experience with us and that you will visit us again soon.\n\n
                    Cheers!
                 `,
                attachments: [
                    {
                        filename: fileName,
                        content: Buffer.from(response.file).toString('base64'),
                        type: 'application/pdf',
                        disposition: 'attachment'
                    }
                ]
            }).then(async () => {
                console.log("Email Sent Successfully!");
                return await client.messages.create({
                    body: `Your order with ID ${surajData.orderId} has been cancelled successfully.`,
                    from: process.env.TWILLIO_NUMBER,
                    to: "+91" + (surajData.phoneNumber),
                }).then(message => console.log(message.sid))
            })
        }).catch((err) => {
            console.error(`🚀 ~ file: notification.service.ts:166 ~ returnawaitgeneratePDF ~ err: ${err}`)
            throw new Error(err);
        })
    } catch (error) {
        console.log("🚀 ~ file: notification.service.ts:316 ~ sendCancelOrderEmailService ~ error:", error)
        throw (error);
    }
}

export const sendCustomerForgotPasswordEmailService = async () => {
    try {
        const message: any = await subClient.get('sendForgotPasswordEmail', (err, count) => {
            if (err) {
                console.error(`Failed to subscribe:  ${err.message}`);
                return err;
            }
            else {
                console.log("Subscribed successfully! This client is currently subscribed to  channels.", count);
                return count;
            }
        });
        const surajData = JSON.parse(message);
        console.log("🚀 ~ file: notification.service.ts:452 ~ sendCustomerForgotPasswordEmailService ~ surajData:", surajData);
        return await sgMail.send({
            to: surajData.email,
            from: sendgridUserEmail,
            subject: 'Forgot Password',
            html: `
            <!DOCTYPE html>
                <html>
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>Password Reset Request</title>
                </head>
                <body style="font-family: Arial, sans-serif; line-height: 1.6; margin: 0; padding: 0;">
                    <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
                        <h2>Password Reset Request - Action Required</h2>
                        <p>Dear ${surajData.name},</p>
                        <p>We hope this email finds you well. We received a request to reset your password for your account at Shippr. Don't worry; we've got you covered!</p>
                        <p>To ensure the security of your account, we have reset your password. Your new login credentials are as follows:</p>
                        <ul>
                            <li><strong>New Password:</strong> ${surajData.password}</li>
                        </ul>
                        <p>For your privacy, we recommend changing this password after logging in. You can do so by navigating to your account settings.</p>
                        <p>If you did not initiate this password reset, or if you have any concerns about your account's security, please reach out to our support team immediately at [Customer Support Email or Phone Number].</p>
                        <p>Thank you for choosing Shippr! We strive to provide a secure and convenient experience for all our valued customers.</p>
                        <p>Best regards,<br>
                        Customer Support<br>
                        Shippr Internationals Pvt Ltd.<br>
                        ${customerSupportEmail}</p>
                    </div>
                </body>
                </html>
            `
        }).then(() => {
            console.log("Email sent successfully!");
            return;
        })
    } catch (error) {
        console.log("🚀 ~ file: notification.service.ts:443 ~ sendCustomerForgotPasswordEmailService ~ error:", error)
        throw (error);
    }
}

export const sendCustomerResetPasswordEmailService = async () => {
    try {
        const message: any = await subClient.get('sendResetPasswordEmail', (err, count) => {
            if (err) {
                console.error(`Failed to subscribe:  ${err.message}`);
                return err;
            }
            else {
                console.log("Subscribed successfully! This client is currently subscribed to  channels.", count);
                return count;
            }
        });
        const surajData = JSON.parse(message);
        console.log("🚀 ~ file: notification.service.ts:508 ~ sendCustomerResetPasswordEmailService ~ surajData:", surajData)
        return await sgMail.send({
            to: surajData.email,
            from: sendgridUserEmail,
            subject: 'Password Change Confirmation',
            html: `
            <!DOCTYPE html>
                <html>
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>Password Changed Confirmation</title>
                </head>
                <body style="font-family: Arial, sans-serif; line-height: 1.6; margin: 0; padding: 0;">
                    <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
                        <h2>Dear ${surajData.name},</h2>
                        <p>This is to confirm that the password for your account has been successfully changed. \nYour account is now secured with the new password that you have set.</p>
                        <p>If you did not change your password, please contact us immediately to report any unauthorized access to your account.</p>
                        <p>If you have any issues or concerns regarding your account, please do not hesitate to contact our customer support team for further assistance.</p>
                        <p>Thank you for using our service.</p>
                        <p>Best regards,<br>
                        Customer Support<br>
                        Shippr Internationals Pvt Ltd.<br>
                        ${customerSupportEmail}</p>
                    </div>
                </body>
                </html>
            `
        }).then(() => {
            console.log("Email send for reset password");
            return;
        })
    } catch (error) {
        console.log("🚀 ~ file: notification.service.ts:499 ~ sendCustomerResetPasswordEmailService ~ error:", error)
        throw (error);
    }
}

export const sendCustomerForceResetPasswordEmailService = async () => {
    try {
        const message: any = await subClient.get('sendForceResetPasswordEmail', (err, count) => {
            if (err) {
                console.error(`Failed to subscribe:  ${err.message}`);
                return err;
            }
            else {
                console.log("Subscribed successfully! This client is currently subscribed to  channels.", count);
                return count;
            }
        });
        const surajData = JSON.parse(message);
        console.log("🚀 ~ file: notification.service.ts:508 ~ sendCustomerResetPasswordEmailService ~ surajData:", surajData)
        return await sgMail.send({
            to: surajData.email,
            from: sendgridUserEmail,
            subject: 'Forced Password Change Confirmation',
            html: `
            <!DOCTYPE html>
                <html>
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>Forced Password Reset Notification</title>
                </head>
                <body style="font-family: Arial, sans-serif; line-height: 1.6; margin: 0; padding: 0;">
                    <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
                        <h2>Dear ${surajData.name}</h2>
                        <p>This is to inform you that your account password has been forcefully reset for security reasons. Your account is now secured with a new password.</p>
                        <p>We recommend logging in using these new credentials and then changing the password to one of your preference for added security.</p>
                        <p>If you did not request this password reset, or if you have any concerns about your account's security, please contact our customer support team immediately for assistance.</p>
                        <p>Thank you for using our service.</p>
                        <p>Best regards,<br>
                        Customer Support<br>
                        Shippr Internationals Pvt Ltd.<br>
                        ${customerSupportEmail}</p>
                    </div>
                </body>
                </html>
            `
        }).then(() => {
            console.log("Email send for reset password");
            return;
        })
    } catch (error) {
        console.log("🚀 ~ file: notification.service.ts:550 ~ sendCustomerForceResetPasswordEmailService ~ error:", error)
        throw (error);
    }
}
