// app/auth/google/callback/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import { handleGoogleCallback } from "@/lib/server/auth";
import { toast } from "sonner";
import { BarLoader } from 'react-spinners';

export default function GoogleCallbackPage() {
    const [status, setStatus] = useState<'processing' | 'success' | 'error'>('processing');
    const [message, setMessage] = useState('Processando autenticação...');
    
    const router = useRouter();
    const searchParams = useSearchParams();
    const setUser = useAuthStore(state => state.setUser);

    useEffect(() => {
        const processCallback = async () => {
            const code = searchParams.get('code');
            const state = searchParams.get('state');
            const error = searchParams.get('error');

            // Se houve erro no Google
            if (error) {
                setStatus('error');
                setMessage('Acesso negado pelo Google');
                toast.error('Autenticação cancelada', { position: "bottom-right" });
                
                setTimeout(() => {
                    router.push('/auth/signin');
                }, 3000);
                return;
            }

            // Se não tem código, erro
            if (!code) {
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
                
                const response = await handleGoogleCallback({ 
                    code, 
                    state: state || undefined 
                });

                if (response.error) {
                    setStatus('error');
                    setMessage(response.error.message);
                    toast.error(response.error.message, { position: "bottom-right" });
                    
                    setTimeout(() => {
                        router.push('/auth/signin');
                    }, 3000);
                    return;
                }

                if (response.data) {
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

                    const welcomeMessage = response.data.isNewUser 
                        ? 'Bem-vindo! Sua conta foi criada com sucesso!' 
                        : 'Bem-vindo de volta!';
                    
                    toast.success(welcomeMessage, { position: "bottom-right" });
                    
                    // Redirecionar para a página principal
                    setTimeout(() => {
                        router.push('/projects');
                    }, 2000);
                }
            } catch (error) {
                console.error('Erro no callback Google:', error);
                setStatus('error');
                setMessage('Erro interno no processamento');
                toast.error('Erro interno', { position: "bottom-right" });
                
                setTimeout(() => {
                    router.push('/auth/signin');
                }, 3000);
            }
        };

        processCallback();
    }, [searchParams, router, setUser]);

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
                        Autenticação Google
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
            </div>
        </div>
    );
}