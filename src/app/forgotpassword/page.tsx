"use client";

import axios from "axios";
import React from "react";
import Link from "next/link";
import toaster from "react-hot-toast";

export default function ForgotPassword() {
    const [loading, setLoading] = React.useState(false);
    const [email, setEmail] = React.useState("");
    const [error, setError] = React.useState(false);

    const handleForgot = async (e: any) => {
        e.preventDefault();
        try {
            setLoading(true);
            await axios.post("/api/users/forgotpassword", { email });
            toaster.success("Email sent");
        } catch (error: any) {
            setError(true);
            toaster.error(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <form
                onSubmit={handleForgot}
                className="reset-password"
            >
                <h1>Forgot Password</h1>
                <p>You are not alone. We’ve all been here at some point.</p>
                <div>
                    <label htmlFor="email">Email address</label>
                    <input
                        type="email"
                        name="email"
                        id="email"
                        placeholder="your email address"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <button
                    name="reset-pwd-button"
                    className="reset-pwd"
                >
                    {!loading ? "Get secure link" : "Sending..."}
                </button>
            </form>
        </div>
    );
}
