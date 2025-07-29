// components/Layouts/MainLayout.tsx - ATUALIZADO

"use client";

import { useAuthStore } from "@/store/authStore";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { User } from "@/types/accounts/user";
import { usePathname } from "@/i18n/navigation"; // 1. Usar o hook de navegação correto
import { useEffect, useState } from "react";
import { Header } from "./Header";
import { BarLoader } from 'react-spinners';
import { Footer } from "./Footer";

type Props = {
    user: User | null,
    children: React.ReactNode
}

export const MainLayout = ({ user, children }: Props) => {
    const [loading, setLoading] = useState(true);
    const pathname = usePathname();
    const { setUser, clearUser } = useAuthStore();

    useEffect(() => {
        if (user) {
            setUser(user);
        } else {
            clearUser();
        }
        setLoading(false);
    }, [user, setUser, clearUser]);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <BarLoader color="#493cdd" />
            </div>
        );
    }

    // Define se a página de autenticação está ativa
    const isAuthPage = pathname.includes("/auth");

    return (
        // 2. A estrutura principal agora usa flexbox para organizar o layout
        <div className="flex flex-col min-h-screen bg-slate-200 dark:bg-slate-950">
            <Header withSidebarTrigger={!!user && !isAuthPage} />
            
            <div className="flex flex-1 mt-[3rem]"> {/* Conteúdo principal começa abaixo do header */}
                {user && !isAuthPage && (
                    <SidebarProvider>
                        <AppSidebar />
                    </SidebarProvider>
                )}
                
                {/* 3. A 'main' agora ocupa o espaço restante, empurrando o footer para baixo */}
                <main className="flex-1 overflow-y-auto">
                    {children}
                </main>
            </div>
            
            {/* 4. O Footer é renderizado fora da área de conteúdo principal */}
            <Footer />
        </div>
    );
};