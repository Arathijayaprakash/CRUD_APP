import { ProductFormData } from "../components/addProduct/productSchema";

const API_URL = "http://localhost:5000/products";

export const addProductApi = async (product: ProductFormData) => {
    const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(product),
    });
    if (!res.ok) throw new Error("Failed to add product");
    return res.json();
};

export const getProducts = async () => {
    const res = await fetch(API_URL);
    if (!res.ok) throw new Error("Failed to fetch products");
    return res.json();
};

export const getProductsById = async (id: string) => {
    const res = await fetch(`${API_URL}/${id}`);
    if (!res.ok) throw new Error("Failed to fetch product by id");
    return res.json();
};

export const updateProductAPI = async (id: string, updatedProduct: ProductFormData) => {
    const res = await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(updatedProduct),
    });
    if (!res.ok) throw new Error("Failed to update product");
    return res.json();
};

export const deleteProductAPI = async (id: string) => {
    const res = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
    if (!res.ok) throw new Error("Failed to delete product");
    return res.json();
}
