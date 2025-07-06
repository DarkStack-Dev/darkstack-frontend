// components/Layouts/Header.tsx - ATUALIZADO
"use client"
import { SidebarTrigger } from "@/components/ui/sidebar";

type HeaderProps = {
    withSidebarTrigger?: boolean;
};

import { handleSignOut } from "@/lib/server/auth"
import { useAuthStore } from "@/store/authStore"
import { useTheme } from "next-themes"
import Link from "next/link"
import { usePathname } from "next/navigation"
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

export const Header = ({ withSidebarTrigger = false }: HeaderProps) => {
    const { setTheme } = useTheme()
    const { user, clearUser } = useAuthStore()
    const { 
        showAdminMenu, 
        showModeratorMenu, 
        isAdmin, 
        isModerator,
        canManageUsers,
        canViewReports 
    } = usePermissions()
    const pathname = usePathname()

    const handleLogOut = () => {
        handleSignOut()
        toast.success('Deslogado com sucesso', { position: "bottom-right" })
        clearUser()
    }
      
    return (
        <header className="fixed top-0 left-0 right-0 z-50 h-[3rem] px-2 bg-white/30 backdrop-blur-lg border-b border-gray-100 bg-slate-100 dark:bg-slate-900/30 dark:border-slate-800">
            <nav className="flex items-center justify-between h-full mx-auto">
                {/* Container para manter SidebarTrigger e Logo juntos no lado esquerdo */}
                <div className="flex gap-2 items-center">
                    {withSidebarTrigger && (
                        <SidebarTrigger />
                    )}

                    {/* Logo/Home para mobile */}
                    <Button className="flex min-[480px]:hidden">
                        <Link href='/'>
                            <Home className="size-[1.2rem]" />
                        </Link>
                    </Button>

                    {/* Menu de navegação principal - só aparece para usuários logados */}
                    {user && (
                        <div className="hidden min-[480px]:flex items-center gap-4 ml-4">
                            {/* Projetos */}
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button 
                                        variant={pathname.startsWith('/projects') ? 'default' : 'ghost'} 
                                        className="flex items-center gap-1"
                                    >
                                        Projetos
                                        <ChevronDown className="w-3 h-3" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="start" className="w-48">
                                    <DropdownMenuLabel>Explorar</DropdownMenuLabel>
                                    <Link href="/projects">
                                        <DropdownMenuItem>
                                            <Eye className="mr-2 w-4 h-4" />
                                            Ver Projetos
                                        </DropdownMenuItem>
                                    </Link>
                                    
                                    <DropdownMenuSeparator />
                                    <DropdownMenuLabel>Meus Projetos</DropdownMenuLabel>
                                    
                                    <Link href="/projects/new">
                                        <DropdownMenuItem>
                                            <Plus className="mr-2 w-4 h-4" />
                                            Criar Projeto
                                        </DropdownMenuItem>
                                    </Link>
                                    
                                    <Link href="/projects/my">
                                        <DropdownMenuItem>
                                            <FolderOpen className="mr-2 w-4 h-4" />
                                            Gerenciar Meus Projetos
                                        </DropdownMenuItem>
                                    </Link>
                                </DropdownMenuContent>
                            </DropdownMenu>
                            
                            {/* Menu de Moderação */}
                            <ProtectedComponent roles={['ADMIN', 'MODERATOR']}>
                                <Link href="/projects/admin" className={`hover:underline ${pathname === '/projects/admin' ? 'font-semibold' : ''}`}>
                                    Moderação
                                </Link>
                            </ProtectedComponent>
                        </div>
                    )}

                    {/* Links simples para usuários não logados */}
                    {!user && (
                        <div className="hidden min-[480px]:flex items-center gap-4 ml-4">
                            <Link href="/projects" className="hover:underline">
                                Projetos
                            </Link>
                        </div>
                    )}
                </div>

                <div className="flex items-center gap-6">
                    {/* Theme Toggle */}
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button
                                variant="outline"
                                size="icon"
                            >
                                <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                                <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                                <span className="sr-only">Alterar o tema</span>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => setTheme("light")}>
                                Light
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setTheme("dark")}>
                                Dark
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setTheme("system")}>
                                Sistema
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>

                    {/* Menu Admin - só aparece para ADMINs */}
                    <ProtectedComponent roles={['ADMIN']}>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline" size="sm" className="gap-2">
                                    <Settings className="size-4" />
                                    <span className="hidden sm:inline">Admin</span>
                                    <ChevronDown className="size-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-48">
                                <DropdownMenuLabel>Administração</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                
                                <Link href="/admin">
                                    <DropdownMenuItem>
                                        <Shield className="mr-2 size-4" />
                                        Dashboard
                                    </DropdownMenuItem>
                                </Link>
                                
                                {canManageUsers() && (
                                    <Link href="/admin/users">
                                        <DropdownMenuItem>
                                            <Users className="mr-2 size-4" />
                                            Gerenciar Usuários
                                        </DropdownMenuItem>
                                    </Link>
                                )}
                                
                                <Link href="/admin/settings">
                                    <DropdownMenuItem>
                                        <Settings className="mr-2 size-4" />
                                        Configurações
                                    </DropdownMenuItem>
                                </Link>

                                {canViewReports() && (
                                    <Link href="/admin/reports">
                                        <DropdownMenuItem>
                                            <FileText className="mr-2 size-4" />
                                            Relatórios
                                        </DropdownMenuItem>
                                    </Link>
                                )}
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </ProtectedComponent>

                    {/* Badge de Role */}
                    {(isAdmin() || isModerator()) && (
                        <span className="px-2 py-1 bg-blue-500 text-white text-xs rounded hidden sm:inline">
                            {isAdmin() ? 'ADMIN' : 'MODERATOR'}
                        </span>
                    )}

                    {/* User Menu */}
                    {user && (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button
                                    variant="outline"
                                    className="gap-5"
                                >
                                    <Avatar className="size-7">
                                        <AvatarImage
                                            src={user?.name}
                                            alt={user?.name}
                                        />
                                        <AvatarFallback>{user?.name?.slice(0, 2)}</AvatarFallback>
                                    </Avatar>

                                    <ChevronDown
                                        className="size-5 text-slate-500 dark:text-slate-300"
                                        strokeWidth={2.5}
                                    />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuLabel>{user.name}</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                
                                <Link href="/account">
                                    <DropdownMenuItem>
                                        <User className="mr-3 size-4" />
                                        <span>Perfil</span>
                                    </DropdownMenuItem>
                                </Link>
                                
                                <Link href="/projects/my">
                                    <DropdownMenuItem>
                                        <FolderOpen className="mr-3 size-4" />
                                        <span>Meus Projetos</span>
                                    </DropdownMenuItem>
                                </Link>
                                
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                    className="text-red-500"
                                    onClick={handleLogOut}
                                >
                                    <LogOut className="mr-3 size-4" />
                                    <span>Sair</span>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    )}

                    {/* Botões para usuários não logados */}
                    {!user && (pathname.startsWith('/auth') || pathname === '/') && (
                        <div className="flex gap-2">
                            {pathname !== '/auth/signin' && (
                                <Button size="sm" asChild>
                                    <Link href="/auth/signin">Entrar</Link>
                                </Button>
                            )}
                            {pathname !== '/auth/signup' && (
                                <Button size="sm" asChild>
                                    <Link href="/auth/signup">Registrar-se</Link>
                                </Button>
                            )}
                        </div>
                    )}
                </div>
            </nav>
        </header>
    )
}