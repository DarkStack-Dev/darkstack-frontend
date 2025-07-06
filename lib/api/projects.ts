// lib/api/projects.ts
import { api } from "@/lib/api";
import { CreateProjectData, Project, PaginatedProjects, ProjectStats, ProjectFilters } from "@/types/projects/projects";

// Listar projetos públicos (aprovados)
export const getProjects = async (filters?: ProjectFilters) => {
  return await api<PaginatedProjects>({
    endpoint: 'projects',
    method: 'GET',
    data: filters,
    withAuth: false
  });
};

// Criar novo projeto
export const createProject = async (data: CreateProjectData) => {
  return await api<{
    id: string;
    name: string;
    status: string;
    createdAt: Date;
    images: Array<{
      id: string;
      url: string;
      filename: string;
      isMain: boolean;
    }>;
  }>({
    endpoint: 'projects',
    method: 'POST',
    data
  });
};

// Buscar projeto por ID
export const getProjectById = async (id: string) => {
  return await api<Project>({
    endpoint: `projects/${id}`,
    method: 'GET',
    withAuth: false
  });
};

// Meus projetos
export const getMyProjects = async (filters?: ProjectFilters & { includeDeleted?: boolean }) => {
  return await api<{
    projects: Project[];
    stats: ProjectStats;
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
      hasNext: boolean;
      hasPrevious: boolean;
    };
  }>({
    endpoint: 'projects/my-projects',
    method: 'GET',
    data: filters
  });
};

// Projetos deletados (admin/moderador)
export const getDeletedProjects = async (filters?: { page?: number; limit?: number }) => {
  return await api<{
    projects: Array<{
      id: string;
      name: string;
      description: string;
      status: string;
      createdAt: Date;
      updatedAt: Date;
      deletedAt: Date;
      owner: {
        id: string;
        name: string;
        email: string;
      };
      imageCount: number;
      participantCount: number;
      daysSinceDeleted: number;
    }>;
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
      hasNext: boolean;
      hasPrevious: boolean;
    };
  }>({
    endpoint: 'projects/deleted',
    method: 'GET',
    data: filters
  });
};

// Deletar projeto (soft delete)
export const deleteProject = async (id: string) => {
  return await api<{
    success: boolean;
    message: string;
    deletedAt: Date;
  }>({
    endpoint: `projects/${id}`,
    method: 'DELETE'
  });
};

// Deletar permanentemente (admin)
export const deleteProjectPermanently = async (id: string) => {
  return await api<{
    success: boolean;
    message: string;
    deletedAt: Date;
  }>({
    endpoint: `projects/${id}/permanent`,
    method: 'DELETE'
  });
};

// Restaurar projeto
export const restoreProject = async (id: string) => {
  return await api<{
    success: boolean;
    message: string;
    restoredAt: Date;
  }>({
    endpoint: `projects/${id}/restore`,
    method: 'POST'
  });
};