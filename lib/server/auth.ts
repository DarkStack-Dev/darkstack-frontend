// lib/server/auth.ts - MELHORAR LOGGING

"use server";

import { cookies } from "next/headers";
import {  signIn, signUp } from "@/lib/requests";
import { SignInData, SignUpData } from "@/lib/schemas/authSchemas";
import { User } from "@/types/accounts/user";
import { redirect } from "next/navigation";
import { startGitHubAuth, gitHubCallback, linkGitHubAccount, unlinkGitHubAccount } from "@/lib/requests";
import { GitHubCallbackData, GitHubLinkData } from "@/lib/requests";

export const handleSignIn = async (data: SignInData) => {
    const response = await signIn(data)
    console.log("response.data aaaaaaaaaaaa", response)
    if (response.data) {
        console.log("response.data", response.data)
        const cookieStore = await cookies() // Await aqui
        cookieStore.set({
            name: process.env.NEXT_PUBLIC_AUTH_KEY as string,
            value: response.data.authToken,
            httpOnly: true,
            maxAge: 86400 * 7 // 7 days
        })
    }

    return response
}

export const handleSignUp = async (data: SignUpData) => {
    const response = await signUp(data)
    console.log("response bbbbbbbbbbb", response)
    if (response.data) {
        const cookieStore = await cookies() // Await aqui
        cookieStore.set({
            name: process.env.NEXT_PUBLIC_AUTH_KEY as string,
            value: response.data.authToken,
            httpOnly: true,
            maxAge: 86400 * 7
        })
    }

    return response
}

export const handleGetUser = async () => {
    const cookieStore = await cookies() // Await aqui
    const authCookie = cookieStore.get(process.env.NEXT_PUBLIC_AUTH_KEY as string)?.value

    const response = await fetch(process.env.NEXT_PUBLIC_API_BASE_URL + '/users', {
        headers: {
            Authorization: `Bearer ${authCookie}`
        }
    })
    console.log("esotu aqui")
    const jsonResponse = await response.json()
    console.log("jsonResponse", jsonResponse)
    const userData = jsonResponse
    console.log("userData", userData)
    if(userData.statusCode === 401 || userData.statusCode === 404){
        return null 
    }else{
       return userData as User 
    }

}

export const handleSignOut = async () => {
    const cookieStore = await cookies() // Await aqui
    cookieStore.delete(process.env.NEXT_PUBLIC_AUTH_KEY as string)
    redirect('/')
}

/* GitHub Auth Server Actions */
export const handleGitHubStart = async (state?: string) => {
    console.log('🚀 [Server Action] Starting GitHub auth...', { state });
    const response = await startGitHubAuth(state);
    console.log('📤 [Server Action] GitHub start response:', { 
        hasError: !!response.error,
        hasData: !!response.data,
        url: response.data?.authorizationUrl ? 'URL gerada' : 'Sem URL'
    });
    return response;
}

export const handleGitHubCallback = async (data: GitHubCallbackData) => {
    console.log('🔄 [Server Action] Processing GitHub callback...', {
        hasCode: !!data.code,
        codeLength: data.code?.length,
        state: data.state
    });
    
    try {
        const response = await gitHubCallback(data);
        
        console.log('📥 [Server Action] GitHub callback response:', {
            hasError: !!response.error,
            hasData: !!response.data,
            errorMessage: response.error?.message,
            userEmail: response.data?.user?.email || 'N/A'
        });
        
        if (response.data) {
            console.log('🍪 [Server Action] Setting auth cookie...');
            const cookieStore = await cookies();
            cookieStore.set({
                name: process.env.NEXT_PUBLIC_AUTH_KEY as string,
                value: response.data.authToken,
                httpOnly: true,
                maxAge: 86400 * 7 // 7 days
            });
            console.log('✅ [Server Action] Auth cookie set successfully');
        }
        
        return response;
    } catch (error) {
        console.error('💥 [Server Action] GitHub callback error:', error);
        return {
            error: {
                message: 'Erro interno no servidor durante autenticação GitHub'
            }
        };
    }
}

export const handleGitHubLink = async (data: GitHubLinkData) => {
    return await linkGitHubAccount(data);
}

export const handleGitHubUnlink = async () => {
    return await unlinkGitHubAccount();
}