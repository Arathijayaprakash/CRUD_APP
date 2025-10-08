import { ProductFormData } from "@/app/components/productForm";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState: ProductFormData[] = []
const productSlice = createSlice({
    name: 'products',
    initialState,
    reducers: {
        setProducts: (state, action: PayloadAction<ProductFormData[]>) => {
            return action.payload
        },
        addProduct: (state, action: PayloadAction<ProductFormData>) => {
            state.push(action.payload)
        },
        updateProduct: (state, action) => {
            const updated = action.payload;
            const index = state.findIndex((p) => p.id === updated.id);
            if (index !== -1) {
                state[index] = updated;
            }
        },
        deleteProduct: (state, action: PayloadAction<string>) => {
            return state.filter((product) => product.id !== action.payload)
        }
    }
})

export const { setProducts, addProduct, deleteProduct, updateProduct } = productSlice.actions
export default productSlice.reducer;