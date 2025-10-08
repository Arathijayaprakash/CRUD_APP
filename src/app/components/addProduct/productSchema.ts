import z from "zod";

export const productSchema = z.object({
    id: z.any().optional(),
    name: z.string().min(1, "Name is required"),
    price: z.coerce.number().min(1, "Price must be greater than 0"),
    sku: z.string().min(1, "SKU is required"),
    image: z.any().optional(),
});

export type ProductFormData = z.infer<typeof productSchema>;
