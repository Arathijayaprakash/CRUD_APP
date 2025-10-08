"use client";

import { Resolver, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { v4 as uuidv4 } from "uuid";
import { addProductApi, getProductsById, updateProductAPI } from "../api/products";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useAppDispatch } from "@/lib/hooks";
import { addProduct, updateProduct } from "@/lib/features/products/productSlice";

const productSchema = z.object({
    id: z.any().optional(),
    name: z.string().min(1, "Name is required"),
    price: z.coerce.number().min(1, "Price must be greater than 0"),
    sku: z.string().min(1, "SKU is required"),
    image: z.any().optional(),
});

export type ProductFormData = z.infer<typeof productSchema>;

export default function ProductForm({
    setIsModalOpen,
    editId,
}: {
    setIsModalOpen: Dispatch<SetStateAction<boolean>>;
    editId?: string;
}) {
    const dispatch = useAppDispatch();
    const [imagePreview, setImagePreview] = useState("");
    const [isImageChanged, setIsImageChanged] = useState(false); // ✅ track new image selection
    const { register, handleSubmit, formState: { errors }, reset, watch, setValue } = useForm<ProductFormData>({
        resolver: zodResolver(productSchema) as Resolver<any>,
    });
    console.log(watch('image'), "image")
    useEffect(() => {
        if (editId) {
            const fetchProductById = async () => {
                try {
                    const product = await getProductsById(editId);
                    if (product) {
                        reset({
                            id: product.id,
                            name: product.name,
                            price: product.price,
                            sku: product.sku,
                            image: product.image,
                        });
                        setImagePreview(product.image || "");
                        setIsImageChanged(false);
                    }
                } catch (error) {
                    console.error("Failed to fetch product for editing", error);
                }
            };
            fetchProductById();
        }
    }, [editId, reset]);

    // ✅ Convert file to Base64
    const convertToBase64 = (file: File): Promise<string> =>
        new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = (error) => reject(error);
        });

    // ✅ Handle form submission
    const onSubmit = async (data: ProductFormData) => {
        console.log(data.image, "onSubmitData@123")
        try {
            let imageBase64 = imagePreview;

            // Handle new image selection
            if (isImageChanged && data.image?.[0]) {
                imageBase64 = await convertToBase64(data.image[0]);
            }

            if (editId) {
                const updatedProduct = { ...data, id: editId, image: imageBase64 };
                console.log(updatedProduct.image, "updatedProduct@123")
                await updateProductAPI(editId, updatedProduct);
                dispatch(updateProduct(updatedProduct));
                alert("Product updated successfully!");
            } else {
                const newProduct = {
                    id: uuidv4(),
                    ...data,
                    image: data.image?.[0] ? await convertToBase64(data.image[0]) : "",
                };
                console.log(newProduct.image, "@123NewProduct")
                await addProductApi(newProduct);
                dispatch(addProduct(newProduct));
                alert("Product added successfully!");
            }

            reset();
            setIsModalOpen(false);
        } catch (error) {
            alert(editId ? "Failed to edit product" : "Failed to add product");
        }
    };

    return (
        <form
            onSubmit={handleSubmit(onSubmit)}
            className="p-4 bg-white shadow-md rounded-lg flex flex-col gap-4 max-w-md mx-auto"
        >
            <input
                {...register("name")}
                placeholder="Product Name"
                className="p-2 border rounded"
            />
            {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}

            <input
                {...register("price")}
                type="number"
                placeholder="Price"
                className="p-2 border rounded"
            />
            {errors.price && <p className="text-red-500 text-sm">{errors.price.message}</p>}

            <input
                {...register("sku")}
                placeholder="SKU Number"
                className="p-2 border rounded"
            />
            {errors.sku && <p className="text-red-500 text-sm">{errors.sku.message}</p>}

            <div className="relative inline-block">
                <label className="p-2 border rounded bg-gray-100 cursor-pointer">
                    {imagePreview ? "Change Image" : "Select Image"}
                    <input
                        type="file"
                        {...register("image")}
                        className="hidden"
                        onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                                console.log(file, "fileonChange@123")
                                setImagePreview(URL.createObjectURL(file));
                                setIsImageChanged(true);
                                setValue('image', [file])
                            }
                        }}
                    />
                </label>

                {imagePreview && (
                    <div className="mt-2 relative w-32 h-32">
                        <img
                            src={imagePreview}
                            alt="Preview"
                            className="w-32 h-32 object-cover rounded"
                        />
                        <button
                            type="button"
                            className="absolute top-0 right-0 bg-red-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
                            onClick={() => {
                                setImagePreview("");
                                setIsImageChanged(false);
                                reset({ ...reset, image: undefined });
                            }}
                        >
                            ×
                        </button>
                    </div>
                )}
            </div>

            <button
                type="submit"
                className="bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
            >
                {editId ? "Save Changes" : "Add Product"}
            </button>
        </form>
    );
}
