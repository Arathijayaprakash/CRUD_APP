'use client';
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { LoginFormValues, loginSchema } from "./loginSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Box, Button, TextField, Typography } from "@mui/material";
import { useAuth } from "@/context/auth/AuthContext";

export default function LoginForm() {
    const { login } = useAuth()
    const router = useRouter();

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<LoginFormValues>({
        resolver: zodResolver(loginSchema),
        mode: "onTouched",
    });

    const onSubmit = async (data: LoginFormValues) => {
        const success = await login(data.email, data.password);
        if (!success) {
            alert("Invalid credentials");
        }
    };
    return (
        <Box
            component="form"
            onSubmit={handleSubmit(onSubmit)}
            className="max-w-md mx-auto p-6 bg-white shadow-md rounded-xl dark:bg-gray-900 flex flex-col gap-4"
        >
            <Typography variant="h5" align="center" className="text-gray-800 dark:text-gray-200">
                Login
            </Typography>

            <TextField
                label="Email"
                type="email"
                {...register("email")}
                error={!!errors.email}
                helperText={errors.email?.message}
                fullWidth
                variant="outlined"
                size="small"
            />

            <TextField
                label="Password"
                type="password"
                {...register("password")}
                error={!!errors.password}
                helperText={errors.password?.message}
                fullWidth
                variant="outlined"
                size="small"
            />

            <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={isSubmitting}
                fullWidth
            >
                {isSubmitting ? "Logging in..." : "Login"}
            </Button>

            <Typography
                variant="body2"
                align="center"
                className="text-gray-600 dark:text-gray-300 mt-2"
            >
                Don’t have an account?{" "}
                <Button
                    type="button"
                    onClick={() => router.push("/register")}
                    variant="text"
                    color="primary"
                    size="small"
                >
                    Register
                </Button>
            </Typography>
        </Box>
    );
}
