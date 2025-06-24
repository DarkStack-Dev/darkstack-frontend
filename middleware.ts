import { NextRequest, NextResponse } from "next/server";
import { handleGetUser } from "@/lib/server/auth";

export async function middleware(request: NextRequest) {
    const user = await handleGetUser();

    // Permitir acesso às rotas públicas sem redirecionar
    const publicPaths = [
        '/', 
        '/auth/signin', 
        '/auth/signup', 
        '/auth/recover', 
        '/auth/reset',
        '/sobrenos',
    ];

    if (publicPaths.includes(request.nextUrl.pathname)) {
        return NextResponse.next();
    }

    //Se o usuário não estiver logado e tentar acessar outras rotas, redirecionar para '/'
    if (!user) {
        return NextResponse.redirect(new URL('/', request.url));
    }

    // Se o usuário estiver logado e tentar acessar as rotas de autenticação, redirecionar para '/ipf'
    if (request.nextUrl.pathname.startsWith('/auth') && user) {
        return NextResponse.redirect(new URL('/projects', request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: '/((?!.*\\..*|_next).*)',
};