// components/ui/GitHubButton.tsx - MELHORAR PREVENÇÃO DE DUPLO CLIQUE

"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { handleGitHubStart } from "@/lib/server/auth";
import { toast } from "sonner";
import { Github } from "lucide-react";

interface GitHubButtonProps {
    text?: string;
    variant?: "default" | "outline";
    size?: "default" | "sm" | "lg";
    className?: string;
    state?: string;
}

export const GitHubButton = ({ 
    text = "Continuar com GitHub", 
    variant = "outline",
    size = "default",
    className = "",
    state = "login"
}: GitHubButtonProps) => {
    const [loading, setLoading] = useState(false);

    const handleGitHubAuth = async () => {
        if (loading) {
            console.log('⚠️ Button already loading, ignoring click');
            return; // ✅ Previne cliques duplos
        }
        
        console.log('🔘 GitHub button clicked, starting auth...');
        setLoading(true);
        
        try {
            const response = await handleGitHubStart(state);
            
            console.log('📤 GitHub start response received:', {
                hasError: !!response.error,
                hasAuthUrl: !!response.data?.authorizationUrl
            });
            
            if (response.error) {
                console.log('❌ GitHub start error:', response.error.message);
                toast.error(response.error.message, { position: "bottom-right" });
                setLoading(false);
                return;
            }

            if (response.data?.authorizationUrl) {
                console.log('🔄 Redirecting to GitHub...');
                // Redirecionar para GitHub
                window.location.href = response.data.authorizationUrl;
                // Não setar loading = false aqui, pois a página vai redirecionar
            } else {
                console.log('❌ No authorization URL received');
                toast.error('Erro ao gerar URL de autenticação', { position: "bottom-right" });
                setLoading(false);
            }
        } catch (error) {
            console.error('💥 Erro ao iniciar autenticação GitHub:', error);
            toast.error('Erro ao conectar com GitHub', { position: "bottom-right" });
            setLoading(false);
        }
    };

    return (
        <Button
            type="button"
            variant={variant}
            size={size}
            className={`w-full ${className}`}
            onClick={handleGitHubAuth}
            disabled={loading}
        >
            <Github className="mr-2 h-4 w-4" />
            {loading ? "Conectando..." : text}
        </Button>
    );
};