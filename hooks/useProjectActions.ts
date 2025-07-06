
// hooks/useProjectActions.ts
import { useState } from 'react';
import { toast } from 'sonner';
import { 
  deleteProject, 
  deleteProjectPermanently, 
  restoreProject 
} from '@/lib/api/projects';

export const useProjectActions = () => {
  const [loading, setLoading] = useState<string | null>(null);

  const handleDeleteProject = async (projectId: string, permanent = false) => {
    setLoading(projectId);
    
    try {
      const response = permanent 
        ? await deleteProjectPermanently(projectId)
        : await deleteProject(projectId);

      if (response.error) {
        toast.error(response.error.message);
        return false;
      }

      toast.success(
        permanent 
          ? 'Projeto removido permanentemente' 
          : 'Projeto deletado com sucesso'
      );
      return true;
    } catch (error) {
      toast.error('Erro ao deletar projeto');
      return false;
    } finally {
      setLoading(null);
    }
  };

  const handleRestoreProject = async (projectId: string) => {
    setLoading(projectId);
    
    try {
      const response = await restoreProject(projectId);

      if (response.error) {
        toast.error(response.error.message);
        return false;
      }

      toast.success('Projeto restaurado com sucesso');
      return true;
    } catch (error) {
      toast.error('Erro ao restaurar projeto');
      return false;
    } finally {
      setLoading(null);
    }
  };

  return {
    loading,
    handleDeleteProject,
    handleRestoreProject
  };
};
