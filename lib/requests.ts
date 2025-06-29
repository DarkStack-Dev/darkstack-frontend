import { RecoverData, SignInData, SignUpData } from "@/lib/schemas/authSchemas";
import { api } from "./api";
import { APISignIn } from "@/types/accounts/signin";
import { APISignUp } from "@/types/accounts/signup";
import { APIUserUpdate } from "@/types/accounts/user";



import { APIrecover } from "@/types/accounts/recover";


/* Auth / User */
export const signIn = async (data: SignInData) => {
    return await api<APISignIn>({
        endpoint: 'users/login',
        method: 'POST',
        withAuth: false,
        data
    })
}

export const signUp = async (data: SignUpData) => {
    return await api<APISignUp>({
        endpoint: 'users/signup',
        method: 'POST',
        withAuth: false,
        data
    })
}

export const updateUser = async (data: FormData) => {
    return await api<APIUserUpdate>({
        endpoint: 'accounts/me',
        method: 'PUT',
        data,
        withAttachment: true

    })
}

export const recoverUser = async (data: RecoverData) => {
    return await api<APIrecover>({
        endpoint: 'accounts/password/reset',
        method: 'POST',
        data
    })
}

export const resetUser = async (data: { password: string }, uidb64: string | string[], token: string | string[]) => {
    return await api({
        endpoint: `accounts/password/reset/${uidb64}/${token}`,
        method: "POST",
        data,
    });
};

// GitHub Auth Types
export type GitHubStartAuthResponse = {
    authorizationUrl: string;
}

export type GitHubCallbackData = {
    code: string;
    state?: string;
}

export type GitHubCallbackResponse = {
    authToken: string;
    refreshToken: string;
    user: {
        id: string;
        name: string;
        email: string;
        roles: string[];
        isNewUser: boolean;
    };

}

export type GitHubLinkData = {
    code: string;
}

export type GitHubLinkResponse = {
    success: boolean;
    githubAccount: {
        id: string;
        username: string;
        bio?: string;
    };
}

export type UserProvidersResponse = {
    user: {
        id: string;
        name: string;
        email: string;
        roles: string[];
        avatar?: string;
        createdAt: Date;
        updatedAt: Date;
    };
    providers: {
        email: {
            hasPassword: boolean;
            verified: boolean;
        };
        github?: {
            id: string;
            username: string;
            bio?: string;
            publicRepos: number;
            followers: number;
            following: number;
            lastSyncAt: Date;
        };
        google?: {
            id: string;
            email: string;
        };
    };
}








// lib/requests.ts - Adicionar função gitHubCallback

// ... (manter todas as outras funções existentes)

/* GitHub Auth Functions - CORRIGIDAS */
export const startGitHubAuth = async (state?: string) => {
    return await api<GitHubStartAuthResponse>({
        endpoint: 'auth/github/start',
        method: 'POST',
        withAuth: false,
        data: { state }
    })
}

// ✅ CORRIGIDO: Nova função que chama o backend NestJS
export const gitHubCallback = async (data: GitHubCallbackData) => {
    console.log('📤 [Frontend] Sending to backend:', {
        hasCode: !!data.code,
        hasState: !!data.state
    });
    
    return await api<GitHubCallbackResponse>({
        endpoint: 'auth/github/callback',
        method: 'POST',
        withAuth: false,
        data
    })
}

export const linkGitHubAccount = async (data: GitHubLinkData) => {
    return await api<GitHubLinkResponse>({
        endpoint: 'auth/github/link',
        method: 'POST',
        data
    })
}

export const unlinkGitHubAccount = async () => {
    return await api<{ success: boolean }>({
        endpoint: 'auth/github/unlink',
        method: 'DELETE'
    })
}

export const getUserProviders = async () => {
    return await api<UserProvidersResponse>({
        endpoint: 'users/providers',
        method: 'GET'
    })
}

// Google Auth Types
export type GoogleStartAuthResponse = {
    authorizationUrl: string;
}

export type GoogleCallbackData = {
    code: string;
    state?: string;
}

export type GoogleCallbackResponse = {
    authToken: string;
    refreshToken: string;
    user: {
        id: string;
        name: string;
        email: string;
        roles: string[];
        isActive: boolean;
    };
    isNewUser: boolean;
}

export type GoogleLinkData = {
    code: string;
}

export type GoogleLinkResponse = {
    success: boolean;
    googleAccount: {
        id: string;
        googleEmail: string;
        picture?: string;
    };
}

/* Google Auth Functions */
export const startGoogleAuth = async (state?: string) => {
    return await api<GoogleStartAuthResponse>({
        endpoint: 'auth/google/start',
        method: 'POST',
        withAuth: false,
        data: { state }
    })
}

export const googleCallback = async (data: GoogleCallbackData) => {
    return await api<GoogleCallbackResponse>({
        endpoint: 'auth/google/callback',
        method: 'POST',
        withAuth: false,
        data
    })
}

export const linkGoogleAccount = async (data: GoogleLinkData) => {
    return await api<GoogleLinkResponse>({
        endpoint: 'auth/google/link',
        method: 'POST',
        data
    })
}

export const unlinkGoogleAccount = async () => {
    return await api<{ success: boolean }>({
        endpoint: 'auth/google/unlink',
        method: 'DELETE'
    })
}