import nodemailer from "nodemailer";

export const sendEmail = async (data) => {
    
    const srvOption = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: parseInt(process.env.SMTP_PORT),
        secure: false,
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASSWORD,
        },
    });
    
    return await srvOption.sendMail({ from: process.env.SMTP_FROM_EMAIL, ...data });

}
