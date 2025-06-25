// components/ProtectedComponent.tsx
'use client'
import { useAuthStore } from '@/store/authStore'
import { UserRole } from '@/types/accounts/user'
import { ReactNode } from 'react'

interface ProtectedComponentProps {
  children: ReactNode
  roles?: UserRole[]
  fallback?: ReactNode
  requireAll?: boolean // true = precisa de TODAS as roles, false = qualquer uma
  requireAuth?: boolean // se precisa estar logado
}

export function ProtectedComponent({ 
  children, 
  roles = [], 
  fallback = null,
  requireAll = false,
  requireAuth = true
}: ProtectedComponentProps) {
  const { user, hasAnyRole, hasAllRoles } = useAuthStore()
  
  // Se require auth e não tem usuário
  if (requireAuth && !user) {
    return <>{fallback}</>
  }

  // Se não especificou roles e só precisa estar logado
  if (roles.length === 0) {
    return <>{children}</>
  }

  // Verificar se tem as roles necessárias
  const hasPermission = requireAll 
    ? hasAllRoles(roles)
    : hasAnyRole(roles)

  if (!hasPermission) {
    return <>{fallback}</>
  }

  return <>{children}</>
}