// lib/requests/projects.ts - CORRIGIDO
import { api } from '@/lib/api';
import { CreateProjectData, ProjectFilters, Project, ProjectsResponse, MyProjectsResponse } from '@/types/projects/projects';

export interface CreateProjectResponse {
  id: string;
  name: string;
  status: string;
  createdAt: string;
  images: Array<{
    id: string;
    url: string;
    filename: string;
    isMain: boolean;
  }>;
}

export interface ProjectDeleteResponse {
  success: boolean;
  message: string;
  deletedAt: string;
}

export interface ProjectRestoreResponse {
  success: boolean;
  message: string;
  restoredAt: string;
}

/* Projetos Públicos */
export const getProjects = async (filters?: Partial<ProjectFilters>) => {
  const params = new URLSearchParams();
  
  if (filters?.page) params.append('page', filters.page.toString());
  if (filters?.limit) params.append('limit', filters.limit.toString());
  if (filters?.search) params.append('search', filters.search);
  if (filters?.status) params.append('status', filters.status);
  if (filters?.ownerId) params.append('ownerId', filters.ownerId);

  const query = params.toString();
  const endpoint = query ? `projects?${query}` : 'projects';
  
  return await api<ProjectsResponse>({
    endpoint,
    method: 'GET',
    withAuth: false
  });
};

/* Projeto por ID */
export const getProjectById = async (id: string) => {
  return await api<Project>({
    endpoint: `projects/${id}`,
    method: 'GET',
    withAuth: false
  });
};

/* Criar Projeto */
export const createProject = async (data: CreateProjectData) => {
  return await api<CreateProjectResponse>({
    endpoint: 'projects',
    method: 'POST',
    data
  });
};

/* Meus Projetos */
export const getMyProjects = async (filters?: Partial<ProjectFilters>) => {
  const params = new URLSearchParams();
  
  if (filters?.page) params.append('page', filters.page.toString());
  if (filters?.limit) params.append('limit', filters.limit.toString());
  if (filters?.status) params.append('status', filters.status);
  if (filters?.includeDeleted) params.append('includeDeleted', 'true');

  const query = params.toString();
  const endpoint = query ? `projects/my-projects?${query}` : 'projects/my-projects';
  
  return await api<MyProjectsResponse>({
    endpoint,
    method: 'GET'
  });
};

/* Deletar Projeto (Soft Delete) */
export const deleteProject = async (id: string) => {
  return await api<ProjectDeleteResponse>({
    endpoint: `projects/${id}`,
    method: 'DELETE'
  });
};

/* Deletar Projeto Permanentemente (Hard Delete - Admin Only) */
export const deleteProjectPermanently = async (id: string) => {
  return await api<ProjectDeleteResponse>({
    endpoint: `projects/${id}/permanent`,
    method: 'DELETE'
  });
};

/* Restaurar Projeto (Admin/Moderator) */
export const restoreProject = async (id: string) => {
  return await api<ProjectRestoreResponse>({
    endpoint: `projects/${id}/restore`,
    method: 'POST'
  });
};

/* Projetos Deletados (Admin/Moderator) */
export const getDeletedProjects = async (filters?: Partial<ProjectFilters>) => {
  const params = new URLSearchParams();
  
  if (filters?.page) params.append('page', filters.page.toString());
  if (filters?.limit) params.append('limit', filters.limit.toString());

  const query = params.toString();
  const endpoint = query ? `projects/deleted?${query}` : 'projects/deleted';
  
  return await api<ProjectsResponse>({
    endpoint,
    method: 'GET'
  });
};

/* Aprovar Projeto (Admin/Moderator) */
export const approveProject = async (id: string) => {
  return await api<{ success: boolean; message: string }>({
    endpoint: `projects/${id}/approve`,
    method: 'POST'
  });
};

/* Rejeitar Projeto (Admin/Moderator) */
export const rejectProject = async (id: string, reason: string) => {
  return await api<{ success: boolean; message: string }>({
    endpoint: `projects/${id}/reject`,
    method: 'POST',
    data: { rejectionReason: reason }
  });
};