import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/db";

export async function POST(request: NextRequest) {
    try {
        const reqBody = await request.json();
        console.log(reqBody);
        const token = reqBody.token;
        console.log(token);

        const user = await prisma.users.findFirst({
            where: {
                verifyToken: token,
                verifyTokenExpiry: { gt: new Date(Date.now()) },
            },
        });

        if (!user) {
            return NextResponse.json(
                { error: "Invalid token" },
                { status: 400 }
            );
        }

        await prisma.users.update({
            where: { id: user.id },
            data: {
                isVerified: true,
                verifyToken: null,
                verifyTokenExpiry: null,
            },
        });

        return NextResponse.json(
            { message: "Email verified successfully" },
            { status: 200 }
        );
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
