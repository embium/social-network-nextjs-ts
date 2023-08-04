"use client";

import axios from "axios";
import Link from "next/link";
import React from "react";
import toaster from "react-hot-toast";

export default function VerifyEmail() {
    const [token, setToken] = React.useState("");
    const [verified, setVerified] = React.useState(false);
    const [error, setError] = React.useState(false);

    React.useEffect(() => {
        const queryString = window.location.search;
        const urlParams = new URLSearchParams(queryString);

        const token = urlParams.get("token");
        if (token) {
            setToken(token);
        } else {
            toaster.error("Invalid token");
        }
    }, []);

    React.useEffect(() => {
        const verifyUserEmail = async () => {
            try {
                await axios.post("/api/users/verify", { token });
                setVerified(true);
            } catch (error: any) {
                setError(true);
                toaster.error(error.message);
            }
        };

        if (token) {
            console.log(token);
            verifyUserEmail();
        }
    }, [token]);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen py-2">
            <h1 className="text-4xl">Verify email</h1>
            <hr />
            <p>{verified ? "Verified" : "Not verified"}</p>
            <Link href="/login">Login</Link>
        </div>
    );
}
