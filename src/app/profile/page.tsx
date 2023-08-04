"use client";

import { useRouter } from "next/navigation";
import axios from "axios";
import Link from "next/link";
import toast from "react-hot-toast";
import React from "react";
import { prisma } from "@/db";

export default function ProfilePage() {
    const router = useRouter();
    const [data, setData] = React.useState(null);
    const logout = async () => {
        try {
            await axios.get("/api/users/logout");
            router.push("/login");
            toast.success("Logout success");
        } catch (error: any) {
            toast.error("Error logging out user");
            console.log(error.message);
        }
    };

    React.useEffect(() => {
        const getUserDetails = async () => {
            const res = await axios.get("/api/users/me");
            setData(res.data.user.username);
        };

        getUserDetails();
    }, [data]);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen py-2">
            <h1>Profile</h1>
            <hr />
            <p>Profile page</p>
            <h2 className="mt-4 p-3 rounded bg-green-400">
                {data ? (
                    <Link href={`/profile/${data}`}>{data}</Link>
                ) : (
                    "No data"
                )}
            </h2>
            <hr />
            <button
                onClick={logout}
                className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
                Logout
            </button>
        </div>
    );
}
