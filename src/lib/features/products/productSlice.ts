import { ProductFormData } from "@/app/components/addProduct/productSchema";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { addProductThunk, updateProductThunk } from "./productThunk";

const initialState: ProductFormData[] = []
const productSlice = createSlice({
    name: 'products',
    initialState,
    reducers: {
        setProducts: (state, action: PayloadAction<ProductFormData[]>) => {
            return action.payload
        },
        deleteProduct: (state, action: PayloadAction<string>) => {
            return state.filter((product) => product.id !== action.payload)
        }
    },
    extraReducers: (builder) => {
        builder.addCase(addProductThunk.fulfilled, (state, action) => {
            state.push(action.payload)
        })
            .addCase(updateProductThunk.fulfilled, (state, action) => {
                const updated = action.payload;
                const index = state.findIndex((p) => p.id === updated.id);
                if (index !== -1) {
                    state[index] = updated;
                }
            })
    }
})

export const { setProducts, deleteProduct } = productSlice.actions
export default productSlice.reducer;