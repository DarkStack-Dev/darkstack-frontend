// app/auth/github/callback/page.tsx - VERIFICAR POSSÍVEIS PROBLEMAS

"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import { handleGitHubCallback } from "@/lib/server/auth";
import { toast } from "sonner";
import { BarLoader } from 'react-spinners';

export default function GitHubCallbackPage() {
    const [status, setStatus] = useState<'processing' | 'success' | 'error'>('processing');
    const [message, setMessage] = useState('Processando autenticação...');
    const [processed, setProcessed] = useState(false); // ✅ Previne execução dupla
    
    const router = useRouter();
    const searchParams = useSearchParams();
    const setUser = useAuthStore(state => state.setUser);

    useEffect(() => {
        // ✅ Previne execução dupla
        if (processed) {
            console.log('⚠️ Callback já foi processado, ignorando...');
            return;
        }

        const processCallback = async () => {
            console.log('🚀 Iniciando processamento do callback...');
            setProcessed(true); // ✅ Marca como processado imediatamente
            
            const code = searchParams.get('code');
            const state = searchParams.get('state');
            const error = searchParams.get('error');

            console.log('📍 Callback params:', { 
                hasCode: !!code, 
                hasState: !!state, 
                hasError: !!error,
                code: code?.substring(0, 10) + '...', // Log parcial por segurança
                state 
            });

            // Se houve erro no GitHub
            if (error) {
                console.log('❌ GitHub OAuth Error:', error);
                setStatus('error');
                setMessage('Acesso negado pelo GitHub');
                toast.error('Autenticação cancelada', { position: "bottom-right" });
                
                setTimeout(() => {
                    router.push('/auth/signin');
                }, 3000);
                return;
            }

            // Se não tem código, erro
            if (!code) {
                console.log('❌ No authorization code found');
                setStatus('error');
                setMessage('Código de autorização não encontrado');
                toast.error('Erro na autenticação', { position: "bottom-right" });
                
                setTimeout(() => {
                    router.push('/auth/signin');
                }, 3000);
                return;
            }

            try {
                setMessage('Finalizando autenticação...');
                
                console.log('📤 Enviando código para backend...', {
                    codeLength: code.length,
                    state: state || 'undefined'
                });
                
                const response = await handleGitHubCallback({ 
                    code, 
                    state: state || undefined 
                });

                console.log('📥 Resposta do backend:', {
                    hasError: !!response.error,
                    hasData: !!response.data,
                    errorMessage: response.error?.message
                });

                if (response.error) {
                    console.log('❌ Erro do backend:', response.error);
                    setStatus('error');
                    setMessage(response.error.message);
                    toast.error(response.error.message, { position: "bottom-right" });
                    
                    setTimeout(() => {
                        router.push('/auth/signin');
                    }, 3000);
                    return;
                }

                if (response.data) {
                    console.log('✅ Autenticação bem-sucedida:', {
                        userId: response.data.user.id,
                        isNewUser: response.data.user.isNewUser
                    });
                    
                    setStatus('success');
                    setMessage('Autenticação realizada com sucesso!');
                    
                    // Atualizar o usuário no store
                    setUser({
                        id: response.data.user.id,
                        name: response.data.user.name,
                        email: response.data.user.email,
                        roles: response.data.user.roles as any,
                        createdAt: new Date().toISOString(),
                        updatedAt: new Date().toISOString(),
                        isActive: true
                    });

                    const welcomeMessage = response.data.user.isNewUser 
                        ? 'Bem-vindo! Sua conta foi criada com sucesso!' 
                        : 'Bem-vindo de volta!';
                    
                    toast.success(welcomeMessage, { position: "bottom-right" });
                    
                    // Redirecionar para a página principal
                    setTimeout(() => {
                        router.push('/projects');
                    }, 2000);
                }
            } catch (error) {
                console.error('💥 Erro no callback GitHub:', error);
                setStatus('error');
                setMessage('Erro interno no processamento');
                toast.error('Erro interno', { position: "bottom-right" });
                
                setTimeout(() => {
                    router.push('/auth/signin');
                }, 3000);
            }
        };

        processCallback();
    }, [searchParams, router, setUser, processed]); // ✅ Adicionar processed nas deps

    const getStatusColor = () => {
        switch (status) {
            case 'processing': return 'text-blue-600';
            case 'success': return 'text-green-600';
            case 'error': return 'text-red-600';
            default: return 'text-gray-600';
        }
    };

    const getStatusIcon = () => {
        switch (status) {
            case 'processing': return '⏳';
            case 'success': return '✅';
            case 'error': return '❌';
            default: return '⏳';
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
            <div className="bg-white dark:bg-gray-800 shadow-xl rounded-xl p-8 w-full max-w-md text-center">
                <div className="mb-6">
                    <div className="text-6xl mb-4">{getStatusIcon()}</div>
                    <h1 className="text-2xl font-bold mb-2 dark:text-white">
                        Autenticação GitHub
                    </h1>
                </div>

                <div className="mb-6">
                    <p className={`text-lg ${getStatusColor()}`}>
                        {message}
                    </p>
                </div>

                {status === 'processing' && (
                    <div className="flex justify-center mb-4">
                        <BarLoader color="#3B82F6" />
                    </div>
                )}

                <div className="text-sm text-gray-500 dark:text-gray-400">
                    {status === 'processing' && 'Aguarde...'}
                    {status === 'success' && 'Redirecionando...'}
                    {status === 'error' && 'Redirecionando para login...'}
                </div>
                
                {/* ✅ Debug info em desenvolvimento */}
                {process.env.NODE_ENV === 'development' && (
                    <div className="mt-4 text-xs text-gray-400 border-t pt-2">
                        <p>Debug: Processed = {processed.toString()}</p>
                        <p>Code: {searchParams.get('code')?.substring(0, 10)}...</p>
                    </div>
                )}
            </div>
        </div>
    );
}