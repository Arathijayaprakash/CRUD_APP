'use client';

import { loginUser } from "@/app/api/auth";
import { usePathname, useRouter } from "next/navigation";
import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { toast } from "sonner";

export const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const router = useRouter();
    const pathname = usePathname();
    const login = async (email: string, password: string) => {
        try {
            const loggedInUser = await loginUser(email, password);
            if (loggedInUser) {
                setUser(loggedInUser);
                localStorage.setItem("user", JSON.stringify(loggedInUser));
                toast.success("Logged in successfully")
                router.replace("/dashboard");
                return true;
            }
            return false;
        } catch (error) {
            console.error("Login error:", error);
            return false;
        }
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem("user");
        toast.success('Logout Successfully')
        router.push("/login");
    };

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) setUser(JSON.parse(storedUser));
    }, [])
    useEffect(() => {
        const user = localStorage.getItem("user");

        if (!user && pathname !== "/login" && pathname !== "/register") {
            router.replace("/login");
        }

        if (user && (pathname === "/login" || pathname === "/register")) {
            router.replace("/dashboard");
        }
    }, [router, pathname, user]);

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within AuthProvider");
    }
    return context;
};