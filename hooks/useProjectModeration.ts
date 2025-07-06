// hooks/useProjectModeration.ts
import { useState } from 'react';
import { toast } from 'sonner';
import { api } from '@/lib/api';

export const useProjectModeration = () => {
  const [loading, setLoading] = useState<string | null>(null);

  const approveProject = async (projectId: string) => {
    setLoading(projectId);
    
    try {
      // TODO: Implementar endpoint de aprovação no backend
      const response = await api<{ success: boolean; message: string }>({
        endpoint: `projects/${projectId}/approve`,
        method: 'POST'
      });

      if (response.error) {
        toast.error(response.error.message);
        return false;
      }

      toast.success('Projeto aprovado com sucesso!');
      return true;
    } catch (error) {
      toast.error('Erro ao aprovar projeto');
      return false;
    } finally {
      setLoading(null);
    }
  };

  const rejectProject = async (projectId: string, reason: string) => {
    if (!reason.trim()) {
      toast.error('Motivo da rejeição é obrigatório');
      return false;
    }

    setLoading(projectId);
    
    try {
      // TODO: Implementar endpoint de rejeição no backend
      const response = await api<{ success: boolean; message: string }>({
        endpoint: `projects/${projectId}/reject`,
        method: 'POST',
        data: { reason }
      });

      if (response.error) {
        toast.error(response.error.message);
        return false;
      }

      toast.success('Projeto rejeitado');
      return true;
    } catch (error) {
      toast.error('Erro ao rejeitar projeto');
      return false;
    } finally {
      setLoading(null);
    }
  };

  const archiveProject = async (projectId: string) => {
    setLoading(projectId);
    
    try {
      // TODO: Implementar endpoint de arquivamento no backend
      const response = await api<{ success: boolean; message: string }>({
        endpoint: `projects/${projectId}/archive`,
        method: 'POST'
      });

      if (response.error) {
        toast.error(response.error.message);
        return false;
      }

      toast.success('Projeto arquivado');
      return true;
    } catch (error) {
      toast.error('Erro ao arquivar projeto');
      return false;
    } finally {
      setLoading(null);
    }
  };

  return {
    loading,
    approveProject,
    rejectProject,
    archiveProject
  };
};