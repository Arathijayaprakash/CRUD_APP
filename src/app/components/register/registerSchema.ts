import z from "zod";

export const registerSchema = z.object({
    name: z.string().min(1, { message: 'Name is required' }),
    email: z.string().min(1, { message: "Email is required" }).email({ message: 'Invalid email address' }),
    dob: z
        .union([z.date(), z.null()])
        .refine((val) => val !== null, { message: "Date of Birth is required" }),
    password: z
        .string()
        .min(6, { message: "Password must be at least 6 characters long" }),

    country: z
        .object({
            name: z.string(),
            code: z.string().optional(),
        })
        .nullable()
        .refine((val) => val !== null, { message: "Country is required" }),
})

export type RegisterFormInputs = z.infer<typeof registerSchema>;
