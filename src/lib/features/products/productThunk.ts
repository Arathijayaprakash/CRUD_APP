import { addProductApi, updateProductAPI } from "@/app/api/products";
import { ProductFormData } from "@/app/components/addProduct/productSchema";
import { convertToBase64 } from "@/app/utils";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { v4 as uuidv4 } from "uuid";

export const addProductThunk = createAsyncThunk("products/addProductThunk", async (data: ProductFormData, { rejectWithValue }) => {
    try {
        const newProduct = {
            id: uuidv4(),
            ...data,
            image: data.image?.[0] ? await convertToBase64(data.image[0]) : "",
        };
        const res = await addProductApi(newProduct);
        return res;
    } catch (error: any) {
        return rejectWithValue(error.message);
    }
})

export const updateProductThunk = createAsyncThunk("products/updateProductThunk", async ({ imagePreview, isImageChanged, data, editId }: { imagePreview: string, isImageChanged: boolean, data: ProductFormData, editId: string }, { rejectWithValue }) => {
    try {
        let imageBase64 = imagePreview;

        if (isImageChanged && data.image?.[0]) {
            imageBase64 = await convertToBase64(data.image[0]);
        }
        const updatedProduct = { ...data, id: editId, image: imageBase64 };
        const res = await updateProductAPI(editId, updatedProduct);
        return res;

    } catch (error: any) {
        return rejectWithValue(error.message);
    }
})