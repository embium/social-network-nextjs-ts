import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/db";
import { sendEmail } from "@/helpers/mailer";

export async function POST(request: NextRequest) {
    try {
        const reqBody = await request.json();
        const email = reqBody.email;

        const user = await prisma.users.findFirst({
            where: {
                email: email,
            },
        });

        if (!user) {
            return NextResponse.json(
                { error: "User does not exist" },
                { status: 400 }
            );
        }

        await sendEmail({
            email,
            emailType: "RESET",
            userId: user.id,
        });

        return NextResponse.json({
            message: "Forgot password sent successfully",
            success: true,
        });
    } catch (error: any) {
        console.log(error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
