// hooks/usePermissions.ts
import { useAuthStore } from '@/store/authStore'
import { UserRole } from '@/types/accounts/user'

export const usePermissions = () => {
  const {
    user,
    hasRole,
    hasAnyRole,
    hasAllRoles,
    isAdmin,
    isModerator,
    isUser,
    isGuest,
    canAccessAdmin,
    canAccessModerator
  } = useAuthStore()

  // Métodos específicos para o menu
  const showAdminMenu = () => canAccessAdmin()
  const showModeratorMenu = () => canAccessModerator()
  const showUserMenu = () => !!user && (isUser() || isModerator() || isAdmin())

  // Verificações de acesso específicas
  const canManageUsers = () => isAdmin()
  const canEditContent = () => isAdmin() || isModerator()
  const canDeleteContent = () => isAdmin()
  const canViewReports = () => isAdmin() || isModerator()

  return {
    user,
    hasRole,
    hasAnyRole,
    hasAllRoles,
    isAdmin,
    isModerator,
    isUser,
    isGuest,
    canAccessAdmin,
    canAccessModerator,
    showAdminMenu,
    showModeratorMenu,
    showUserMenu,
    canManageUsers,
    canEditContent,
    canDeleteContent,
    canViewReports
  }
}