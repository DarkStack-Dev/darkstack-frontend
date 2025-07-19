// types/projects/projects.ts - CORRIGIDO
export type ProjectStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'ARCHIVED';
export type ImageType = 'JPG' | 'JPEG' | 'PNG' | 'WEBP' | 'GIF' | 'SVG';

export interface ProjectImage {
  id: string;
  filename: string;
  type: ImageType;
  base64?: string;
  url?: string;
  isMain: boolean; // ✅ CORRIGIDO: Sempre obrigatório
  order: number;
  size?: number;
  width?: number;
  height?: number;
}

export interface ProjectOwner {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  status: ProjectStatus;
  createdAt: string;
  updatedAt?: string;
  deletedAt?: string;
  owner: ProjectOwner;
  images: ProjectImage[];
  participantCount: number;
  imageCount: number;
  isOwner?: boolean;
  isActive?: boolean; // ✅ ADICIONADO: Para projetos deletados
  approvedAt?: string;
  approvedBy?: ProjectOwner;
  rejectionReason?: string;
  participants?: ProjectParticipant[]; // ✅ ADICIONADO: Para participantes
}

export type ProjectParticipant = {
  id: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
  role?: string;
  joinedAt: Date;
};

export type ProjectStats = {
  total: number;
  pending: number;
  approved: number;
  rejected: number;
  archived: number;
};

// ✅ CORRIGIDO: CreateProjectData agora usa o tipo inferido do schema
export type CreateProjectData = {
  name: string;
  description: string;
  images: {
    filename: string;
    type: ImageType;
    base64: string;
    isMain: boolean; // ✅ CORRIGIDO: Agora obrigatório
    size?: number;
  }[];
};

export type ProjectFilters = {
  status?: ProjectStatus;
  search?: string;
  page?: number;
  limit?: number;
  ownerId?: string;
  includeDeleted?: boolean;
};

export type PaginatedProjects = {
  projects: Project[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrevious: boolean;
  };
};

export interface ProjectsResponse {
  projects: Project[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrevious: boolean;
  };
}

export interface MyProjectStats {
  total: number;
  pending: number;
  approved: number;
  rejected: number;
  archived: number;
}

export interface MyProjectsResponse extends ProjectsResponse {
  stats: MyProjectStats;
}

// ✅ ADICIONADO: Tipos para respostas da API
export interface CreateProjectResponse {
  id: string;
  name: string;
  status: ProjectStatus;
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

export interface ProjectModerationResponse {
  success: boolean;
  message: string;
}