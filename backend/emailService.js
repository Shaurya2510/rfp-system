require('dotenv').config();
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: true,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
    }
});


async function sendRfpEmail(to, subject, textBody, htmlBody) {
    try {
        const info = await transporter.sendMail({
            from: process.env.EMAIL_FROM,
            to,
            subject,
            text: textBody,
            html: htmlBody
        });

        return { success: true, info };
    } catch (error) {
        console.error("Email send error:", error);
        return { success: false, error };
    }
}

module.exports = { sendRfpEmail };
