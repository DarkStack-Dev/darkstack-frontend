  "use client";

import { useAuthStore } from "@/store/authStore";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { User } from "@/types/accounts/user";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Header } from "./Header";
import { BarLoader } from 'react-spinners';
import { Footer } from "./Footer";


type Props = {
    user: User | null,
    children: React.ReactNode
}

export const MainLayout = ({ user, children }: Props) => {
    const auth = useAuthStore();
    const [loading, setLoading] = useState(true);
    const pathname = usePathname();

    useEffect(() => {
        if (user) auth.setUser(user);
        setLoading(false);
    }, [user]);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <BarLoader color="#493cdd" />
            </div>
        );
    }

    // Renderização do layout com o Sidebar
    return (
        <div className="mt-[3rem] relative overflow-hidden bg-slate-200 dark:bg-slate-950">
            {auth.user && !pathname.includes("auth") ? (
                <SidebarProvider>
                    <AppSidebar className="mt-[3rem] h-[calc(100vh-3rem)]" />
                    
                    <div className="flex-1">
                        {/* Coloca o SidebarTrigger dentro do Header */}
                        <Header withSidebarTrigger />
                        <div>
                            <main >
                                {children}
                            </main>
                            <Footer />
                        </div>
                    </div>
                </SidebarProvider>
            ) : (
                <div className="flex-1">
                    <Header />
                    {children}
                    <Footer />
                </div>
            )}

        </div>
    );
};