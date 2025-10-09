'use client';
import { useSidebar } from "@/context/sidebar/SideBarContext";
import Link from "next/link";
import { usePathname } from "next/navigation";
import CloseIcon from '@mui/icons-material/Close';

export default function Sidebar() {
    const pathname = usePathname();
    const { toggleSidebar, isSidebarOpen } = useSidebar()
    const links = [
        { name: "Dashboard", href: "/dashboard" },
        { name: "Products", href: "/dashboard/products" },
        { name: "Settings", href: "/dashboard/settings" },
    ];

    return (
        <>
            {isSidebarOpen &&
                <div
                    className="fixed inset-0 bg-black/50 z-40 md:hidden"
                    onClick={toggleSidebar}
                />
            }

            <aside
                className={`fixed md:static top-0 left-0 h-full w-64 bg-gray-800 text-white z-50 p-5 transform transition-transform duration-300 ease-in-out
        ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}
            >
                <button
                    onClick={toggleSidebar}
                    className="absolute top-4 right-4 text-gray-400 hover:text-white md:hidden"
                >
                    <CloseIcon />
                </button>
                <h2 className="text-lg font-semibold mb-6 mt-2">Menu</h2>
                <ul className="space-y-4">
                    {links.map((link) => (
                        <li key={link.href}>
                            <Link
                                href={link.href}
                                onClick={toggleSidebar}
                                className={`block p-2 rounded hover:bg-gray-700 ${pathname === link.href ? "bg-gray-700" : ""
                                    }`}
                            >
                                {link.name}
                            </Link>
                        </li>
                    ))}
                </ul>
            </aside >
        </>
    );
}
