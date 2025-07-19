// hooks/useProjects.ts - CORRIGIDO
import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import { 
  getProjects, 
  getProjectById, 
  createProject, 
  getMyProjects,
  deleteProject,
  restoreProject,
  getDeletedProjects,
  approveProject,
  rejectProject 
} from '@/lib/requests/projects';
import { 
  Project, 
  ProjectsResponse, 
  MyProjectsResponse, 
  ProjectFilters, 
  CreateProjectData 
} from '@/types/projects/projects';

/* Hook para listar projetos públicos */
export const useProjects = (initialFilters?: Partial<ProjectFilters>) => {
  const [projects, setProjects] = useState<ProjectsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<Partial<ProjectFilters>>(initialFilters || {});

  const fetchProjects = useCallback(async (newFilters?: Partial<ProjectFilters>) => {
    try {
      setLoading(true);
      setError(null);
      const currentFilters = newFilters || filters;
      const response = await getProjects(currentFilters);
      
      if (response.error) {
        setError(response.error.message);
        toast.error(response.error.message);
        return;
      }
      
      setProjects(response.data || null);
    } catch (err) {
      const message = 'Erro ao carregar projetos';
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  const updateFilters = useCallback((newFilters: Partial<ProjectFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
    fetchProjects({ ...filters, ...newFilters });
  }, [filters, fetchProjects]);

  const refresh = useCallback(() => {
    fetchProjects();
  }, [fetchProjects]);

  useEffect(() => {
    fetchProjects();
  }, []);

  return {
    projects,
    loading,
    error,
    filters,
    updateFilters,
    refresh
  };
};

/* Hook para projeto específico */
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
      
      setProject(response.data || null);
    } catch (err) {
      const message = 'Erro ao carregar projeto';
      setError(message);
      toast.error(message);
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
    refresh: fetchProject
  };
};

/* Hook para meus projetos */
export const useMyProjects = (initialFilters?: Partial<ProjectFilters>) => {
  const [myProjects, setMyProjects] = useState<MyProjectsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<Partial<ProjectFilters>>(initialFilters || {});

  const fetchMyProjects = useCallback(async (newFilters?: Partial<ProjectFilters>) => {
    try {
      setLoading(true);
      setError(null);
      const currentFilters = newFilters || filters;
      const response = await getMyProjects(currentFilters);
      
      if (response.error) {
        setError(response.error.message);
        toast.error(response.error.message);
        return;
      }
      
      setMyProjects(response.data || null);
    } catch (err) {
      const message = 'Erro ao carregar seus projetos';
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  const updateFilters = useCallback((newFilters: Partial<ProjectFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
    fetchMyProjects({ ...filters, ...newFilters });
  }, [filters, fetchMyProjects]);

  const refresh = useCallback(() => {
    fetchMyProjects();
  }, [fetchMyProjects]);

  useEffect(() => {
    fetchMyProjects();
  }, []);

  return {
    myProjects,
    loading,
    error,
    filters,
    updateFilters,
    refresh
  };
};

/* Hook para criar projeto */
export const useCreateProject = () => {
  const [loading, setLoading] = useState(false);

  const create = useCallback(async (data: CreateProjectData) => {
    try {
      setLoading(true);
      const response = await createProject(data);
      
      if (response.error) {
        toast.error(response.error.message);
        return { success: false, error: response.error.message };
      }
      
      toast.success('Projeto criado com sucesso! Aguardando aprovação.');
      return { success: true, data: response.data };
    } catch (err) {
      const message = 'Erro ao criar projeto';
      toast.error(message);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  }, []);

  return { create, loading };
};

/* Hook para moderar projetos */
export const useProjectModeration = () => {
  const [loading, setLoading] = useState(false);

  const approve = useCallback(async (id: string) => {
    try {
      setLoading(true);
      const response = await approveProject(id);
      
      if (response.error) {
        toast.error(response.error.message);
        return { success: false };
      }
      
      toast.success('Projeto aprovado com sucesso!');
      return { success: true };
    } catch (err) {
      toast.error('Erro ao aprovar projeto');
      return { success: false };
    } finally {
      setLoading(false);
    }
  }, []);

  const reject = useCallback(async (id: string, reason: string) => {
    try {
      setLoading(true);
      const response = await rejectProject(id, reason);
      
      if (response.error) {
        toast.error(response.error.message);
        return { success: false };
      }
      
      toast.success('Projeto rejeitado');
      return { success: true };
    } catch (err) {
      toast.error('Erro ao rejeitar projeto');
      return { success: false };
    } finally {
      setLoading(false);
    }
  }, []);

  const remove = useCallback(async (id: string, permanent = false) => {
    try {
      setLoading(true);
      const response = permanent 
        ? await deleteProject(id) // O backend decide baseado na role
        : await deleteProject(id);
      
      if (response.error) {
        toast.error(response.error.message);
        return { success: false };
      }
      
      toast.success(permanent ? 'Projeto removido permanentemente' : 'Projeto movido para lixeira');
      return { success: true };
    } catch (err) {
      toast.error('Erro ao remover projeto');
      return { success: false };
    } finally {
      setLoading(false);
    }
  }, []);

  const restore = useCallback(async (id: string) => {
    try {
      setLoading(true);
      const response = await restoreProject(id);
      
      if (response.error) {
        toast.error(response.error.message);
        return { success: false };
      }
      
      toast.success('Projeto restaurado com sucesso!');
      return { success: true };
    } catch (err) {
      toast.error('Erro ao restaurar projeto');
      return { success: false };
    } finally {
      setLoading(false);
    }
  }, []);

  return { approve, reject, remove, restore, loading };
};

/* Hook para projetos deletados (Admin/Moderator) */
export const useDeletedProjects = () => {
  const [deletedProjects, setDeletedProjects] = useState<ProjectsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDeletedProjects = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getDeletedProjects();
      
      if (response.error) {
        setError(response.error.message);
        toast.error(response.error.message);
        return;
      }
      
      setDeletedProjects(response.data || null);
    } catch (err) {
      const message = 'Erro ao carregar projetos deletados';
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDeletedProjects();
  }, []);

  return {
    deletedProjects,
    loading,
    error,
    refresh: fetchDeletedProjects
  };
};