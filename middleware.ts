import { NextRequest, NextResponse } from "next/server";
import { handleGetUser } from "@/lib/server/auth";

// Definindo as roles disponíveis (baseado no seu Prisma schema)
type UserRole = 'ADMIN' | 'USER' | 'MODERATOR' | 'GUEST';

// Mapeamento de rotas e roles permitidas
const roleBasedRoutes: Record<string, UserRole[]> = {
    '/admin': ['ADMIN'],
    '/admin/users': ['ADMIN'],
    '/admin/settings': ['ADMIN'],
    '/moderator': ['ADMIN', 'MODERATOR'],
    '/moderator/content': ['ADMIN', 'MODERATOR'],
    '/projects': ['ADMIN', 'MODERATOR', 'USER'], // usuários normais podem acessar
    '/profile': ['ADMIN', 'MODERATOR', 'USER'], // todos os usuários logados
    '/dashboard': ['ADMIN', 'MODERATOR', 'USER'],
};

// Rotas que só usuários ativos podem acessar
const requiresActiveUser = [
    '/projects',
    '/admin',
    '/moderator',
    '/profile',
    '/dashboard'
];

export async function middleware(request: NextRequest) {
    const user = await handleGetUser();
    const pathname = request.nextUrl.pathname;

    // Permitir acesso às rotas públicas sem redirecionar
    const publicPaths = [
        '/', 
        '/auth/signin', 
        '/auth/signup', 
        '/auth/recover', 
        '/auth/retrieve', 
        '/auth/reset',
        '/sobrenos',
    ];

    if (publicPaths.includes(pathname)) {
        return NextResponse.next();
    }

    //Se o usuário não estiver logado e tentar acessar outras rotas, redirecionar para '/'
    if (!user) {
        return NextResponse.redirect(new URL('/', request.url));
    }

    // Se o usuário estiver logado e tentar acessar as rotas de autenticação, redirecionar para '/ipf'
    if (pathname.startsWith('/auth') && user) {
        return NextResponse.redirect(new URL('/projects', request.url));
    }

    // Verificar se o usuário está ativo (se a rota requer)
    if (requiresActiveUser.some(route => pathname.startsWith(route))) {
        console.log("User is active:", user.isActive);
        if (!user.isActive) {
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
            // Redirecionar baseado na role do usuário
            if (user.roles.includes('ADMIN')) {
                return NextResponse.redirect(new URL('/admin', request.url));
            } else if (user.roles.includes('MODERATOR')) {
                return NextResponse.redirect(new URL('/moderator', request.url));
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