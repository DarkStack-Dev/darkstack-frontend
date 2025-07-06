import { getMyProjects } from "@/lib/api/projects";
import { Project, ProjectFilters } from "@/types/projects/projects";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

// hooks/useMyProjects.ts
export const useMyProjects = (initialFilters?: ProjectFilters & { includeDeleted?: boolean }) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0,
    archived: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
    hasNext: false,
    hasPrevious: false
  });
  const [filters, setFilters] = useState(initialFilters || {});

  const fetchMyProjects = useCallback(async (newFilters?: typeof filters) => {
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
      
      if (response.data) {
        setProjects(response.data.projects);
        setStats(response.data.stats);
        setPagination(response.data.pagination);
      }
    } catch (err) {
      const errorMessage = 'Erro ao carregar meus projetos';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  const updateFilters = useCallback((newFilters: Partial<typeof filters>) => {
    const updatedFilters = { ...filters, ...newFilters };
    setFilters(updatedFilters);
    fetchMyProjects(updatedFilters);
  }, [filters, fetchMyProjects]);

  useEffect(() => {
    fetchMyProjects();
  }, []);

  return {
    projects,
    stats,
    loading,
    error,
    pagination,
    filters,
    updateFilters,
    refetch: fetchMyProjects
  };
};