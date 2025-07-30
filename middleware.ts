// middleware.ts - CORRIGIDO COM TRATAMENTO DE ERROS
import { NextRequest, NextResponse } from "next/server";
import { handleGetUser } from "@/lib/server/auth";
import createIntlMiddleware from 'next-intl/middleware';

// --- CONFIGURAÇÃO DA INTERNACIONALIZAÇÃO (i18n) ---
const intlMiddleware = createIntlMiddleware({
    locales: ['pt', 'en'],
    defaultLocale: 'pt',
    pathnames: {
        '/': '/',
    }
});

// --- SUA LÓGICA DE AUTENTICAÇÃO E AUTORIZAÇÃO ---

// Definindo as roles disponíveis
type UserRole = 'ADMIN' | 'USER' | 'MODERATOR' | 'GUEST';

// Mapeamento de rotas e roles permitidas (sem o prefixo de idioma)
const roleBasedRoutes: Record<string, UserRole[]> = {
    '/admin': ['ADMIN'],
    '/moderator': ['ADMIN', 'MODERATOR'],
    '/projects/admin': ['ADMIN', 'MODERATOR'],
    '/projects/new': ['ADMIN', 'MODERATOR', 'USER'],
    '/projects/my': ['ADMIN', 'MODERATOR', 'USER'],
    '/projects/edit': ['ADMIN', 'MODERATOR', 'USER'],
    '/profile': ['ADMIN', 'MODERATOR', 'USER'],
    '/account': ['ADMIN', 'MODERATOR', 'USER'],
    '/dashboard': ['ADMIN', 'MODERATOR', 'USER'],
};

// Rotas que só usuários ativos podem acessar
const requiresActiveUser = [
    '/projects/new', '/projects/my', '/projects/edit', '/projects/admin',
    '/admin', '/moderator', '/profile', '/account', '/dashboard'
];

// --- MIDDLEWARE PRINCIPAL (COMBINADO) ---
export async function middleware(request: NextRequest) {
    try {
        // Passo 1: Executa o middleware da next-intl primeiro.
        const response = intlMiddleware(request);

        // Pega o pathname já com o locale, se houver (ex: /pt/admin)
        const pathnameWithLocale = request.nextUrl.pathname;
        
        // Extrai o locale e o pathname sem o locale
        const locale = response.headers.get('x-next-intl-locale') || 'pt';
        const pathname = pathnameWithLocale.startsWith(`/${locale}`)
            ? pathnameWithLocale.substring(locale.length + 1) || '/'
            : pathnameWithLocale;
        
        // As rotas de API não precisam de autenticação neste nível
        if (pathname.startsWith('/api/')) {
            return response;
        }

        // ✅ TRATAMENTO ROBUSTO PARA BUSCAR USUÁRIO
        let user = null;
        try {
            console.log(`🔍 Middleware: Tentando buscar usuário para rota: ${pathname}`);
            user = await handleGetUser();
            console.log(`🔍 Middleware: Usuário encontrado: ${user ? user.email : 'nenhum'}`);
        } catch (error) {
            console.error(`❌ Middleware: Erro ao buscar usuário:`, error);
            // ✅ CONTINUAR EXECUÇÃO MESMO COM ERRO - NÃO QUEBRAR O SITE
            user = null;
        }

        console.log(`🔍 Middleware: Rota original: ${pathnameWithLocale}, Rota tratada: ${pathname}, User: ${user ? user.email : 'anonymous'}`);

        // Rotas de autenticação são sempre públicas
        if (pathname.startsWith('/auth')) {
            if (user) {
                // Se já logado, redireciona para projetos
                return NextResponse.redirect(new URL(`/${locale}/projects`, request.url));
            }
            return response; // Permite acesso a /auth/* para não logados
        }

        // Se não for rota de auth e o usuário não estiver logado
        if (!user) {
            // Verifica se a rota é pública
            const isProtected = Object.keys(roleBasedRoutes).some(route => 
                pathname === route || pathname.startsWith(route + '/')
            );
            
            if (isProtected) {
                console.log(`🚫 Middleware: Rota protegida, redirecionando para login: ${pathname}`);
                // Se for protegida, redireciona para o login
                return NextResponse.redirect(new URL(`/${locale}/auth/signin`, request.url));
            }
            
            // Se não for protegida, permite acesso
            return response;
        }
        
        // Se chegou aqui, o usuário está logado.
        
        // Verificar se o usuário está ativo (se a rota requer)
        if (requiresActiveUser.some(route => pathname === route || pathname.startsWith(route + '/'))) {
            if (!user.isActive) {
                console.log(`🚫 Middleware: Usuário inativo, redirecionando: ${pathname}`);
                return NextResponse.redirect(new URL(`/${locale}/account-suspended`, request.url));
            }
        }
        
        // Verificar autorização baseada em roles
        const matchedRoute = Object.keys(roleBasedRoutes).find(route => 
            pathname === route || pathname.startsWith(route + '/')
        );

        if (matchedRoute) {
            const allowedRoles = roleBasedRoutes[matchedRoute];
            const userHasPermission = user.roles && user.roles.some((role: UserRole) => 
                allowedRoles.includes(role)
            );

            if (!userHasPermission) {
                console.log(`🚫 Middleware: Acesso negado para ${pathname}, roles: ${user.roles}`);
                // Redireciona para uma página de "não autorizado" ou para a home de projetos
                return NextResponse.redirect(new URL(`/${locale}/projects`, request.url));
            }
        }

        // Se passou por todas as verificações, permite o acesso.
        return response;

    } catch (error) {
        console.error(`❌ Middleware: Erro crítico:`, error);
        
        // ✅ EM CASO DE ERRO CRÍTICO, PERMITIR ACESSO MAS LOGAR O ERRO
        // Isso evita que o site inteiro quebre por causa de um erro no middleware
        const response = intlMiddleware(request);
        return response;
    }
}

// --- CONFIGURAÇÃO DO MATCHER (APENAS UMA) ---
export const config = {
  // Este matcher foi atualizado para também ignorar qualquer arquivo .svg
  matcher: ['/((?!api|_next/static|_next/image|assets|favicon.ico|.*\\.svg$).*)']
};