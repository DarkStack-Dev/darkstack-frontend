// components/ui/GitHubButton.tsx
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
    state?: string; // Para diferenciar login vs link
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
        setLoading(true);
        
        try {
            const response = await handleGitHubStart(state);
            
            if (response.error) {
                toast.error(response.error.message, { position: "bottom-right" });
                setLoading(false);
                return;
            }

            if (response.data?.authorizationUrl) {
                // Redirecionar para GitHub
                window.location.href = response.data.authorizationUrl;
            }
        } catch (error) {
            console.error('Erro ao iniciar autenticação GitHub:', error);
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