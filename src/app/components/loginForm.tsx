'use client';
import { useState } from "react";
import { useRouter } from "next/navigation";
import { loginUser } from "../api/auth";

export default function LoginForm() {
    const [form, setForm] = useState({ email: "", password: "" });
    const router = useRouter();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const user = await loginUser(form.email, form.password);
        if (user) {
            localStorage.setItem("user", JSON.stringify(user));
            router.push("/dashboard");
        } else {
            alert("Invalid credentials");
        }
    };

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-w-md mx-auto p-6 bg-white shadow-md rounded-xl dark:bg-gray-900">
            <h2 className="text-2xl font-semibold text-center text-gray-800 dark:text-gray-200">Login</h2>
            <input name="email" onChange={handleChange} placeholder="Email" type="email" className="p-2 border rounded-lg" />
            <input name="password" onChange={handleChange} placeholder="Password" type="password" className="p-2 border rounded-lg" />
            <button type="submit" className="bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700">Login</button>
            <p className="text-center text-sm text-gray-600 dark:text-gray-300 mt-2">
                Don’t have an account?{" "}
                <button
                    type="button"
                    onClick={() => router.push("/register")}
                    className="text-blue-600 hover:underline dark:text-blue-400"
                >
                    Register
                </button>
            </p>
        </form>
    );
}
