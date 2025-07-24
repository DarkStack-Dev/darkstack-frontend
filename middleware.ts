// middleware.ts - ATUALIZADO
import { NextRequest, NextResponse } from "next/server";
import { handleGetUser } from "@/lib/server/auth";
import createMiddleware from 'next-intl/middleware';
import {routing} from './i18n/routing';


export default createMiddleware({
    locales: ['pt', 'en'],
    defaultLocale: 'pt'
});

export const configuratiom = {
    matcher: ['/((?!_next|favicon.ico|images|assets).*)']
};

// Definindo as roles disponíveis (baseado no seu Prisma schema)
type UserRole = 'ADMIN' | 'USER' | 'MODERATOR' | 'GUEST';

// Mapeamento de rotas e roles permitidas
const roleBasedRoutes: Record<string, UserRole[]> = {
    // Rotas de administração
    '/admin': ['ADMIN'],
    '/admin/users': ['ADMIN'],
    '/admin/settings': ['ADMIN'],
    '/admin/reports': ['ADMIN'],
    
    // Rotas de moderação
    '/moderator': ['ADMIN', 'MODERATOR'],
    '/moderator/content': ['ADMIN', 'MODERATOR'],
    
    // Rotas de projetos - moderação
    '/projects/admin': ['ADMIN', 'MODERATOR'],
    
    // Rotas de projetos - usuários autenticados
    '/projects/new': ['ADMIN', 'MODERATOR', 'USER'],
    '/projects/my': ['ADMIN', 'MODERATOR', 'USER'],
    '/projects/edit': ['ADMIN', 'MODERATOR', 'USER'],
    
    // Rotas gerais autenticadas
    '/profile': ['ADMIN', 'MODERATOR', 'USER'],
    '/account': ['ADMIN', 'MODERATOR', 'USER'],
    '/dashboard': ['ADMIN', 'MODERATOR', 'USER'],
};

// Rotas que só usuários ativos podem acessar
const requiresActiveUser = [
    '/projects/new',
    '/projects/my',
    '/projects/edit',
    '/projects/admin',
    '/admin',
    '/moderator',
    '/profile',
    '/account',
    '/dashboard'
];

// Rotas completamente públicas (não requerem autenticação)
const publicPaths = [
    '/', 
    '/auth/signin', 
    '/auth/signup', 
    '/auth/recover', 
    '/auth/retrieve', 
    '/auth/github/callback', 
    '/auth/google/callback', 
    '/auth/reset',
    '/sobrenos',
    '/projects', // Lista pública de projetos aprovados
    '/api/auth/github',
];

// Rotas que são públicas mas podem ter conteúdo extra para usuários logados
const semiPublicPaths = [
    '/projects', // Lista de projetos (público, mas com mais features para logados)
];

export async function middleware(request: NextRequest) {
    const user = await handleGetUser();
    const pathname = request.nextUrl.pathname;

    console.log(`🔍 Middleware: ${pathname} - User: ${user ? user.email : 'anonymous'}`);

    // Permitir acesso às rotas completamente públicas
    if (publicPaths.includes(pathname)) {
        return NextResponse.next();
    }

    // Permitir rotas de projetos específicos (ex: /projects/123)
    if (pathname.startsWith('/projects/') && pathname.match(/^\/projects\/[a-zA-Z0-9]+$/)) {
        // Projeto específico é público (se aprovado)
        return NextResponse.next();
    }

    // Se o usuário não estiver logado e tentar acessar outras rotas protegidas
    if (!user) {
        // Para rotas semi-públicas, permitir mas sem funcionalidades extras
        if (semiPublicPaths.some(path => pathname.startsWith(path))) {
            return NextResponse.next();
        }
        
        // Outras rotas redirecionam para home
        console.log(`❌ Middleware: Redirecting unauthenticated user from ${pathname} to /`);
        return NextResponse.redirect(new URL('/', request.url));
    }

    // Se o usuário estiver logado e tentar acessar as rotas de autenticação, redirecionar
    if (pathname.startsWith('/auth') && user) {
        console.log(`🔄 Middleware: Redirecting authenticated user from ${pathname} to /projects`);
        return NextResponse.redirect(new URL('/projects', request.url));
    }

    // Verificar se o usuário está ativo (se a rota requer)
    if (requiresActiveUser.some(route => pathname.startsWith(route))) {
        if (!user.isActive) {
            console.log(`⚠️ Middleware: Inactive user attempting to access ${pathname}`);
            return NextResponse.redirect(new URL('/account-suspended', request.url));
        }
    }

    // Verificar autorização baseada em roles
    const matchedRoute = Object.keys(roleBasedRoutes).find(route => 
        pathname.startsWith(route)
    );

    if (matchedRoute) {
        const allowedRoles = roleBasedRoutes[matchedRoute];
        const userHasPermission = user.roles.some((role: UserRole) => 
            allowedRoles.includes(role)
        );

        if (!userHasPermission) {
            console.log(`🚫 Middleware: User ${user.email} denied access to ${pathname}. Required: ${allowedRoles.join(', ')}, Has: ${user.roles.join(', ')}`);
            
            // Redirecionar baseado na role do usuário
            if (user.roles.includes('ADMIN')) {
                return NextResponse.redirect(new URL('/admin', request.url));
            } else if (user.roles.includes('MODERATOR')) {
                return NextResponse.redirect(new URL('/projects/admin', request.url));
            } else {
                return NextResponse.redirect(new URL('/projects', request.url));
            }
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: '/((?!.*\\..*|_next).*)',
};