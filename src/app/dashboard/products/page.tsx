"use client";

import { getProducts } from "@/app/api/products";
import { ProductFormData } from "@/app/components/addProduct/productSchema";
import ProductTable from "@/app/components/productTable";
import Search from "@/app/components/search";
import { setProducts } from "@/lib/features/products/productSlice";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { useEffect, useState } from "react";
import { useDebouncedCallback } from "use-debounce";

export default function Products() {
    const products = useAppSelector((state) => state.products);
    const dispatch = useAppDispatch();
    const [filteredProducts, setFilteredProducts] = useState<ProductFormData[]>([]);

    useEffect(() => {
        setFilteredProducts(products);
    }, [products]);

    const handleSearch = useDebouncedCallback((term) => {
        if (!term) {
            setFilteredProducts(products)
        } else {
            setFilteredProducts(products.filter((p) => p.name.toLowerCase().includes(term.toLowerCase())))
        }
    }, 300);

    useEffect(() => {
        const fetchProduct = async () => {
            const data = await getProducts();
            dispatch(setProducts(data));
        };
        fetchProduct();
    }, [dispatch]);
    return (
        <div className="w-full">
            <div className="flex w-full items-center justify-between">
                <h1 className='text-2xl'>Products</h1>
            </div>
            <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
                <Search placeholder="Search products..." handleSearch={handleSearch} />
            </div>
            <ProductTable products={filteredProducts} />
        </div>

    )
}