'use client';
import { useState } from "react";
import { useRouter } from "next/navigation";
import { registerUser } from "../api/auth";

export default function RegisterForm() {
    const [form, setForm] = useState({ name: "", email: "", dob: "", password: "", country: "" });
    const router = useRouter();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await registerUser(form);
        alert("Registered successfully!");
        router.push("/login");
    };

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-w-md mx-auto p-6 bg-white shadow-md rounded-xl dark:bg-gray-900">
            <h2 className="text-2xl font-semibold text-center text-gray-800 dark:text-gray-200">Register</h2>
            <input name="name" onChange={handleChange} placeholder="Name" className="p-2 border rounded-lg" />
            <input name="email" onChange={handleChange} placeholder="Email" type="email" className="p-2 border rounded-lg" />
            <input name="dob" onChange={handleChange} type="date" className="p-2 border rounded-lg" />
            <input name="password" onChange={handleChange} placeholder="Password" type="password" className="p-2 border rounded-lg" />
            <select name="country" onChange={handleChange} className="p-2 border rounded-lg">
                <option value="">Select country</option>
                <option value="India">India</option>
                <option value="USA">USA</option>
            </select>
            <button type="submit" className="bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700">Register</button>
        </form>
    );
}
