import { NextRequest } from "next/server";
import jwt from "jsonwebtoken";

export const getIdFromToken = (request: NextRequest) => {
    try {
        const encodedToken = request.cookies.get("token")?.value || "";
        const decodedToken: any = jwt.verify(
            encodedToken,
            process.env.JWT_SECRET_KEY!
        );
        return decodedToken.id;
    } catch (error: any) {
        throw new Error(error.message);
    }
};
