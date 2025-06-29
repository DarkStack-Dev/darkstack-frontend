// components/test/TestUnlinkGitHub.tsx - TEMPORÁRIO PARA TESTE

"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { handleGitHubUnlink } from "@/lib/server/auth";
import { toast } from "sonner";

export const TestUnlinkGitHub = () => {
    const [loading, setLoading] = useState(false);

    const handleUnlink = async () => {
        if (!confirm("Tem certeza que deseja desvincular sua conta GitHub?")) {
            return;
        }

        setLoading(true);
        try {
            console.log('🧪 Testando unlink GitHub...');
            const response = await handleGitHubUnlink();
            
            if (response.error) {
                console.log('❌ Erro no unlink:', response.error.message);
                toast.error(response.error.message);
                return;
            }

            console.log('✅ Unlink realizado com sucesso:', response.data);
            toast.success("Conta GitHub desvinculada com sucesso!");
            
            // Recarregar a página para atualizar o estado
            window.location.reload();
        } catch (error) {
            console.log('💥 Erro no unlink:', error);
            toast.error("Erro ao desvincular conta GitHub");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-4 border rounded">
            <h3 className="text-lg font-semibold mb-2">🧪 Teste de Unlink GitHub</h3>
            <p className="text-sm text-gray-600 mb-4">
                Este componente é apenas para teste. Remove depois!
            </p>
            <Button 
                onClick={handleUnlink} 
                disabled={loading}
                variant="destructive"
            >
                {loading ? "Desvinculando..." : "Desvincular GitHub"}
            </Button>
        </div>
    );
};

// Para usar temporariamente, adicione em alguma página:
// import { TestUnlinkGitHub } from "@/components/test/TestUnlinkGitHub";
// 
// E dentro do JSX da página:
// <TestUnlinkGitHub />