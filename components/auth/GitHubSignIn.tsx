// components/auth/GitHubSignIn.tsx
"use client";

import { Button } from "@/components/ui/button";
import { Github } from "lucide-react";

export const GitHubSignIn = () => {
    const handleGitHubLogin = () => {
        const clientId = process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID;
        const redirectUri = `${window.location.origin}/auth/github/callback`;
        const scope = 'user:email'; // Permissões que você quer

        const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}`;
        
        // Redirecionar para GitHub
        window.location.href = githubAuthUrl;
    };

    return (
        <Button
            type="button"
            variant="outline"
            onClick={handleGitHubLogin}
            className="w-full flex items-center gap-2 bg-gray-900 hover:bg-gray-800 text-white border-gray-700"
        >
            <Github className="w-5 h-5" />
            Continuar com GitHub
        </Button>
    );
};