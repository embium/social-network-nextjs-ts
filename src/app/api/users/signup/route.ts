import { NextRequest, NextResponse } from "next/server";
import bcryptjs from "bcryptjs";
import { sendEmail } from "@/helpers/mailer";
import { prisma } from "@/db";

export async function POST(request: NextRequest) {
    try {
        const reqBody = await request.json();
        const { email, username, password } = reqBody;

        // Check if user already exists
        const user = await prisma.users.findFirst({ where: { email: email } });
        if (user) {
            return NextResponse.json(
                { error: "User already exists" },
                { status: 400 }
            );
        }

        // Hash password
        const salt = await bcryptjs.genSalt(10);
        const hashedPassword = await bcryptjs.hash(password, salt);

        const newUser = await prisma.users.create({
            data: {
                username: username,
                email: email,
                password: hashedPassword,
            },
        });

        // Send verificatione email

        await sendEmail({ email, emailType: "VERIFY", userId: newUser.id });

        return NextResponse.json({
            message: "User created successfully",
            success: true,
            newUser,
        });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
