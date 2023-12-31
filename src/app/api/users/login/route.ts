import { NextRequest, NextResponse } from "next/server";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import { prisma } from "@/db";

export async function POST(request: NextRequest) {
    try {
        const reqBody = await request.json();
        const { email, password } = reqBody;

        // Check if user exists
        const user = await prisma.users.findFirst({ where: { email: email } });
        if (!user) {
            return NextResponse.json(
                { error: "user does not exist" },
                { status: 400 }
            );
        }

        // Check if password is correct
        const validPassword = await bcryptjs.compare(password, user.password);
        if (!validPassword) {
            return NextResponse.json(
                { error: "Invalid password" },
                { status: 400 }
            );
        }

        // Create token data
        const tokenData = {
            id: user.id,
            email: user.email,
            username: user.username,
        };

        // Create token
        const token = jwt.sign(tokenData, process.env.JWT_SECRET_KEY!, {
            expiresIn: "1d",
        });

        const response = NextResponse.json({
            message: "User logged in successfully",
            success: true,
        });
        response.cookies.set("token", token, { httpOnly: true });

        return response;
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
