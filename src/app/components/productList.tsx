"use client";

import { useEffect, useState } from "react";
import { deleteProductAPI, getProducts } from "../api/products";
import ProductForm from "./addProduct/productForm";
import DeleteConfirmationModal from "./deleteConfirmationModal";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { deleteProduct, setProducts } from "@/lib/features/products/productSlice";
import { toast } from "sonner";

export default function ProductList() {
    const products = useAppSelector((state) => state.products);
    const dispatch = useAppDispatch();
    const [isEditing, setIsEditing] = useState<boolean>(false);
    const [editId, setEditId] = useState<string>("");
    const [deleteId, setDeleteId] = useState<string>("");
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);

    const deleteModalHandler = (id: string) => {
        setIsDeleteModalOpen(true);
        setDeleteId(id);
    };

    const deleteModalCancel = () => {
        setIsDeleteModalOpen(false);
        setDeleteId("");
    };

    const deleteProductHandler = async () => {
        try {
            dispatch(deleteProduct(deleteId));
            await deleteProductAPI(deleteId);
            toast.success('Product deleted successfully')
        } catch (error) {
            toast.error("Failed to delete product");
        }
        setIsDeleteModalOpen(false);
    };

    const editProductHandler = (id: string) => {
        setIsEditing(true);
        setEditId(id);
    };

    useEffect(() => {
        const fetchProduct = async () => {
            const data = await getProducts();
            dispatch(setProducts(data));
        };
        fetchProduct();
    }, [dispatch]);

    return (
        <div className="p-4 max-w-6xl mx-auto">
            <h2 className="text-2xl font-semibold mb-6 text-center text-gray-800 dark:text-gray-100">
                🛍️ Product Catalog
            </h2>

            {products.length === 0 ? (
                <p className="text-center text-gray-600 dark:text-gray-300">No products added yet.</p>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {products.map((product) => (
                        <div
                            key={product.id}
                            className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden flex flex-col"
                        >
                            <div className="relative w-full h-52 bg-gray-100">
                                {product.image ? (
                                    <img
                                        src={product.image}
                                        alt={product.name}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="flex items-center justify-center h-full text-gray-400">
                                        No Image
                                    </div>
                                )}
                            </div>

                            <div className="p-4 flex flex-col justify-between flex-grow">
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 truncate">
                                        {product.name}
                                    </h3>
                                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                        SKU: {product.sku}
                                    </p>
                                    <p className="text-xl font-bold text-blue-600 dark:text-blue-400 mt-2">
                                        ₹{product.price}
                                    </p>
                                </div>

                                <div className="flex justify-between items-center mt-4">
                                    <button
                                        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm transition-colors"
                                        onClick={() => editProductHandler(product.id)}
                                    >
                                        Edit
                                    </button>
                                    <button
                                        className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm transition-colors"
                                        onClick={() => deleteModalHandler(product.id)}
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Edit Product Modal */}
            {isEditing && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg max-w-lg w-full relative">
                        <button
                            onClick={() => setIsEditing(false)}
                            className="absolute top-2 right-3 text-gray-500 hover:text-gray-700 text-xl"
                        >
                            ×
                        </button>
                        <ProductForm setIsModalOpen={setIsEditing} editId={editId} />
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {isDeleteModalOpen && (
                <DeleteConfirmationModal
                    onConfirm={deleteProductHandler}
                    onCancel={deleteModalCancel}
                />
            )}
        </div>
    );
}
