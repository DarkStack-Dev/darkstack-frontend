
// hooks/useProjectPermissions.ts
import { useAuthStore } from '@/store/authStore';
import { Project } from '@/types/projects/projects';

export const useProjectPermissions = (project?: Project) => {
  const { user, hasAnyRole } = useAuthStore();

  const isOwner = user && project ? project.owner.id === user.id : false;
  const isAdmin = hasAnyRole(['ADMIN']);
  const isModerator = hasAnyRole(['ADMIN', 'MODERATOR']);

  const canView = () => {
    if (!project) return false;
    
    // Projetos aprovados são públicos
    if (project.status === 'APPROVED' && project.isActive) {
      return true;
    }
    
    // Proprietário pode ver seus próprios projetos
    if (isOwner) return true;
    
    // Moderadores podem ver todos os projetos
    if (isModerator) return true;
    
    return false;
  };

  const canEdit = () => {
    if (!project || !user) return false;
    
    // Apenas proprietário pode editar (por enquanto)
    // TODO: Permitir moderadores editarem também se necessário
    return isOwner && project.isActive;
  };

  const canDelete = () => {
    if (!project || !user) return false;
    
    // Proprietário pode deletar seus projetos
    if (isOwner) return true;
    
    // Moderadores podem deletar qualquer projeto
    if (isModerator) return true;
    
    return false;
  };

  const canApprove = () => {
    if (!project || !user) return false;
    
    // Apenas moderadores podem aprovar
    return isModerator && project.status === 'PENDING';
  };

  const canReject = () => {
    if (!project || !user) return false;
    
    // Apenas moderadores podem rejeitar
    return isModerator && project.status === 'PENDING';
  };

  const canRestore = () => {
    if (!project || !user) return false;
    
    // Apenas moderadores podem restaurar projetos deletados
    return isModerator && !!project.deletedAt;
  };

  const canHardDelete = () => {
    if (!project || !user) return false;
    
    // Apenas admins podem deletar permanentemente
    return isAdmin;
  };

  return {
    isOwner,
    isAdmin,
    isModerator,
    canView,
    canEdit,
    canDelete,
    canApprove,
    canReject,
    canRestore,
    canHardDelete
  };
};