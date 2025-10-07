'use client';
import { useState } from "react";
import { useRouter } from "next/navigation";
import { registerUser } from "../../api/auth";
import dayjs, { Dayjs } from 'dayjs'
import { Autocomplete, Button, MenuItem, TextField } from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { getNames, getCode } from 'country-list';

export default function RegisterForm() {
    const [form, setForm] = useState({
        name: "", email: "", dob: null as Dayjs | null, password: "", country: null as { name: string; code: string | undefined } | null,
    });
    const router = useRouter();
    const countries = getNames().map((name: string) => ({ name, code: getCode(name) }));

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement | HTMLSelectElement | HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const payload = { ...form, dob: form.dob ? form.dob.format("YYYY-MM-DD") : "" };
        const result = await registerUser(payload);
        if (result.error) {
            alert(result.error);
            return;
        }
        alert("Registered successfully!");
        router.push("/login");
    };

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-w-md mx-auto p-6 bg-white shadow-md rounded-xl dark:bg-gray-900">
            <h2 className="text-2xl font-semibold text-center text-gray-800 dark:text-gray-200">Register</h2>
            <TextField
                label="Name"
                name="name"
                value={form.name}
                onChange={handleChange}
                fullWidth
                variant="outlined"
                size="small"
            />
            <TextField
                label="Email"
                name="email"
                value={form.email}
                onChange={handleChange}
                fullWidth
                type="email"
                variant="outlined"
                size="small"
            />
            <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                    label="Date of Birth"
                    value={form.dob}
                    onChange={(newValue) => setForm({ ...form, dob: newValue })}
                    maxDate={dayjs()}
                />
            </LocalizationProvider>

            <TextField
                label="Password"
                name="password"
                value={form.password}
                onChange={handleChange}
                fullWidth
                type="password"
                variant="outlined"
                size="small"
            />
            <Autocomplete
                options={countries}
                getOptionLabel={(option) => option.name}
                value={form.country}
                onChange={(_, newValue) => setForm({ ...form, country: newValue })}
                renderInput={(params) => <TextField {...params} label="Country" fullWidth size="small" />}
            />

            <button
                type="submit"
                className="bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition duration-200"
            >
                Register
            </button>

            <p className="text-center text-sm text-gray-600 dark:text-gray-300 mt-2">
                Already have an account?{" "}
                <Button
                    type="button"
                    onClick={() => router.push("/login")}
                    variant="text"
                    size="small"
                    color="primary"
                >
                    Log in
                </Button>
            </p>
        </form>
    );
}
