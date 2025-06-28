// app/api/auth/github/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

interface GitHubTokenResponse {
    access_token: string;
    token_type: string;
    scope: string;
    error?: string;
    error_description?: string;
}

interface GitHubUser {
    id: number;
    login: string;
    name: string;
    email: string;
    avatar_url: string;
    bio: string;
    public_repos: number;
    followers: number;
    following: number;
}

export async function POST(request: NextRequest) {
    console.log('🚀 [GitHub API Route] Iniciando autenticação GitHub...');
    
    try {
        const { code } = await request.json();
        console.log('📝 [GitHub API Route] Code recebido:', code ? 'Presente' : 'Ausente');

        if (!code) {
            console.log('❌ [GitHub API Route] Code não fornecido');
            return NextResponse.json(
                { error: 'Código de autorização é obrigatório' },
                { status: 400 }
            );
        }

        // 1. Trocar código por access_token no GitHub
        console.log('🔄 [GitHub API Route] Trocando code por access_token...');
        const tokenResponse = await fetch('https://github.com/login/oauth/access_token', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                client_id: process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID,
                client_secret: process.env.GITHUB_CLIENT_SECRET,
                code: code,
            }),
        });

        const tokenData: GitHubTokenResponse = await tokenResponse.json();
        console.log('🔑 [GitHub API Route] Token response:', tokenData.access_token ? 'Token obtido' : 'Erro:', tokenData.error);

        if (!tokenData.access_token) {
            console.log('❌ [GitHub API Route] Falha ao obter token:', tokenData.error_description);
            return NextResponse.json(
                { error: 'Falha ao obter token do GitHub: ' + (tokenData.error_description || 'Erro desconhecido') },
                { status: 400 }
            );
        }

        // 2. Buscar dados do usuário no GitHub
        console.log('👤 [GitHub API Route] Buscando dados do usuário...');
        const userResponse = await fetch('https://api.github.com/user', {
            headers: {
                'Authorization': `Bearer ${tokenData.access_token}`,
                'Accept': 'application/vnd.github.v3+json',
            },
        });

        const githubUser: GitHubUser = await userResponse.json();
        console.log('📊 [GitHub API Route] Dados do usuário obtidos:', {
            id: githubUser.id,
            login: githubUser.login,
            name: githubUser.name,
            email: githubUser.email || 'Email não público'
        });

        // 3. Buscar email se não estiver público
        let email = githubUser.email;
        if (!email) {
            console.log('📧 [GitHub API Route] Email não público, buscando emails...');
            const emailResponse = await fetch('https://api.github.com/user/emails', {
                headers: {
                    'Authorization': `Bearer ${tokenData.access_token}`,
                    'Accept': 'application/vnd.github.v3+json',
                },
            });
            
            const emails = await emailResponse.json();
            const primaryEmail = emails.find((e: any) => e.primary && e.verified);
            email = primaryEmail?.email || '';
            console.log('📧 [GitHub API Route] Email encontrado:', email || 'Nenhum email encontrado');
        }

        // 4. Preparar dados para enviar ao backend
        const userData = {
            githubId: githubUser.id.toString(),
            username: githubUser.login,
            name: githubUser.name || githubUser.login,
            email: email,
            avatarUrl: githubUser.avatar_url,
            bio: githubUser.bio,
            publicRepos: githubUser.public_repos,
            followers: githubUser.followers,
            following: githubUser.following,
            accessToken: tokenData.access_token,
        };

        console.log('📤 [GitHub API Route] Dados do usuário preparados para envio ao backend:', userData);

        console.log('🌐 [GitHub API Route] Enviando dados para o backend:', process.env.NEXT_PUBLIC_API_BASE_URL + '/users/login');

        // 5. Enviar dados para seu backend
        const backendResponse = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/users/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userData),
        });

        const backendData = await backendResponse.json();
        console.log('🏠 [GitHub API Route] Resposta do backend:', {
            status: backendResponse.status,
            success: backendResponse.ok,
            user: backendData.user ? 'Usuário retornado' : 'Sem usuário',
            token: backendData.authToken ? 'Token retornado' : 'Sem token'
        });

        if (!backendResponse.ok) {
            console.log('❌ [GitHub API Route] Erro no backend:', backendData.message);
            return NextResponse.json(
                { error: backendData.message || 'Erro no servidor' },
                { status: backendResponse.status }
            );
        }

        // 6. Configurar cookie de autenticação
        console.log('🍪 [GitHub API Route] Configurando cookie de autenticação...');
        const cookieStore = await cookies();
        cookieStore.set({
            name: process.env.NEXT_PUBLIC_AUTH_KEY as string,
            value: backendData.authToken,
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 86400 * 7, // 7 dias
        });

        console.log('✅ [GitHub API Route] Autenticação GitHub concluída com sucesso!');

        // 7. Retornar dados do usuário
        return NextResponse.json({
            user: backendData.user,
            message: 'Autenticação realizada com sucesso'
        });

    } catch (error) {
        console.error('💥 [GitHub API Route] Erro na autenticação GitHub:', error);
        return NextResponse.json(
            { error: 'Erro interno do servidor: ' + (error instanceof Error ? error.message : 'Erro desconhecido') },
            { status: 500 }
        );
    }
}