"use client";

import { Controller, Resolver, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { v4 as uuidv4 } from "uuid";
import { addProductApi, getProductsById, updateProductAPI } from "../../api/products";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useAppDispatch } from "@/lib/hooks";
import { addProduct, updateProduct } from "@/lib/features/products/productSlice";
import { ProductFormData, productSchema } from "./productSchema";
import { Box, Button, IconButton, TextField, Typography } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";


export default function ProductForm({
    setIsModalOpen,
    editId,
}: {
    setIsModalOpen: Dispatch<SetStateAction<boolean>>;
    editId?: string;
}) {

    const dispatch = useAppDispatch();
    const [imagePreview, setImagePreview] = useState("");
    const [isImageChanged, setIsImageChanged] = useState(false);
    const { handleSubmit, formState: { errors }, reset, setValue, control, getValues } = useForm<ProductFormData>({
        resolver: zodResolver(productSchema) as Resolver<any>,
        defaultValues: {
            name: "",
            price: 0,
            sku: "",
            image: undefined,
        },
    });

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

    const convertToBase64 = (file: File): Promise<string> =>
        new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = (error) => reject(error);
        });

    const onSubmit = async (data: ProductFormData) => {
        console.log(data.image, "onSubmitData@123")
        try {
            let imageBase64 = imagePreview;

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
        <Box
            component="form"
            onSubmit={handleSubmit(onSubmit)}
            className="p-6 bg-white shadow-md rounded-lg flex flex-col gap-4 max-w-md mx-auto"
        >
            <Typography variant="h6" textAlign="center" gutterBottom>
                {editId ? "Edit Product" : "Add Product"}
            </Typography>

            {/* Product Name */}
            <Controller
                name="name"
                control={control}
                render={({ field }) => (
                    <TextField
                        {...field}
                        label="Product Name"
                        variant="outlined"
                        fullWidth
                        size="small"
                        error={!!errors.name}
                        helperText={errors.name?.message}
                    />
                )}
            />

            {/* Price */}
            <Controller
                name="price"
                control={control}
                render={({ field }) => (
                    <TextField
                        {...field}
                        label="Price"
                        type="number"
                        variant="outlined"
                        fullWidth
                        size="small"
                        error={!!errors.price}
                        helperText={errors.price?.message}
                    />
                )}
            />

            {/* SKU */}
            <Controller
                name="sku"
                control={control}
                render={({ field }) => (
                    <TextField
                        {...field}
                        label="SKU Number"
                        variant="outlined"
                        fullWidth
                        size="small"
                        error={!!errors.sku}
                        helperText={errors.sku?.message}
                    />
                )}
            />

            {/* Image Upload */}
            <Box>
                <Button
                    variant="outlined"
                    component="label"
                    fullWidth
                >
                    {imagePreview ? "Change Image" : "Select Image"}
                    <input
                        type="file"
                        hidden
                        onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                                setImagePreview(URL.createObjectURL(file));
                                setIsImageChanged(true);
                                setValue("image", e.target.files);
                            }
                        }}
                    />
                </Button>

                {imagePreview && (
                    <Box mt={2} position="relative" display="inline-block">
                        <img
                            src={imagePreview}
                            alt="Preview"
                            className="w-32 h-32 object-cover rounded-md border"
                        />
                        <IconButton
                            size="small"
                            color="error"
                            sx={{
                                position: "absolute",
                                top: 0,
                                right: 0,
                                backgroundColor: "white",
                                "&:hover": { backgroundColor: "white" },
                            }}
                            onClick={() => {
                                setImagePreview("");
                                setIsImageChanged(false);
                                const currentValues = getValues();
                                reset({ ...currentValues, image: undefined });
                            }}
                        >
                            <CloseIcon fontSize="small" />
                        </IconButton>
                    </Box>
                )}
            </Box>

            {/* Submit Button */}
            <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
            >
                {editId ? "Save Changes" : "Add Product"}
            </Button>
        </Box>
    );
}
