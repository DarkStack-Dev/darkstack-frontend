// components/Layouts/Header.tsx - VERSÃO FINAL COM CORREÇÃO DO "PISCA-PISCA"

"use client"
import { useState, useEffect } from 'react'; // 1. IMPORTAÇÕES ADICIONADAS
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useTranslations } from 'next-intl';
import { handleSignOut } from "@/lib/server/auth"
import { useAuthStore } from "@/store/authStore"
import { useTheme } from "next-themes"
import { Link, usePathname } from '@/i18n/navigation';
import { toast } from "sonner"
import Image from "next/image"
import { Button } from "../ui/button"
import { ChevronDown, FileText, Home, LogOut, Moon, Settings, Shield, Sun, User, Users, Plus, FolderOpen, Eye } from "lucide-react"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
    DropdownMenuLabel
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"
import { usePermissions } from "@/hooks/usePermissions";
import { ProtectedComponent } from "../ProtectedComponent";
import { LanguageSwitcher } from "../LanguageSwitcher";

type HeaderProps = {
    withSidebarTrigger?: boolean;
};

export const Header = ({ withSidebarTrigger = false }: HeaderProps) => {
    // 2. LÓGICA PARA EVITAR O "PISCA-PISCA"
    const [hasMounted, setHasMounted] = useState(false);

    useEffect(() => {
        setHasMounted(true);
    }, []);

    const t = useTranslations('header');
    const { setTheme } = useTheme()
    const { user, clearUser } = useAuthStore()
    const { isAdmin, isModerator, canManageUsers, canViewReports } = usePermissions()
    const pathname = usePathname() 

    const handleLogOut = () => {
        handleSignOut()
        toast.success('Deslogado com sucesso', { position: "bottom-right" })
        clearUser()
    }
    
    // 3. CONDIÇÃO DE RENDERIZAÇÃO SEGURA
    // Se o componente ainda não montou no navegador, renderiza um placeholder vazio
    // para evitar o "salto" dos botões e a troca de tema.
    if (!hasMounted) {
        return (
             <header className="fixed top-0 left-0 right-0 z-50 h-[3rem] px-2" />
        );
    }

    return (
        <header className="fixed top-0 left-0 right-0 z-50 h-[3rem] px-2 bg-white/30 backdrop-blur-lg border-b border-gray-100 dark:bg-slate-900/30 dark:border-slate-800">
            <nav className="flex items-center justify-between h-full mx-auto">
                <div className="flex gap-2 items-center">
                    {withSidebarTrigger && <SidebarTrigger />}
                    <Button className="flex min-[480px]:hidden" asChild>
                        <Link href='/'><Home className="size-[1.2rem]" /></Link>
                    </Button>
                    {user && (
                        <div className="hidden min-[480px]:flex items-center gap-4 ml-4">
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant={pathname.startsWith('/projects') ? 'default' : 'ghost'} className="flex items-center gap-1">
                                        {t('projects')}
                                        <ChevronDown className="w-3 h-3" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="start" className="w-48">
                                    <DropdownMenuLabel>{t('projects')}</DropdownMenuLabel>
                                    <Link href="/projects"><DropdownMenuItem><Eye className="mr-2 w-4 h-4" />{t('viewProjects')}</DropdownMenuItem></Link>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuLabel>{t('myProjects')}</DropdownMenuLabel>
                                    <Link href="/projects/new"><DropdownMenuItem><Plus className="mr-2 w-4 h-4" />{t('createProject')}</DropdownMenuItem></Link>
                                    <Link href="/projects/my"><DropdownMenuItem><FolderOpen className="mr-2 w-4 h-4" />{t('manageMyProjects')}</DropdownMenuItem></Link>
                                </DropdownMenuContent>
                            </DropdownMenu>
                            <ProtectedComponent roles={['ADMIN', 'MODERATOR']}>
                                <Link href="/projects/admin" className={`hover:underline ${pathname === '/projects/admin' ? 'font-semibold' : ''}`}>{t('moderation')}</Link>
                            </ProtectedComponent>
                        </div>
                    )}
                    {!user && (
                        <div className="hidden min-[480px]:flex items-center gap-4 ml-4">
                            <Link href="/projects" className="hover:underline">{t('projects')}</Link>
                        </div>
                    )}
                </div>

                <div className="flex items-center gap-6">
                    <LanguageSwitcher />
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="icon">
                                <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                                <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                                <span className="sr-only">{t('theme')}</span>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => setTheme("light")}>{t('light')}</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setTheme("dark")}>{t('dark')}</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setTheme("system")}>{t('system')}</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                    <ProtectedComponent roles={['ADMIN']}>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline" size="sm" className="gap-2">
                                    <Settings className="size-4" />
                                    <span className="hidden sm:inline">{t('admin')}</span>
                                    <ChevronDown className="size-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-48">
                                <DropdownMenuLabel>{t('administration')}</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <Link href="/admin"><DropdownMenuItem><Shield className="mr-2 size-4" />{t('dashboard')}</DropdownMenuItem></Link>
                                {canManageUsers() && (
                                    <Link href="/admin/users"><DropdownMenuItem><Users className="mr-2 size-4" />{t('manageUsers')}</DropdownMenuItem></Link>
                                )}
                                <Link href="/admin/settings"><DropdownMenuItem><Settings className="mr-2 size-4" />{t('settings')}</DropdownMenuItem></Link>
                                {canViewReports() && (
                                    <Link href="/admin/reports"><DropdownMenuItem><FileText className="mr-2 size-4" />{t('reports')}</DropdownMenuItem></Link>
                                )}
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </ProtectedComponent>
                    {(isAdmin() || isModerator()) && (
                        <span className="px-2 py-1 bg-blue-500 text-white text-xs rounded hidden sm:inline">{isAdmin() ? 'ADMIN' : 'MODERATOR'}</span>
                    )}
                    {user && (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline" className="gap-5">
                                    <Avatar className="size-7"><AvatarImage src={user?.name} alt={user?.name} /><AvatarFallback>{user?.name?.slice(0, 2)}</AvatarFallback></Avatar>
                                    <ChevronDown className="size-5 text-slate-500 dark:text-slate-300" strokeWidth={2.5} />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuLabel>{user.name}</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <Link href="/account"><DropdownMenuItem><User className="mr-3 size-4" /><span>{t('profile')}</span></DropdownMenuItem></Link>
                                <Link href="/projects/my"><DropdownMenuItem><FolderOpen className="mr-3 size-4" /><span>{t('myProjects')}</span></DropdownMenuItem></Link>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem className="text-red-500" onClick={handleLogOut}><LogOut className="mr-3 size-4" /><span>{t('logout')}</span></DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    )}
                    {!user && (pathname.startsWith('/auth') || pathname === '/') && (
                        <div className="flex gap-2">
                            {pathname !== '/auth/signin' && (
                                <Button size="sm" asChild className="min-w-[120px] justify-center"><Link href="/auth/signin">{t('login')}</Link></Button>
                            )}
                            {pathname !== '/auth/signup' && (
                                <Button size="sm" asChild className="min-w-[120px] justify-center"><Link href="/auth/signup">{t('signup')}</Link></Button>
                            )}
                        </div>
                    )}
                </div>
            </nav>
        </header>
    )
}