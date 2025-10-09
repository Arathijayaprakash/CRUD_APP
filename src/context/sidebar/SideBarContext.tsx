'use client'

import { createContext, useContext, useState } from "react";

export interface SideBarContextTypes {
    isSidebarOpen: boolean;
    toggleSidebar: () => void;
}
export const SideBarContext = createContext<SideBarContextTypes | undefined>(undefined)

export const SideBarProvider = ({ children }: { children: React.ReactNode }) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false)
    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen)
    }

    return (
        <SideBarContext.Provider value={{ isSidebarOpen, toggleSidebar }}>
            {children}
        </SideBarContext.Provider>
    )
}

export const useSidebar = () => {
    const context = useContext(SideBarContext)
    if (!context) {
        throw new Error("useSidebar must be used within sidebarProvider");
    }
    return context
}