import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/db";
import bcryptjs from "bcryptjs";

export async function POST(request: NextRequest) {
    try {
        const reqBody = await request.json();
        const token = reqBody.token;
        const password = reqBody.password;

        const user = await prisma.users.findFirst({
            where: {
                forgotPasswordToken: token,
                forgotPasswordTokenExpiry: { gt: new Date(Date.now()) },
            },
        });

        if (!user) {
            return NextResponse.json(
                { error: "Invalid token" },
                { status: 400 }
            );
        }

        const salt = await bcryptjs.genSalt(10);
        const hashedPassword = await bcryptjs.hash(password, salt);

        await prisma.users.update({
            where: { id: user.id },
            data: {
                password: hashedPassword,
                forgotPasswordToken: null,
                forgotPasswordTokenExpiry: null,
            },
        });

        return NextResponse.json(
            { message: "Password changed successfully" },
            { status: 200 }
        );
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
