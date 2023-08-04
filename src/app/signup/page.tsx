"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import React from "react";
import axios from "axios";
import toast from "react-hot-toast";

interface IUser {
    email: string;
    password: string;
    username: string;
}

export default function SignupPage() {
    const router = useRouter();
    const [user, setUser] = React.useState<IUser>({
        email: "",
        password: "",
        username: "",
    });
    const [buttonEnabled, setButtonEnabled] = React.useState(true);
    const [loading, setLoading] = React.useState(false);

    const onSignup = async () => {
        try {
            setLoading(true);
            await axios.post("/api/users/signup", user);
            toast.success("Signup success");
            router.push("/login");
        } catch (error: any) {
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    };

    React.useEffect(() => {
        if (
            user.email.length > 0 &&
            user.username.length > 0 &&
            user.password.length > 0
        ) {
            setButtonEnabled(true);
        } else {
            setButtonEnabled(false);
        }
    }, [user]);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen py-2">
            <h1>{loading ? "Processing" : "Signup"}</h1>
            <hr />
            <label htmlFor="username">Username</label>
            <input
                className="p-2 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:border-gray-600 text-black"
                id="username"
                type="text"
                value={user.username}
                onChange={(e) => setUser({ ...user, username: e.target.value })}
                placeholder="username"
            />
            <label htmlFor="email"></label>
            <input
                className="p-2 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:border-gray-600 text-black"
                id="email"
                type="text"
                value={user.email}
                onChange={(e) => setUser({ ...user, email: e.target.value })}
                placeholder="email"
            />
            <label htmlFor="password"></label>
            <input
                className="p-2 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:border-gray-600 text-black"
                id="password"
                type="password"
                value={user.password}
                onChange={(e) => setUser({ ...user, password: e.target.value })}
                placeholder="password"
            />
            <button
                onClick={onSignup}
                disabled={!buttonEnabled}
                className="p-2 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:border-gray-600"
            >
                {buttonEnabled ? "Signup" : "No signup"}
            </button>
            <Link href="/login">Visit login page</Link>
        </div>
    );
}
