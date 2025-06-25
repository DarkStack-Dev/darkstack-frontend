import { User, UserRole } from "@/types/accounts/user"
import { create } from "zustand"

export type AuthState = {
    user: User | null
}

export type AuthActions = {
    setUser: (user: User) => void,
    clearUser: () => void,
    // Métodos de verificação de permissão
    hasRole: (role: UserRole) => boolean,
    hasAnyRole: (roles: UserRole[]) => boolean,
    hasAllRoles: (roles: UserRole[]) => boolean,
    isAdmin: () => boolean,
    isModerator: () => boolean,
    isUser: () => boolean,
    isGuest: () => boolean,
    canAccessAdmin: () => boolean,
    canAccessModerator: () => boolean,
}

export type AuthStore = AuthState & AuthActions

export const useAuthStore = create<AuthStore>((set, get) => ({
    user: null,
    setUser: (user) => set({ user }),
    clearUser: () => set({ user: null }),

    // Verificações de role
    hasRole: (role: UserRole) => {
        const { user } = get()
        return user?.roles?.includes(role) ?? false
    },
    
    hasAnyRole: (roles: UserRole[]) => {
        const { user } = get()
        return roles.some(role => user?.roles?.includes(role)) ?? false
    },
    
    hasAllRoles: (roles: UserRole[]) => {
        const { user } = get()
        return roles.every(role => user?.roles?.includes(role)) ?? false
    },
    
    isAdmin: () => {
        const { hasRole } = get()
        return hasRole('ADMIN')
    },
    
    isModerator: () => {
        const { hasRole } = get()
        return hasRole('MODERATOR')
    },
    
    isUser: () => {
        const { hasRole } = get()
        return hasRole('USER')
    },
    
    isGuest: () => {
        const { hasRole } = get()
        return hasRole('GUEST')
    },
    
    canAccessAdmin: () => {
        const { isAdmin } = get()
        return isAdmin()
    },
    
    canAccessModerator: () => {
        const { isAdmin, isModerator } = get()
        return isAdmin() || isModerator()
    }
}))