import { CLASSFLOW_GMAIL_PASSWORD, CLASSFLOW_GMAIL_USER, RESEND_KEY } from "@env";
import nodemailer from "nodemailer";



const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    tls: {
        rejectUnauthorized: false,
    },
    connectionTimeout: 9000,
    auth: {
        // TODO: replace `user` and `pass` values from <https://forwardemail.net>
        user: CLASSFLOW_GMAIL_USER,
        pass: CLASSFLOW_GMAIL_PASSWORD
    }
});
export default class EmailService {
    public async sendEmail(recipients: string[] | string, subject: string, body: string) {
        //search for group with the required email
        return await transporter.sendMail({
            from: '"Classflow" <no-reply@classflow.com>',
            to: recipients,
            subject,
            html: body
        })
    }

}