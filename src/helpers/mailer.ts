import nodemailer from "nodemailer";
import bcryptjs from "bcryptjs";
import { prisma } from "@/db";

export const sendEmail = async ({ email, emailType, userId }: any) => {
    try {
        // Create a hashed token
        const hashedToken = await bcryptjs.hash(userId.toString(), 10);

        if (emailType === "VERIFY") {
            await prisma.users.update({
                where: { id: userId },
                data: {
                    verifyToken: hashedToken,
                    verifyTokenExpiry: new Date(Date.now() + 3600000),
                },
            });
        } else if (emailType === "RESET") {
            await prisma.users.update({
                where: { id: userId },
                data: {
                    forgotPasswordToken: hashedToken,
                    forgotPasswordTokenExpiry: new Date(Date.now() + 3600000),
                },
            });
        }

        var transport = nodemailer.createTransport({
            host: "sandbox.smtp.mailtrap.io",
            port: 2525,
            auth: {
                user: process.env.MAILTRAP_USER,
                pass: process.env.MAILTRAP_PASSWORD,
            },
        });

        const transporter = nodemailer.createTransport(transport);

        const mailOptions = {
            from: '"Michael Mooney" <mikeymooney1991@gamil.com>',
            to: email,
            subject:
                emailType === "VERIFY"
                    ? "Verify your email"
                    : "Reset your password",
            html: `<p>Click <a href="${
                process.env.DOMAIN
            }/verifyemail?token=${hashedToken}">here</a> to ${
                emailType === "VERIFY"
                    ? "verify your email"
                    : "reset your password"
            }</p>`,
        };

        const mailResponse = await transport.sendMail(mailOptions);
        return mailResponse;
    } catch (error: any) {
        throw new Error(error.message);
    }
};
