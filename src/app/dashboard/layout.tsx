import Navbar from "../components/navbar/navbar";
import Sidebar from "../components/sidebar/sidebar";

export default function Layout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div className="flex h-screen">
            <Sidebar />
            <div className="flex flex-col flex-1">
                <Navbar />
                <main className="flex-1 bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 p-6 overflow-y-auto">
                    {children}
                </main>
            </div>
        </div>
    );
}
