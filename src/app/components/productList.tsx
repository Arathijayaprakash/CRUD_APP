"use client";

import { useEffect, useState } from "react";
import { deleteProductAPI, getProducts } from "../api/products";
import { useAppDispatch, useAppSelector } from "../lib/hooks";
import { setProducts, deleteProduct } from "../lib/features/products/productSlice";
import ProductForm from "./productForm";
import DeleteConfirmationModal from "./deleteConfirmationModal";

export default function ProductList() {
    const products = useAppSelector((state) => state.products);
    const dispatch = useAppDispatch();
    const [isEditing, setIsEditing] = useState<boolean>(false)
    const [editId, setEditId] = useState<string>('')
    const [deleteId, setDeleteId] = useState<string>('')
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false)
    const deleteModalHandler = (id: string) => {
        setIsDeleteModalOpen(true)
        setDeleteId(id)
    }
    const deleteModalCancel = () => {
        setIsDeleteModalOpen(false)
        setDeleteId('')
    }
    const deleteProductHandler = async () => {
        try {
            dispatch(deleteProduct(deleteId))
            await deleteProductAPI(deleteId);
        } catch (error) {
            alert("Failed to delete product");
        }
        setIsDeleteModalOpen(false)
    }
    const editProductHandler = (id: string) => {
        setIsEditing(true)
        setEditId(id)
    }
    useEffect(() => {
        const fetchProduct = async () => {
            const data = await getProducts();
            dispatch(setProducts(data))
        }
        fetchProduct()
    }, [dispatch])

    return (
        <div className="p-4 max-w-2xl mx-auto">
            <h2 className="text-xl font-semibold mb-4">Product List</h2>
            {products.length === 0 ? (
                <p>No products added yet.</p>
            ) : (
                <ul className="space-y-3">
                    {products.map((product) => (
                        <li key={product.id} className="p-4 border rounded flex justify-between items-center">
                            <div>
                                <p><b>{product.name}</b> (${product.price})</p>
                                <p>SKU: {product.sku}</p>
                            </div>
                            {product.image && <img src={product.image} alt="product" className="w-16 h-16 object-cover rounded" />}
                            <div className="flex gap-2 mt-2">
                                <button
                                    className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 cursor-pointer"
                                    onClick={() => editProductHandler(product.id)}
                                >
                                    Edit
                                </button>
                                <button
                                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 cursor-pointer" onClick={() => deleteModalHandler(product.id)}
                                >
                                    Delete
                                </button>
                            </div>

                        </li>
                    ))}
                </ul>
            )}
            {isEditing && <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg max-w-lg w-full relative">
                    <button
                        onClick={() => setIsEditing(false)}
                        className="absolute top-2 right-3 text-gray-500 hover:text-gray-700 text-xl"
                    >
                        ×
                    </button>
                    <h2 className="text-2xl font-semibold mb-4 text-center">Edit Product</h2>
                    <ProductForm setIsModalOpen={setIsEditing} editId={editId} />
                </div>

            </div>}
            {isDeleteModalOpen && <DeleteConfirmationModal onConfirm={deleteProductHandler} onCancel={deleteModalCancel} />}
        </div>
    );
}
