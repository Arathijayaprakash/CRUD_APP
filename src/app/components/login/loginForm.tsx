'use client';
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { LoginFormValues, loginSchema } from "./loginSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Alert, Box, Button, IconButton, InputAdornment, TextField, Typography } from "@mui/material";
import { useAuth } from "@/context/auth/AuthContext";
import { useState } from "react";
import { Visibility, VisibilityOff } from "@mui/icons-material";

export default function LoginForm() {
    const { login } = useAuth()
    const router = useRouter();
    const [loginError, setLoginError] = useState<boolean>(false)
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<LoginFormValues>({
        resolver: zodResolver(loginSchema),
        mode: "onTouched",
    });
    const handleClickShowPassword = () => {
        setShowPassword((prev) => !prev);
    };

    const onSubmit = async (data: LoginFormValues) => {
        const success = await login(data.email, data.password);
        setLoginError(!success);
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
            {loginError && <Alert severity="error" className="mt-2">
                Incorrect Email or Password
            </Alert>}
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
                type={showPassword ? "text" : "password"}
                {...register("password")}
                error={!!errors.password}
                helperText={errors.password?.message}
                fullWidth
                variant="outlined"
                size="small"
                slotProps={{
                    input: {
                        endAdornment: (
                            <InputAdornment position="end">
                                <IconButton onClick={handleClickShowPassword} edge="end">
                                    {showPassword ? <VisibilityOff /> : <Visibility />}
                                </IconButton>
                            </InputAdornment>
                        )
                    }
                }}
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
