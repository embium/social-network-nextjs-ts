"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import React from "react";
import axios from "axios";
import toast from "react-hot-toast";

interface IUser {
    email: string;
    password: string;
}

export default function LoginPage() {
    const router = useRouter();
    const [user, setUser] = React.useState<IUser>({
        email: "",
        password: "",
    });
    const [buttonEnabled, setButtonEnabled] = React.useState(true);
    const [loading, setLoading] = React.useState(false);

    const onLogin = async () => {
        try {
            setLoading(true);
            await axios.post("/api/users/login", user);
            toast.success("Login success");
            router.push("/profile");
        } catch (error: any) {
            toast.error(error.response.data.error);
        } finally {
            setLoading(false);
        }
    };

    React.useEffect(() => {
        if (user.email.length > 0 && user.password.length > 0) {
            setButtonEnabled(true);
        } else {
            setButtonEnabled(false);
        }
    }, [user]);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen py-2">
            <h1>{loading ? "Processing" : "Login"}</h1>
            <hr />
            <label htmlFor="email"></label>
            <input
                className="p-2 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:border-gray-600"
                id="email"
                type="text"
                value={user.email}
                onChange={(e) => setUser({ ...user, email: e.target.value })}
                placeholder="email"
            />
            <label htmlFor="password"></label>
            <input
                className="p-2 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:border-gray-600"
                id="password"
                type="password"
                value={user.password}
                onChange={(e) => setUser({ ...user, password: e.target.value })}
                placeholder="password"
            />
            <button
                onClick={onLogin}
                disabled={!buttonEnabled}
                className="p-2 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:border-gray-600"
            >
                {buttonEnabled ? "Login" : "No login"}
            </button>
            <Link href="/signup">Visit signup page</Link>
        </div>
    );
}
