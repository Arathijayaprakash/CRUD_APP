'use client';
import { useAuth } from "@/context/auth/AuthContext";
import { useSidebar } from "@/context/sidebar/SideBarContext";
import MenuIcon from '@mui/icons-material/Menu';

export default function Navbar() {
    const { user, logout } = useAuth();
    const { toggleSidebar } = useSidebar()
    return (
        <nav className="w-full bg-gray-700 text-white flex justify-between items-center px-6 py-6 shadow-md">
            <button
                className="md:hidden text-white hover:text-gray-200"
                onClick={toggleSidebar}
                aria-label="Toggle Sidebar"
            >
                <MenuIcon />
            </button>
            <h1 className="text-lg font-semibold md:text-xl">My Dashboard</h1>
            <div className="flex items-center space-x-4">
                <span className="hidden sm:inline text-sm">{user?.name}</span>
                <button
                    onClick={logout}
                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm"
                >
                    Logout
                </button>
            </div>
        </nav>
    );
}
