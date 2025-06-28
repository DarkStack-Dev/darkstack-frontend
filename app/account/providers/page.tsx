// app/account/providers/page.tsx
"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Github, Mail, Users, Calendar, ExternalLink, Unlink } from "lucide-react";
import { getUserProviders } from "@/lib/requests";
import { handleGitHubStart, handleGitHubUnlink } from "@/lib/server/auth";
import { toast } from "sonner";
import { UserProvidersResponse } from "@/lib/requests";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";

export default function AccountProvidersPage() {
    const [providers, setProviders] = useState<UserProvidersResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [unlinkingGitHub, setUnlinkingGitHub] = useState(false);
    const [linkingGitHub, setLinkingGitHub] = useState(false);

    useEffect(() => {
        loadProviders();
    }, []);

    const loadProviders = async () => {
        try {
            const response = await getUserProviders();
            if (response.error) {
                toast.error(response.error.message);
                return;
            }
            setProviders(response.data);
        } catch (error) {
            toast.error("Erro ao carregar provedores");
        } finally {
            setLoading(false);
        }
    };

    const handleLinkGitHub = async () => {
        setLinkingGitHub(true);
        try {
            const response = await handleGitHubStart("link");
            if (response.error) {
                toast.error(response.error.message);
                setLinkingGitHub(false);
                return;
            }
            if (response.data?.authorizationUrl) {
                window.location.href = response.data.authorizationUrl;
            }
        } catch (error) {
            toast.error("Erro ao conectar com GitHub");
            setLinkingGitHub(false);
        }
    };

    const handleUnlinkGitHub = async () => {
        if (!confirm("Tem certeza que deseja desvincular sua conta GitHub?")) {
            return;
        }

        setUnlinkingGitHub(true);
        try {
            const response = await handleGitHubUnlink();
            if (response.error) {
                toast.error(response.error.message);
                return;
            }
            toast.success("Conta GitHub desvinculada com sucesso");
            loadProviders(); // Recarregar dados
        } catch (error) {
            toast.error("Erro ao desvincular conta GitHub");
        } finally {
            setUnlinkingGitHub(false);
        }
    };

    if (loading) {
        return (
            <div className="container mx-auto p-6 max-w-4xl">
                <div className="mb-8">
                    <Skeleton className="h-8 w-64 mb-2" />
                    <Skeleton className="h-4 w-96" />
                </div>
                
                <div className="grid gap-6">
                    {[1, 2].map((i) => (
                        <Skeleton key={i} className="h-32 rounded-lg" />
                    ))}
                </div>
            </div>
        );
    }

    if (!providers) {
        return (
            <div className="container mx-auto p-6 max-w-4xl">
                <div className="text-center py-12">
                    <p className="text-gray-500">Erro ao carregar informações</p>
                    <Button onClick={loadProviders} className="mt-4">
                        Tentar Novamente
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-6 max-w-4xl">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold mb-2">Provedores de Autenticação</h1>
                <p className="text-gray-600 dark:text-gray-400">
                    Gerencie suas contas vinculadas e métodos de login
                </p>
            </div>

            {/* User Info Card */}
            <Card className="p-6 mb-6">
                <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-xl font-bold">
                        {providers.user.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1">
                        <h2 className="text-xl font-semibold">{providers.user.name}</h2>
                        <p className="text-gray-600 dark:text-gray-400">{providers.user.email}</p>
                        <div className="flex gap-2 mt-2">
                            {providers.user.roles.map((role) => (
                                <Badge key={role} variant="secondary">
                                    {role}
                                </Badge>
                            ))}
                        </div>
                    </div>
                </div>
            </Card>

            {/* Providers Grid */}
            <div className="grid gap-6">
                {/* Email Provider */}
                <Card className="p-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                                <Mail className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold">Email/Senha</h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    Login tradicional com email e senha
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <Badge variant={providers.providers.email.hasPassword ? "default" : "secondary"}>
                                {providers.providers.email.hasPassword ? "Configurado" : "Sem senha"}
                            </Badge>
                            <Badge variant={providers.providers.email.verified ? "default" : "destructive"}>
                                {providers.providers.email.verified ? "Verificado" : "Não verificado"}
                            </Badge>
                        </div>
                    </div>
                </Card>

                {/* GitHub Provider */}
                <Card className="p-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
                                <Github className="w-6 h-6 text-gray-800 dark:text-gray-200" />
                            </div>
                            <div className="flex-1">
                                <h3 className="text-lg font-semibold">GitHub</h3>
                                {providers.providers.github ? (
                                    <div className="space-y-1">
                                        <p className="text-sm text-gray-600 dark:text-gray-400">
                                            @{providers.providers.github.username}
                                        </p>
                                        {providers.providers.github.bio && (
                                            <p className="text-xs text-gray-500 dark:text-gray-500">
                                                {providers.providers.github.bio}
                                            </p>
                                        )}
                                        <div className="flex gap-4 text-xs text-gray-500 dark:text-gray-500">
                                            <span className="flex items-center gap-1">
                                                <Users className="w-3 h-3" />
                                                {providers.providers.github.followers} seguidores
                                            </span>
                                            <span>
                                                {providers.providers.github.publicRepos} repositórios
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <Calendar className="w-3 h-3" />
                                                Sincronizado {new Date(providers.providers.github.lastSyncAt).toLocaleDateString()}
                                            </span>
                                        </div>
                                    </div>
                                ) : (
                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                        Conecte sua conta GitHub para login rápido
                                    </p>
                                )}
                            </div>
                        </div>
                        <div className="flex gap-2">
                            {providers.providers.github ? (
                                <>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        asChild
                                    >
                                        <Link
                                            href={`https://github.com/${providers.providers.github.username}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            <ExternalLink className="w-4 h-4 mr-1" />
                                            Ver Perfil
                                        </Link>
                                    </Button>
                                    <Button
                                        variant="destructive"
                                        size="sm"
                                        onClick={handleUnlinkGitHub}
                                        disabled={unlinkingGitHub}
                                    >
                                        <Unlink className="w-4 h-4 mr-1" />
                                        {unlinkingGitHub ? "Desvinculando..." : "Desvincular"}
                                    </Button>
                                </>
                            ) : (
                                <Button
                                    onClick={handleLinkGitHub}
                                    disabled={linkingGitHub}
                                    size="sm"
                                >
                                    <Github className="w-4 h-4 mr-1" />
                                    {linkingGitHub ? "Conectando..." : "Conectar GitHub"}
                                </Button>
                            )}
                        </div>
                    </div>
                </Card>

                {/* Google Provider - Placeholder for future */}
                <Card className="p-6 opacity-50">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-red-100 dark:bg-red-900 rounded-lg flex items-center justify-center">
                                <span className="text-lg">G</span>
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold">Google</h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    Login com conta Google (Em breve)
                                </p>
                            </div>
                        </div>
                        <Badge variant="secondary">Em breve</Badge>
                    </div>
                </Card>
            </div>

            {/* Info Box */}
            <Card className="p-4 mt-6 bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800">
                <div className="flex gap-3">
                    <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-white text-xs">!</span>
                    </div>
                    <div className="text-sm">
                        <p className="font-medium text-blue-900 dark:text-blue-100 mb-1">
                            Dica de Segurança
                        </p>
                        <p className="text-blue-800 dark:text-blue-200">
                            Manter múltiplos provedores vinculados garante que você sempre tenha acesso à sua conta, 
                            mesmo se um deles estiver temporariamente indisponível.
                        </p>
                    </div>
                </div>
            </Card>
        </div>
    );
}