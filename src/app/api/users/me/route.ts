import { getIdFromToken } from "@/helpers/getIdFromToken";
import { NextRequest, NextResponse } from "next/server";

import { prisma } from "@/db";

export async function GET(request: NextRequest) {
    try {
        const userId = getIdFromToken(request);
        const user = await prisma.users.findFirst({
            where: { id: userId },
            select: { username: true },
        });
        return NextResponse.json(
            { message: "User found", user },
            { status: 200 }
        );
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
