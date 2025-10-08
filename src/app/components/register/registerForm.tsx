'use client';
import { useRouter } from "next/navigation";
import { registerUser } from "../../api/auth";
import dayjs from 'dayjs'
import { Autocomplete, Button, TextField } from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { getNames, getCode } from 'country-list';
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { RegisterFormInputs, registerSchema } from "./registerSchema";
import { zodResolver } from "@hookform/resolvers/zod";

export default function RegisterForm() {
    const router = useRouter();
    const { handleSubmit, control, formState: { errors } } = useForm<RegisterFormInputs>({
        resolver: zodResolver(registerSchema),
        defaultValues: {
            name: '',
            email: '',
            dob: null,
            password: '',
            country: null
        }
    })
    const countries = getNames().map((name: string) => ({ name, code: getCode(name) }));

    const onSubmit: SubmitHandler<RegisterFormInputs> = async (data) => {
        const payload = { ...data, dob: data.dob ? dayjs(data.dob).format('YYYY-MM-DD') : '', country: data.country ? data.country.name : '' }
        const result = await registerUser(payload);
        if (result.error) {
            alert(result.error);
            return;
        }
        alert("Registered successfully!");
        router.push("/login");
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 max-w-md mx-auto p-6 bg-white shadow-md rounded-xl dark:bg-gray-900">
            <h2 className="text-2xl font-semibold text-center text-gray-800 dark:text-gray-200">Register</h2>
            <Controller
                name="name"
                control={control}
                render={({ field }) => (
                    <TextField
                        {...field}
                        label="Name"
                        fullWidth
                        size="small"
                        variant="outlined"
                        error={!!errors.name}
                        helperText={errors.name?.message}
                    />
                )}
            />

            <Controller
                name="email"
                control={control}
                render={({ field }) => (
                    <TextField
                        {...field}
                        label="Email"
                        fullWidth
                        size="small"
                        variant="outlined"
                        type="email"
                        error={!!errors.email}
                        helperText={errors.email?.message}
                    />
                )}
            />

            <LocalizationProvider dateAdapter={AdapterDayjs}>
                <Controller
                    name="dob"
                    control={control}
                    render={({ field }) => (
                        <DatePicker
                            label="Date of Birth"
                            value={field.value ? dayjs(field.value) : null}
                            onChange={(newValue) => field.onChange(newValue?.toDate() || null)}
                            slotProps={{
                                textField: {
                                    fullWidth: true,
                                    size: "small",
                                    error: !!errors.dob,
                                    helperText: errors.dob?.message
                                },
                            }}
                        />
                    )}
                />
            </LocalizationProvider>

            <Controller
                name="password"
                control={control}
                render={({ field }) => (
                    <TextField
                        {...field}
                        label="Password"
                        fullWidth
                        size="small"
                        variant="outlined"
                        type="password"
                        error={!!errors.password}
                        helperText={errors.password?.message}
                    />
                )}
            />

            <Controller
                name="country"
                control={control}
                render={({ field }) => (
                    <Autocomplete
                        options={countries}
                        getOptionLabel={(option) => option.name}
                        value={field.value}
                        onChange={(_, newValue) => field.onChange(newValue)}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                label="Country"
                                fullWidth
                                size="small"
                                error={!!errors.country}
                                helperText={errors.country?.message}
                            />
                        )}
                    />
                )}
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
