"use client";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const user = localStorage.getItem("user");

    // Allow login and register without redirect
    if (!user && pathname !== "/login" && pathname !== "/register") {
      router.replace("/login");
    }

    if (user && (pathname === "/login" || pathname === "/register")) {
      router.replace("/dashboard");
    }
  }, [router, pathname]);

  return <>{children}</>;
}
