import { getProjectById } from "@/lib/api/projects";
import { Project } from "@/types/projects/projects";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

// hooks/useProject.ts
export const useProject = (id: string) => {
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProject = useCallback(async () => {
    if (!id) return;
    
    try {
      setLoading(true);
      setError(null);
      
      const response = await getProjectById(id);
      
      if (response.error) {
        setError(response.error.message);
        toast.error(response.error.message);
        return;
      }
      
      if (response.data) {
        setProject(response.data);
      }
    } catch (err) {
      const errorMessage = 'Erro ao carregar projeto';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchProject();
  }, [fetchProject]);

  return {
    project,
    loading,
    error,
    refetch: fetchProject
  };
};