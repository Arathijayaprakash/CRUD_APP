"use client";

import { DebouncedState } from "use-debounce";

export default function Search({ placeholder, handleSearch }: { placeholder: string, handleSearch: DebouncedState<(term: any) => void> }) {

    return (
        <div className="relative flex flex-1 flex-shrink-0">
            <label htmlFor="search" className="sr-only">
                Search
            </label>
            <input
                className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
                placeholder={placeholder}
                onChange={(e) => handleSearch(e.target.value)}
            />
        </div>
    );
}
