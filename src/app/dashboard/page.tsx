'use client';
import { useState } from "react";
import ProductForm from "../components/addProduct/productForm";
import ProductList from "../components/productList";
import { useAuth } from "@/context/auth/AuthContext";

export default function DashboardPage() {
    const { user, logout } = useAuth();

    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <main className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
            {user ? (
                <>
                    <h1 className="text-3xl font-bold mb-4">Welcome, {user.name}</h1>
                    <p className="mb-6 text-gray-700 dark:text-gray-300">
                        Email: {user.email}
                    </p>
                    <button className="bg-blue-600 text-white py-2 px-4 rounded-lg m-2 hover:bg-blue-700" onClick={() => setIsModalOpen(true)}
                    >Add Product</button>
                    <ProductList />
                    <button
                        onClick={logout}
                        className="bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600"
                    >
                        Logout
                    </button>
                </>
            ) : (
                <p>Loading...</p>
            )}
            {isModalOpen && <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg max-w-lg w-full relative">
                    <button
                        onClick={() => setIsModalOpen(false)}
                        className="absolute top-2 right-3 text-gray-500 hover:text-gray-700 text-xl"
                    >
                        ×
                    </button>
                    <ProductForm setIsModalOpen={setIsModalOpen} />
                </div>

            </div>}
        </main>
    );
}
