import { getIdFromToken } from "@/helpers/getIdFromToken";

import { NextRequest, NextResponse } from "next/server";
import User from "@/models/userModel";
import { connect } from "@/dbConfig/dbConfig";

connect();

export async function GET(request: NextRequest) {
    try {
        console.log(request);
        const userId = getIdFromToken(request);
        const user = await User.findOne({ _id: userId }).select("-password");
        return NextResponse.json(
            { message: "User found", user },
            { status: 200 }
        );
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
