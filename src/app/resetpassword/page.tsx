"use client";

import axios from "axios";
import React from "react";
import Link from "next/link";
import toaster from "react-hot-toast";

export default function ForgotPassword() {
    const [disabled, setDisabled] = React.useState(true);
    const [password, setPassword] = React.useState("");
    const [confirmPassword, setConfirmPassword] = React.useState("");
    const [token, setToken] = React.useState("");
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

    const handleForgot = async (e: any) => {
        e.preventDefault();
        try {
            setDisabled(true);
            await axios.post("/api/users/resetpassword", { password, token });
            toaster.success("Password changed successfully");
        } catch (error: any) {
            setError(true);
            toaster.error(error.message);
        } finally {
            setDisabled(false);
        }
    };

    React.useEffect(() => {
        if (password && confirmPassword && token) {
            if (password === confirmPassword) {
                setDisabled(false);
            } else {
                setDisabled(true);
            }
        }
    }, [token, password, confirmPassword]);

    return (
        <div>
            <form
                onSubmit={handleForgot}
                className="reset-password"
            >
                <h1>Forgot Password</h1>
                <p>You are not alone. We’ve all been here at some point.</p>
                <div>
                    <input
                        type="password"
                        placeholder="Enter new password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <input
                        type="password"
                        placeholder="Confirm new password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                    />
                </div>
                <button
                    name="reset-pwd-button"
                    className="reset-pwd"
                    disabled={disabled}
                >
                    Reset password
                </button>
            </form>
        </div>
    );
}
